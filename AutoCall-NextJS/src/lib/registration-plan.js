import 'server-only';

import prisma from '@/lib/prisma';
import {
    normalizeBillingCycle,
    normalizeRegistrationPlan,
    postRegistrationTarget,
    REGISTRATION_PLAN_SLUGS,
} from './registration-plan.mjs';

export {
    normalizeBillingCycle,
    normalizeRegistrationPlan,
    postRegistrationTarget,
    REGISTRATION_PLAN_SLUGS,
};

export async function registrationPlans() {
    const plans = await prisma.plan.findMany({
        where: { enabled: true, slug: { in: REGISTRATION_PLAN_SLUGS } },
        orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            currency_code: true,
            monthly_price_cents: true,
            yearly_price_cents: true,
            featured: true,
            popular: true,
        },
    });

    return plans.map((plan) => ({
        id: Number(plan.id),
        name: plan.name,
        slug: plan.slug,
        description: plan.description,
        currency_code: plan.currency_code,
        monthly_price_cents: Number(plan.monthly_price_cents ?? 0),
        yearly_price_cents: Number(plan.yearly_price_cents ?? 0),
        highlighted: plan.featured || plan.popular || plan.slug === 'pro',
    }));
}

export async function resolveRegistrationPlan(value) {
    const slug = normalizeRegistrationPlan(value);
    return prisma.plan.findFirst({ where: { slug, enabled: true } });
}

export async function activateFreePlan(userId, clientId, plan) {
    if (!userId || !clientId || !plan) return false;
    const isFree = Number(plan.monthly_price_cents ?? plan.price_cents ?? 0) === 0
        && Number(plan.yearly_price_cents ?? 0) === 0;
    if (!isFree) return false;

    const existing = await prisma.clientSubscription.findFirst({
        where: { client_id: BigInt(clientId), status: 'active' },
        orderBy: { id: 'desc' },
    });
    if (existing) return true;

    const now = new Date();
    await prisma.clientSubscription.create({
        data: {
            client_id: BigInt(clientId),
            plan_id: plan.id,
            billing_cycle: 'month',
            status: 'active',
            starts_at: now,
            created_at: now,
            updated_at: now,
        },
    });
    return true;
}
