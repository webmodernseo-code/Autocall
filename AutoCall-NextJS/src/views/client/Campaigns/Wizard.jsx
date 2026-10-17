'use client';

import { route } from '@/lib/route';
import { useState } from 'react';
import { Head, Link, useForm } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Target,
    Bot,
    Users,
    Phone,
    Calendar,
    Sparkles,
    ShieldCheck,
    Clock,
    Flame,
    HelpCircle,
} from 'lucide-react';
import { DateTimePicker } from '@/components/ui';

const TYPE_CONFIG = {
    lead_qualification: {
        label: 'Qualification de prospects',
        desc: 'Évaluer le besoin, le budget et le niveau d\'intérêt',
        icon: Target,
    },
    sales: {
        label: 'Vente & Closing',
        desc: 'Présentation d\'offres et conversion directe',
        icon: Flame,
    },
    support: {
        label: 'Support & Suivi',
        desc: 'Accompagnement client, onboarding ou réclamations',
        icon: HelpCircle,
    },
    survey: {
        label: 'Sondage & Enquête',
        desc: 'Collecte d\'avis qualitatifs et questionnaires satisfaction',
        icon: Users,
    },
};

const inputCls =
    'w-full rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-2xs';

const STEPS = [
    { n: 1, label: 'Paramètres généraux', icon: Target },
    { n: 2, label: 'Agent & Ligne', icon: Bot },
    { n: 3, label: 'Contacts & Lancement', icon: Users },
];

