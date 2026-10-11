import Privacy from '@/views/frontend/Privacy';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Politique de confidentialité', description: "Traitement, sécurité et confidentialité des données, enregistrements et transcriptions sur la plateforme AutoCall.", path: '/privacy' });

export const dynamic = 'force-dynamic';

/** GET /privacy */
export default async function Page() {
    return renderPage(Privacy, 'frontend/Privacy', {}, { url: '/privacy' });
}
