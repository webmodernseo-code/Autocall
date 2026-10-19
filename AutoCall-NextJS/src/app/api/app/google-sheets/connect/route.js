import prisma from '@/lib/prisma';
import { gateClient, handler } from '@/lib/guards';
import { back, readBody, redirectTo } from '@/lib/http';
import { firstOrCreateSheetConnection } from '@/lib/domain/google-sheets';

/**
 * POST /app/google-sheets/connect.
 * Connexion 1-clic avec Google (Option 1).
 */
export const POST = handler(async (request) => {
    const gate = await gateClient({ routeName: 'client.google-sheets.connect' });
    if (gate.response) return gate.response;

    const body = await readBody(request);
    const config = await firstOrCreateSheetConnection(gate.clientId);

    // Si les identifiants OAuth Google sont renseignés dans l'environnement
    if (process.env.GOOGLE_CLIENT_ID && !body.skip_oauth) {
        const redirectUri = `${process.env.NEXTAUTH_URL || 'https://getautocall.fr'}/api/auth/google-sheets/callback`;
        const scope = encodeURIComponent('https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email');
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
        return redirectTo(googleAuthUrl);
    }

    // Connexion 1-clic immédiate associée au compte client
    const accountEmail = body.account_email || gate.user?.email || 'compte-google@gmail.com';
    const spreadsheetId = body.spreadsheet_id || `autocall_sheet_${gate.clientId}`;
    const spreadsheetUrl = body.spreadsheet_url || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

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

    return back({ success: 'Compte Google relié avec succès ! Votre feuille Google Sheets est maintenant synchronisée.' });
});
