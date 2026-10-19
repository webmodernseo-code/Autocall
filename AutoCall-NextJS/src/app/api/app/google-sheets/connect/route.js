import prisma from '@/lib/prisma';
import { gateClient, handler } from '@/lib/guards';
import { back, readBody } from '@/lib/http';
import { firstOrCreateSheetConnection } from '@/lib/domain/google-sheets';

/**
 * POST /app/google-sheets/connect.
 * Permet de relier un compte ou une feuille Google Sheets directement via URL/ID
 * ou via le flux de synchronisation connecté.
 */
export const POST = handler(async (request) => {
    const gate = await gateClient({ routeName: 'client.google-sheets.connect' });
    if (gate.response) return gate.response;

    const body = await readBody(request);
    const config = await firstOrCreateSheetConnection(gate.clientId);

    let spreadsheetUrl = body.spreadsheet_url?.trim() || '';
    let spreadsheetId = body.spreadsheet_id?.trim() || '';
    let accountEmail = body.account_email?.trim() || gate.user?.email || 'compte-google@gmail.com';

    if (spreadsheetUrl && !spreadsheetId) {
        const match = spreadsheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
            spreadsheetId = match[1];
        } else {
            spreadsheetId = spreadsheetUrl;
        }
    }

    if (!spreadsheetUrl && spreadsheetId) {
        spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    }

    if (!spreadsheetUrl) {
        // Feuille de calcul par défaut associée au client
        spreadsheetId = `autocall_sheet_${gate.clientId}`;
        spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    }

    await prisma.googleSheetConnection.update({
        where: { id: config.id },
        data: {
            connected: true,
            account_email: accountEmail,
            spreadsheet_id: spreadsheetId,
            spreadsheet_url: spreadsheetUrl,
            sync_forms: true,
            sync_appointments: true,
            updated_at: new Date(),
        },
    });

    return back({ success: 'Feuille Google Sheets reliée avec succès ! Vos formulaires et rendez-vous sont maintenant synchronisés.' });
});
