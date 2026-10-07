'use client';

import React, { useState } from 'react';
import { route } from '@/lib/route';
import { Head, Link, router, useForm, usePage } from '@/lib/page-router';
import { signInWithGoogle } from '@/lib/firebaseAuth';
import AuthShell, { AuthField, GoogleButton, OrDivider, SubmitButton } from '@/components/auth/Auth';
import { Check } from 'lucide-react';

export default function Register() {
    const { props } = usePage();
    const brand = props.branding?.company_name || props.branding?.system_title || 'CallMind AI';
    const logoUrl = props.branding?.site_logo_url ?? null;

    const socialLogin = props.socialLogin ?? {};
    const showGoogle = Boolean(socialLogin.enabled && socialLogin.google);

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
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    const registerWithGoogle = async () => {
        setGoogleError('');
        setGoogleLoading(true);
        try {
            const idToken = await signInWithGoogle(socialLogin.firebase);
            router.post(route('auth.firebase.callback'), { id_token: idToken }, {
                onError: (errs) => setGoogleError(errs.social_login || 'L\'inscription avec Google a échoué. Veuillez réessayer.'),
                onFinish: () => setGoogleLoading(false),
            });
        } catch (e) {
            const code = e?.code || '';
            if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
                setGoogleError(e?.message || 'L\'inscription avec Google a échoué.');
            }
            setGoogleLoading(false);
        }
    };

    return (
        <AuthShell
            brand={brand}
            logoUrl={logoUrl}
            eyebrow="Essai Gratuit 14 Jours"
            title="Créez votre standard téléphonique IA"
            subtitle="Démarrez en 3 minutes sans carte bancaire requise. Vous ne payez que si vous êtes pleinement convaincu."
            footer={
                <div className="text-xs text-white/60">
                    Vous possédez déjà un compte ?{' '}
                    <Link href={route('login')} className="font-semibold text-white hover:underline">
                        Se connecter
                    </Link>
                </div>
            }
        >
            <Head title="Inscription gratuite · CallMind AI" />

            {/* Micro-pastilles de réassurance */}
            <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] text-white/70">
                <span className="inline-flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-400" />
                    Aucun numéro à changer
                </span>
                <span className="inline-flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-400" />
                    Sans engagement
                </span>
                <span className="inline-flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-400" />
                    Support en français
                </span>
            </div>

            {showGoogle && (
                <div className="mb-2">
                    <GoogleButton onClick={registerWithGoogle} loading={googleLoading} label="S'inscrire avec Google" />
                    {googleError && <p className="mt-2 text-xs text-red-400">{googleError}</p>}
                    <OrDivider label="ou avec votre adresse e-mail professionnelle" />
                </div>
            )}

            <form onSubmit={submit} className="space-y-3.5">
                <AuthField
                    id="name"
                    label="Nom complet ou nom du cabinet"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    required
                    placeholder="Dr. Thomas Martin ou Me. Laurent"
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
                    placeholder="contact@cabinet-martin.fr"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <AuthField
                    id="password"
                    label="Mot de passe"
                    secret
                    name="password"
                    autoComplete="new-password"
                    required
                    placeholder="Au moins 8 caractères"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <AuthField
                    id="password_confirmation"
                    label="Confirmer le mot de passe"
                    secret
                    name="password_confirmation"
                    autoComplete="new-password"
                    required
                    placeholder="Confirmez votre mot de passe"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                />

                <div className="pt-3">
                    <SubmitButton processing={processing} loadingText="Création du compte…">
                        Démarrer mon essai gratuit de 14 jours
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
