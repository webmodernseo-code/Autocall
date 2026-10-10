import LandingDemo from '@/views/landing-demo/LandingDemo';
import { renderPage } from '@/lib/render';
import prisma from '@/lib/prisma';
import { plain } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

/**
 * Route Démo & Conception de la nouvelle Landing Page
 * Accessible en direct sur : /landing-demo
 */
export default async function LandingDemoPage() {
    const plans = await prisma.plan
        .findMany({ where: { enabled: true }, orderBy: [{ sort_order: 'asc' }, { id: 'asc' }] })
        .catch(() => []);

    return renderPage(LandingDemo, 'LandingDemo', { plans: plain(plans) }, { url: '/landing-demo' });
}
