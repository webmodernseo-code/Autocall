import MentionsLegales from '@/views/frontend/MentionsLegales';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Mentions légales', description: "Informations légales relatives à l'éditeur, à l'hébergement et à l'exploitation de la plateforme AutoCall.", path: '/mentions-legales' });

export const dynamic = 'force-dynamic';

/** GET /mentions-legales */
export default async function Page() {
    return renderPage(MentionsLegales, 'frontend/MentionsLegales', {}, { url: '/mentions-legales' });
}
