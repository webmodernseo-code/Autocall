'use client';

import React, { useState } from 'react';
import { route } from '@/lib/route';
import { Head, Link, router, useForm, usePage } from '@/lib/page-router';
import { signInWithGoogle } from '@/lib/firebaseAuth';
import AuthShell, { AuthField, GoogleButton, AppleButton, OrDivider, SubmitButton, PasswordStrengthMeter } from '@/components/auth/Auth';
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
    const { props } = usePage();
    const socialLogin = props.socialLogin ?? {};

    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
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
            router.post(route('auth.firebase.callback'), { id_token: idToken }, {
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
            eyebrow="Essai Gratuit 14 Jours"
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
                    14 jours d&apos;essai complet
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    500 minutes offertes
                </span>
            </div>

            <div className="mb-2">
                <div className="grid gap-3 sm:grid-cols-2">
                    <GoogleButton onClick={registerWithGoogle} loading={googleLoading} label="S'inscrire avec Google" />
                    <AppleButton label="S'inscrire avec Apple" />
                </div>
                {googleError && <p className="mt-2 text-xs text-red-400">{googleError}</p>}
                <OrDivider label="ou inscription par e-mail" />
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
                        <span>Démarrer l&apos;essai gratuit (14j)</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
