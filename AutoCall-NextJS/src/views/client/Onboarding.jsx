'use client';

import { Head, Link, useForm, router } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { showToast } from '@/components/FlashToast';
import { route } from '@/lib/route';
import {
    ArrowLeft,
    ArrowRight,
    Bot,
    BriefcaseBusiness,
    Building2,
    CalendarCheck,
    Check,
    CheckCircle2,
    Clock3,
    Headphones,
    Languages,
    PhoneCall,
    Phone,
    ShieldCheck,
    Sparkles,
    UserRoundCheck,
    Play,
    Pause,
    Volume2,
    X,
    Flame
} from 'lucide-react';

const sectors = [
    ['health', 'Santé et bien-être'],
    ['real_estate', 'Immobilier'],
    ['hospitality', 'Hôtellerie et restauration'],
    ['services', 'Services aux entreprises & Conseil'],
    ['retail', 'Commerce et e-commerce'],
    ['automotive', 'Automobile & Transport'],
    ['other', 'Autre activité professionnelle'],
];

const goals = [
    { value: 'inbound', title: 'Répondre aux appels', text: 'Accueil, réponses aux questions fréquentes et orientation.', icon: Headphones },
    { value: 'appointments', title: 'Prendre des rendez-vous', text: 'Qualification des besoins et réservation de créneaux.', icon: CalendarCheck },
    { value: 'outbound', title: 'Qualifier des prospects', text: 'Appels sortants proactifs et recueil des besoins.', icon: UserRoundCheck },
    { value: 'both', title: 'Entrants et sortants', text: 'Un assistant polyvalent pour gérer tous vos flux d’appels.', icon: PhoneCall },
];

const stepDefinitions = [
    { n: 1, title: 'Votre entreprise', subtitle: 'Informations de base', icon: Building2 },
    { n: 2, title: 'Sa mission', subtitle: 'Le résultat attendu', icon: BriefcaseBusiness },
    { n: 3, title: 'Votre agent', subtitle: 'Voix et présentation', icon: Bot },
    { n: 4, title: 'Règles & Horaires', subtitle: 'Disponibilité et transfert', icon: ShieldCheck },
    { n: 5, title: 'Test & Activation', subtitle: 'Vérification en conditions réelles', icon: PhoneCall },
];

const fieldClass = 'h-11 w-full rounded-xl border border-neutral-200/90 bg-white px-3.5 text-xs sm:text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-[#11141d] dark:text-white dark:placeholder:text-neutral-600';
const textareaClass = `${fieldClass} h-auto min-h-28 py-3 leading-relaxed`;

function Field({ label, hint, error, children, required = false }) {
    return (
        <label className="block space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {label} {required && <span className="text-blue-600 dark:text-blue-400">*</span>}
                </span>
            </div>
            {children}
            {hint && !error && <span className="block text-xs text-neutral-500 dark:text-neutral-400">{hint}</span>}
            {error && <span className="block text-xs font-medium text-red-600 dark:text-red-400">{error}</span>}
        </label>
    );
}

function Choice({ selected, onClick, icon: Icon, title, text }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                selected
                    ? 'border-blue-500 bg-blue-50/70 shadow-2xs ring-1 ring-blue-500/20 dark:border-blue-400/80 dark:bg-blue-500/10'
                    : 'border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-2xs dark:border-white/10 dark:bg-[#11141d] dark:hover:border-white/20'
            }`}
        >
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${selected ? 'bg-blue-600 text-white shadow-2xs' : 'bg-neutral-100 text-neutral-500 dark:bg-white/[0.06] dark:text-neutral-400'}`}>
                <Icon className="h-4.5 w-4.5 stroke-[2]" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-neutral-900 dark:text-white">{title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{text}</span>
            </span>
            <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-neutral-300 dark:border-white/20'}`}>
                {selected && <Check className="h-3 w-3 stroke-[2.5]" />}
            </span>
        </button>
    );
}

