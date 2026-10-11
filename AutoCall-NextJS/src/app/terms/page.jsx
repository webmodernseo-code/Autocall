import Terms from '@/views/frontend/Terms';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: "Conditions générales d'utilisation", description: "Conditions d'accès et d'utilisation de la plateforme d'agents vocaux intelligents AutoCall.", path: '/terms' });

export const dynamic = 'force-dynamic';

/** GET /terms */
export default async function Page() {
    return renderPage(Terms, 'frontend/Terms', {}, { url: '/terms' });
}
