import LandingDemo from '@/views/landing-demo/LandingDemo';
import { renderPage } from '@/lib/render';
import prisma from '@/lib/prisma';
import { plain } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

/** GET / — the public landing page. */
export default async function Page() {
    const plans = await prisma.plan
        .findMany({ where: { enabled: true }, orderBy: [{ sort_order: 'asc' }, { id: 'asc' }] })
        .catch(() => []);

    return renderPage(LandingDemo, 'LandingDemo', { plans: plain(plans) }, { url: '/' });
}

