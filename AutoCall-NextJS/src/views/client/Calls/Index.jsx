'use client';


import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import { useState } from 'react';
import { Head, router } from '@/lib/page-router';
import axios from 'axios';
import ClientLayout from '@/layouts/ClientLayout';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import { Pagination, AudioPlayer, PageHeader, EmptyState } from '@/components/ui';
import { PhoneCall, Search, Download, RefreshCw, X, FileText, Play } from 'lucide-react';

const SENTIMENT = {
    positive: 'text-emerald-600 dark:text-emerald-400 font-medium',
    neutral: 'text-slate-500 dark:text-[#8E95A5]',
    negative: 'text-rose-600 dark:text-rose-400 font-medium',
};

const QUAL = {
    hot: 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    warm: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    cold: 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    unqualified: 'bg-neutral-100 text-neutral-600 border border-slate-200/80 dark:bg-white/[0.04] dark:text-neutral-400 dark:border-white/10',
};

const QUAL_LABELS = {
    hot: 'Très intéressé (Hot)',
    warm: 'Intéressé (Warm)',
    cold: 'Peu réceptif (Cold)',
    unqualified: 'Non qualifié',
};

const STATUS = {
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    failed: 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    no_answer: 'bg-neutral-100 text-neutral-600 border border-slate-200/80 dark:bg-white/[0.04] dark:text-neutral-400 dark:border-white/10',
    busy: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
};

const STATUS_LABELS = {
    completed: 'Complété',
    failed: 'Échoué',
    no_answer: 'Sans réponse',
    busy: 'Occupé',
};

function fmtDur(s) {
    if (!s) return '0:00';
    const m = Math.floor(s / 60), r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
}

