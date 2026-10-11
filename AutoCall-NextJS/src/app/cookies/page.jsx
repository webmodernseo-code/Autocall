import CookiesDoc from '@/views/frontend/Cookies';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Politique relative aux cookies', description: "Découvrez comment AutoCall utilise les cookies essentiels et protège vos préférences et vos données.", path: '/cookies' });

export const dynamic = 'force-dynamic';

/** GET /cookies */
export default async function Page() {
    return renderPage(CookiesDoc, 'frontend/Cookies', {}, { url: '/cookies' });
}
