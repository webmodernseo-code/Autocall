'use client';



import translationI18n from '@/i18n';
import { Trans } from 'react-i18next';
import { useState } from 'react';
import { Head, router } from '@/lib/page-router';
import AdminLayout from '@/layouts/AdminLayout';
import {
    Server, Clock, Cpu, CheckCircle2, XCircle, AlertTriangle, Copy, Check, RefreshCw, Terminal,
} from 'lucide-react';

function CopyBox({ label, value, hint }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</span>
                <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-soft border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-ink-700 dark:text-neutral-300 dark:hover:bg-ink-800">
                    {copied ? <><Check className="h-3.5 w-3.5 text-signal-600" /> <Trans i18nKey="hardcoded.views_admin_system_index_a9d9af2f3c23" /></> : <><Copy className="h-3.5 w-3.5" /> <Trans i18nKey="hardcoded.views_admin_system_index_6c30b3bf2f5f" /></>}
                </button>
            </div>
            <pre className="overflow-x-auto rounded-soft border border-neutral-200 bg-neutral-50 px-3 py-2.5 font-mono text-xs leading-relaxed text-neutral-800 dark:border-ink-700 dark:bg-ink-950 dark:text-neutral-200 whitespace-pre-wrap break-all">{value}</pre>
            {hint && <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
        </div>
    );
}

function HealthPill({ ok, warn, okText, badText }) {
    if (warn) return <span className="inline-flex items-center gap-1 rounded-full bg-warm/20 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"><AlertTriangle className="h-3.5 w-3.5" /> {badText}</span>;
    return ok
        ? <span className="inline-flex items-center gap-1 rounded-full bg-signal-100 px-2.5 py-1 text-xs font-medium text-signal-700 dark:bg-signal-500/20 dark:text-signal-300"><CheckCircle2 className="h-3.5 w-3.5" /> {okText}</span>
        : <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger"><XCircle className="h-3.5 w-3.5" /> {badText}</span>;
}

function HealthRow({ label, children, desc }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-neutral-100 py-3 last:border-0 dark:border-ink-800">
            <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{label}</p>
                {desc && <p className="text-xs text-neutral-500 dark:text-neutral-400">{desc}</p>}
            </div>
            {children}
        </div>
    );
}

function Kv({ k, v, mono = true, ok = null }) {
    return (
        <div className="flex items-start justify-between gap-3 py-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{k}</span>
            <span className={`text-right text-sm ${mono ? 'font-mono' : ''} ${ok === false ? 'text-danger' : 'text-neutral-800 dark:text-neutral-200'} break-all`}>{v}</span>
        </div>
    );
}

