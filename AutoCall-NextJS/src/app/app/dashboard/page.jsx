import Dashboard from '@/views/client/Dashboard';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import prisma from '@/lib/prisma';
import { iso } from '@/lib/serialize';
import {
    buildActivityBuckets,
    DASHBOARD_PERIOD_DAYS,
    dashboardPeriod,
} from '@/lib/dashboard-metrics.mjs';
import { getOrCreateOnboardingState } from '@/lib/domain/onboarding';

export const dynamic = 'force-dynamic';

/** GET /app/dashboard */
export default async function Page({ searchParams }) {
    const { user, clientId } = await requireClientPage();
    const params = await searchParams;
    const selectedPeriod = dashboardPeriod(params?.period);
    const props = await buildProps(clientId, selectedPeriod);

    if (params?.verified === '1') {
        props.flash = {
            ...(props.flash ?? {}),
            success: 'Votre adresse e-mail a été vérifiée avec succès !',
        };
    }
    return renderPage(Dashboard, 'client/Dashboard', props, { url: '/app/dashboard', user });
}

async function buildProps(clientId, selectedPeriod) {
    const periodDays = DASHBOARD_PERIOD_DAYS[selectedPeriod];
    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - periodDays * 24 * 60 * 60 * 1000);

    if (!clientId) {
        return {
            selectedPeriod,
            periodStart: iso(periodStart),
            periodEnd: iso(periodEnd),
            kpis: null,
            onboarding: null,
            onboardingState: null,
        };
    }

    const onboardingState = await getOrCreateOnboardingState(clientId);
    const client_id = BigInt(clientId);
    const calls = await prisma.call.findMany({
        where: { client_id, created_at: { gte: periodStart, lte: periodEnd } },
        select: { status: true, sentiment: true, qualification: true, duration_seconds: true, created_at: true },
    });
    const completed = calls.filter((call) => call.status === 'completed');

    const callsByDay = buildActivityBuckets(calls, periodStart, periodEnd, periodDays);

    const [
        recent,
        agentsCount,
        numbersCount,
        contactsCount,
        activeCampaignCount,
        anyCampaign,
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
        prisma.campaign.findMany({
            where: { client_id, status: 'active', deleted_at: null },
            include: { _count: { select: { campaign_contact: true } } },
            orderBy: { id: 'desc' },
            take: 4,
        }),
    ]);

    const countBy = (field, value) => calls.filter((call) => call[field] === value).length;

    return {
        selectedPeriod,
        periodStart: iso(periodStart),
        periodEnd: iso(periodEnd),
        kpis: {
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
        },
        onboardingState,
    };
}
