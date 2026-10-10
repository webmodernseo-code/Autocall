import StatusView from '@/views/frontend/Status';

export const metadata = {
    title: 'État des services en direct | AutoCall Status',
    description: 'Statut en temps réel, disponibilité, latence et historique des services de la plateforme d\'agents vocaux IA AutoCall.',
};

export default function StatusPage() {
    return <StatusView />;
}
