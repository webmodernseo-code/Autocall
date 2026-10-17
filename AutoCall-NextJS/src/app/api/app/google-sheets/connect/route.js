import { gateClient, handler } from '@/lib/guards';
import { abort } from '@/lib/http';

/**
 * POST /app/google-sheets/connect.
 * OAuth is intentionally unavailable until a real Google authorization flow is
 * configured. Never mark a synthetic spreadsheet as connected.
 */
export const POST = handler(async () => {
    const gate = await gateClient({ routeName: 'client.google-sheets.connect' });
    if (gate.response) return gate.response;

    return abort(501, 'La connexion Google Sheets sera disponible après configuration OAuth Google.');
});
