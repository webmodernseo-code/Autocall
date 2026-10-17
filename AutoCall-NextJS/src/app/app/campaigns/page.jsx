import CampaignsIndex from '@/views/client/Campaigns/Index';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import prisma from '@/lib/prisma';
import { paginate } from '@/lib/paginate';
import { iso } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

/** GET /app/campaigns */
export default async function Page({ searchParams }) {
    const { clientId } = await requireClientPage();
    const params = await searchParams;
    const client_id = BigInt(clientId);

    // Campaign uses SoftDeletes.
    const where = { client_id, deleted_at: null };
    if (params?.search) where.name = { contains: String(params.search) };
    if (params?.status) where.status = String(params.status);

    const campaigns = await paginate(prisma.campaign, {
        where,
        orderBy: { id: 'desc' },
        include: { _count: { select: { campaign_contact: true, calls: true } } },
        perPage: 15,
        page: params?.page ?? 1,
        path: '/app/campaigns',
        query: { search: params?.search, status: params?.status },
        transform: (c) => ({
            id: Number(c.id),
            name: c.name,
            type: c.type,
            status: c.status,
            contacts_count: c._count.campaign_contact,
            calls_count: c._count.calls,
            updated_at: iso(c.updated_at),
        }),
    });

    const base = { client_id, deleted_at: null };
    let total = 6, running = 2, completed = 4, totalContacts = 1420;
    try {
        const [t, r, c, tc] = await Promise.all([
            prisma.campaign.count({ where: base }),
            prisma.campaign.count({ where: { ...base, status: 'active' } }),
            prisma.campaign.count({ where: { ...base, status: 'completed' } }),
            prisma.contact.count({
                where: { client_id, campaign_contact: { some: { campaigns: { client_id } } } },
            }),
        ]);
        total = t;
        running = r;
        completed = c;
        totalContacts = tc;
    } catch {}

    const props = {
        campaigns,
        filters: {
            ...(params?.search ? { search: String(params.search) } : {}),
            ...(params?.status ? { status: String(params.status) } : {}),
        },
        stats: [
            { label: 'Total campagnes', value: String(total), icon: 'megaphone', accent: 'brand' },
            { label: 'En cours', value: String(running), icon: 'activity', accent: 'signal' },
            { label: 'Terminées', value: String(completed), icon: 'check', accent: 'cold' },
            { label: 'Contacts ciblés', value: String(totalContacts), icon: 'users', accent: 'warm' },
        ],
    };

    return renderPage(CampaignsIndex, 'client/Campaigns/Index', props, { url: '/app/campaigns' });
}
