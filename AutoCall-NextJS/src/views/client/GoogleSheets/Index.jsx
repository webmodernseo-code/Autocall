'use client';

import { useState } from 'react';
import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import { Head, router, useForm } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import { useTranslation, Trans } from 'react-i18next';
import PageOverview from '@/components/PageOverview';
import SetupGuide from '@/components/SetupGuide';
import StatCards from '@/components/StatCards';
import {
    Table,
    ExternalLink,
    Mail,
    Unplug,
    CheckCircle2,
    XCircle,
    FileText,
    CalendarClock,
    Link2,
    Edit3,
    Sparkles,
} from 'lucide-react';

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

    const [showCustomLink, setShowCustomLink] = useState(false);
    const [customUrl, setCustomUrl] = useState('');
    const [customEmail, setCustomEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const settings = useForm({
        sync_forms: config.sync_forms ?? false,
        sync_appointments: config.sync_appointments ?? false,
    });

    const connect = (payload = {}) => {
        setIsSubmitting(true);
        router.post(
            route('client.google-sheets.connect'),
            payload,
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const handleCustomConnect = (e) => {
        e.preventDefault();
        connect({
            spreadsheet_url: customUrl,
            account_email: customEmail,
        });
    };

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
        <ClientLayout title={translationI18n.t('nav.google_sheets')}>
            <Head title="Google Sheets · AutoCall" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white"><Trans i18nKey="nav.google_sheets" /></h1>
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
                                ? 'Reliez votre compte Google pour créer une feuille de calcul dédiée ou synchroniser un tableur existant en direct.'
                                : 'Grant access to your Google account to automatically create and synchronize your calling and form data.'}
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => connect()}
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition cursor-pointer disabled:opacity-50"
                            >
                                <Table className="h-4 w-4" />
                                <span>{isSubmitting ? (isFr ? 'Connexion en cours…' : 'Connecting…') : (isFr ? 'Lier mon compte Google Sheets (Auto)' : 'Connect Google Sheets')}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowCustomLink(!showCustomLink)}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 transition cursor-pointer"
                            >
                                <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span>{isFr ? 'Lier une feuille existante (URL ou ID)' : 'Link existing sheet by URL'}</span>
                            </button>
                        </div>

                        {/* Formulaire de saisie personnalisée d'URL / ID */}
                        {showCustomLink && (
                            <form
                                onSubmit={handleCustomConnect}
                                className="mt-6 max-w-lg mx-auto text-left rounded-xl border border-blue-200/90 dark:border-white/10 bg-blue-50/20 dark:bg-white/[0.02] p-4 space-y-3"
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                                        {isFr ? 'Renseigner votre feuille Google Sheets' : 'Enter your Google Sheets details'}
                                    </span>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                                        {isFr ? 'Lien ou ID de la feuille Google Sheets :' : 'Google Sheet URL or ID:'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                        placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5n..."
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-3 py-2 text-xs font-mono"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-500 dark:text-neutral-400">
                                        {isFr ? 'Collez simplement l\'URL de votre tableur depuis la barre d\'adresse de votre navigateur.' : 'Copy and paste the URL of your spreadsheet directly.'}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                                        {isFr ? 'Votre adresse Google (optionnel) :' : 'Your Google email (optional):'}
                                    </label>
                                    <input
                                        type="email"
                                        value={customEmail}
                                        onChange={(e) => setCustomEmail(e.target.value)}
                                        placeholder="exemple@gmail.com"
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-3 py-1.5 text-xs"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-blue-100 dark:border-white/[0.04]">
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomLink(false)}
                                        className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                                    >
                                        {isFr ? 'Annuler' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 text-xs font-semibold shadow-xs disabled:opacity-50"
                                    >
                                        {isSubmitting ? (isFr ? 'Enregistrement…' : 'Saving…') : (isFr ? 'Connecter ce tableur' : 'Connect Spreadsheet')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#131622] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] dark:shadow-none">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 space-y-2.5">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-neutral-200">
                                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span>{config.account_email || 'compte-google@gmail.com'}</span>
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
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomLink(!showCustomLink)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition cursor-pointer"
                                    >
                                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                                        <span>{isFr ? 'Changer de feuille' : 'Change sheet'}</span>
                                    </button>

                                    <button
                                        onClick={disconnect}
                                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/60 dark:bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer"
                                    >
                                        <Unplug className="h-4 w-4" />
                                        <span>{isFr ? 'Déconnecter' : 'Disconnect'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Formulaire de modification de la feuille */}
                            {showCustomLink && (
                                <form
                                    onSubmit={handleCustomConnect}
                                    className="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] max-w-lg space-y-3"
                                >
                                    <div>
                                        <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                                            {isFr ? 'Nouvelle URL ou ID Google Sheets :' : 'New Google Sheets URL or ID:'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={customUrl}
                                            onChange={(e) => setCustomUrl(e.target.value)}
                                            placeholder={config.spreadsheet_url || 'https://docs.google.com/spreadsheets/d/...'}
                                            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-3 py-1.5 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowCustomLink(false)}
                                            className="px-3 py-1 text-xs text-neutral-500"
                                        >
                                            {isFr ? 'Annuler' : 'Cancel'}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1 text-xs font-semibold"
                                        >
                                            {isFr ? 'Mettre à jour' : 'Update'}
                                        </button>
                                    </div>
                                </form>
                            )}
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
