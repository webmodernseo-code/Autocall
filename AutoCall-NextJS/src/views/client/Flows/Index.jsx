'use client';



import translationI18n from '@/i18n';
import { Trans } from 'react-i18next';
import { route } from '@/lib/route';
import { useState } from 'react';
import { Head, Link, router } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import { Pagination } from '@/components/ui';
import { Workflow, Plus, LayoutTemplate, Search, Play, Pencil, Trash2, GitBranch, ArrowRight } from 'lucide-react';

const STATUS = {
    active: 'bg-signal-100 text-signal-700 dark:bg-signal-500/20 dark:text-signal-300',
    paused: 'bg-warm/20 text-amber-700 dark:text-amber-300',
    draft: 'bg-neutral-100 text-neutral-500 dark:bg-ink-800 dark:text-neutral-400',
};
const TRIGGER_LABEL = {
    manual: 'Manual', call_completed: 'Call completed', inbound_call: 'Inbound call',
    lead_qualified: 'Lead qualified', schedule: 'Schedule',
};

export default function FlowsIndex({ flows, filters = {}, stats = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const apply = (e) => { e?.preventDefault(); router.get(route('client.flows.index'), { search, status: filters.status }, { preserveState: true, replace: true }); };
    const setStatus = (status) => router.get(route('client.flows.index'), { search, status }, { preserveState: true, replace: true });
    const run = (f) => router.post(route('client.flows.run', f.id), {}, { preserveScroll: true });
    const remove = (f) => { if (confirm(`Delete "${f.name}"? This cannot be undone.`)) router.delete(route('client.flows.destroy', f.id), { preserveScroll: true }); };

    return (
        <ClientLayout title="Flow Builder">
            <Head title="Flow Builder" />
            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white"><Trans i18nKey="nav.flows" /></h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"><Trans i18nKey="hardcoded.views_client_flows_index_3e5f753d054d" /></p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('client.flows.templates')} className="inline-flex items-center gap-2 rounded-soft border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-ink-700 dark:text-neutral-300 dark:hover:bg-ink-800"><LayoutTemplate className="h-4 w-4" /> <Trans i18nKey="admin.templates" /></Link>
                        <Link href={route('client.flows.create')} className="inline-flex items-center gap-2 rounded-soft bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-500"><Plus className="h-4 w-4" /> <Trans i18nKey="hardcoded.views_client_flows_index_ae7eda4427a8" /></Link>
                    </div>
                </div>

                <PageOverview feature="flows" />
                <StatCards items={stats} />

                <form onSubmit={apply} className="flex flex-wrap items-center gap-2">
                    <div className="relative max-w-xs flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={translationI18n.t('hardcoded.views_client_flows_index_9206ad12640b')} className="w-full rounded-soft border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-ink-700 dark:bg-ink-900" />
                    </div>
                    <select value={filters.status || ''} onChange={(e) => setStatus(e.target.value)} className="rounded-soft border border-neutral-200 bg-white px-3 pr-8 py-2 text-sm dark:border-ink-700 dark:bg-ink-900">
                        <option value=""><Trans i18nKey="hardcoded.views_client_flows_index_5edba247126f" /></option>
                        <option value="active"><Trans i18nKey="hardcoded.views_client_flows_index_6bfad4788d28" /></option>
                        <option value="paused">Paused</option>
                        <option value="draft">Draft</option>
                    </select>
                </form>

                {flows.data.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {flows.data.map((f) => (
                            <div key={f.id} className="group flex flex-col rounded-soft-lg border border-neutral-200 bg-white p-4 shadow-soft transition hover:border-brand-300 hover:shadow-soft-lg dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-500/40">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300"><Workflow className="h-5 w-5" /></span>
                                        <div className="min-w-0">
                                            <Link href={route('client.flows.edit', f.id)} className="truncate font-medium text-neutral-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300">{f.name}</Link>
                                            <p className="truncate text-xs text-neutral-400">{TRIGGER_LABEL[f.trigger_type] || 'Manual'}</p>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs capitalize ${STATUS[f.status] || STATUS.draft}`}>{f.status}</span>
                                </div>
                                {f.description && <p className="mt-2 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">{f.description}</p>}
                                <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                                    <span className="inline-flex items-center gap-1"><GitBranch className="h-3.5 w-3.5" /> {f.nodes} steps</span>
                                    <span className="inline-flex items-center gap-1"><Play className="h-3.5 w-3.5" /> {f.executions_count} runs</span>
                                    {f.last_run_at && <span className="truncate">· {f.last_run_at}</span>}
                                </div>
                                <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3 dark:border-ink-800">
                                    <button onClick={() => run(f)} className="inline-flex items-center gap-1.5 rounded-soft bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300"><Play className="h-3.5 w-3.5" /> Run</button>
                                    <Link href={route('client.flows.edit', f.id)} className="inline-flex items-center gap-1.5 rounded-soft px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-ink-800"><Pencil className="h-3.5 w-3.5" /> <Trans i18nKey="hardcoded.views_client_flows_index_6eaf82f5d772" /></Link>
                                    <button onClick={() => remove(f)} className="ml-auto rounded-soft p-1.5 text-neutral-400 hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-soft-lg border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-ink-700">
                        <Workflow className="mx-auto mb-3 h-12 w-12 text-neutral-300" />
                        <p className="text-neutral-500"><Trans i18nKey="hardcoded.views_client_flows_index_47805c69a0e2" /></p>
                        <div className="mt-4 flex justify-center gap-2">
                            <Link href={route('client.flows.templates')} className="inline-flex items-center gap-2 rounded-soft border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-ink-700 dark:text-neutral-300"><LayoutTemplate className="h-4 w-4" /> Browse templates</Link>
                            <Link href={route('client.flows.create')} className="inline-flex items-center gap-2 rounded-soft bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-500"><Trans i18nKey="hardcoded.views_client_flows_index_77ac3f7ac1b4" /> <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                    </div>
                )}

                <Pagination data={flows} />
            </div>
        </ClientLayout>
    );
}
