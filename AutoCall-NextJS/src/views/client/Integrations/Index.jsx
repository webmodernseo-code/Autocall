'use client';


import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import { useState } from 'react';
import { Head, router, useForm } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import { useTranslation, Trans } from 'react-i18next';
import PageOverview from '@/components/PageOverview';
import SetupGuide from '@/components/SetupGuide';
import StatCards from '@/components/StatCards';
import { Cable, Plus, Trash2, Send, X, Webhook as WebhookIcon, Copy } from 'lucide-react';

const inputCls = 'w-full rounded-soft border border-neutral-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm';
const EVENT_LABEL = { 'call.completed': 'Call completed', 'lead.qualified': 'Lead qualified', 'campaign.status_changed': 'Campaign status changed', 'agent.performance': 'Agent performance' };

function Modal({ initial, events, campaigns, onClose }) {
    const editing = Boolean(initial?.id);
    const form = useForm({
        name: initial?.name || '', target_url: initial?.target_url || '',
        events: initial?.events || ['call.completed'], campaign_id: initial?.campaign_id || '', is_active: initial?.is_active ?? true,
    });
    const toggle = (ev) => form.setData('events', form.data.events.includes(ev) ? form.data.events.filter((e) => e !== ev) : [...form.data.events, ev]);
    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        editing ? form.put(route('client.integrations.update', initial.id), opts) : form.post(route('client.integrations.store'), opts);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <form onSubmit={submit} className="w-full max-w-md rounded-soft-lg bg-white dark:bg-ink-900 p-5 shadow-soft-xl space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-white">{editing ? translationI18n.t('hardcoded.views_client_integrations_index_fa23131ec62a') : translationI18n.t('hardcoded.views_client_integrations_index_a19c3370606d')}</h3><button type="button" onClick={onClose}><X className="h-4 w-4 text-neutral-400" /></button></div>
                <input className={inputCls} placeholder={translationI18n.t('hardcoded.views_client_integrations_index_bd659a71cc35')} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                {form.errors.name && <p className="text-xs text-danger">{form.errors.name}</p>}
                <input className={inputCls} placeholder="https://your-app.com/webhooks/autocall" value={form.data.target_url} onChange={(e) => form.setData('target_url', e.target.value)} />
                {form.errors.target_url && <p className="text-xs text-danger">{form.errors.target_url}</p>}
                <div>
                    <p className="mb-1 text-xs font-medium normal-case text-neutral-500">Events</p>
                    <div className="space-y-1">{events.map((ev) => <label key={ev} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"><input type="checkbox" checked={form.data.events.includes(ev)} onChange={() => toggle(ev)} /> {EVENT_LABEL[ev] || ev}</label>)}</div>
                </div>
                <select className={inputCls} value={form.data.campaign_id} onChange={(e) => form.setData('campaign_id', e.target.value)}><option value=""><Trans i18nKey="hardcoded.views_client_integrations_index_58da84bfe87e" /></option>{campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"><input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} /> <Trans i18nKey="hardcoded.views_client_integrations_index_24e5f3cd3d8b" /></label>
                <div className="flex justify-end gap-2 pt-1"><button type="button" onClick={onClose} className="rounded-soft px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-ink-800"><Trans i18nKey="hardcoded.views_client_integrations_index_88e5abd76567" /></button><button type="submit" disabled={form.processing} className="rounded-soft bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-50">{editing ? translationI18n.t('hardcoded.views_client_integrations_index_d06fdc737baa') : translationI18n.t('hardcoded.views_client_integrations_index_2a81914f40d7')}</button></div>
            </form>
        </div>
    );
}

export default function IntegrationsIndex({ webhooks = [], availableEvents = [], campaigns = [], stats = [] }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState(null);
    const remove = (w) => { if (confirm(`Delete webhook "${w.name}"?`)) router.delete(route('client.integrations.destroy', w.id), { preserveScroll: true }); };
    const test = (w) => router.post(route('client.integrations.test', w.id), {}, { preserveScroll: true });
    const copy = (s) => navigator.clipboard?.writeText(s);

    return (
        <ClientLayout title={t('nav.integrations') !== 'nav.integrations' ? t('nav.integrations') : 'Integrations'}>
            <Head title={translationI18n.t('nav.integrations')} />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div><h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Integrations & Webhooks</h1><p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"><Trans i18nKey="hardcoded.views_client_integrations_index_9f9d0cf3f837" /></p></div>
                    <button onClick={() => setModal({})} className="inline-flex items-center gap-2 rounded-soft bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"><Plus className="h-4 w-4" /> <Trans i18nKey="hardcoded.views_client_integrations_index_a19c3370606d" /></button>
                </div>

                <PageOverview feature="integrations" />

                <SetupGuide guide="webhooks" />
                <StatCards items={stats} />

                {webhooks.length === 0 ? (
                    <div className="rounded-soft-lg border border-dashed border-neutral-300 dark:border-ink-700 px-6 py-16 text-center"><Cable className="mx-auto mb-3 h-12 w-12 text-neutral-300" /><p className="text-neutral-500"><Trans i18nKey="hardcoded.views_client_integrations_index_d58df0ef4f7e" /></p></div>
                ) : (
                    <div className="space-y-3">
                        {webhooks.map((w) => (
                            <div key={w.id} className="rounded-soft-lg border border-neutral-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-soft">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2"><WebhookIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" /><p className="font-display font-semibold text-neutral-900 dark:text-white">{w.name}</p>{!w.is_active && <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-ink-800">Paused</span>}</div>
                                        <p className="mt-1 truncate font-mono text-xs text-neutral-500">{w.target_url}</p>
                                        <div className="mt-2 flex flex-wrap gap-1">{(w.events || []).map((e) => <span key={e} className="rounded-full bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 text-xs text-brand-700 dark:text-brand-300">{EVENT_LABEL[e] || e}</span>)}{w.campaign && <span className="rounded-full bg-neutral-100 dark:bg-ink-800 px-2 py-0.5 text-xs text-neutral-500">{w.campaign}</span>}</div>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400"><span>Secret:</span><code className="font-mono">{w.secret?.slice(0, 14)}…</code><button onClick={() => copy(w.secret)} title={translationI18n.t('hardcoded.views_client_integrations_index_3e929af8f943')}><Copy className="h-3 w-3" /></button>{w.last_status && <span>· last: {w.last_status}</span>}<span>· {w.deliveries_count} deliveries</span></div>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <button onClick={() => test(w)} title={translationI18n.t('hardcoded.views_client_integrations_index_db1a797a6f7c')} className="rounded-soft p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-ink-800"><Send className="h-4 w-4" /></button>
                                        <button onClick={() => setModal(w)} className="rounded-soft border border-neutral-200 dark:border-ink-700 px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-ink-800"><Trans i18nKey="hardcoded.views_client_integrations_index_ec34c216fc3c" /></button>
                                        <button onClick={() => remove(w)} className="rounded-soft p-2 text-danger hover:bg-danger/10"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modal && <Modal initial={modal} events={availableEvents} campaigns={campaigns} onClose={() => setModal(null)} />}
        </ClientLayout>
    );
}
