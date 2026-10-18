import net from 'node:net';

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

        if (a === 0 || a === 10 || a === 127) return false;
        if (a === 172 && b >= 16 && b <= 31) return false;
        if (a === 192 && b === 168) return false;
        if (a === 169 && b === 254) return false;
        if (a === 100 && b >= 64 && b <= 127) return false;
        if (a === 192 && b === 0 && parts[2] === 2) return false;
        if (a === 198 && b === 51 && parts[2] === 100) return false;
        if (a === 203 && b === 0 && parts[2] === 113) return false;
        if (a >= 224) return false;
        return true;
    }

    if (net.isIPv6(ip)) {
        const lower = ip.toLowerCase();
        if (lower === '::' || lower === '::1') return false;
        if (lower.startsWith('fe80') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return false;
        if (lower.startsWith('fc') || lower.startsWith('fd')) return false;
        if (lower.startsWith('ff') || lower.startsWith('2001:db8:')) return false;
        return true;
    }

    return false;
}
