import 'server-only';

import prisma from '@/lib/prisma';

/** GoogleSheetConnection::firstOrCreate(['client_id' => …]) */
export async function firstOrCreateSheetConnection(clientId) {
    const client_id = BigInt(clientId);
    const now = new Date();

    try {
        // A page prefetch and the following click can render concurrently. An
        // atomic upsert prevents both requests from trying to create the unique
        // client row at the same time.
        return await prisma.googleSheetConnection.upsert({
            where: { client_id },
            update: {},
            create: { client_id, created_at: now, updated_at: now },
        });
    } catch (err) {
        console.error('[GoogleSheets] database error in firstOrCreateSheetConnection:', err?.message || err);
        return {
            id: null,
            client_id,
            connected: false,
            account_email: null,
            spreadsheet_id: null,
            spreadsheet_url: null,
            sync_forms: false,
            sync_appointments: false,
            rows_synced: 0,
            last_synced_at: null,
            created_at: now,
            updated_at: now,
        };
    }
}
