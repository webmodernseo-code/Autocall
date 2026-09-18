'use client';

import { useState } from 'react';
import { Building2, Stethoscope, Briefcase, Megaphone, CheckCircle2, ArrowRight } from 'lucide-react';

const USE_CASES = [
    {
        id: 'real-estate',
        name: 'Immobilier & Promoteurs',
        icon: Building2,
        title: 'Qualifiez chaque acquéreur et remplissez l’agenda de vos agents immobiliers',
        description: 'Dès qu’un prospect remplit un formulaire SeLoger ou LeBonCoin, l’agent CallMindAI l’appelle en moins de 90 secondes pour valider son budget, son secteur de recherche et caler la visite.',
        metrics: [
            { label: 'Délai de rappel moyen', value: '75 secondes' },
            { label: 'Taux de concrétisation visites', value: '+52%' },
            { label: 'Appels perdus en soirée/week-end', value: '0%' }
        ],
        checklist: [
            'Détection du statut de financement et accord bancaire',
            'Proposition directe de créneaux sur l’agenda du négociateur',
            'Envoi automatique de SMS de confirmation avec géolocalisation du bien'
        ]
    },
    {
        id: 'health-legal',
        name: 'Cabinets Médicaux & Juridiques',
        icon: Stethoscope,
        title: 'Un secrétariat téléphonique disponible 24/7 sans surcharge mentale pour votre équipe',
        description: 'Filtrez les urgences médicales ou juridiques, pré-qualifiez les dossiers entrants et gérez les reprogrammations de rendez-vous en toute sérénité.',
        metrics: [
            { label: 'Appels traités sans attente', value: '100%' },
            { label: 'Diminution des no-shows', value: '-68%' },
            { label: 'Temps secrétariat libéré', value: '4h / jour' }
        ],
        checklist: [
            'Filtrage rigoureux selon votre protocole de cabinet',
            'Rappels SMS automatiques et gestion des reports',
            'Conformité stricte RGPD et confidentialité des données patients/clients'
        ]
    },
    {
        id: 'b2b-saas',
        name: 'SaaS & Entreprises B2B',
        icon: Briefcase,
        title: 'Multipliez par 3 vos démonstrations commerciales en convertissant les leads entrants',
        description: 'Le délai de conversion d’un lead chaud chute de 80% après 5 minutes. CallMindAI déclenche un appel instantané pour qualifier le besoin technique et booker la démo.',
        metrics: [
            { label: 'Hausse des RDV démo fixés', value: '+44%' },
            { label: 'Exactitude des champs CRM', value: '99.2%' },
            { label: 'Temps gagné par les SDR', value: '18h / sem.' }
        ],
        checklist: [
            'Qualification BANT (Budget, Authority, Need, Timeline)',
            'Enrichissement direct de HubSpot, Salesforce ou Pipedrive',
            'Transfert chaud direct vers l’Account Executive disponible'
        ]
    },
    {
        id: 'agencies',
        name: 'Agences & Télémarketing',
        icon: Megaphone,
        title: 'Déployez des campagnes d’appels à grande échelle pour le compte de vos clients',
        description: 'Proposez à vos clients une offre de prospection téléphonique clé en main en marque blanche, avec vos marges et votre propre tableau de bord.',
        metrics: [
            { label: 'Capacité de traitement', value: '10 000+ / j' },
            { label: 'Marge moyenne agence', value: '65%' },
            { label: 'Déploiement d’un compte client', value: '< 10 min' }
        ],
        checklist: [
            'Portail client marque blanche personnalisé à vos couleurs',
            'Gestion multi-comptes avec facturation et quotas de minutes',
            'Export des enregistrements et synthèses d’appels en PDF/CSV'
        ]
    }
];

export default function UseCasesTabs() {
    const [activeTabId, setActiveTabId] = useState('real-estate');
    const activeCase = USE_CASES.find(c => c.id === activeTabId) || USE_CASES[0];

    return (
        <div className="w-full space-y-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                {USE_CASES.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === activeTabId;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTabId(item.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${
                                isActive
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                                    : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Active Content Card */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-5">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                            {activeCase.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {activeCase.description}
                        </p>

                        <div className="space-y-2.5 pt-2">
                            {activeCase.checklist.map((point, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/60 p-6 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                            Impact Métier Mesuré
                        </span>
                        <div className="space-y-3">
                            {activeCase.metrics.map((m, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{m.label}</span>
                                    <strong className="text-sm font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums">{m.value}</strong>
                                </div>
                            ))}
                        </div>
                        <a
                            href="/register"
                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-xs transition-colors"
                        >
                            Configurer ce cas d’usage <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
