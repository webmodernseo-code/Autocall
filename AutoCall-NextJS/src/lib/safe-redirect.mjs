const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;

/**
 * Only allow application-local paths as post-authentication destinations.
 * Protocol-relative URLs (//host), backslash variants and control characters
 * are rejected to prevent browsers from interpreting them as external URLs.
 */
export function safeRedirectPath(value, fallback = '/app/dashboard') {
    if (typeof value !== 'string') return fallback;

    const candidate = value.trim();
    if (
        !candidate.startsWith('/')
        || candidate.startsWith('//')
        || candidate.includes('\\')
        || CONTROL_CHARACTERS.test(candidate)
    ) {
        return fallback;
    }

    try {
        const parsed = new URL(candidate, 'https://autocall.co');
        if (parsed.origin !== 'https://autocall.co') return fallback;
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
        return fallback;
    }
}
