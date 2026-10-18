import GoogleSheetsIndex from '@/views/client/GoogleSheets/Index';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import { diffForHumans, iso } from '@/lib/serialize';
import { firstOrCreateSheetConnection } from '@/lib/domain/google-sheets';

export const dynamic = 'force-dynamic';

/** GET /app/google-sheets */
export default async function Page() {
    const { clientId } = await requireClientPage();
    let config = null;
    try {
        config = await firstOrCreateSheetConnection(clientId);
    } catch (err) {
        console.error('[GoogleSheets] Failed to resolve sheet connection:', err);
    }

    const safeConfig = config || {
        connected: false,
        account_email: null,
        spreadsheet_id: null,
        spreadsheet_url: null,
        sync_forms: false,
        sync_appointments: false,
        rows_synced: 0,
        last_synced_at: null,
    };

    const props = {
        config: {
            connected: safeConfig.connected ?? false,
            account_email: safeConfig.account_email ?? null,
            spreadsheet_id: safeConfig.spreadsheet_id ?? null,
            spreadsheet_url: safeConfig.spreadsheet_url ?? null,
            sync_forms: safeConfig.sync_forms ?? false,
            sync_appointments: safeConfig.sync_appointments ?? false,
            rows_synced: safeConfig.rows_synced ?? 0,
            last_synced_at: iso(safeConfig.last_synced_at),
            last_synced_human: diffForHumans(safeConfig.last_synced_at),
        },
        stats: [
            {
                label: 'Status',
                value: safeConfig.connected ? 'Connected' : 'Not connected',
                icon: 'plug',
                accent: safeConfig.connected ? 'signal' : 'warm',
            },
            { label: 'Rows synced', value: String(safeConfig.rows_synced ?? 0), icon: 'list', accent: 'brand' },
            {
                label: 'Last sync',
                value: diffForHumans(safeConfig.last_synced_at) ?? 'Never',
                icon: 'clock',
                accent: 'cold',
            },
        ],
    };

    return renderPage(GoogleSheetsIndex, 'client/GoogleSheets/Index', props, {
        url: '/app/google-sheets',
    });
}
