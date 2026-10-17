'use client';

import React, { useState } from 'react';
import { route } from '@/lib/route';
import { Head, Link, router, useForm, usePage } from '@/lib/page-router';
import { signInWithGoogle } from '@/lib/firebaseAuth';
import AuthShell, { AuthField, GoogleButton, OrDivider, SubmitButton, PasswordStrengthMeter } from '@/components/auth/Auth';
import { User, Mail, Lock, ArrowRight, CheckCircle2, Check } from 'lucide-react';

const PLAN_COPY = {
    free: { name: 'Découverte', description: 'Pour tester AutoCall sans carte bancaire.' },
    starter: { name: 'Starter', description: 'Pour indépendants et petites structures.' },
    pro: { name: 'Pro', description: 'Pour équipes et entreprises en croissance.' },
    agency: { name: 'Agency', description: 'Pour agences et volumes importants.' },
};

function planPrice(plan, cycle) {
    const cents = cycle === 'year' ? plan.yearly_price_cents : plan.monthly_price_cents;
    if (!cents) return 'Gratuit';
    const monthlyCents = cycle === 'year' ? Math.round(cents / 12) : cents;
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(monthlyCents / 100)} €/mois`;
}

export default function Register({ plans = [], selectedPlan = 'free', billingCycle = 'month' }) {
    const { props } = usePage();
    const socialLogin = props.socialLogin ?? {};

    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        plan_slug: selectedPlan,
        billing_cycle: billingCycle,
    });

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
            eyebrow="100 minutes offertes"
            title="Activez votre standard IA"
            subtitle="Configurez vos agents vocaux en 3 minutes. Aucun numéro à modifier et aucune carte bancaire requise."
            footer={
                <div className="text-xs text-neutral-400">
                    Vous possédez déjà un compte ?{' '}
                    <Link href={route('login')} className="font-semibold text-white hover:underline underline-offset-4 transition-colors">
                        Se connecter
                    </Link>
                </div>
            }
        >
            <Head title="Créer un compte · AutoCall" />

            {/* Micro-pastilles de réassurance au sommet */}
            <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Sans carte bancaire
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    100 minutes d&apos;appels offertes
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Sans engagement
                </span>
            </div>

            <div className="mb-2">
                <div>
                    <GoogleButton onClick={registerWithGoogle} loading={googleLoading} label="S'inscrire avec Google" />
                </div>
                {googleError && <p className="mt-2 text-xs text-red-400">{googleError}</p>}
                <OrDivider label="ou inscription par e-mail" />
            </div>

            <form onSubmit={submit} className="space-y-4">
                {plans.length > 0 && (
                    <fieldset className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <legend className="text-sm font-semibold text-white">Votre forfait</legend>
                            <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-[11px]">
                                <button
                                    type="button"
                                    onClick={() => setData('billing_cycle', 'month')}
                                    className={`rounded-md px-2.5 py-1.5 transition ${data.billing_cycle === 'month' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-white'}`}
                                >
                                    Mensuel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('billing_cycle', 'year')}
                                    className={`rounded-md px-2.5 py-1.5 transition ${data.billing_cycle === 'year' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-white'}`}
                                >
                                    Annuel
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {plans.map((plan) => {
                                const selected = data.plan_slug === plan.slug;
                                const copy = PLAN_COPY[plan.slug] ?? {};
                                return (
                                    <button
                                        key={plan.slug}
                                        type="button"
                                        onClick={() => setData('plan_slug', plan.slug)}
                                        aria-pressed={selected}
                                        className={`relative min-h-20 rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400/70 ${selected ? 'border-sky-400/70 bg-sky-400/10 shadow-sm' : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'}`}
                                    >
                                        <span className="flex items-start justify-between gap-2">
                                            <span>
                                                <span className="block text-sm font-semibold text-white">{copy.name ?? plan.name}</span>
                                                <span className="mt-0.5 block text-[11px] leading-4 text-neutral-400">{copy.description ?? plan.description}</span>
                                            </span>
                                            <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-sky-400 bg-sky-400 text-slate-950' : 'border-white/25 text-transparent'}`}>
                                                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                            </span>
                                        </span>
                                        <span className="mt-2 block text-xs font-semibold tabular-nums text-sky-300">
                                            {planPrice(plan, data.billing_cycle)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.plan_slug && <p className="text-xs text-red-400">{errors.plan_slug}</p>}
                        <p className="text-[11px] leading-4 text-neutral-500">
                            Aucun paiement maintenant. Les offres payantes seront confirmées après la création du compte.
                        </p>
                    </fieldset>
                )}

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

                <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
                    En créant un compte, vous acceptez nos{' '}
                    <Link href="/terms" className="text-neutral-200 hover:underline underline-offset-2 font-medium">
                        Conditions Générales
                    </Link>{' '}
                    et notre{' '}
                    <Link href="/privacy" className="text-neutral-200 hover:underline underline-offset-2 font-medium">
                        Politique de Confidentialité
                    </Link>.
                </p>

                <div className="pt-2">
                    <SubmitButton processing={processing} loadingText="Création du compte…">
                        <span>{data.plan_slug === 'free' ? 'Créer mon compte gratuitement' : 'Continuer avec ce forfait'}</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