function DetailModal({ callId, onClose }) {
    const [data, setData] = useState(null);
    if (!data && callId) axios.get(route('client.calls.show', callId)).then((r) => setData(r.data)).catch(() => setData({ error: true }));
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={onClose}>
            <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131622] p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                    <div>
                        <h3 className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white">
                            Détail de l&apos;appel vocal
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-[#8E95A5] mt-0.5">
                            Transcription, analyse du sentiment et synthèse automatisée.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {!data ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                        Chargement de l&apos;enregistrement et de la transcription…
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.recording_url && <AudioPlayer src={data.recording_url} filename={`appel-${callId}.mp3`} />}
                        {data.summary && (
                            <div className="rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] p-4 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                                <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-[#8E95A5]">Synthèse de la conversation</p>
                                {data.summary}
                            </div>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                            {data.sentiment && (
                                <span className="flex items-center gap-1.5">
                                    <span className="text-slate-500">Sentiment :</span>
                                    <span className={SENTIMENT[data.sentiment] || 'font-medium'}>{data.sentiment}</span>
                                </span>
                            )}
                            {data.qualification && (
                                <span className="flex items-center gap-1.5">
                                    <span className="text-slate-500">Qualification :</span>
                                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${QUAL[data.qualification]}`}>
                                        {QUAL_LABELS[data.qualification] || data.qualification}
                                    </span>
                                </span>
                            )}
                            <span className="text-slate-500 font-mono">
                                Durée : {fmtDur(data.duration_seconds)}
                            </span>
                        </div>
                        <div>
                            <p className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-[#8E95A5]">Transcription intégrale</p>
                            <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] p-3.5 text-xs font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                {data.transcript || 'Aucune transcription disponible pour cet appel.'}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CallsIndex({ calls, filters = {}, stats = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [detail, setDetail] = useState(null);

    const go = (extra) => router.get(route('client.calls.index'), { ...filters, search, ...extra }, { preserveState: true, replace: true });
    const sync = () => router.post(route('client.calls.sync-recordings'), {}, { preserveScroll: true });

    const hasFilters = Boolean(filters.tab || filters.sentiment || filters.search);

    return (
        <ClientLayout title="Historique des appels">
            <Head title="Appels téléphoniques · AutoCall" />
            <div className="space-y-6">
                <PageHeader
                    title="Historique des appels"
                    description="Consultez les transcriptions, analyses de sentiment et enregistrements audio de vos conversations vocales."
                    primaryAction={{
                        label: 'Exporter les appels (CSV)',
                        href: route('client.calls.export'),
                        icon: Download,
                    }}
                    secondaryActions={[
                        {
                            label: 'Synchroniser les enregistrements',
                            onClick: sync,
                            icon: RefreshCw,
                        },
                    ]}
                />

                <PageOverview feature="calls" />
                <StatCards items={stats} />

                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex gap-1.5">
                        {[
                            ['', 'Tous les appels'],
                            ['transcribed', 'Avec transcription'],
                            ['recordings', 'Avec enregistrement'],
                        ].map(([v, l]) => (
                            <button
                                key={v || 'all'}
                                type="button"
                                onClick={() => go({ tab: v })}
                                className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                                    (filters.tab || '') === v
                                        ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                                        : 'border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131622] text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-white/20'
                                }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                    <select
                        value={filters.sentiment || ''}
                        onChange={(e) => go({ sentiment: e.target.value })}
                        className="rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-xs text-neutral-700 shadow-2xs focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-[#131622] dark:text-neutral-200"
                    >
                        <option value="">Tous les sentiments</option>
                        <option value="positive">Positif</option>
                        <option value="neutral">Neutre</option>
                        <option value="negative">Négatif</option>
                    </select>
                    <form onSubmit={(e) => { e.preventDefault(); go(); }} className="relative flex-1 min-w-[200px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par contact ou numéro…"
                            className="w-full rounded-xl border border-slate-200/90 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 shadow-2xs focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-[#131622] dark:text-white"
                        />
                    </form>
                </div>

                <div className="overflow-hidden rounded-[20px] border border-slate-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
                    {calls?.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 dark:divide-white/[0.06] text-xs">
                                <thead className="bg-slate-50/80 dark:bg-white/[0.02]">
                                    <tr>
                                        {['Contact', 'Campagne', 'Statut', 'Sentiment', 'Qualification', 'Durée', ''].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-300">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                                    {calls.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-neutral-900 dark:text-white">{c.contact || 'Inconnu'}</p>
                                                <p className="font-mono text-xs text-slate-400 mt-0.5">{c.phone_masked}</p>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-[#8E95A5]">
                                                {c.campaign || 'Appel direct'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS[c.status] || 'bg-neutral-100 text-neutral-500 dark:bg-white/[0.04]'}`}>
                                                    {STATUS_LABELS[c.status] || c.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-3 capitalize ${SENTIMENT[c.sentiment] || 'text-slate-400'}`}>
                                                {c.sentiment || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {c.qualification ? (
                                                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${QUAL[c.qualification]}`}>
                                                        {QUAL_LABELS[c.qualification] || c.qualification}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-600 dark:text-neutral-300">
                                                {fmtDur(c.duration_seconds)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setDetail(c.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition cursor-pointer"
                                                >
                                                    {c.has_transcript ? <FileText className="h-3.5 w-3.5 text-blue-500" /> : <Play className="h-3.5 w-3.5 text-emerald-500" />}
                                                    <span>Détails</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-4 sm:p-6">
                            <EmptyState
                                variant={hasFilters ? 'filter' : 'default'}
                                icon={PhoneCall}
                                title={hasFilters ? 'Aucun appel correspondant' : 'Aucun appel enregistré pour le moment'}
                                description={
                                    hasFilters
                                        ? 'Aucun appel ne correspond aux filtres ou termes de recherche sélectionnés.'
                                        : 'Les appels émis par vos campagnes ou reçus sur vos numéros apparaîtront ici automatiquement avec transcription et enregistrement.'
                                }
                                primaryAction={
                                    hasFilters
                                        ? {
                                              label: 'Réinitialiser les filtres',
                                              onClick: () => {
                                                  setSearch('');
                                                  go({ tab: '', sentiment: '' });
                                              },
                                          }
                                        : {
                                              label: 'Lancer un appel de test',
                                              href: '/app/onboarding',
                                              icon: Play,
                                          }
                                }
                            />
                        </div>
                    )}
                </div>

                <Pagination data={calls} />
            </div>

            {detail && <DetailModal callId={detail} onClose={() => setDetail(null)} />}
        </ClientLayout>
    );
}
