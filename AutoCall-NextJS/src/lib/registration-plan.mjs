export const REGISTRATION_PLAN_SLUGS = ['starter', 'pro', 'agency'];
export const REGISTRATION_BILLING_CYCLES = ['month', 'year'];

export function normalizeRegistrationPlan(value, fallback = 'pro') {
    const slug = String(value ?? '').trim().toLowerCase();
    return REGISTRATION_PLAN_SLUGS.includes(slug) ? slug : fallback;
}

export function normalizeBillingCycle(value, fallback = 'month') {
    const cycle = String(value ?? '').trim().toLowerCase();
    return REGISTRATION_BILLING_CYCLES.includes(cycle) ? cycle : fallback;
}

export function postRegistrationTarget(planSlug, billingCycle = 'month') {
    const slug = normalizeRegistrationPlan(planSlug);
    const params = new URLSearchParams({
        plan: slug,
        billing: normalizeBillingCycle(billingCycle),
        onboarding: '1',
    });
    return `/app/pricing?${params.toString()}`;
}
