import 'server-only';

import prisma from '@/lib/prisma';

/** GoogleSheetConnection::firstOrCreate(['client_id' => …]) */
export async function firstOrCreateSheetConnection(clientId) {
    const client_id = BigInt(clientId);
    const now = new Date();

    // A page prefetch and the following click can render concurrently. An
    // atomic upsert prevents both requests from trying to create the unique
    // client row at the same time.
    return prisma.googleSheetConnection.upsert({
        where: { client_id },
        update: {},
        create: { client_id, created_at: now, updated_at: now },
    });
}
