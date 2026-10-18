import net from 'node:net';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function normalizedOrigin(value) {
    if (!value) return null;
    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
}

export function allowedApplicationOrigins(env = process.env) {
    const origins = new Set();
    for (const value of [env.APP_URL, env.APP_CLIENT_URL, env.NEXT_PUBLIC_APP_URL]) {
        const origin = normalizedOrigin(value);
        if (origin) origins.add(origin);
    }
    return origins;
}

export function csrfFailureReason(request, env = process.env) {
    const method = String(request?.method ?? 'GET').toUpperCase();
    if (!MUTATING_METHODS.has(method) || !request?.url) return null;

    const pathname = new URL(request.url).pathname;
    // These endpoints authenticate with provider signatures, bearer API keys,
    // or an explicit scheduler secret instead of browser cookies.
    if (
        pathname.startsWith('/webhooks/') ||
        pathname.startsWith('/api/v1/') ||
        pathname.startsWith('/api/cron/')
    ) {
        return null;
    }

    const fetchSite = request.headers.get('sec-fetch-site');
    if (fetchSite === 'cross-site') return 'cross-site';

    const originHeader = request.headers.get('origin');
    if (!originHeader) return null; // Non-browser clients do not always send Origin.

    const origin = normalizedOrigin(originHeader);
    if (!origin) return 'invalid-origin';

    const allowed = allowedApplicationOrigins(env);
    // Local development remains usable without requiring APP_URL.
    if (allowed.size === 0 && env.NODE_ENV !== 'production') {
        allowed.add(new URL(request.url).origin);
    }

    return allowed.has(origin) ? null : 'origin-mismatch';
}

function validIp(value) {
    const candidate = String(value ?? '').trim();
    return net.isIP(candidate) ? candidate : null;
}

/**
 * Resolve the client address behind a configured number of reverse proxies.
 * Selecting from the right prevents a caller from prepending a forged address
 * to X-Forwarded-For. Deployments with more than one proxy must set
 * TRUSTED_PROXY_COUNT accordingly.
 */
export function clientIp(request, env = process.env) {
    const chain = String(request?.headers?.get?.('x-forwarded-for') ?? '')
        .split(',')
        .map(validIp)
        .filter(Boolean);
    const configured = Number.parseInt(env.TRUSTED_PROXY_COUNT ?? '1', 10);
    const trustedProxyCount = Number.isInteger(configured) && configured > 0 ? configured : 0;

    if (chain.length && trustedProxyCount > 0) {
        const index = Math.max(0, chain.length - trustedProxyCount);
        return chain[index];
    }

    return validIp(request?.headers?.get?.('x-real-ip')) ?? 'unknown';
}
