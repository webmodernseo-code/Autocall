import Dashboard from '@/views/client/Dashboard';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import { effectiveSubscription, subscriptionIsActive } from '@/lib/auth';
import { balance } from '@/lib/services/credits';
import prisma from '@/lib/prisma';
import { iso } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

function calculateTrend(currentVal, previousVal) {
    if (previousVal == null || previousVal === 0) {
        return null;
    }
    const diff = ((currentVal - previousVal) / previousVal) * 100;
    const rounded = Math.round(diff * 10) / 10;
    return {
        pct: `${rounded >= 0 ? '+' : ''}${rounded}%`,
        isPositive: rounded >= 0,
        diff: rounded,
        prevValue: previousVal,
    };
}

/** GET /app/dashboard */
export default async function Page({ searchParams }) {
    const { user, clientId } = await requireClientPage();
    const params = await searchParams;
    const period = ['7d', '30d', '90d'].includes(params?.period) ? params.period : '30d';
    const props = await buildProps(user, clientId, period);

    if (params?.verified === '1') {
        props.flash = {
            ...(props.flash ?? {}),
            success: 'Votre adresse e-mail a été vérifiée avec succès !',
        };
    }
    return renderPage(Dashboard, 'client/Dashboard', props, { url: '/app/dashboard', user });
}

