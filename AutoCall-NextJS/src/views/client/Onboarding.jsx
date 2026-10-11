'use client';

import { Head, Link, useForm } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
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
    ShieldCheck,
    Sparkles,
    UserRoundCheck,
} from 'lucide-react';

const sectors = [
    ['health', 'Santé et bien-être'],
    ['real_estate', 'Immobilier'],
    ['hospitality', 'Hôtellerie et restauration'],
    ['services', 'Services aux entreprises'],
    ['retail', 'Commerce'],
    ['other', 'Autre activité'],
];

const goals = [
    { value: 'inbound', title: 'Répondre aux appels', text: 'Accueil, questions fréquentes et orientation.', icon: Headphones },
    { value: 'appointments', title: 'Prendre des rendez-vous', text: 'Qualification et réservation des créneaux.', icon: CalendarCheck },
    { value: 'outbound', title: 'Qualifier des prospects', text: 'Appels sortants et collecte des besoins.', icon: UserRoundCheck },
    { value: 'both', title: 'Entrants et sortants', text: 'Un agent polyvalent pour les deux usages.', icon: PhoneCall },
];

const steps = [
    { title: 'Votre entreprise', subtitle: 'Les informations essentielles', icon: Building2 },
    { title: 'Sa mission', subtitle: 'Le résultat attendu', icon: BriefcaseBusiness },
    { title: 'Votre agent', subtitle: 'Voix et présentation', icon: Bot },
    { title: 'Règles et validation', subtitle: 'Horaires et transfert', icon: ShieldCheck },
];

const fieldClass = 'h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-[#11141d] dark:text-white dark:placeholder:text-neutral-600';
const textareaClass = `${fieldClass} h-auto min-h-28 py-3 leading-relaxed`;

function Field({ label, hint, error, children }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{label}</span>
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
            className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                selected
                    ? 'border-blue-500 bg-blue-50/70 shadow-sm ring-1 ring-blue-500/10 dark:border-blue-400/70 dark:bg-blue-500/10'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-white/10 dark:bg-[#11141d] dark:hover:border-white/20'
            }`}
        >
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-500 dark:bg-white/[0.06] dark:text-neutral-400'}`}>
                <Icon className="h-4.5 w-4.5" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-neutral-900 dark:text-white">{title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{text}</span>
            </span>
            <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-neutral-300 dark:border-white/20'}`}>
                {selected && <Check className="h-3 w-3" />}
            </span>
        </button>
    );
}

