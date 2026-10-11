import Blog from '@/views/frontend/Blog';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Blog des appels et agents vocaux IA', description: "Guides et bonnes pratiques pour automatiser la prospection téléphonique, qualifier vos prospects et réussir vos campagnes avec l'IA vocale.", path: '/blog' });

export const dynamic = 'force-dynamic';

/** GET /blog */
export default async function Page() {
    return renderPage(Blog, 'frontend/Blog', {}, { url: '/blog' });
}
