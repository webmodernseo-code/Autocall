'use client';

import React from 'react';
import { route } from '@/lib/route';
import { Head, Link, useForm } from '@/lib/page-router';
import AuthShell, { AuthField, SubmitButton, PasswordStrengthMeter } from '@/components/auth/Auth';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthShell
            eyebrow="Sécurité & Compte"
            title="Nouveau mot de passe"
            subtitle="Définissez un nouveau mot de passe fort pour sécuriser l’accès à vos agents AutoCall."
            footer={
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Vous souhaitez annuler ?{' '}
                    <Link href={route('login')} className="font-semibold text-neutral-900 dark:text-white underline underline-offset-4 hover:opacity-80 transition-opacity">
                        Retour à la connexion
                    </Link>
                </div>
            }
        >
            <Head title="Réinitialiser le mot de passe · AutoCall" />

            <form onSubmit={submit} className="space-y-4">
                <AuthField
                    id="email"
                    label="Adresse e-mail"
                    type="email"
                    name="email"
                    autoComplete="username"
                    required
                    icon={Mail}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <AuthField
                    id="password"
                    label="Nouveau mot de passe"
                    secret
                    name="password"
                    autoComplete="new-password"
                    autoFocus
                    required
                    icon={Lock}
                    placeholder="Minimum 8 caractères"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <PasswordStrengthMeter password={data.password} />

                <AuthField
                    id="password_confirmation"
                    label="Confirmer le nouveau mot de passe"
                    secret
                    name="password_confirmation"
                    autoComplete="new-password"
                    required
                    icon={Lock}
                    placeholder="Répétez le mot de passe"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                />

                <div className="pt-2">
                    <SubmitButton processing={processing} loadingText="Mise à jour…">
                        <span>Enregistrer le nouveau mot de passe</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
