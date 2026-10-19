import 'server-only';

import prisma from '@/lib/prisma';
import { maybeDecrypt } from '@/lib/crypt';

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

/**
 * Automatically sync a row to Google Sheets if connected and corresponding toggle is enabled.
 * @param {string|number|BigInt} clientId
 * @param {'form'|'appointment'} type
 * @param {Record<string, any>} rowData
 */
export async function syncToGoogleSheet(clientId, type, rowData = {}) {
    if (!clientId) return;
    try {
        const conn = await prisma.googleSheetConnection.findUnique({
            where: { client_id: BigInt(clientId) },
        });

        if (!conn || !conn.connected) return;
        if (type === 'form' && !conn.sync_forms) return;
        if (type === 'appointment' && !conn.sync_appointments) return;

        if (conn.access_token && conn.spreadsheet_id) {
            try {
                const values = [
                    new Date().toISOString(),
                    type,
                    JSON.stringify(rowData),
                ];
                await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${conn.spreadsheet_id}/values/A1:append?valueInputOption=USER_ENTERED`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${maybeDecrypt(conn.access_token)}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ values: [values] }),
                });
            } catch (apiErr) {
                console.error('[GoogleSheets] Google API push error:', apiErr?.message);
            }
        }

        await prisma.googleSheetConnection.update({
            where: { id: conn.id },
            data: {
                rows_synced: { increment: 1 },
                last_synced_at: new Date(),
                updated_at: new Date(),
            },
        });
    } catch (err) {
        console.error('[GoogleSheets] syncToGoogleSheet error:', err?.message || err);
    }
}
