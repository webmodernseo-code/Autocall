import StatusView from '@/views/frontend/Status';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'État des services en direct', description: "Statut en temps réel, disponibilité, latence et historique des services de la plateforme d'agents vocaux IA AutoCall.", path: '/status' });

export default function StatusPage() {
    return <StatusView />;
}
