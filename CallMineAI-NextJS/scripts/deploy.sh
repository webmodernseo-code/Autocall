#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${1:?Usage: deploy.sh APP_DIR GHCR_IMAGE IMAGE_TAG}"
GHCR_IMAGE="${2:?GHCR image is required}"
IMAGE_TAG="${3:?Immutable image tag is required}"
COMPOSE_FILE="compose.deploy.yaml"

case "$APP_DIR" in
  /*) ;;
  *) echo "APP_DIR must be an absolute path" >&2; exit 2 ;;
esac

[[ "$APP_DIR" =~ ^/[A-Za-z0-9._/-]+$ ]] || { echo "APP_DIR contains unsafe characters" >&2; exit 2; }
[[ "$GHCR_IMAGE" =~ ^ghcr\.io/[a-z0-9._/-]+$ ]] || { echo "Invalid GHCR image name" >&2; exit 2; }
[[ "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]] || { echo "IMAGE_TAG must be a full Git commit SHA" >&2; exit 2; }

if [[ "$APP_DIR" == "/" || "$APP_DIR" == "/root" || "$APP_DIR" == "/home" ]]; then
  echo "Refusing unsafe deployment directory: $APP_DIR" >&2
  exit 2
fi

mkdir -p "$APP_DIR"
cd "$APP_DIR"

[[ -f .env ]] || { echo "Missing $APP_DIR/.env" >&2; exit 3; }
[[ -f "$COMPOSE_FILE" ]] || { echo "Missing $APP_DIR/$COMPOSE_FILE" >&2; exit 3; }

previous_tag=""
[[ -f .deployed-image ]] && previous_tag="$(tr -d '\r\n' < .deployed-image)"

compose() {
  GHCR_IMAGE="$GHCR_IMAGE" IMAGE_TAG="$1" docker compose -f "$COMPOSE_FILE" "${@:2}"
}

echo "Pulling immutable image $GHCR_IMAGE:$IMAGE_TAG"
compose "$IMAGE_TAG" pull web worker migrate

echo "Applying versioned database migrations once"
compose "$IMAGE_TAG" --profile tools run --rm migrate

rollback() {
  if [[ -n "$previous_tag" && "$previous_tag" != "$IMAGE_TAG" ]]; then
    echo "Deployment failed; restoring application image $previous_tag" >&2
    compose "$previous_tag" up -d --remove-orphans web worker || true
  fi
}
trap rollback ERR

echo "Starting web and worker"
compose "$IMAGE_TAG" up -d --remove-orphans web worker

port=3000
while IFS='=' read -r key value; do
  if [[ "$key" == "APP_PORT" ]]; then
    value="${value%$'\r'}"
    value="${value//\"/}"
    value="${value//\'/}"
    port="$value"
  fi
done < .env
[[ "$port" =~ ^[0-9]{1,5}$ ]] && (( port >= 1 && port <= 65535 )) || {
  echo "Invalid APP_PORT in $APP_DIR/.env" >&2
  exit 3
}

for attempt in {1..45}; do
  if curl --silent --show-error --fail "http://127.0.0.1:${port}/api/health" >/dev/null; then
    printf '%s\n' "$IMAGE_TAG" > .deployed-image
    trap - ERR
    compose "$IMAGE_TAG" ps
    echo "Deployment healthy: $IMAGE_TAG"
    exit 0
  fi
  sleep 2
done

echo "Health check failed after 90 seconds" >&2
compose "$IMAGE_TAG" logs --tail=150 web worker >&2 || true
exit 1
