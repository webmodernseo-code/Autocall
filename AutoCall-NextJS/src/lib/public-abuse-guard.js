import 'server-only';
import { NextResponse } from 'next/server';
import { clientIp } from '@/lib/request-security.mjs';
import { consumeStrict } from '@/lib/rate-limit';

export async function enforcePublicLimits(request, rules) {
    const ip = clientIp(request);
    try {
        for (const rule of rules) {
            const result = await consumeStrict(`public:${rule.scope}:ip:${ip}`, rule.max, rule.seconds);
            if (!result.allowed) {
                return NextResponse.json(
                    { error: 'Trop de tentatives. Veuillez réessayer plus tard.' },
                    { status: 429, headers: { 'Retry-After': String(result.retryAfter) } },
                );
            }
        }
        return null;
    } catch (error) {
        console.error('[PublicRateLimit] unavailable:', error?.message || error);
        return NextResponse.json(
            { error: 'Service temporairement indisponible.' },
            { status: 503, headers: { 'Retry-After': '30' } },
        );
    }
}
