import Dashboard from '@/views/client/Dashboard';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import { effectiveSubscription, subscriptionIsActive } from '@/lib/auth';
import { balance } from '@/lib/services/credits';
import prisma from '@/lib/prisma';
import { iso } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

const PERIOD_DAYS = Object.freeze({ '7d': 7, '30d': 30, '90d': 90 });

/** GET /app/dashboard */
export default async function Page({ searchParams }) {
    const { user, clientId } = await requireClientPage();
    const params = await searchParams;
    const selectedPeriod = Object.hasOwn(PERIOD_DAYS, params?.period) ? params.period : '30d';
    const props = await buildProps(user, clientId, selectedPeriod);

    if (params?.verified === '1') {
        props.flash = {
            ...(props.flash ?? {}),
            success: 'Votre adresse e-mail a été vérifiée avec succès !',
        };
    }
    return renderPage(Dashboard, 'client/Dashboard', props, { url: '/app/dashboard', user });
}

async function buildProps(user, clientId, selectedPeriod) {
    const effective = await effectiveSubscription(user);
    const periodDays = PERIOD_DAYS[selectedPeriod];
    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - periodDays * 24 * 60 * 60 * 1000);

    let currentPlan = null;
    let renewsAt = null;
    let managedByAdmin = false;

    if (effective?.plans) {
        currentPlan = {
            id: Number(effective.plans.id),
            name: effective.plans.name,
            slug: effective.plans.slug,
            status: subscriptionIsActive(effective) ? 'active' : (effective.status ?? 'inactive'),
        };
        if (effective.__kind === 'user') renewsAt = iso(effective.renews_at);
        if (effective.__kind === 'client') {
            renewsAt = iso(effective.ends_at);
            managedByAdmin = true;
        }
    }

    const isClientAdministrator = user.client_role === 'administrator';

    if (!clientId) {
        return {
            currentPlan,
            renewsAt,
            managedByAdmin,
            creditBalance: 0,
            selectedPeriod,
            periodStart: iso(periodStart),
            periodEnd: iso(periodEnd),
            kpis: null,
            onboarding: null,
            isClientAdministrator,
        };
    }

    const client_id = BigInt(clientId);
    const calls = await prisma.call.findMany({
        where: { client_id, created_at: { gte: periodStart, lte: periodEnd } },
        select: { status: true, sentiment: true, qualification: true, duration_seconds: true, created_at: true },
    });
    const completed = calls.filter((call) => call.status === 'completed');

    const callsByDay = [];
    for (let offset = 6; offset >= 0; offset--) {
        const day = new Date(periodEnd);
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - offset);
        const next = new Date(day);
        next.setDate(next.getDate() + 1);

        callsByDay.push({
            day: day.toLocaleDateString('fr-FR', { weekday: 'short' }),
            calls: calls.filter((call) => {
                const createdAt = new Date(call.created_at);
                return createdAt >= day && createdAt < next;
            }).length,
        });
    }

    const [
        recent,
        agentsCount,
        numbersCount,
        contactsCount,
        activeCampaignCount,
        anyCampaign,
        creditBalance,
        totalCalls,
        activeCampaigns,
    ] = await Promise.all([
        prisma.call.findMany({
            where: { client_id },
            include: { contacts: { select: { id: true, name: true, phone: true } } },
            orderBy: { id: 'desc' },
            take: 6,
        }),
        prisma.agent.count({ where: { client_id, deleted_at: null } }),
        prisma.phoneNumber.count({ where: { client_id, status: 'active' } }),
        prisma.contact.count({ where: { client_id } }),
        prisma.campaign.count({ where: { client_id, status: 'active', deleted_at: null } }),
        prisma.campaign.count({ where: { client_id, deleted_at: null } }),
        balance(clientId),
        prisma.call.count({ where: { client_id } }),
        prisma.campaign.findMany({
            where: { client_id, status: 'active', deleted_at: null },
            include: { _count: { select: { campaign_contact: true } } },
            orderBy: { id: 'desc' },
            take: 4,
        }),
    ]);

    const countBy = (field, value) => calls.filter((call) => call[field] === value).length;

    return {
        currentPlan,
        renewsAt,
        managedByAdmin,
        creditBalance,
        selectedPeriod,
        periodStart: iso(periodStart),
        periodEnd: iso(periodEnd),
        kpis: {
            total_calls: totalCalls,
            calls_period: calls.length,
            success_rate: calls.length ? Math.round((completed.length / calls.length) * 1000) / 10 : 0,
            qualified_leads: calls.filter((call) => ['hot', 'warm'].includes(call.qualification)).length,
            avg_duration: completed.length
                ? Math.round(completed.reduce((sum, call) => sum + Number(call.duration_seconds ?? 0), 0) / completed.length)
                : 0,
            agents: agentsCount,
            numbers: numbersCount,
            contacts: contactsCount,
            active_campaigns: activeCampaignCount,
        },
        callsByDay,
        leadDistribution: [
            { name: 'Hot', value: countBy('qualification', 'hot') },
            { name: 'Warm', value: countBy('qualification', 'warm') },
            { name: 'Cold', value: countBy('qualification', 'cold') },
        ],
        recentCalls: recent.map((call) => ({
            id: Number(call.id),
            contact: call.contacts?.name ?? call.contacts?.phone ?? 'Inconnu',
            status: call.status,
            sentiment: call.sentiment,
            qualification: call.qualification,
            duration_seconds: Number(call.duration_seconds ?? 0),
            created_at: iso(call.created_at),
        })),
        activeCampaigns: activeCampaigns.map((campaign) => ({
            id: Number(campaign.id),
            name: campaign.name,
            type: campaign.type,
            contacts_count: campaign._count.campaign_contact,
        })),
        onboarding: {
            has_agent: agentsCount > 0,
            has_number: numbersCount > 0,
            has_contacts: contactsCount > 0,
            has_campaign: anyCampaign > 0,
            has_credits: creditBalance > 0,
        },
        isClientAdministrator,
    };
}
