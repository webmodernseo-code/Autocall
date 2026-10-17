'use client';

import { route } from '@/lib/route';
import { Head, Link, router } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import KycGate from '@/components/KycGate';
import { useTranslation } from 'react-i18next';
import { Megaphone, Plus, Users, PhoneCall, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const STATUS = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    paused: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    completed: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    draft: 'bg-neutral-100 text-neutral-600 border-neutral-200/80 dark:bg-white/[0.04] dark:text-neutral-400 dark:border-white/10',
};

const STATUS_LABELS = {
    active: 'En cours',
    paused: 'En pause',
    completed: 'Terminée',
    draft: 'Brouillon',
};

const TYPE_LABEL = {
    lead_qualification: 'Qualification de leads',
    sales: 'Vente & Prospection',
    support: 'Support & Suivi',
    survey: 'Sondage & Enquête',
};

const FILTER_TABS = [
    { key: '', label: 'Toutes' },
    { key: 'active', label: 'En cours' },
    { key: 'paused', label: 'En pause' },
    { key: 'completed', label: 'Terminées' },
    { key: 'draft', label: 'Brouillons' },
];

export default function CampaignsIndex({ campaigns, filters = {}, stats = [] }) {
    const { t } = useTranslation();
    const filter = (status) =>
        router.get(route('client.campaigns.index'), status ? { status } : {}, { preserveState: true, replace: true });

    return (
        <ClientLayout title="Campagnes d'appels">
            <Head title="Campagnes d'appels · AutoCall" />
            <div className="space-y-6">

                {/* En-tête de section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Campagnes d&apos;appels
                        </h1>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-[#8E95A5]">
                            Automatisez vos appels sortants à grande échelle avec vos agents IA vocaux.
                        </p>
                    </div>
                    <Link
                        href={route('client.campaigns.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all cursor-pointer self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Nouvelle campagne</span>
                    </Link>
                </div>

                {/* Bannière de présentation fonctionnelle */}
                <PageOverview feature="campaigns" />

                <KycGate action="lancer des campagnes d'appels" />

                {/* Cartes statistiques */}
                <StatCards items={stats} />

                {/* Filtres d'état sobres */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {FILTER_TABS.map((tab) => {
                        const isActive = (filters.status || '') === tab.key;
                        return (
                            <button
                                key={tab.key || 'all'}
                                type="button"
                                onClick={() => filter(tab.key)}
                                className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                                        : 'border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-white/20'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Liste des campagnes ou état vide */}
                {campaigns?.data?.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {campaigns.data.map((c) => (
                            <Link
                                key={c.id}
                                href={route('client.campaigns.show', c.id)}
                                className="group relative overflow-hidden rounded-[20px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)] hover:shadow-[0_10px_28px_rgba(16,24,40,0.12)] hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-200"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <Megaphone className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-hero-sans font-bold text-sm text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {c.name}
                                            </p>
                                            <p className="text-[11px] text-neutral-400 mt-0.5">
                                                {TYPE_LABEL[c.type] || c.type}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium shrink-0 ${STATUS[c.status] || STATUS.draft}`}>
                                        {STATUS_LABELS[c.status] || c.status}
                                    </span>
                                </div>

                                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-neutral-500 dark:text-[#8E95A5]">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 text-neutral-400" />
                                        <span className="tabular-nums font-medium text-neutral-700 dark:text-neutral-300">{c.contacts_count}</span> contacts
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <PhoneCall className="h-3.5 w-3.5 text-neutral-400" />
                                        <span className="tabular-nums font-medium text-neutral-700 dark:text-neutral-300">{c.calls_count}</span> appels
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[22px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-10 sm:p-14 text-center shadow-[0_4px_24px_-2px_rgba(16,24,40,0.06)]">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 border border-blue-100 dark:border-blue-500/20">
                            <Megaphone className="h-6 w-6" />
                        </div>
                        <h3 className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white">
                            Aucune campagne pour le moment
                        </h3>
                        <p className="mt-1.5 text-xs text-neutral-500 dark:text-[#8E95A5] max-w-md mx-auto">
                            Créez votre première campagne d&apos;appels sortants pour engager automatiquement vos contacts avec un agent IA vocal sur-mesure.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href={route('client.campaigns.create')}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Créer ma première campagne</span>
                            </Link>
                        </div>

                        {/* Micro-réassurance */}
                        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-[11px] text-neutral-400">
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                                <span>Numérotation & réessais automatiques</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Détection des répondeurs</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                                <span>Conforme aux règles de télé-prospection</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
