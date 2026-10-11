import ConfirmPassword from '@/views/Auth/ConfirmPassword';
import { renderPage } from '@/lib/render';
import { requireUserPage } from '@/lib/guards';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Confirmer le mot de passe', path: '/confirm-password', noIndex: true });

export const dynamic = 'force-dynamic';

/** GET /confirm-password */
export default async function Page() {
    await requireUserPage();
    return renderPage(ConfirmPassword, 'Auth/ConfirmPassword', {}, { url: '/confirm-password' });
}
