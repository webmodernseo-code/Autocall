'use client';

import React, { useState } from 'react';
import { route } from '@/lib/route';
import { Head, Link, router, useForm, usePage } from '@/lib/page-router';
import { signInWithGoogle } from '@/lib/firebaseAuth';
import AuthShell, { AuthField, GoogleButton, OrDivider, SubmitButton, PasswordStrengthMeter } from '@/components/auth/Auth';
import { User, Mail, Lock, ArrowRight, CheckCircle2, Check, Sparkles, ShieldCheck } from 'lucide-react';

const PLAN_META = {
    starter: {
        name: 'Starter',
        badge: null,
        description: 'Idéal pour indépendants et petites structures.',
        credits: '5 000 crédits IA inclus / mois',
        perks: ['1 agent vocal autonome', 'Routage entrant & sortant 24h/24', 'Support standard'],
    },
    pro: {
        name: 'Pro',
        badge: 'Recommandé',
        description: 'Pour cabinets, PME et entreprises en croissance.',
        credits: '15 000 crédits IA inclus / mois',
        perks: ['Agents conversationnels illimités', 'Agent WhatsApp autonome & Relances', 'Export des débriefings & Webhooks'],
    },
    agency: {
        name: 'Scale / Agency',
        badge: 'Entreprise',
        description: 'Pour agences et forts volumes d’appels.',
        credits: '50 000 crédits IA inclus / mois',
        perks: ['Agents & Campagnes illimités', 'Option marque blanche complète', 'Domaine personnalisé & Multi-espaces'],
    },
};