async function buildProps(user, clientId, period = '30d') {
    const effective = await effectiveSubscription(user);

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
    const periodDays = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const now = new Date();
    const start = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const prevStart = new Date(start.getTime() - periodDays * 24 * 60 * 60 * 1000);

    if (!clientId) {
        return {
            currentPlan,
            renewsAt,
            managedByAdmin,
            creditBalance: 0,
            selectedPeriod: period,
            startDate: start.toISOString(),
            endDate: now.toISOString(),
            kpis: null,
            onboarding: null,
            isClientAdministrator,
        };
    }

    const client_id = BigInt(clientId);

    try {
        const [calls, prevCalls] = await Promise.all([
            prisma.call.findMany({
                where: { client_id, created_at: { gte: start } },
                select: { id: true, status: true, sentiment: true, qualification: true, duration_seconds: true, created_at: true },
            }),
            prisma.call.findMany({
                where: { client_id, created_at: { gte: prevStart, lt: start } },
                select: { id: true, status: true, qualification: true, duration_seconds: true },
            }),
        ]);

        const completed = calls.filter((c) => c.status === 'completed');
        const prevCompleted = prevCalls.filter((c) => c.status === 'completed');

        const successRate = calls.length ? Math.round((completed.length / calls.length) * 1000) / 10 : 0;
        const prevSuccessRate = prevCalls.length ? Math.round((prevCompleted.length / prevCalls.length) * 1000) / 10 : 0;

        const qualifiedLeads = calls.filter((c) => ['hot', 'warm'].includes(c.qualification)).length;
        const prevQualifiedLeads = prevCalls.filter((c) => ['hot', 'warm'].includes(c.qualification)).length;

        const avgDuration = completed.length
            ? Math.round(completed.reduce((sum, c) => sum + Number(c.duration_seconds ?? 0), 0) / completed.length)
            : 0;
        const prevAvgDuration = prevCompleted.length
            ? Math.round(prevCompleted.reduce((sum, c) => sum + Number(c.duration_seconds ?? 0), 0) / prevCompleted.length)
            : 0;

        const callsByDay = [];
        for (let offset = 6; offset >= 0; offset--) {
            const day = new Date();
            day.setHours(0, 0, 0, 0);
            day.setDate(day.getDate() - offset);
            const next = new Date(day);
            next.setDate(next.getDate() + 1);

            callsByDay.push({
                day: day.toLocaleDateString('fr-FR', { weekday: 'short' }),
                calls: calls.filter((c) => {
                    const cd = new Date(c.created_at);
                    return cd >= day && cd < next;
                }).length,
            });
        }

        const recent = await prisma.call.findMany({
            where: { client_id },
            include: { contacts: { select: { id: true, name: true, phone: true } } },
            orderBy: { id: 'desc' },
            take: 6,
        });

        const [agentsCount, numbersCount, contactsCount, activeCampaignCount, anyCampaign, creditBalance, totalCallsCount] =
            await Promise.all([
                prisma.agent.count({ where: { client_id } }),
                prisma.phoneNumber.count({ where: { client_id, status: 'active' } }),
                prisma.contact.count({ where: { client_id } }),
                prisma.campaign.count({ where: { client_id, status: 'active' } }),
                prisma.campaign.count({ where: { client_id } }),
                balance(clientId),
                prisma.call.count({ where: { client_id } }),
            ]);

        const activeCampaigns = await prisma.campaign.findMany({
            where: { client_id, status: 'active' },
            include: { _count: { select: { campaign_contact: true } } },
            orderBy: { id: 'desc' },
            take: 4,
        });

        const countBy = (field, value) => calls.filter((c) => c[field] === value).length;

        return {
            currentPlan,
            renewsAt,
            managedByAdmin,
            creditBalance,
            selectedPeriod: period,
            startDate: start.toISOString(),
            endDate: now.toISOString(),
            kpis: {
                total_calls: totalCallsCount,
                calls_30d: calls.length,
                success_rate: successRate,
                qualified_leads: qualifiedLeads,
                avg_duration: avgDuration,
                agents: agentsCount,
                numbers: numbersCount,
                contacts: contactsCount,
                active_campaigns: activeCampaignCount,
                trends: {
                    calls: calculateTrend(calls.length, prevCalls.length),
                    success_rate: calculateTrend(successRate, prevSuccessRate),
                    qualified: calculateTrend(qualifiedLeads, prevQualifiedLeads),
                    duration: calculateTrend(avgDuration, prevAvgDuration),
                },
                prev_calls_count: prevCalls.length,
            },
            callsByDay,
            leadDistribution: [
                { name: 'Hot', value: countBy('qualification', 'hot') },
                { name: 'Warm', value: countBy('qualification', 'warm') },
                { name: 'Cold', value: countBy('qualification', 'cold') },
            ],
            recentCalls: recent.map((c) => ({
                id: Number(c.id),
                contact: c.contacts?.name || c.contacts?.phone || 'Inconnu',
                direction: c.direction || 'outbound',
                status: c.status || 'completed',
                sentiment: c.sentiment || 'neutral',
                qualification: c.qualification || 'unqualified',
                duration_seconds: Number(c.duration_seconds ?? 0),
                created_at: iso(c.created_at),
            })),
            activeCampaigns: activeCampaigns.map((c) => ({
                id: Number(c.id),
                name: c.name,
                type: c.type,
                contacts_count: c._count.campaign_contact,
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
    } catch (e) {
        console.error('Error fetching client dashboard data from DB:', e);
        return {
            currentPlan,
            renewsAt,
            managedByAdmin,
            creditBalance: 0,
            selectedPeriod: period,
            startDate: start.toISOString(),
            endDate: now.toISOString(),
            kpis: {
                total_calls: 0,
                calls_30d: 0,
                success_rate: 0,
                qualified_leads: 0,
                avg_duration: 0,
                agents: 0,
                numbers: 0,
                contacts: 0,
                active_campaigns: 0,
                trends: {
                    calls: null,
                    success_rate: null,
                    qualified: null,
                    duration: null,
                },
                prev_calls_count: 0,
            },
            callsByDay: Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return { day: d.toLocaleDateString('fr-FR', { weekday: 'short' }), calls: 0 };
            }),
            leadDistribution: [
                { name: 'Hot', value: 0 },
                { name: 'Warm', value: 0 },
                { name: 'Cold', value: 0 },
            ],
            recentCalls: [],
            activeCampaigns: [],
            onboarding: {
                has_agent: false,
                has_number: false,
                has_contacts: false,
                has_campaign: false,
                has_credits: false,
            },
            isClientAdministrator,
        };
    }
}
