# Exécution Docker

## Prérequis

- Docker Engine récent avec Docker Compose v2 et BuildKit ;
- un fichier `.env` non committé contenant les secrets réels ;
- une base MySQL/TiDB joignable depuis les conteneurs.

## Construction

```bash
docker compose build
```

Le build produit une image Next.js standalone non-root. Les secrets ne sont pas
inclus dans l'image. Seuls le nom et l'URL publics peuvent être fournis comme
arguments de build.

## Première installation ou mise à jour

Toujours appliquer les migrations comme une tâche unique avant le déploiement :

```bash
docker compose --profile tools run --rm migrate
docker compose up -d web worker
docker compose ps
```

Ne jamais lancer plusieurs conteneurs `migrate` simultanément.

## Vérification

```bash
curl --fail http://127.0.0.1:3000/api/health
docker compose logs --tail=100 web
docker compose logs --tail=100 worker
```

Le port écoute seulement sur `127.0.0.1` par défaut : Caddy, Traefik ou Nginx
doit être le seul composant exposé à Internet. Pour un test sur le réseau local,
définir temporairement `APP_BIND_ADDRESS=0.0.0.0` dans l'environnement.

## Arrêt et retour arrière

```bash
docker compose down
IMAGE_TAG=<tag-precedent> docker compose up -d web worker
```

Utiliser des tags immuables correspondant au SHA Git en staging/production, et
non `latest`. Un rollback applicatif ne revient pas automatiquement sur une
migration de données : suivre le runbook de migration.

## Services

- `web` : serveur Next.js, port interne 3000, healthcheck HTTP ;
- `worker` : ordonnanceur d'appels, une seule réplique ;
- `migrate` : tâche manuelle `prisma migrate deploy`, jamais permanente.

Les services utilisent un système de fichiers en lecture seule. Seuls `/tmp` et
le cache Next.js sont temporaires. Les documents clients et enregistrements ne
doivent donc pas être conservés dans le conteneur ; utiliser un stockage objet.
