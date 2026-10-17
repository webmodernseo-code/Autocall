import { redirect } from 'next/navigation';
import VerifyEmail from '@/views/Auth/VerifyEmail';
import { renderPage } from '@/lib/render';
import { requireUserPage } from '@/lib/guards';
import { pageMetadata } from '@/lib/seo';
import { getSession } from '@/lib/auth/session';
import { postRegistrationTarget } from '@/lib/registration-plan';

export const metadata = pageMetadata({ title: "Vérification de l'adresse e-mail", path: '/verify-email', noIndex: true });

export const dynamic = 'force-dynamic';

/** GET /verify-email */
export default async function Page({ searchParams }) {
    const user = await requireUserPage();
    const session = await getSession();
    if (user.email_verified_at) {
        redirect(session?.pending_plan_slug
            ? postRegistrationTarget(session.pending_plan_slug, session.pending_billing_cycle)
            : '/app/dashboard');
    }

    const params = await searchParams;
    return renderPage(
        VerifyEmail,
        'Auth/VerifyEmail',
        { status: params?.status ?? null },
        { url: '/verify-email' },
    );
}
