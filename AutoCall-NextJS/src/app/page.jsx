import LandingDemo from '@/views/landing-demo/LandingDemo';
import { renderPage } from '@/lib/render';
import prisma from '@/lib/prisma';
import { plain } from '@/lib/serialize';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ description: "Créez des agents vocaux IA qui appellent, qualifient vos prospects, prennent des rendez-vous et synchronisent chaque échange avec votre CRM.", path: '/' });

export const dynamic = 'force-dynamic';

/** GET / — the public landing page. */
export default async function Page() {
    const plans = await prisma.plan
        .findMany({ where: { enabled: true }, orderBy: [{ sort_order: 'asc' }, { id: 'asc' }] })
        .catch(() => []);

    return renderPage(LandingDemo, 'LandingDemo', { plans: plain(plans) }, { url: '/' });
}
