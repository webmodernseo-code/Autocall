import 'server-only';

import dns from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { isPublicIp } from './outbound-guard-core.mjs';

export { isPublicIp } from './outbound-guard-core.mjs';

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
    if (parsed.username || parsed.password) return null;

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

/**
 * Hardened fetch wrapper that validates DNS and pins requests against SSRF & DNS rebinding.
 */
export async function safeFetch(url, options = {}) {
    const target = await resolveSafeTarget(url);
    if (!target) {
        throw new Error('SSRF Guard: Target URL was rejected as unsafe or private.');
    }

    const transport = target.scheme === 'https' ? https : http;
    const maxResponseBytes = 10 * 1024 * 1024;

    return new Promise((resolve, reject) => {
        const request = transport.request({
            protocol: `${target.scheme}:`,
            hostname: target.host,
            servername: target.scheme === 'https' ? target.host : undefined,
            port: target.port,
            path: `${target.parsed.pathname}${target.parsed.search}`,
            method: options.method ?? 'GET',
            headers: {
                ...options.headers,
                'User-Agent': options.headers?.['User-Agent'] || 'AutoCall-SafeFetch/3.0',
            },
            // Pin the connection to the address that passed the public-IP check.
            // This closes the second DNS lookup used by fetch() and prevents
            // DNS rebinding between validation and connection.
            lookup(_hostname, _lookupOptions, callback) {
                callback(null, target.ip, net.isIPv6(target.ip) ? 6 : 4);
            },
            signal: options.signal,
        }, (response) => {
            const chunks = [];
            let size = 0;

            response.on('data', (chunk) => {
                size += chunk.length;
                if (size > maxResponseBytes) {
                    response.destroy(new Error('SSRF Guard: Response exceeded 10 MiB.'));
                    return;
                }
                chunks.push(chunk);
            });
            response.on('end', () => {
                const headers = new Headers();
                for (const [name, value] of Object.entries(response.headers)) {
                    if (Array.isArray(value)) value.forEach((item) => headers.append(name, item));
                    else if (value !== undefined) headers.set(name, String(value));
                }
                resolve(new Response(Buffer.concat(chunks), {
                    status: response.statusCode ?? 502,
                    statusText: response.statusMessage,
                    headers,
                }));
            });
            response.on('error', reject);
        });

        request.on('error', reject);
        if (options.body !== undefined && options.body !== null) request.write(options.body);
        request.end();
    });
}
