import CookiesDoc from '@/views/frontend/Cookies';
import { renderPage } from '@/lib/render';

export const dynamic = 'force-dynamic';

/** GET /cookies */
export default async function Page() {
    return renderPage(CookiesDoc, 'frontend/Cookies', {}, { url: '/cookies' });
}
