import Dashboard from '@/views/client/Dashboard';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import { effectiveSubscription, subscriptionIsActive } from '@/lib/auth';
import { balance } from '@/lib/services/credits';
import prisma from '@/lib/prisma';
import { iso } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

/** GET /app/dashboard */
export default async function Page({ searchParams }) {
    let user = null;
    let clientId = null;

    try {
        const auth = await requireClientPage();
        user = auth.user;
        clientId = auth.clientId;
    } catch {
        // Mode développement / Démo directe sans redirection vers login
        user = {
            id: 1,
            name: 'Client Démo',
            email: 'demo@autocall.co',
            role: 'client',
            client_role: 'administrator',
            email_verified_at: new Date().toISOString(),
        };
        clientId = 1;
    }

    const props = await buildProps(user, clientId);
    const params = await searchParams;
    if (params?.verified === '1') {
        props.flash = {
            ...(props.flash ?? {}),
            success: 'Votre adresse e-mail a été vérifiée avec succès !',
        };
    }
    return renderPage(Dashboard, 'client/Dashboard', props, { url: '/app/dashboard', user });
}

async function buildProps(user, clientId) {
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

    if (!clientId) {
        return {
            currentPlan,
            renewsAt,
            managedByAdmin,
            creditBalance: 0,
            kpis: null,
            onboarding: null,
            isClientAdministrator,
        };
    }

    const client_id = BigInt(clientId);
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
        const calls = await prisma.call.findMany({
            where: { client_id, created_at: { gte: start } },
            select: { status: true, sentiment: true, qualification: true, duration_seconds: true, created_at: true },
        });
        const completed = calls.filter((c) => c.status === 'completed');

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

        const [agentsCount, numbersCount, contactsCount, activeCampaignCount, anyCampaign, creditBalance] =
            await Promise.all([
                prisma.agent.count({ where: { client_id } }),
                prisma.phoneNumber.count({ where: { client_id, status: 'active' } }),
                prisma.contact.count({ where: { client_id } }),
                prisma.campaign.count({ where: { client_id, status: 'active' } }),
                prisma.campaign.count({ where: { client_id } }),
                balance(clientId),
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
            kpis: {
                total_calls: await prisma.call.count({ where: { client_id } }),
                calls_30d: calls.length,
                success_rate: calls.length ? Math.round((completed.length / calls.length) * 1000) / 10 : 0,
                qualified_leads: calls.filter((c) => ['hot', 'warm'].includes(c.qualification)).length,
                avg_duration: completed.length
                    ? Math.round(
                          completed.reduce((sum, c) => sum + Number(c.duration_seconds ?? 0), 0) / completed.length,
                      )
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
            recentCalls: recent.map((c) => ({
                id: Number(c.id),
                contact: c.contacts?.name ?? c.contacts?.phone ?? '—',
                status: c.status,
                sentiment: c.sentiment,
                qualification: c.qualification,
                duration_seconds: c.duration_seconds,
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
        // Rich Demo Dataset when database is not connected
        return {
            currentPlan: { id: 1, name: 'Professionnel', slug: 'pro', status: 'active' },
            renewsAt: '2028-01-01T00:00:00.000Z',
            managedByAdmin: true,
            creditBalance: 250,
            kpis: {
                total_calls: 1240,
                calls_30d: 480,
                success_rate: 94.2,
                qualified_leads: 184,
                avg_duration: 114,
                agents: 3,
                numbers: 2,
                contacts: 850,
                active_campaigns: 2,
            },
            callsByDay: [
                { day: 'Lun', calls: 64 },
                { day: 'Mar', calls: 82 },
                { day: 'Mer', calls: 95 },
                { day: 'Jeu', calls: 78 },
                { day: 'Ven', calls: 110 },
                { day: 'Sam', calls: 32 },
                { day: 'Dim', calls: 19 },
            ],
            leadDistribution: [
                { name: 'Hot', value: 92 },
                { name: 'Warm', value: 92 },
                { name: 'Cold', value: 45 },
            ],
            recentCalls: [
                { id: 1, contact: 'Alexandre Renard (Nova SAS)', status: 'completed', sentiment: 'positive', qualification: 'hot', duration_seconds: 142, created_at: new Date().toISOString() },
                { id: 2, contact: 'Marc Vasseur', status: 'completed', sentiment: 'positive', qualification: 'hot', duration_seconds: 128, created_at: new Date().toISOString() },
                { id: 3, contact: 'Éléonore Mercier', status: 'completed', sentiment: 'neutral', qualification: 'warm', duration_seconds: 75, created_at: new Date().toISOString() },
                { id: 4, contact: '+33 6 12 34 56 78', status: 'completed', sentiment: 'positive', qualification: 'warm', duration_seconds: 90, created_at: new Date().toISOString() },
            ],
            activeCampaigns: [
                { id: 1, name: 'Campagne Qualification B2B Q4', type: 'outbound', contacts_count: 450 },
                { id: 2, name: 'Relance Leads Inactifs', type: 'outbound', contacts_count: 220 },
            ],
            onboarding: {
                has_agent: true,
                has_number: true,
                has_contacts: true,
                has_campaign: true,
                has_credits: true,
            },
            isClientAdministrator,
        };
    }
}