export default function Onboarding({ step = 1, totalSteps = 4, client, agent, saved = {}, voices = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        step,
        business_name: client?.name || '',
        business_email: client?.email || '',
        business_phone: client?.phone || '',
        business_address: client?.address || '',
        sector: saved.sector || '',
        goal: saved.goal || '',
        agent_name: agent?.name === 'Assistant AutoCall' ? '' : (agent?.name || ''),
        voice_id: agent?.voice_id || '',
        language: agent?.language || 'fr',
        tone: agent?.tone || 'Professional',
        greeting: agent?.greeting || `Bonjour, vous êtes bien chez ${client?.name || 'nous'}. Comment puis-je vous aider ?`,
        business_summary: saved.business_summary || '',
        opening_start: saved.opening_start || '09:00',
        opening_end: saved.opening_end || '18:00',
        transfer_phone: saved.transfer_phone || '',
        transfer_rule: saved.transfer_rule || 'requested',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/app/onboarding');
    };

    return (
        <ClientLayout title="Configuration guidée">
            <Head title="Configurer mon espace · AutoCall" />

            <div className="mx-auto max-w-6xl pb-10">
                <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            Configuration guidée
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
                            Créons votre premier agent vocal
                        </h1>
                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Chaque étape enregistre de vraies informations dans votre espace. Vous pourrez tout modifier ensuite.
                        </p>
                    </div>
                    <div className="text-sm font-medium tabular-nums text-neutral-500 dark:text-neutral-400">
                        Étape {step} sur {totalSteps}
                    </div>
                </div>

                <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
                    <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
                </div>

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#11141d]">
                            {steps.map((item, index) => {
                                const number = index + 1;
                                const Icon = item.icon;
                                const active = number === step;
                                const done = number < step;
                                return (
                                    <div key={item.title} className={`flex items-center gap-3 rounded-xl p-3 ${active ? 'bg-neutral-100 dark:bg-white/[0.06]' : ''}`}>
                                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${done ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : active ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-400 dark:bg-white/[0.04]'}`}>
                                            {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                                        </span>
                                        <span>
                                            <span className={`block text-sm font-semibold ${active ? 'text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>{item.title}</span>
                                            <span className="block text-[11px] text-neutral-400">{item.subtitle}</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11141d]">
                        <div className="p-5 sm:p-7 lg:p-8">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">Parlez-nous de votre entreprise</h2>
                                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Ces informations personnalisent les réponses de votre agent.</p>
                                    </div>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Field label="Nom de l’entreprise" error={errors.business_name}>
                                            <input className={fieldClass} value={data.business_name} onChange={(e) => setData('business_name', e.target.value)} placeholder="Cabinet Horizon" autoFocus />
                                        </Field>
                                        <Field label="Secteur d’activité" error={errors.sector}>
                                            <select className={fieldClass} value={data.sector} onChange={(e) => setData('sector', e.target.value)}>
                                                <option value="">Sélectionnez votre secteur</option>
                                                {sectors.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                            </select>
                                        </Field>
                                        <Field label="E-mail professionnel" error={errors.business_email}>
                                            <input type="email" className={fieldClass} value={data.business_email} onChange={(e) => setData('business_email', e.target.value)} placeholder="contact@entreprise.fr" />
                                        </Field>
                                        <Field label="Téléphone de l’entreprise" error={errors.business_phone}>
                                            <input type="tel" className={fieldClass} value={data.business_phone} onChange={(e) => setData('business_phone', e.target.value)} placeholder="+33 1 84 80 20 20" />
                                        </Field>
                                        <div className="sm:col-span-2">
                                            <Field label="Adresse" error={errors.business_address} hint="Facultatif, utile pour répondre aux demandes d’itinéraire.">
                                                <input className={fieldClass} value={data.business_address} onChange={(e) => setData('business_address', e.target.value)} placeholder="12 rue de la Paix, 75002 Paris" />
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">Que doit accomplir votre agent ?</h2>
                                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Choisissez sa mission principale. Vous pourrez ajouter d’autres usages plus tard.</p>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {goals.map((goal) => <Choice key={goal.value} {...goal} selected={data.goal === goal.value} onClick={() => setData('goal', goal.value)} />)}
                                    </div>
                                    {errors.goal && <p className="text-sm font-medium text-red-600 dark:text-red-400">{errors.goal}</p>}
                                    <Field label="Ce que votre agent doit connaître" error={errors.business_summary} hint="Décrivez vos services, vos clients et les réponses importantes en quelques phrases.">
                                        <textarea className={textareaClass} value={data.business_summary} onChange={(e) => setData('business_summary', e.target.value)} placeholder="Nous accompagnons les professionnels pour… Nos principaux services sont…" />
                                    </Field>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">Donnez une identité à votre agent</h2>
                                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Une présentation courte et naturelle inspire immédiatement confiance.</p>
                                    </div>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Field label="Nom de l’agent" error={errors.agent_name}>
                                            <input className={fieldClass} value={data.agent_name} onChange={(e) => setData('agent_name', e.target.value)} placeholder="Camille" autoFocus />
                                        </Field>
                                        <Field label="Langue principale" error={errors.language}>
                                            <select className={fieldClass} value={data.language} onChange={(e) => setData('language', e.target.value)}>
                                                <option value="fr">Français</option><option value="en">English</option><option value="es">Español</option><option value="de">Deutsch</option><option value="it">Italiano</option><option value="pt">Português</option>
                                            </select>
                                        </Field>
                                        <Field label="Ton de conversation" error={errors.tone}>
                                            <select className={fieldClass} value={data.tone} onChange={(e) => setData('tone', e.target.value)}>
                                                <option value="Professional">Professionnel</option><option value="Friendly">Chaleureux</option><option value="Empathetic">Empathique</option><option value="Concise">Direct et concis</option>
                                            </select>
                                        </Field>
                                        <Field label="Voix" error={errors.voice_id} hint={voices.length ? 'Vous pourrez écouter et changer la voix depuis la fiche de l’agent.' : 'La voix par défaut sera utilisée.'}>
                                            <select className={fieldClass} value={data.voice_id} onChange={(e) => setData('voice_id', e.target.value)}>
                                                <option value="">Voix recommandée</option>
                                                {voices.map((voice) => <option key={voice.id} value={voice.id}>{voice.name}{voice.accent ? ` · ${voice.accent}` : ''}</option>)}
                                            </select>
                                        </Field>
                                        <div className="sm:col-span-2">
                                            <Field label="Message d’accueil" error={errors.greeting} hint="Votre agent prononcera exactement cette phrase au début de l’appel.">
                                                <textarea rows="3" className={textareaClass} value={data.greeting} onChange={(e) => setData('greeting', e.target.value)} />
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">Définissez les dernières règles</h2>
                                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Votre agent restera en brouillon jusqu’au premier test et à l’activation téléphonique.</p>
                                    </div>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Field label="Ouverture en semaine" error={errors.opening_start}>
                                            <div className="relative"><Clock3 className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" /><input type="time" className={`${fieldClass} pl-10`} value={data.opening_start} onChange={(e) => setData('opening_start', e.target.value)} /></div>
                                        </Field>
                                        <Field label="Fermeture en semaine" error={errors.opening_end}>
                                            <div className="relative"><Clock3 className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" /><input type="time" className={`${fieldClass} pl-10`} value={data.opening_end} onChange={(e) => setData('opening_end', e.target.value)} /></div>
                                        </Field>
                                        <Field label="Numéro de transfert" error={errors.transfer_phone} hint="Facultatif. Ajoutez le numéro d’un conseiller disponible.">
                                            <input type="tel" className={fieldClass} value={data.transfer_phone} onChange={(e) => setData('transfer_phone', e.target.value)} placeholder="+33 6 12 34 56 78" />
                                        </Field>
                                        <Field label="Règle de transfert" error={errors.transfer_rule}>
                                            <select className={fieldClass} value={data.transfer_rule} onChange={(e) => setData('transfer_rule', e.target.value)}>
                                                <option value="requested">Si l’appelant le demande</option><option value="always">Dès qu’un conseiller est nécessaire</option><option value="message">Prendre un message uniquement</option>
                                            </select>
                                        </Field>
                                    </div>

                                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle2 className="h-5 w-5" /></span>
                                            <div>
                                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Votre configuration est prête</h3>
                                                <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                                    L’agent {data.agent_name || 'AutoCall'} sera créé avec vos consignes réelles. Le prochain écran vous permettra de vérifier sa fiche avant l’activation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50/60 px-5 py-4 dark:border-white/10 dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            <div>
                                {step > 1 ? (
                                    <Link href={`/app/onboarding?step=${step - 1}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-white/[0.06]">
                                        <ArrowLeft className="h-4 w-4" /> Retour
                                    </Link>
                                ) : <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400"><ShieldCheck className="h-3.5 w-3.5" /> Données enregistrées dans votre espace</span>}
                            </div>
                            <button type="submit" disabled={processing} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60">
                                <span>{processing ? 'Enregistrement…' : step === totalSteps ? 'Terminer la configuration' : 'Enregistrer et continuer'}</span>
                                {step === totalSteps ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-400">
                    <Languages className="h-3.5 w-3.5" />
                    Votre agent pourra parler plusieurs langues après sa configuration initiale.
                </div>
            </div>
        </ClientLayout>
    );
}
