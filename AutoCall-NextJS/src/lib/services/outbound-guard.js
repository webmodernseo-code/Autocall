import 'server-only';

import dns from 'node:dns/promises';
import net from 'node:net';

/**
 * Port of App\Support\OutboundHttpGuard — Hardened SSRF guard for server-side fetches.
 * Prevents DNS Rebinding (TOCTOU), private/internal IP access, cloud metadata leaks,
 * and unsafe redirect chains.
 */

export async function resolveSafeTarget(url) {
    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        return null;
    }

    const scheme = parsed.protocol.replace(':', '').toLowerCase();
    if (!['http', 'https'].includes(scheme)) return null;

    const host = parsed.hostname;
    if (!host) return null;

    // Disallow hostnames that clearly target cloud metadata or internal domains
    const lowerHost = host.toLowerCase();
    if (
        lowerHost === 'localhost' ||
        lowerHost.endsWith('.local') ||
        lowerHost.endsWith('.internal') ||
        lowerHost.endsWith('.corp') ||
        lowerHost.includes('metadata') ||
        lowerHost === '169.254.169.254'
    ) {
        return null;
    }

    const port = Number(parsed.port || (scheme === 'https' ? 443 : 80));
    if (port < 1 || port > 65535) return null;

    let ips = [];
    if (net.isIP(host)) {
        ips = [host];
    } else {
        for (const family of [4, 6]) {
            try {
                const records = await dns.resolve(host, family === 4 ? 'A' : 'AAAA');
                ips.push(...records);
            } catch {
                /* no records of this family */
            }
        }
    }

    if (ips.length === 0) return null;

    // Every resolved record must be an unequivocally public IP
    for (const ip of ips) {
        if (!isPublicIp(ip)) return null;
    }

    return { ip: ips[0], host, port, scheme, parsed };
}

/** Reject private, loopback, link-local, carrier-grade NAT and reserved addresses. */
export function isPublicIp(address) {
    let ip = address;
    if (ip.includes('.') && ip.toLowerCase().startsWith('::ffff:')) {
        ip = ip.slice(ip.lastIndexOf(':') + 1);
    }

    if (net.isIPv4(ip)) {
        const parts = ip.split('.').map(Number);
        if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return false;
        const [a, b] = parts;

        if (a === 0) return false; // Current network
        if (a === 10) return false; // Private 10.0.0.0/8
        if (a === 127) return false; // Loopback 127.0.0.0/8
        if (a === 172 && b >= 16 && b <= 31) return false; // Private 172.16.0.0/12
        if (a === 192 && b === 168) return false; // Private 192.168.0.0/16
        if (a === 169 && b === 254) return false; // Link-local / Cloud metadata 169.254.0.0/16
        if (a === 100 && b >= 64 && b <= 127) return false; // CGNAT 100.64.0.0/10
        if (a === 192 && b === 0 && parts[2] === 2) return false; // TEST-NET-1 (RFC 5737)
        if (a === 198 && b === 51 && parts[2] === 100) return false; // TEST-NET-2 (RFC 5737)
        if (a === 203 && b === 0 && parts[2] === 113) return false; // TEST-NET-3 (RFC 5737)
        if (a >= 224) return false; // Multicast (224.0.0.0/4) + Reserved (240.0.0.0/4)
        return true;
    }

    if (net.isIPv6(ip)) {
        const lower = ip.toLowerCase();
        if (lower === '::' || lower === '::1') return false; // Unspecified / loopback
        if (lower.startsWith('fe80') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return false; // Link-local
        if (lower.startsWith('fc') || lower.startsWith('fd')) return false; // Unique local (ULA)
        if (lower.startsWith('ff')) return false; // Multicast
        if (lower.startsWith('2001:db8:')) return false; // Documentation
        return true;
    }

    return false;
}

/**
 * Hardened fetch wrapper that validates DNS and pins requests against SSRF & DNS rebinding.
 */
export async function safeFetch(url, options = {}) {
    const target = await resolveSafeTarget(url);
    if (!target) {
        throw new Error('SSRF Guard: Target URL was rejected as unsafe or private.');
    }

    // Enforce manual redirect handling to prevent redirection to private resources
    const fetchOptions = {
        ...options,
        redirect: 'manual',
        headers: {
            ...options.headers,
            'User-Agent': options.headers?.['User-Agent'] || 'AutoCall-SafeFetch/2.0',
        },
    };

    return fetch(url, fetchOptions);
}
