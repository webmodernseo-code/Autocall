'use client';


import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import { useState } from 'react';
import { Head, Link, router } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import AgentTabs from '@/components/AgentTabs';
import { PageHeader, EmptyState } from '@/components/ui';
import { Bot, Plus, Pencil, Trash2, AudioLines, Search } from 'lucide-react';
import { useMoney } from '@/lib/money';

const STATUS = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    draft: 'bg-neutral-100 text-neutral-600 border-neutral-200/80 dark:bg-white/[0.04] dark:text-neutral-400 dark:border-white/10',
    archived: 'bg-neutral-100 text-neutral-400 border-neutral-200/80 dark:bg-white/[0.04]',
};

const STATUS_LABELS = {
    active: 'Actif',
    draft: 'Brouillon',
    archived: 'Archivé',
};

export default function AgentsIndex({ agents, stats = [], filters = {}, engines = [] }) {
    const money = useMoney();
    const [search, setSearch] = useState(filters.search || '');
    const apply = (e) => {
        e?.preventDefault();
        router.get(route('client.agents.index'), { search, engine: filters.engine }, { preserveState: true, replace: true });
    };
    const setEngine = (engine) => router.get(route('client.agents.index'), { search, engine }, { preserveState: true, replace: true });
    const remove = (a) => {
        if (confirm(`Voulez-vous vraiment supprimer l'agent "${a.name}" ? Cette action est irréversible.`)) {
            router.delete(route('client.agents.destroy', a.id), { preserveScroll: true });
        }
    };

    const hasSearch = Boolean(filters.search || filters.engine);

    return (
        <ClientLayout title="Agents conversationnels">
            <Head title="Agents conversationnels · AutoCall" />
            <div className="space-y-6">
                <PageHeader
                    title="Agents conversationnels"
                    description="Configurez vos assistants vocaux IA, leurs voix naturelles et leurs scénarios d'appel."
                    primaryAction={{
                        label: 'Créer un agent',
                        href: route('client.agents.create'),
                        icon: Plus,
                    }}
                />

                <AgentTabs active="agents" />
                <PageOverview feature="agents" />
                <StatCards items={stats} />

                <div className="flex flex-wrap items-center gap-2.5">
                    <form onSubmit={apply} className="relative max-w-xs flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par nom ou langue..."
                            className="w-full rounded-xl border border-slate-200/90 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 shadow-2xs focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-[#131622] dark:text-white"
                        />
                    </form>
                    <select
                        value={filters.engine || ''}
                        onChange={(e) => setEngine(e.target.value)}
                        className="rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-xs text-neutral-700 shadow-2xs focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-[#131622] dark:text-neutral-200"
                    >
                        <option value="">Tous les moteurs vocaux</option>
                        {engines.map((e) => (
                            <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                    </select>
                </div>

                {agents?.data?.length === 0 ? (
                    <EmptyState
                        variant={hasSearch ? 'search' : 'default'}
                        icon={Bot}
                        title={hasSearch ? 'Aucun agent correspondant' : 'Aucun agent conversationnel'}
                        description={
                            hasSearch
                                ? 'Aucun agent ne correspond à vos critères de recherche actuels.'
                                : 'Créez votre premier agent vocal IA pour automatiser la qualification de vos contacts et la prise de rendez-vous.'
                        }
                        primaryAction={
                            hasSearch
                                ? {
                                      label: 'Réinitialiser les filtres',
                                      onClick: () => {
                                          setSearch('');
                                          router.get(route('client.agents.index'), {}, { preserveState: true, replace: true });
                                      },
                                  }
                                : {
                                      label: 'Créer mon premier agent',
                                      href: route('client.agents.create'),
                                  }
                        }
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.data.map((a) => (
                            <div
                                key={a.id}
                                className="flex flex-col justify-between rounded-[20px] border border-slate-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)] hover:shadow-[0_10px_28px_rgba(16,24,40,0.12)] hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-200"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                                <Bot className="h-5 w-5" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate font-hero-sans font-bold text-sm text-neutral-900 dark:text-white">
                                                    {a.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-[#8E95A5] mt-0.5">
                                                    {a.llm_model} · {a.language}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shrink-0 ${STATUS[a.status] || STATUS.draft}`}>
                                            {STATUS_LABELS[a.status] || a.status}
                                        </span>
                                    </div>
                                    {a.engine_label && (
                                        <div className="mt-3">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
                                                <span className="h-2 w-2 rounded-full" style={{ background: a.engine_dot }} />
                                                {a.engine_label}
                                            </span>
                                        </div>
                                    )}
                                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-[#8E95A5]">
                                        <AudioLines className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>{a.voice || 'Voix standard'}</span>
                                        <span className="ml-auto font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                                            {money(a.cost_per_minute_cents, 'EUR', { decimals: 3 })}/min
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2 border-t border-slate-100 dark:border-white/[0.06] pt-3">
                                    <Link
                                        href={route('client.agents.edit', a.id)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition"
                                    >
                                        <Pencil className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Configurer</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => remove(a)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200/80 dark:border-rose-500/20 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Supprimer</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
