'use client';

import { useState } from 'react';
import { Trans } from 'react-i18next';
import { route } from '@/lib/route';
import { Head, Link, router } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import PageOverview from '@/components/PageOverview';
import {
    Target,
    Phone,
    MessageSquare,
    RefreshCw,
    LayoutTemplate,
    ArrowLeft,
    GitBranch,
    Zap,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    SlidersHorizontal,
    Search
} from 'lucide-react';

const ICONS = {
    target: Target,
    phone: Phone,
    message: MessageSquare,
    refresh: RefreshCw,
};

const ACCENTS = {
    brand: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25',
    signal: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
    warm: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
    cold: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25',
};

const TRIGGER_META = {
    manual: { label: 'Manuel', badge: 'bg-neutral-100 text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-400' },
    call_completed: { label: 'Appel terminé', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
    inbound_call: { label: 'Appel entrant manqué', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    lead_qualified: { label: 'Lead qualifié chaud', badge: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' },
    schedule: { label: 'Planification récurrente', badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400' },
};

export default function FlowTemplates({ templates = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const use = (key) => router.post(route('client.flows.templates.use', key));

    const filteredTemplates = templates.filter((tpl) => {
        const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'outbound') return tpl.trigger_type === 'call_completed' || tpl.trigger_type === 'schedule';
        if (selectedCategory === 'inbound') return tpl.trigger_type === 'inbound_call';
        if (selectedCategory === 'surveys') return tpl.key.includes('survey') || tpl.trigger_type === 'call_completed';
        return true;
    });

    return (
        <ClientLayout title="Modèles d'Automatisations">
            <Head title="Modèles d'Automatisations — AutoCall" />

            <div className="space-y-6">
                {/* 1. Header supérieur moderne style Dashboard */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/90 dark:border-blue-500/30 dark:bg-blue-600/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-2xs">
                                <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                <span>Bibliothèque de Scénarios IA</span>
                            </span>
                        </div>
                        <h1 className="font-hero-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                            Modèles de Workflows Vocaux
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                            Démarrez en quelques secondes avec des scénarios d&apos;appels automatisés haute conversion.
                        </p>
                    </div>

                    <Link
                        href={route('client.flows.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs hover:border-neutral-300 dark:hover:border-white/20 transition-all cursor-pointer self-start sm:self-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Retour aux flux</span>
                    </Link>
                </div>

                {/* 2. PageOverview stylisée aux couleurs AutoCall */}
                <PageOverview feature="flow-templates" />

                {/* 3. Barre de recherche et filtres de catégories innovants */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131622] shadow-2xs">
                    {/* Filtres de catégories par pills */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                        {[
                            { id: 'all', label: 'Tous les modèles' },
                            { id: 'outbound', label: 'Appels sortants & Relances' },
                            { id: 'inbound', label: 'Appels manqués' },
                            { id: 'surveys', label: 'Enquêtes & Satisfaction' },
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                                    selectedCategory === cat.id
                                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Champ de recherche rapide */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un scénario..."
                            className="w-full rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.04] pl-9 pr-3 py-1.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                        />
                    </div>
                </div>

                {/* 4. Grille Bento des Modèles */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTemplates.map((tpl) => {
                        const Icon = ICONS[tpl.icon] || LayoutTemplate;
                        const steps = tpl.definition?.nodes ?? [];
                        const trigger = TRIGGER_META[tpl.trigger_type] || { label: tpl.trigger_type, badge: 'bg-neutral-100 text-neutral-600' };

                        return (
                            <div
                                key={tpl.key}
                                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#131622] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.09)] dark:hover:border-blue-500/30 transition-all duration-200"
                            >
                                <div>
                                    {/* Header de la carte : Icône liquide + Déclencheur */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl backdrop-blur-md shadow-xs ${ACCENTS[tpl.accent] || ACCENTS.brand}`}>
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-transparent dark:border-white/5 ${trigger.badge}`}>
                                            <Zap className="h-3 w-3" />
                                            <span>{trigger.label}</span>
                                        </span>
                                    </div>

                                    <h3 className="font-hero-sans text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {tpl.name}
                                    </h3>

                                    <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                                        {tpl.description}
                                    </p>

                                    {/* Séquence chronologique des étapes */}
                                    <div className="mt-5 space-y-2 rounded-xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04] p-3.5">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                                            Étapes automatiques ({steps.length})
                                        </p>
                                        {steps.map((n, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                                                    {i + 1}
                                                </span>
                                                <span className="truncate font-medium">{n.data?.label || `Action ${i + 1}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer de carte avec bouton d'activation */}
                                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 dark:border-white/[0.06] pt-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                                        <GitBranch className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>{steps.length} nœuds actifs</span>
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => use(tpl.key)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-1.5 text-xs shadow-sm hover:shadow-md transition-all cursor-pointer group-hover:scale-[1.02]"
                                    >
                                        <span>Utiliser ce modèle</span>
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 p-8">
                        <LayoutTemplate className="mx-auto h-10 w-10 text-neutral-300 dark:text-neutral-600 mb-3" />
                        <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Aucun modèle ne correspond à votre recherche</h4>
                        <p className="text-xs text-neutral-400 mt-1">Essayez d&apos;ajuster vos filtres ou termes de recherche.</p>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
