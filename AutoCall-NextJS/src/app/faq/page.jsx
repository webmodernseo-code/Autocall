import Faq from '@/views/frontend/Faq';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'FAQ sur les agents vocaux IA', description: "Réponses sur les agents vocaux AutoCall, les appels automatisés, les intégrations, la sécurité, les tarifs et le déploiement.", path: '/faq' });

export const dynamic = 'force-dynamic';

/** GET /faq */
export default async function Page() {
    return renderPage(Faq, 'frontend/Faq', {}, { url: '/faq' });
}
