import Register from '@/views/Auth/Register';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Créer un compte', path: '/register', noIndex: true });

export const dynamic = 'force-dynamic';

/** GET /register */
export default async function Page() {
    return renderPage(Register, 'Auth/Register', {}, { url: '/register' });
}