export default function CampaignWizard({
    types = ['lead_qualification', 'sales', 'support', 'survey'],
    agents = [],
    numbers = [],
    contactsTotal = 0,
    recentContacts = [],
    campaign = null,
}) {
    const { t } = useTranslation();
    const editing = Boolean(campaign);
    const [step, setStep] = useState(1);
    const { data, setData, post, put, processing, errors } = useForm({
        name: campaign?.name ?? '',
        type: campaign?.type ?? 'lead_qualification',
        goal: campaign?.goal ?? '',
        agent_id: campaign?.agent_id ?? (agents[0]?.id || ''),
        phone_number_id: campaign?.phone_number_id ?? (numbers[0]?.id || ''),
        max_retries: campaign?.max_retries ?? 3,
        retry_delay_minutes: campaign?.retry_delay_minutes ?? 60,
        schedule_start: campaign?.schedule_start ?? '',
        select_all: editing ? false : true,
        contact_ids: campaign?.contact_ids ?? [],
    });

    const toggleContact = (id) =>
        setData(
            'contact_ids',
            data.contact_ids.includes(id) ? data.contact_ids.filter((x) => x !== id) : [...data.contact_ids, id]
        );

    const submit = () => (editing ? put(route('client.campaigns.update', campaign.id)) : post(route('client.campaigns.store')));
    const canNext = step === 1 ? Boolean(data.name.trim() && data.type) : true;

    const selectedAgent = agents.find((a) => String(a.id) === String(data.agent_id));
    const selectedNumber = numbers.find((n) => String(n.id) === String(data.phone_number_id));
    const selectedType = TYPE_CONFIG[data.type] || TYPE_CONFIG.lead_qualification;

    return (
        <ClientLayout title={editing ? 'Modifier la campagne' : 'Nouvelle campagne'}>
            <Head title={`${editing ? 'Modifier' : 'Créer'} une campagne · AutoCall`} />
            <div className="space-y-6 max-w-5xl mx-auto">

                {/* En-tête avec bouton retour */}
                <div className="flex items-center gap-3">
                    <Link
                        href={editing ? route('client.campaigns.show', campaign.id) : route('client.campaigns.index')}
                        className="rounded-xl border border-neutral-200/90 dark:border-white/10 p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#131622] hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition shadow-2xs"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="font-hero-sans text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {editing ? 'Modifier la campagne' : 'Créer une nouvelle campagne d\'appels'}
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-[#8E95A5] mt-0.5">
                            Étape {step} sur 3 — {STEPS[step - 1].label}
                        </p>
                    </div>
                </div>

                {/* Stepper moderne */}
                <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-3 shadow-2xs">
                    {STEPS.map((s, i) => {
                        const isDone = step > s.n;
                        const isCurrent = step === s.n;
                        const StepIcon = s.icon;

                        return (
                            <div key={s.n} className="flex flex-1 items-center gap-2 min-w-0">
                                <div
                                    className={`flex items-center gap-2.5 min-w-0 ${
                                        isCurrent
                                            ? 'text-blue-600 dark:text-blue-400 font-semibold'
                                            : isDone
                                            ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                            : 'text-neutral-400 dark:text-white/30'
                                    }`}
                                >
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                            isDone
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                                : isCurrent
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-neutral-100 dark:bg-white/[0.05] text-neutral-500'
                                        }`}
                                    >
                                        {isDone ? <Check className="h-4 w-4 stroke-[2.5]" /> : s.n}
                                    </span>
                                    <span className="hidden sm:inline text-xs truncate">{s.label}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={`h-0.5 flex-1 rounded-full ${
                                            step > s.n ? 'bg-emerald-500/50' : 'bg-neutral-200 dark:bg-white/10'
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Grille principale : Formulaire (2/3) + Panneau d'aperçu & conseils (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLONNE GAUCHE : FORMULAIRE */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="rounded-[22px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-6 sm:p-7 shadow-[0_4px_24px_-2px_rgba(16,24,40,0.06)] space-y-5">

                            {/* ÉTAPE 1 : PARAMÈTRES GÉNÉRAUX */}
                            {step === 1 && (
                                <div className="space-y-4.5">
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">
                                            Nom de la campagne
                                        </label>
                                        <input
                                            className={inputCls}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Ex: Prospection PME · Q4 2026"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">
                                            Objectif stratégique
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {types.map((tp) => {
                                                const cfg = TYPE_CONFIG[tp] || { label: tp, desc: '' };
                                                const isSelected = data.type === tp;
                                                return (
                                                    <button
                                                        key={tp}
                                                        type="button"
                                                        onClick={() => setData('type', tp)}
                                                        className={`text-left rounded-xl border p-3 transition-all cursor-pointer ${
                                                            isSelected
                                                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                                                                : 'border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-neutral-50/40 dark:bg-white/[0.01]'
                                                        }`}
                                                    >
                                                        <p className="text-xs font-bold text-neutral-900 dark:text-white">
                                                            {cfg.label}
                                                        </p>
                                                        <p className="text-[11px] text-neutral-500 dark:text-[#8E95A5] mt-0.5 line-clamp-1">
                                                            {cfg.desc}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">
                                            Consigne & directive d&apos;appel pour l&apos;agent
                                        </label>
                                        <textarea
                                            rows="3"
                                            className={inputCls}
                                            value={data.goal}
                                            onChange={(e) => setData('goal', e.target.value)}
                                            placeholder="Ex: Contacter le prospect, valider son intérêt pour notre solution, répondre à ses questions tarifaires et convenir d'un rendez-vous sur le calendrier."
                                        />
                                        <p className="text-[11px] text-neutral-400 mt-1">
                                            Ce prompt orientera le comportement et la politesse de l&apos;IA lors de chaque échange.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ÉTAPE 2 : AGENT & LIGNE */}
                            {step === 2 && (
                                <div className="space-y-4.5">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                                                Agent vocal IA
                                            </label>
                                            <Link
                                                href={route('client.agents.create')}
                                                target="_blank"
                                                className="text-[11px] text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                                            >
                                                + Créer un agent
                                            </Link>
                                        </div>
                                        <select
                                            className={inputCls}
                                            value={data.agent_id}
                                            onChange={(e) => setData('agent_id', e.target.value)}
                                        >
                                            <option value="">Sélectionner un agent vocal...</option>
                                            {agents.map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.name}
                                                </option>
                                            ))}
                                        </select>
                                        {agents.length === 0 && (
                                            <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                                                Aucun agent disponible. Créez d&apos;abord votre premier agent dans la rubrique Agents IA.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                                                Numéro appelant (Caller ID)
                                            </label>
                                            <Link
                                                href={route('client.phone-numbers.index')}
                                                target="_blank"
                                                className="text-[11px] text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                                            >
                                                Gérer les numéros
                                            </Link>
                                        </div>
                                        <select
                                            className={inputCls}
                                            value={data.phone_number_id}
                                            onChange={(e) => setData('phone_number_id', e.target.value)}
                                        >
                                            <option value="">Sélectionner une ligne téléphonique...</option>
                                            {numbers.map((n) => (
                                                <option key={n.id} value={n.id}>
                                                    {n.e164_number} {n.friendly_name ? `(${n.friendly_name})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {numbers.length === 0 && (
                                            <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                                                Aucun numéro actif. Liez ou achetez un numéro dans Téléphonie ➔ Numéros.
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">
                                                Nombre de réessais max
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="5"
                                                className={inputCls}
                                                value={data.max_retries}
                                                onChange={(e) => setData('max_retries', Number(e.target.value))}
                                            />
                                            <p className="text-[10px] text-neutral-400 mt-1">
                                                En cas de non-réponse ou répondeur.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">
                                                Planification du démarrage
                                            </label>
                                            <DateTimePicker
                                                value={data.schedule_start}
                                                onChange={(val) => setData('schedule_start', val)}
                                                placeholder="Immédiat ou date future..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ÉTAPE 3 : CONTACTS & AUDIENCE */}
                            {step === 3 && (
                                <div className="space-y-4.5">
                                    <div className="rounded-xl border border-neutral-200/90 dark:border-white/10 p-3.5 bg-neutral-50/50 dark:bg-white/[0.02]">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.select_all}
                                                onChange={(e) => setData('select_all', e.target.checked)}
                                                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                                                    Cibler tous les contacts disponibles ({contactsTotal} contacts)
                                                </p>
                                                <p className="text-[11px] text-neutral-500 dark:text-[#8E95A5]">
                                                    La campagne appellera automatiquement l&apos;ensemble de votre carnet de contacts.
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    {!data.select_all && (
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                                                    Sélection manuelle ({data.contact_ids.length} sélectionné{data.contact_ids.length > 1 ? 's' : ''})
                                                </label>
                                                <Link
                                                    href={route('client.contacts.index')}
                                                    target="_blank"
                                                    className="text-[11px] text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                                >
                                                    + Importer un fichier CSV
                                                </Link>
                                            </div>

                                            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-xl border border-neutral-200/90 dark:border-white/10 p-2.5 bg-white dark:bg-white/[0.01]">
                                                {recentContacts.map((c) => {
                                                    const isChecked = data.contact_ids.includes(c.id);
                                                    return (
                                                        <label
                                                            key={c.id}
                                                            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer transition ${
                                                                isChecked
                                                                    ? 'bg-blue-50 dark:bg-blue-500/10'
                                                                    : 'hover:bg-neutral-50 dark:hover:bg-white/[0.04]'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => toggleContact(c.id)}
                                                                className="h-3.5 w-3.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                                                {c.name || 'Contact'}
                                                            </span>
                                                            <span className="ml-auto font-mono text-[11px] text-neutral-400">
                                                                {c.phone}
                                                            </span>
                                                        </label>
                                                    );
                                                })}

                                                {recentContacts.length === 0 && (
                                                    <p className="py-6 text-center text-xs text-neutral-400">
                                                        Aucun contact enregistré. Importez un fichier CSV dans Contacts.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Boutons d'action du Wizard */}
                            <div className="pt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                                    disabled={step === 1}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/90 dark:border-white/10 px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] disabled:opacity-30 transition cursor-pointer"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    <span>Retour</span>
                                </button>

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={() => canNext && setStep((s) => s + 1)}
                                        disabled={!canNext}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.25)] disabled:opacity-40 transition cursor-pointer"
                                    >
                                        <span>Continuer</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={submit}
                                        disabled={processing}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-xs font-semibold shadow-[0_2px_8px_rgba(16,185,129,0.25)] disabled:opacity-50 transition cursor-pointer"
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                        <span>{editing ? 'Enregistrer les modifications' : 'Lancer la campagne'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLONNE DROITE : RÉCAPITULATIF & BONNES PRATIQUES IA */}
                    <div className="space-y-4">
                        <div className="rounded-[22px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_4px_20px_-2px_rgba(16,24,40,0.06)]">
                            <h3 className="font-hero-sans text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
                                Récapitulatif en direct
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/[0.05]">
                                    <span className="text-neutral-500 dark:text-neutral-400">Nom :</span>
                                    <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[140px]">
                                        {data.name || 'Non défini'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/[0.05]">
                                    <span className="text-neutral-500 dark:text-neutral-400">Objectif :</span>
                                    <span className="font-semibold text-neutral-900 dark:text-white">
                                        {selectedType.label}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/[0.05]">
                                    <span className="text-neutral-500 dark:text-neutral-400">Agent vocal :</span>
                                    <span className="font-semibold text-neutral-900 dark:text-white">
                                        {selectedAgent?.name || 'À définir'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/[0.05]">
                                    <span className="text-neutral-500 dark:text-neutral-400">Ligne d&apos;appel :</span>
                                    <span className="font-mono text-neutral-900 dark:text-white">
                                        {selectedNumber?.e164_number || 'À définir'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-500 dark:text-neutral-400">Audience ciblée :</span>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                                        {data.select_all ? `${contactsTotal} contacts` : `${data.contact_ids.length} contact(s)`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Conseils d'optimisation télécom */}
                        <div className="rounded-[22px] border border-blue-200/80 dark:border-white/[0.07] bg-blue-50/40 dark:bg-white/[0.02] p-5 shadow-2xs">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                                <Sparkles className="h-4 w-4" />
                                <span className="font-hero-sans text-xs font-bold">Conseil IA de performance</span>
                            </div>
                            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                Les campagnes appelant entre <strong className="text-neutral-900 dark:text-white">10h-12h</strong> et <strong className="text-neutral-900 dark:text-white">14h-17h</strong> obtiennent en moyenne <strong>+28% de décroché</strong>.
                            </p>
                            <div className="mt-3 pt-3 border-t border-blue-100 dark:border-white/[0.05] flex items-center gap-2 text-[10px] text-neutral-400">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                <span>Protection contre le spam & conformité ARCEP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
