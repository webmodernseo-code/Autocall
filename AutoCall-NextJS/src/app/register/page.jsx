import Register from '@/views/Auth/Register';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';
import {
    normalizeBillingCycle,
    normalizeRegistrationPlan,
    registrationPlans,
} from '@/lib/registration-plan';

export const metadata = pageMetadata({ title: 'Créer un compte', path: '/register', noIndex: true });

export const dynamic = 'force-dynamic';

/** GET /register */
export default async function Page({ searchParams }) {
    const params = await searchParams;
    const plans = await registrationPlans();
    const requestedPlan = normalizeRegistrationPlan(params?.plan);
    const selectedPlan = plans.some((plan) => plan.slug === requestedPlan)
        ? requestedPlan
        : (plans[0]?.slug ?? 'pro');

    return renderPage(Register, 'Auth/Register', {
        plans,
        selectedPlan,
        billingCycle: normalizeBillingCycle(params?.billing),
    }, { url: '/register' });
}
