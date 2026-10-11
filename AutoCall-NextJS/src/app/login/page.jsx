import Login from '@/views/Auth/Login';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Connexion', path: '/login', noIndex: true });

export const dynamic = 'force-dynamic';

/** GET /login */
export default async function Page({ searchParams }) {
    const params = await searchParams;
    let status = params?.status ?? null;
    if (params?.verified === '1') {
        status = 'Votre adresse e-mail a été vérifiée avec succès. Vous pouvez maintenant vous connecter.';
    }
    return renderPage(
        Login,
        'Auth/Login',
        { canResetPassword: true, status },
        { url: '/login' },
    );
}
