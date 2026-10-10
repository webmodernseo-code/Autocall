'use client';

import React, { useState } from 'react';
import { route } from '@/lib/route';
import { Head, Link, router, useForm, usePage } from '@/lib/page-router';
import { signInWithGoogle } from '@/lib/firebaseAuth';
import AuthShell, { AuthField, GoogleButton, AppleButton, OrDivider, SubmitButton, DemoLoginCard } from '@/components/auth/Auth';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword = true }) {
    const { props } = usePage();

    const socialLogin = props.socialLogin ?? {};
    const showGoogle = Boolean(socialLogin.enabled && socialLogin.google);
    const demoCred = props.demo_mode ? props.demo_credentials?.client : null;

    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState('');
    const [demoLoading, setDemoLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    const oneClickLogin = () => {
        if (!demoCred) return;
        setData({ email: demoCred.email, password: demoCred.password, remember: true });
        router.post(route('login'), { email: demoCred.email, password: demoCred.password, remember: true }, {
            onStart: () => setDemoLoading(true),
            onFinish: () => setDemoLoading(false),
        });
    };

    const loginWithGoogle = async () => {
        setGoogleError('');
        setGoogleLoading(true);
        try {
            const idToken = await signInWithGoogle(socialLogin.firebase);
            router.post(route('auth.firebase.callback'), { id_token: idToken }, {
                onError: (errs) => setGoogleError(errs.social_login || 'La connexion avec Google a échoué. Veuillez réessayer.'),
                onFinish: () => setGoogleLoading(false),
            });
        } catch (e) {
            const code = e?.code || '';
            if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
                setGoogleError(e?.message || 'La connexion avec Google a échoué.');
            }
            setGoogleLoading(false);
        }
    };

    return (
        <AuthShell
            eyebrow="Espace Client"
            title="Connexion à votre espace"
            subtitle="Accédez au tableau de bord pour superviser vos agents vocaux et consulter l’historique de vos appels."
            footer={
                <div className="text-xs text-neutral-400">
                    Pas encore de compte ?{' '}
                    <Link href={route('register')} className="font-semibold text-white hover:underline underline-offset-4 transition-colors">
                        Créer un compte (14 jours offerts)
                    </Link>
                </div>
            }
        >
            <Head title="Connexion · AutoCall" />

            {status && (
                <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-300">
                    {status}
                </div>
            )}

            <DemoLoginCard cred={demoCred} onOneClick={oneClickLogin} loading={demoLoading} hint="Tester avec les accès de démonstration" />

            <div className="mb-2">
                <div className="grid gap-3 sm:grid-cols-2">
                    <GoogleButton onClick={loginWithGoogle} loading={googleLoading} label="Continuer avec Google" />
                    <AppleButton label="Continuer avec Apple" />
                </div>
                {googleError && <p className="mt-2 text-xs text-red-400">{googleError}</p>}
                <OrDivider label="ou avec votre adresse e-mail" />
            </div>

            <form onSubmit={submit} className="space-y-4">
                <AuthField
                    id="email"
                    label="Adresse e-mail professionnelle"
                    type="email"
                    name="email"
                    autoComplete="username"
                    autoFocus
                    required
                    icon={Mail}
                    placeholder="nom@entreprise.fr"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <AuthField
                    id="password"
                    label="Mot de passe"
                    secret
                    name="password"
                    autoComplete="current-password"
                    required
                    icon={Lock}
                    placeholder="••••••••••••"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 text-neutral-400 hover:text-white cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded-md border-white/20 bg-white/5 text-white focus:ring-white/20 cursor-pointer"
                        />
                        <span>Se souvenir de moi</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-neutral-400 hover:text-white transition-colors font-medium"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <SubmitButton processing={processing} loadingText="Connexion en cours…">
                        <span>Se connecter au standard</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