export default function Onboarding({
    step = 1,
    totalSteps = 5,
    client,
    agent,
    onboardingState = {},
    saved = {},
    voices = [],
    phoneNumbers = [],
    recentContacts = [],
}) {
    const [audioState, setAudioState] = useState({ voiceId: null, status: 'idle' });
    const audioRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        step,
        business_name: client?.name || '',
        business_email: client?.email || '',
        business_phone: client?.phone || '',
        business_address: client?.address || '',
        sector: saved.sector || '',
        goal: saved.goal || 'inbound',
        agent_name: agent?.name === 'Assistant AutoCall' ? 'Camille' : (agent?.name || 'Camille'),
        voice_id: agent?.voice_id ? String(agent.voice_id) : (voices[0]?.id ? String(voices[0].id) : ''),
        language: agent?.language || 'fr',
        tone: agent?.tone || 'Professional',
        greeting: agent?.greeting || `Bonjour, vous êtes bien chez ${client?.name || 'notre entreprise'}. Comment puis-je vous aider aujourd'hui ?`,
        business_summary: saved.business_summary || '',
        opening_start: saved.opening_start || '09:00',
        opening_end: saved.opening_end || '18:00',
        transfer_phone: saved.transfer_phone || '',
        transfer_rule: saved.transfer_rule || 'requested',
        test_contact_phone: saved.test_contact_phone || client?.phone || '',
    });

    useEffect(() => {
        setData('step', step);
    }, [step, setData]);

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setAudioState({ voiceId: null, status: 'idle' });
    };

    const playVoicePreview = async (voice) => {
        if (audioState.voiceId === voice.id && audioState.status === 'playing') {
            stopAudio();
            return;
        }
        stopAudio();
        setAudioState({ voiceId: voice.id, status: 'loading' });
        try {
            let src = voice.preview_url;
            if (!src) {
                const res = await axios.post(route('client.voices.preview', voice.id));
                src = res.data?.url || res.data?.data;
            }
            if (!src) {
                setAudioState({ voiceId: null, status: 'idle' });
                showToast('Aperçu audio indisponible pour cette voix.', 'info');
                return;
            }
            const audio = new Audio(src);
            audioRef.current = audio;
            audio.onended = () => setAudioState({ voiceId: null, status: 'idle' });
            await audio.play();
            setAudioState({ voiceId: voice.id, status: 'playing' });
        } catch {
            setAudioState({ voiceId: null, status: 'idle' });
            showToast('Impossible de lire l’aperçu audio.', 'error');
        }
    };

    const submit = (event) => {
        event.preventDefault();
        stopAudio();
        post('/app/onboarding');
    };

    const dismiss = () => {
        stopAudio();
        post('/app/api/app/onboarding/dismiss');
    };

    const selectedVoice = voices.find((v) => String(v.id) === String(data.voice_id)) || voices[0];
    const progressPercent = Math.round((step / totalSteps) * 100);

    return (
        <ClientLayout title="Configuration de votre agent">
            <Head title="Configuration guidée · AutoCall" />

            <div className="mx-auto max-w-5xl pb-12">
                {/* Header épuré style Apple / Linear */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200/80 pb-6 dark:border-white/[0.08]">
                    <div>
                        <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Mise en route guidée</span>
                            <span className="text-neutral-300 dark:text-white/20">·</span>
                            <span className="text-neutral-500 dark:text-neutral-400 font-normal">~4 minutes</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                            Préparons votre premier appel vocal
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl">
                            Configurez votre assistant vocal avec vos consignes réelles. Votre progression est enregistrée automatiquement à chaque étape.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-medium tabular-nums text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.05] px-2.5 py-1 rounded-lg">
                            Étape {step} sur {totalSteps}
                        </span>
                        <button
                            type="button"
                            onClick={dismiss}
                            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/[0.04] cursor-pointer"
                        >
                            Passer pour le moment
                        </button>
                    </div>
                </div>

                {/* Progress bar discrète */}
                <div className="mb-6">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/[0.08]">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out dark:bg-blue-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                    {/* Stepper vertical accessible */}
                    <aside className="hidden lg:block">
                        <nav aria-label="Progression de l'onboarding" className="sticky top-24 rounded-2xl border border-neutral-200/90 bg-white p-3 shadow-2xs dark:border-white/[0.08] dark:bg-[#11141d]">
                            <ol className="space-y-1">
                                {stepDefinitions.map((item) => {
                                    const number = item.n;
                                    const Icon = item.icon;
                                    const active = number === step;
                                    const done = number < step;
                                    return (
                                        <li key={item.key}>
                                            <div className={`flex items-center gap-3 rounded-xl p-2.5 transition ${active ? 'bg-blue-50/80 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200' : 'text-neutral-600 dark:text-neutral-400'}`}>
                                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
                                                    done
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                                                        : active
                                                            ? 'bg-blue-600 text-white shadow-2xs'
                                                            : 'bg-neutral-100 text-neutral-400 dark:bg-white/[0.04]'
                                                }`}>
                                                    {done ? <Check className="h-4 w-4 stroke-[2.5]" /> : <Icon className="h-4 w-4" />}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <span className={`block text-xs font-semibold truncate ${active ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                                        {item.title}
                                                    </span>
                                                    <span className="block text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                                                        {item.subtitle}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>
                    </aside>

                    {/* Formulaire principal */}
                    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xs dark:border-white/[0.08] dark:bg-[#11141d]">
                        <div className="p-5 sm:p-7 lg:p-8">
                            {/* ÉTAPE 1 : Votre entreprise */}
                            {step === 1 && (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                            Parlez-nous de votre entreprise
                                        </h2>
                                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                            Ces détails permettent à votre agent vocal de répondre avec précision à vos interlocuteurs.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Nom de l’entreprise" error={errors.business_name} required>
                                            <input
                                                className={fieldClass}
                                                value={data.business_name}
                                                onChange={(e) => setData('business_name', e.target.value)}
                                                placeholder="Ex: Cabinet Horizon"
                                                autoFocus
                                            />
                                        </Field>

                                        <Field label="Secteur d’activité" error={errors.sector}>
                                            <select
                                                className={fieldClass}
                                                value={data.sector}
                                                onChange={(e) => setData('sector', e.target.value)}
                                            >
                                                <option value="">Sélectionnez un secteur</option>
                                                {sectors.map(([val, label]) => (
                                                    <option key={val} value={val}>{label}</option>
                                                ))}
                                            </select>
                                        </Field>

                                        <Field label="E-mail professionnel" error={errors.business_email}>
                                            <input
                                                type="email"
                                                className={fieldClass}
                                                value={data.business_email}
                                                onChange={(e) => setData('business_email', e.target.value)}
                                                placeholder="contact@entreprise.fr"
                                            />
                                        </Field>

                                        <Field label="Téléphone de contact" error={errors.business_phone}>
                                            <input
                                                type="tel"
                                                className={fieldClass}
                                                value={data.business_phone}
                                                onChange={(e) => setData('business_phone', e.target.value)}
                                                placeholder="+33 1 84 80 20 20"
                                            />
                                        </Field>

                                        <div className="sm:col-span-2">
                                            <Field label="Adresse physique" error={errors.business_address} hint="Facultatif. Utile si vos appelants demandent où vous trouver.">
                                                <input
                                                    className={fieldClass}
                                                    value={data.business_address}
                                                    onChange={(e) => setData('business_address', e.target.value)}
                                                    placeholder="12 rue de la Paix, 75002 Paris"
                                                />
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ÉTAPE 2 : Mission & Objectifs */}
                            {step === 2 && (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                            Que doit accomplir votre agent vocal ?
                                        </h2>
                                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                            Définissez son rôle prioritaire. Vous pourrez créer d’autres agents spécialisés par la suite.
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {goals.map((g) => (
                                            <Choice
                                                key={g.value}
                                                {...g}
                                                selected={data.goal === g.value}
                                                onClick={() => setData('goal', g.value)}
                                            />
                                        ))}
                                    </div>
                                    {errors.goal && <p className="text-xs font-medium text-red-600 dark:text-red-400">{errors.goal}</p>}

                                    <Field
                                        label="Ce que votre agent doit savoir"
                                        error={errors.business_summary}
                                        hint="Décrivez vos services, vos tarifs indicatifs ou les réponses courantes en quelques phrases claires."
                                    >
                                        <textarea
                                            className={textareaClass}
                                            value={data.business_summary}
                                            onChange={(e) => setData('business_summary', e.target.value)}
                                            placeholder="Ex: Nous sommes un cabinet d'avocats spécialisé en droit des affaires. Nos consultations ont lieu sur rendez-vous du lundi au vendredi. Les urgences sont transmises directement à Me Martin."
                                        />
                                    </Field>
                                </div>
                            )}

                            {/* ÉTAPE 3 : Agent & Voix */}
                            {step === 3 && (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                            Donnez une identité et une voix à votre agent
                                        </h2>
                                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                            Une voix naturelle et un message d’accueil chaleureux inspirent immédiatement confiance.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Nom de l’agent" error={errors.agent_name} required>
                                            <input
                                                className={fieldClass}
                                                value={data.agent_name}
                                                onChange={(e) => setData('agent_name', e.target.value)}
                                                placeholder="Camille"
                                                autoFocus
                                            />
                                        </Field>

                                        <Field label="Langue principale" error={errors.language}>
                                            <select
                                                className={fieldClass}
                                                value={data.language}
                                                onChange={(e) => setData('language', e.target.value)}
                                            >
                                                <option value="fr">Français</option>
                                                <option value="en">English</option>
                                                <option value="es">Español</option>
                                                <option value="de">Deutsch</option>
                                                <option value="it">Italiano</option>
                                            </select>
                                        </Field>

                                        <Field label="Ton de conversation" error={errors.tone}>
                                            <select
                                                className={fieldClass}
                                                value={data.tone}
                                                onChange={(e) => setData('tone', e.target.value)}
                                            >
                                                <option value="Professional">Professionnel & Rassurant</option>
                                                <option value="Friendly">Chaleureux & Accueillant</option>
                                                <option value="Empathetic">Empathique & Patient</option>
                                                <option value="Concise">Direct & Efficace</option>
                                            </select>
                                        </Field>

                                        <Field label="Voix sélectionnée" error={errors.voice_id} hint="Écoutez un extrait ci-dessous.">
                                            <select
                                                className={fieldClass}
                                                value={data.voice_id}
                                                onChange={(e) => setData('voice_id', e.target.value)}
                                            >
                                                {voices.map((v) => (
                                                    <option key={v.id} value={v.id}>
                                                        {v.name} {v.accent ? `(${v.accent})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>

                                        {/* Lecteur d'aperçu vocal intégré */}
                                        {selectedVoice && (
                                            <div className="sm:col-span-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-500/20 dark:bg-blue-500/[0.05] flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-2xs">
                                                        <Volume2 className="h-4 w-4" />
                                                    </span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                                                            Aperçu vocal : {selectedVoice.name}
                                                        </p>
                                                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                            {selectedVoice.accent || 'Français naturel'} · {selectedVoice.tone || 'Clair et fluide'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => playVoicePreview(selectedVoice)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-500 transition cursor-pointer"
                                                >
                                                    {audioState.voiceId === selectedVoice.id && audioState.status === 'playing' ? (
                                                        <>
                                                            <Pause className="h-3.5 w-3.5" />
                                                            <span>Arrêter</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="h-3.5 w-3.5" />
                                                            <span>Écouter</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        <div className="sm:col-span-2">
                                            <Field
                                                label="Phrase d’accueil prononcée dès le décrochage"
                                                error={errors.greeting}
                                                hint="Votre agent prononcera exactement cette phrase lors de la prise d’appel."
                                                required
                                            >
                                                <textarea
                                                    rows="3"
                                                    className={textareaClass}
                                                    value={data.greeting}
                                                    onChange={(e) => setData('greeting', e.target.value)}
                                                />
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ÉTAPE 4 : Règles & Horaires */}
                            {step === 4 && (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                            Définissez les horaires et les règles de transfert
                                        </h2>
                                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                            Votre assistant saura exactement quand intervenir et vers qui transférer un appelant en cas de besoin.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Ouverture habituelle" error={errors.opening_start}>
                                            <div className="relative">
                                                <Clock3 className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
                                                <input
                                                    type="time"
                                                    className={`${fieldClass} pl-10`}
                                                    value={data.opening_start}
                                                    onChange={(e) => setData('opening_start', e.target.value)}
                                                />
                                            </div>
                                        </Field>

                                        <Field label="Fermeture habituelle" error={errors.opening_end}>
                                            <div className="relative">
                                                <Clock3 className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
                                                <input
                                                    type="time"
                                                    className={`${fieldClass} pl-10`}
                                                    value={data.opening_end}
                                                    onChange={(e) => setData('opening_end', e.target.value)}
                                                />
                                            </div>
                                        </Field>

                                        <Field
                                            label="Numéro de transfert"
                                            error={errors.transfer_phone}
                                            hint="Facultatif. Votre téléphone mobile ou celui d’un collaborateur."
                                        >
                                            <input
                                                type="tel"
                                                className={fieldClass}
                                                value={data.transfer_phone}
                                                onChange={(e) => setData('transfer_phone', e.target.value)}
                                                placeholder="+33 6 12 34 56 78"
                                            />
                                        </Field>

                                        <Field label="Règle de transfert" error={errors.transfer_rule}>
                                            <select
                                                className={fieldClass}
                                                value={data.transfer_rule}
                                                onChange={(e) => setData('transfer_rule', e.target.value)}
                                            >
                                                <option value="requested">Si l'appelant le demande explicitement</option>
                                                <option value="always">Dès qu'une intervention humaine est utile</option>
                                                <option value="message">Prendre un message écrit uniquement</option>
                                            </select>
                                        </Field>
                                    </div>
                                </div>
                            )}

                            {/* ÉTAPE 5 : Test & Activation */}
                            {step === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                            Votre agent est prêt pour son premier appel
                                        </h2>
                                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                            Vérifiez les réglages avant de terminer. Vous pourrez tester votre agent immédiatement.
                                        </p>
                                    </div>

                                    {/* Récapitulatif clean sans AI slop */}
                                    <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-5 dark:border-white/[0.08] dark:bg-white/[0.02] space-y-4">
                                        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3 dark:border-white/[0.06]">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                                    <Bot className="h-4 w-4" />
                                                </span>
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral-900 dark:text-white">{data.agent_name || 'Camille'}</p>
                                                    <p className="text-[11px] text-neutral-500">{data.tone} · {selectedVoice?.name || 'Voix par défaut'}</p>
                                                </div>
                                            </div>
                                            <Link href="/app/onboarding?step=3" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                                                Modifier
                                            </Link>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 text-xs">
                                            <div>
                                                <span className="text-neutral-400">Entreprise :</span>
                                                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.business_name || client?.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-neutral-400">Mission :</span>
                                                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                                                    {goals.find((g) => g.value === data.goal)?.title || 'Répondre aux appels'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-neutral-400">Horaires :</span>
                                                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                                                    {data.opening_start} - {data.opening_end} (Lun - Ven)
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-neutral-400">Transfert :</span>
                                                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                                                    {data.transfer_phone || 'Aucun (message pris)'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t border-neutral-200/60 pt-3 dark:border-white/[0.06]">
                                            <span className="text-[11px] text-neutral-400 block mb-1">Message d'accueil configuré :</span>
                                            <p className="italic text-xs text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#11141d] p-3 rounded-xl border border-neutral-200/80 dark:border-white/10">
                                                « {data.greeting} »
                                            </p>
                                        </div>
                                    </div>

                                    {/* Numéro pour le premier test */}
                                    <Field
                                        label="Numéro de téléphone pour le premier test"
                                        error={errors.test_contact_phone}
                                        hint="Indiquez votre propre numéro pour recevoir ou tester un premier appel immédiatement."
                                    >
                                        <input
                                            type="tel"
                                            className={fieldClass}
                                            value={data.test_contact_phone}
                                            onChange={(e) => setData('test_contact_phone', e.target.value)}
                                            placeholder="+33 6 12 34 56 78"
                                        />
                                    </Field>

                                    {/* Micro-réassurance sobre */}
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <span>Votre agent restera en mode brouillon jusqu'à votre premier lancement effectif.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Barre d'action inférieure */}
                        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200/80 bg-neutral-50/60 px-5 py-4 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            <div>
                                {step > 1 ? (
                                    <Link
                                        href={`/app/onboarding?step=${step - 1}`}
                                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs sm:text-sm font-semibold text-neutral-600 transition hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-white/[0.06]"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span>Retour</span>
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        <span>Données sécurisées et persistées</span>
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                            >
                                <span>
                                    {processing
                                        ? 'Enregistrement…'
                                        : step === totalSteps
                                            ? 'Finaliser et activer mon agent'
                                            : 'Enregistrer et continuer'}
                                </span>
                                {step === totalSteps ? (
                                    <Check className="h-4 w-4 stroke-[2.5]" />
                                ) : (
                                    <ArrowRight className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ClientLayout>
    );
}
