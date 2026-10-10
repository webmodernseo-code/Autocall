import MentionsLegales from '@/views/frontend/MentionsLegales';
import { renderPage } from '@/lib/render';

export const dynamic = 'force-dynamic';

/** GET /mentions-legales */
export default async function Page() {
    return renderPage(MentionsLegales, 'frontend/MentionsLegales', {}, { url: '/mentions-legales' });
}
