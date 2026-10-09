import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Liveness endpoint for Docker/orchestrators.
 * Deliberately does not contact MySQL or third-party providers: a temporary
 * dependency outage must not cause the container to restart in a loop.
 */
export function GET() {
    return NextResponse.json(
        {
            status: 'ok',
            service: 'autocall-web',
            timestamp: new Date().toISOString(),
        },
        {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        },
    );
}

