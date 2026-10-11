import ResetPassword from '@/views/Auth/ResetPassword';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Réinitialiser le mot de passe', path: '/reset-password', noIndex: true });

export const dynamic = 'force-dynamic';

/** GET /reset-password/{token} */
export default async function Page({ params, searchParams }) {
    const { token } = await params;
    const query = await searchParams;
    return renderPage(
        ResetPassword,
        'Auth/ResetPassword',
        { token, email: query?.email ?? '' },
        { url: `/reset-password/${token}` },
    );
}
