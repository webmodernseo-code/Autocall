import LandingDemo from '@/views/landing-demo/LandingDemo';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ description: "Créez des agents vocaux IA qui appellent, qualifient vos prospects, prennent des rendez-vous et synchronisent chaque échange avec votre CRM.", path: '/' });

/** GET / — the public landing page. */
export default function Page() {
    return <LandingDemo />;
}