function planPrice(plan, cycle) {
    const cents = cycle === 'year' ? plan.yearly_price_cents : plan.monthly_price_cents;
    if (!cents) return '—';
    const monthlyCents = cycle === 'year' ? Math.round(cents / 12) : cents;
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(monthlyCents / 100)} €/mois`;
}

export default function Register({ plans = [], selectedPlan = 'pro', billingCycle = 'month' }) {
    const { props } = usePage();
    const socialLogin = props.socialLogin ?? {};

    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        plan_slug: selectedPlan || 'pro',
        billing_cycle: billingCycle || 'month',
    });

    const activePlan = plans.find((p) => p.slug === data.plan_slug) || plans[0] || null;
    const activeMeta = activePlan ? (PLAN_META[activePlan.slug] ?? { name: activePlan.name, perks: [] }) : null;

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const registerWithGoogle = async () => {
        setGoogleError('');
        setGoogleLoading(true);
        try {
            const idToken = await signInWithGoogle(socialLogin.firebase);
            router.post(route('auth.firebase.callback'), {
                id_token: idToken,
                plan_slug: data.plan_slug,
                billing_cycle: data.billing_cycle,
            }, {
                onError: (errs) => setGoogleError(errs.social_login || 'L’inscription avec Google a échoué. Veuillez réessayer.'),
                onFinish: () => setGoogleLoading(false),
            });
        } catch (e) {
            const code = e?.code || '';
            if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
                setGoogleError(e?.message || 'L’inscription avec Google a échoué.');
            }
            setGoogleLoading(false);
        }
    };

    return (
        <AuthShell
            eyebrow="Déploiement en 3 minutes"
            title="Activez votre standard IA"
            subtitle="Configurez vos agents vocaux dès aujourd'hui. Sans engagement, annulation à tout moment."
            footer={
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Vous possédez déjà un compte ?{' '}
                    <Link href={route('login')} className="font-semibold text-neutral-900 dark:text-white underline underline-offset-4 hover:opacity-80 transition-opacity">
                        Se connecter
                    </Link>
                </div>
            }
        >
            <Head title="Créer un compte · AutoCall" />

            {/* Micro-pastilles de réassurance */}
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Paiements sécurisés GeniusPay
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Crédits IA inclus
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Sans engagement
                </span>
            </div>

            {/* Sélecteur de forfait pro */}
            {plans.length > 0 && (
                <div className="mb-6 space-y-3.5">
                    {/* Header du sélecteur avec toggle cycle */}
                    <div className="flex items-center justify-between gap-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                            1. Choisissez votre formule
                        </label>
                        <div className="flex items-center rounded-xl border border-neutral-200/90 dark:border-white/10 bg-neutral-100/80 dark:bg-white/[0.04] p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setData('billing_cycle', 'month')}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    data.billing_cycle === 'month'
                                        ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Mensuel
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('billing_cycle', 'year')}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all flex items-center gap-1 ${
                                    data.billing_cycle === 'year'
                                        ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                <span>Annuel</span>
                                <span className="rounded bg-emerald-100 px-1 py-0.2 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    -17%
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Sélecteur compact en 3 onglets horizontaux */}
                    <div className="grid grid-cols-3 gap-2">
                        {plans.map((plan) => {
                            const isSelected = data.plan_slug === plan.slug;
                            const meta = PLAN_META[plan.slug] ?? { name: plan.name };
                            const price = planPrice(plan, data.billing_cycle);

                            return (
                                <button
                                    key={plan.slug}
                                    type="button"
                                    onClick={() => setData('plan_slug', plan.slug)}
                                    className={`relative flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? 'border-2 border-neutral-900 bg-white dark:border-white dark:bg-neutral-800/90 shadow-xs ring-2 ring-neutral-900/10 dark:ring-white/10'
                                            : 'border border-neutral-200/90 bg-neutral-50/70 hover:border-neutral-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {meta.badge && (
                                        <span className={`absolute -top-2 rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                                            isSelected
                                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                                : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                                        }`}>
                                            {meta.badge}
                                        </span>
                                    )}

                                    <span className={`text-xs font-bold ${
                                        isSelected
                                            ? 'text-neutral-950 dark:text-white'
                                            : 'text-neutral-700 dark:text-neutral-300'
                                    }`}>
                                        {meta.name}
                                    </span>

                                    <span className={`mt-0.5 text-[11px] font-semibold tabular-nums ${
                                        isSelected
                                            ? 'text-neutral-900 dark:text-neutral-200'
                                            : 'text-neutral-500 dark:text-neutral-400'
                                    }`}>
                                        {price}
                                    </span>

                                    {isSelected && (
                                        <span className="mt-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500">
                                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Fiche récapitulative dynamique du forfait sélectionné */}
                    {activeMeta && (
                        <div className="rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] p-3 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-neutral-900 dark:text-white">
                                    {activeMeta.credits}
                                </span>
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                    {activeMeta.description}
                                </span>
                            </div>
                            <ul className="grid grid-cols-1 gap-1 text-[11px] text-neutral-700 dark:text-neutral-300 pt-0.5">
                                {activeMeta.perks?.map((perk, i) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={2.5} />
                                        <span>{perk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {errors.plan_slug && <p className="text-xs text-red-500">{errors.plan_slug}</p>}
                </div>
            )}

            {/* Étape 2 : Inscription */}
            <div className="mb-4 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    2. Créez votre compte
                </label>
                <div>
                    <GoogleButton onClick={registerWithGoogle} loading={googleLoading} label="Continuer avec Google" />
                </div>
                {googleError && <p className="text-xs text-red-500">{googleError}</p>}
                <OrDivider label="ou avec votre adresse e-mail" />
            </div>

            <form onSubmit={submit} className="space-y-4">
                <AuthField
                    id="name"
                    label="Nom complet ou raison sociale"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    required
                    icon={User}
                    placeholder="Dr. Thomas Martin ou Cabinet Alpha"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                />

                <AuthField
                    id="email"
                    label="Adresse e-mail professionnelle"
                    type="email"
                    name="email"
                    autoComplete="username"
                    required
                    icon={Mail}
                    placeholder="contact@cabinet-alpha.fr"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <div className="space-y-1">
                    <AuthField
                        id="password"
                        label="Mot de passe"
                        secret
                        name="password"
                        autoComplete="new-password"
                        required
                        icon={Lock}
                        placeholder="Au moins 8 caractères"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                    <PasswordStrengthMeter password={data.password} />
                </div>

                <AuthField
                    id="password_confirmation"
                    label="Confirmer le mot de passe"
                    secret
                    name="password_confirmation"
                    autoComplete="new-password"
                    required
                    icon={Lock}
                    placeholder="Répétez votre mot de passe"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                />

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                    En créant un compte, vous acceptez nos{' '}
                    <Link href="/terms" className="text-neutral-900 dark:text-white font-semibold underline underline-offset-2">
                        Conditions Générales
                    </Link>{' '}
                    et notre{' '}
                    <Link href="/privacy" className="text-neutral-900 dark:text-white font-semibold underline underline-offset-2">
                        Politique de Confidentialité
                    </Link>.
                </p>

                <div className="pt-2">
                    <SubmitButton processing={processing} loadingText="Création du compte en cours…">
                        <span>Continuer avec le forfait {activeMeta?.name || ''}</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