export default function SystemIndex({ env, commands, health }) {
    const refresh = () => router.reload({ only: ['health'] });
    const lastRun = health.scheduler_last_run ? new Date(health.scheduler_last_run * 1000).toLocaleString() : 'never';

    return (
        <AdminLayout title={translationI18n.t('hardcoded.views_admin_system_index_b5bb537afd37')}>
            <Head title={translationI18n.t('hardcoded.views_admin_system_index_afa2d01dfaab')} />
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300"><Server className="h-5 w-5" /></span>
                        <div>
                            <h2 className="font-display text-xl font-bold text-neutral-900 dark:text-white"><Trans i18nKey="hardcoded.views_admin_system_index_afa2d01dfaab" /></h2>
                            <p className="text-xs text-neutral-400"><Trans i18nKey="hardcoded.views_admin_system_index_7eaf4407bd93" /></p>
                        </div>
                    </div>
                    <button onClick={refresh} className="inline-flex items-center gap-2 rounded-soft border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-ink-700 dark:text-neutral-300 dark:hover:bg-ink-800"><RefreshCw className="h-4 w-4" /> <Trans i18nKey="hardcoded.views_admin_system_index_ae2fe836d5d9" /></button>
                </div>

                {/* Live health */}
                <div className="rounded-soft-lg border border-neutral-200 bg-white p-6 shadow-soft dark:border-ink-800 dark:bg-ink-900">
                    <div className="mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-neutral-400" /><h3 className="font-display text-base font-semibold text-neutral-900 dark:text-white"><Trans i18nKey="hardcoded.views_admin_system_index_072dc19a94c7" /></h3></div>
                    <HealthRow label="Scheduler (cron)" desc={`Last tick: ${lastRun}`}>
                        <HealthPill ok={health.scheduler_running} okText="Running" badText="Not detected" />
                    </HealthRow>
                    <HealthRow label="Queue worker" desc={`${health.jobs_waiting} job(s) waiting to be processed`}>
                        <HealthPill ok={!health.worker_stalled} warn={health.worker_stalled} okText="Healthy" badText="Backlog not draining" />
                    </HealthRow>
                    <HealthRow label="Failed jobs" desc="Jobs that exhausted all retries">
                        <HealthPill ok={health.jobs_failed === 0} okText="None" badText={`${health.jobs_failed} failed`} />
                    </HealthRow>
                    <HealthRow label="Pending calls" desc="Contacts queued and waiting to be dialed">
                        <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{health.queue_pending}</span>
                    </HealthRow>
                    {!health.scheduler_running && (
                        <div className="mt-3 rounded-soft border border-warm/30 bg-warm/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                            <Trans i18nKey="hardcoded.views_admin_system_index_42f3c41e73f7" />
                        </div>
                    )}
                </div>

                {/* Setup commands */}
                <div className="rounded-soft-lg border border-neutral-200 bg-white p-6 shadow-soft dark:border-ink-800 dark:bg-ink-900 space-y-5">
                    <div className="flex items-center gap-2"><Terminal className="h-4 w-4 text-neutral-400" /><h3 className="font-display text-base font-semibold text-neutral-900 dark:text-white"><Trans i18nKey="hardcoded.views_admin_system_index_b463403c2415" /></h3></div>

                    <div className="rounded-soft bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:bg-ink-950 dark:text-neutral-300">
                        <Trans i18nKey="hardcoded.views_admin_system_index_7c32ec680ba2" /> <span className="font-semibold">both</span> <Trans i18nKey="hardcoded.views_admin_system_index_465c0594df05" /> <span className="font-mono">* * * * *</span> <Trans i18nKey="hardcoded.views_admin_system_index_aca39232621e" /> <span className="font-semibold">schedule</span> <Trans i18nKey="hardcoded.views_admin_system_index_3c39e9f08a93" /> <span className="font-semibold">command</span> <Trans i18nKey="hardcoded.views_admin_system_index_2515559dc504" />
                    </div>

                    <CopyBox
                        label="1. Cron — Scheduler (required)"
                        value={commands.cron_scheduler}
                        hint="Runs every minute. Drives dialing, stuck-call recovery, and monthly credits — this one cron powers all scheduled tasks."
                    />
                    <CopyBox
                        label="2. Cron — Queue worker (required if you are NOT using Supervisor below)"
                        value={commands.cron_worker}
                        hint="Processes queued call jobs each minute. Skip this one if you set up the Supervisor daemon instead."
                    />
                    <CopyBox
                        label="Supervisor (recommended for production, instead of cron #2)"
                        value={commands.supervisor}
                        hint="Save as /etc/supervisor/conf.d/callmineai-worker.conf, then: supervisorctl reread && supervisorctl update && supervisorctl start callmineai-worker:*  — an always-on worker with auto-restart. Requires SSH/root."
                    />
                </div>

                {/* Environment */}
                <div className="rounded-soft-lg border border-neutral-200 bg-white p-6 shadow-soft dark:border-ink-800 dark:bg-ink-900">
                    <div className="mb-3 flex items-center gap-2"><Cpu className="h-4 w-4 text-neutral-400" /><h3 className="font-display text-base font-semibold text-neutral-900 dark:text-white">Detected environment</h3></div>
                    <Kv k="Node binary" v={env.node_binary} />
                    <Kv k="Node version" v={env.node_version} />
                    <Kv k="App path" v={env.app_path} />
                    <Kv k="Worker script" v={env.worker_path} />
                    <Kv k="App URL" v={env.app_url} ok={String(env.app_url).startsWith('https://')} />
                    <Kv k="Queue driver" v={env.queue_connection} />
                    <Kv k="Production build" v={env.config_cached ? 'yes' : 'no'} mono={false} />
                    <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                        If <span className="font-mono">Node binary</span> <Trans i18nKey="hardcoded.views_admin_system_index_cb884b99a073" /> <span className="font-mono">which node</span><Trans i18nKey="hardcoded.views_admin_system_index_5415faefae68" /> <span className="font-mono">https</span> <Trans i18nKey="hardcoded.views_admin_system_index_ae8747fe910c" />
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
