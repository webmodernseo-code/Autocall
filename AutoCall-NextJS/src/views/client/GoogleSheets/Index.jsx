'use client';

import { route } from '@/lib/route';
import { Head, router, useForm } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import { useTranslation, Trans } from 'react-i18next';
import PageOverview from '@/components/PageOverview';
import SetupGuide from '@/components/SetupGuide';
import StatCards from '@/components/StatCards';
import { Table, ExternalLink, Mail, Unplug, CheckCircle2, XCircle, FileText, CalendarClock } from 'lucide-react';

function StatusBadge({ connected, isFr }) {
    return connected ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isFr ? 'Connecté' : 'Connected'}</span>
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/[0.06] dark:text-neutral-400 dark:border-white/10">
            <XCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>{isFr ? 'Non connecté' : 'Not connected'}</span>
        </span>
    );
}

function Toggle({ label, description, icon: Icon, checked, onChange, disabled }) {
    return (
        <label className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#131622] p-4 shadow-2xs hover:border-slate-300 transition cursor-pointer">
            <div className="flex gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{label}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">{description}</p>
                </div>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 cursor-pointer ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-700'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </label>
    );
}

export default function GoogleSheetsIndex({ config = {}, stats = [] }) {
    const { t, i18n } = useTranslation();
    const isFr = (i18n?.language || 'fr').startsWith('fr');

    const settings = useForm({
        sync_forms: config.sync_forms ?? false,
        sync_appointments: config.sync_appointments ?? false,
    });

    const connect = () => router.post(route('client.google-sheets.connect'), {}, { preserveScroll: true });
    const disconnect = () => {
        const confirmMsg = isFr ? 'Déconnecter Google Sheets ? La synchronisation sera interrompue.' : 'Disconnect Google Sheets? Sync will stop.';
        if (confirm(confirmMsg)) {
            router.post(route('client.google-sheets.disconnect'), {}, { preserveScroll: true });
        }
    };
    const saveToggle = (field, value) => {
        settings.setData(field, value);
        router.put(
            route('client.google-sheets.update'),
            { sync_forms: settings.data.sync_forms, sync_appointments: settings.data.sync_appointments, [field]: value },
            { preserveScroll: true }
        );
    };

    return (
        <ClientLayout title="Google Sheets">
            <Head title="Google Sheets · AutoCall" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Google Sheets</h1>
                            <StatusBadge connected={config.connected} isFr={isFr} />
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-neutral-400">
                            {isFr
                                ? 'Synchronisez vos données de formulaires et rendez-vous vers vos feuilles de calcul Google Sheets en temps réel.'
                                : 'Push form submissions and booked appointments to Google Sheets automatically.'}
                        </p>
                    </div>
                </div>

                <PageOverview feature="google-sheets" />

                <SetupGuide guide="google-sheets" />
                <StatCards items={stats} />

                {!config.connected ? (
                    <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#131622] p-8 text-center shadow-[0_1px_3px_rgba(15,23,42,0.06),0_6px_20px_rgba(15,23,42,0.03)] dark:shadow-none">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                            <Table className="h-7 w-7" />
                        </div>
                        <h2 className="font-hero-sans text-lg font-bold text-neutral-900 dark:text-white">
                            {isFr ? 'Connecter votre compte Google Sheets' : 'Connect Google Sheets'}
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                            {isFr
                                ? 'Autorisez l\'accès à votre compte Google pour créer une feuille de calcul dédiée et alimenter vos lignes en direct.'
                                : 'Grant access to your Google account to automatically create and synchronize your calling and form data.'}
                        </p>
                        <button
                            onClick={connect}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition cursor-pointer"
                        >
                            <Table className="h-4 w-4" />
                            <span>{isFr ? 'Lier mon compte Google Sheets' : 'Connect Google Sheets'}</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#131622] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] dark:shadow-none">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 space-y-2.5">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-neutral-200">
                                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span>{config.account_email}</span>
                                    </div>
                                    {config.spreadsheet_url && (
                                        <a
                                            href={config.spreadsheet_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                        >
                                            <Table className="h-4 w-4" />
                                            <span>{isFr ? 'Ouvrir le tableur Google Sheets' : 'Open spreadsheet'}</span>
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                    {config.last_synced_human && (
                                        <p className="text-xs text-slate-400 dark:text-neutral-500">
                                            {isFr ? 'Dernière synchronisation :' : 'Last synced:'} {config.last_synced_human}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={disconnect}
                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/60 dark:bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer"
                                >
                                    <Unplug className="h-4 w-4" />
                                    <span>{isFr ? 'Déconnecter' : 'Disconnect'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#131622] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] dark:shadow-none">
                            <h3 className="font-hero-sans text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                                {isFr ? 'Synchronisation automatique' : 'Auto-sync settings'}
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
                                {isFr
                                    ? 'Activez les flux de données que vous souhaitez envoyer automatiquement vers votre feuille Google Sheets.'
                                    : 'Choose which incoming events are appended to your spreadsheet rows in real-time.'}
                            </p>
                            <div className="mt-4 space-y-3">
                                <Toggle
                                    label={isFr ? 'Synchroniser les formulaires' : 'Sync form submissions'}
                                    description={isFr ? 'Ajoute chaque nouvelle soumission de formulaire sous forme de ligne.' : 'Append each new form submission as a row.'}
                                    icon={FileText}
                                    checked={settings.data.sync_forms}
                                    disabled={settings.processing}
                                    onChange={(v) => saveToggle('sync_forms', v)}
                                />
                                <Toggle
                                    label={isFr ? 'Synchroniser les rendez-vous' : 'Sync appointments'}
                                    description={isFr ? 'Ajoute les rendez-vous pris par vos agents vocaux au fil de l\'eau.' : 'Append booked appointments as they are scheduled.'}
                                    icon={CalendarClock}
                                    checked={settings.data.sync_appointments}
                                    disabled={settings.processing}
                                    onChange={(v) => saveToggle('sync_appointments', v)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
