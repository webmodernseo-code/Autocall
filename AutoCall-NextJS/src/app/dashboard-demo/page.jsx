import Dashboard from '@/views/client/Dashboard';
import { renderPage } from '@/lib/render';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Démonstration du tableau de bord', path: '/dashboard-demo', noIndex: true });

export const dynamic = 'force-dynamic';

/**
 * Route Démo directe du Tableau de Bord (accessible sans connexion)
 * URL : /dashboard-demo
 */
export default async function DashboardDemoPage() {
    const user = {
        id: 1,
        name: 'Client Démo',
        email: 'demo@autocall.co',
        role: 'client',
        client_role: 'administrator',
        email_verified_at: new Date().toISOString(),
    };

    const props = {
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
            { id: 2, contact: 'Marc Vasseur (Cabinet Dentaire)', status: 'completed', sentiment: 'positive', qualification: 'hot', duration_seconds: 128, created_at: new Date().toISOString() },
            { id: 3, contact: 'Éléonore Mercier (Avocat Conseil)', status: 'completed', sentiment: 'neutral', qualification: 'warm', duration_seconds: 75, created_at: new Date().toISOString() },
            { id: 4, contact: '+33 6 12 34 56 78', status: 'completed', sentiment: 'positive', qualification: 'warm', duration_seconds: 90, created_at: new Date().toISOString() },
            { id: 5, contact: 'Syndic Résidence Monceau', status: 'completed', sentiment: 'positive', qualification: 'hot', duration_seconds: 165, created_at: new Date().toISOString() },
        ],
        activeCampaigns: [
            { id: 1, name: 'Campagne Qualification B2B Q4', type: 'outbound', contacts_count: 450 },
            { id: 2, name: 'Relance Devis Habitat', type: 'outbound', contacts_count: 220 },
        ],
        onboarding: {
            has_agent: true,
            has_number: true,
            has_contacts: true,
            has_campaign: true,
            has_credits: true,
        },
        isClientAdministrator: true,
    };

    return renderPage(Dashboard, 'client/Dashboard', props, { url: '/dashboard-demo', user });
}
