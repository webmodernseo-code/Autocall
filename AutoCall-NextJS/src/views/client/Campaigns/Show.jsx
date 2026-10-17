'use client';

import { route } from '@/lib/route';
import { Head, Link, router } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import KycGate from '@/components/KycGate';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft,
    Play,
    Pause,
    Trash2,
    Users,
    PhoneCall,
    Bot,
    Hash,
    Megaphone,
    Pencil,
    Target,
    AlertCircle,
} from 'lucide-react';

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
    lead_qualification: 'Qualification de prospects',
    sales: 'Vente & Prospection',
    support: 'Support & Suivi',
    survey: 'Sondage & Enquête',
};

function MetricCard({ icon: Icon, label, value, sub }) {
    return (
        <div className="rounded-[20px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-4.5 shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-[#8E95A5]">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="mt-2 font-hero-sans text-2xl font-bold tracking-tight tabular-nums text-neutral-900 dark:text-white">
                {value}
            </p>
            {sub && <p className="mt-1 text-[11px] text-neutral-400">{sub}</p>}
        </div>
    );
}

export default function CampaignShow({ campaign }) {
    const { t } = useTranslation();
    const act = (verb) => router.post(route(`client.campaigns.${verb}`, campaign.id), {}, { preserveScroll: true });
    const remove = () => {
        if (confirm('Voulez-vous vraiment supprimer cette campagne ?')) {
            router.delete(route('client.campaigns.destroy', campaign.id));
        }
    };

    return (
        <ClientLayout title={campaign.name}>
            <Head title={`${campaign.name} · AutoCall`} />
            <div className="mx-auto max-w-5xl space-y-6">

                {/* En-tête avec navigation & actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <Link
                            href={route('client.campaigns.index')}
                            className="rounded-xl border border-neutral-200/90 dark:border-white/10 p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#131622] hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition shadow-2xs"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="font-hero-sans text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                    {campaign.name}
                                </h1>
                                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${STATUS[campaign.status]}`}>
                                    {STATUS_LABELS[campaign.status] || campaign.status}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-[#8E95A5] mt-0.5">
                                {TYPE_LABEL[campaign.type] || campaign.type}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {['draft', 'paused'].includes(campaign.status) && (
                            <Link
                                href={route('client.campaigns.edit', campaign.id)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition shadow-2xs"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Modifier</span>
                            </Link>
                        )}

                        {['draft', 'paused'].includes(campaign.status) && (
                            <button
                                type="button"
                                onClick={() => act(campaign.status === 'draft' ? 'launch' : 'resume')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-[0_2px_8px_rgba(16,185,129,0.25)] transition cursor-pointer"
                            >
                                <Play className="h-3.5 w-3.5 fill-current" />
                                <span>{campaign.status === 'draft' ? 'Lancer la campagne' : 'Reprendre'}</span>
                            </button>
                        )}

                        {campaign.status === 'active' && (
                            <button
                                type="button"
                                onClick={() => act('pause')}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition cursor-pointer"
                            >
                                <Pause className="h-3.5 w-3.5" />
                                <span>Mettre en pause</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={remove}
                            className="inline-flex items-center justify-center rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition shadow-2xs cursor-pointer"
                            title="Supprimer la campagne"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {['draft', 'paused'].includes(campaign.status) && <KycGate action="lancer cette campagne" />}

                {/* 4 Métriques clés de la campagne */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <MetricCard
                        icon={Users}
                        label="Contacts ciblés"
                        value={Number(campaign.contacts_count ?? 0).toLocaleString()}
                        sub="Audience de la campagne"
                    />
                    <MetricCard
                        icon={PhoneCall}
                        label="Appels passés"
                        value={Number(campaign.calls_count ?? 0).toLocaleString()}
                        sub="Exécutions enregistrées"
                    />
                    <MetricCard
                        icon={Bot}
                        label="Agent assigné"
                        value={campaign.agent?.name || '—'}
                        sub="Voix & personnalité IA"
                    />
                    <MetricCard
                        icon={Hash}
                        label="Numéro appelant"
                        value={campaign.number || '—'}
                        sub="Ligne sortante"
                    />
                </div>

                {/* Consigne d'appel */}
                {campaign.goal && (
                    <div className="rounded-[20px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
                        <div className="flex items-center gap-2 text-neutral-500 dark:text-[#8E95A5] mb-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            <h3 className="font-hero-sans text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                                Directive & Objectif d&apos;appel
                            </h3>
                        </div>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                            {campaign.goal}
                        </p>
                    </div>
                )}

                {/* Alerte si agent ou numéro manquant */}
                {(!campaign.agent || !campaign.number) && (
                    <div className="rounded-2xl border border-amber-200/90 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <div>
                            <p className="font-semibold">Configuration incomplète</p>
                            <p className="mt-0.5 text-amber-700 dark:text-amber-400/90">
                                Pour que la campagne puisse composer des numéros, vous devez lui assigner un agent vocal IA actif et une ligne téléphonique sortante.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
