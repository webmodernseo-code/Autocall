import { redirect } from 'next/navigation';
import Pricing from '@/views/client/Pricing';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import prisma from '@/lib/prisma';
import { priceCentsForCycle } from '@/lib/plans';
import { defaultCurrencyCode, formatConverted } from '@/lib/services/currency';
import { billingRegistry } from '@/lib/services/billing';
import { getSession } from '@/lib/auth/session';
import { monthlyGrantForPlan } from '@/lib/services/credits';

export const dynamic = 'force-dynamic';

/** GET /app/pricing */
export default async function Page({ searchParams }) {
    const { user, clientId } = await requireClientPage({ allowUnsubscribed: true });
    const session = await getSession();
    const params = await searchParams;

    // Fulfill Stripe Checkout session if returned from Stripe with session_id
    if (params?.session_id) {
        const registry = await billingRegistry();
        const stripe = registry.get('stripe');
        if (stripe) {
            const fulfilled = await stripe.fulfillCheckoutSession(String(params.session_id), user.id).catch(() => ({ ok: false }));
            if (fulfilled?.ok) {
                if (clientId) await monthlyGrantForPlan(clientId).catch(() => {});
                redirect('/app/dashboard?activated=1');
            }
        }
    }

    const displayCurrency =
        user?.display_currency ??
        user?.tenant?.currency_code ??
        session?.display_currency ??
        (await defaultCurrencyCode());

    // Only fetch payable plans to ensure no free bypass without payment
    const rows = await prisma.plan.findMany({
        where: {
            enabled: true,
            OR: [
                { monthly_price_cents: { gt: 0 } },
                { yearly_price_cents: { gt: 0 } },
            ],
        },
        orderBy: { sort_order: 'asc' },
    });

    const plans = [];
    for (const plan of rows) {
        const monthlyCents = priceCentsForCycle(plan, 'month');
        const yearlyCents = priceCentsForCycle(plan, 'year');

        plans.push({
            id: Number(plan.id),
            name: plan.name,
            slug: plan.slug,
            monthly_price_display:
                monthlyCents !== null
                    ? await formatConverted(Number(monthlyCents), plan.currency_code, displayCurrency)
                    : null,
            yearly_price_display:
                yearlyCents !== null
                    ? await formatConverted(Number(yearlyCents), plan.currency_code, displayCurrency)
                    : null,
            ai_credits: plan.ai_credits,
            websites_limit: plan.websites_limit,
            export_enabled: plan.export_enabled,
            custom_domain_enabled: plan.custom_domain_enabled,
            white_label_enabled: plan.white_label_enabled,
            whatsapp_enabled: plan.whatsapp_enabled,
            messaging_enabled: plan.messaging_enabled,
            is_free: false,
        });
    }

    const registry = await billingRegistry();
    const isRequired = Boolean(params?.required || params?.onboarding);
    const selectedPlanSlug = plans.some((plan) => plan.slug === params?.plan) ? String(params.plan) : null;
    const billingCycle = params?.billing === 'year' ? 'year' : 'month';

    return renderPage(
        Pricing,
        'client/Pricing',
        {
            plans,
            gateways: registry.listForFrontend(),
            isRequired,
            selectedPlanSlug,
            billingCycle,
            flash: { error: null, success: null },
        },
        { url: '/app/pricing' },
    );
}
