'use client';

import React from 'react';
import { route } from '@/lib/route';
import { Head, Link, useForm, usePage } from '@/lib/page-router';
import AuthShell, { AuthField, SubmitButton } from '@/components/auth/Auth';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { props } = usePage();

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthShell
            eyebrow="Récupération & Sécurité"
            title="Mot de passe oublié"
            subtitle="Indiquez l’adresse e-mail associée à votre compte AutoCall. Vous recevrez un lien sécurisé pour redéfinir votre mot de passe."
            footer={
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Vous vous souvenez de votre mot de passe ?{' '}
                    <Link href={route('login')} className="font-semibold text-neutral-900 dark:text-white underline underline-offset-4 hover:opacity-80 transition-opacity">
                        Retour à la connexion
                    </Link>
                </div>
            }
        >
            <Head title="Mot de passe oublié · AutoCall" />

            {status && (
                <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Lien de réinitialisation envoyé</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 pl-6 leading-relaxed">
                        {status}
                    </p>
                </div>
            )}

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
                    helperText="Nous vous enverrons un lien à usage unique valide 60 minutes."
                />

                <div className="pt-2">
                    <SubmitButton processing={processing} loadingText="Envoi en cours…">
                        <span>Envoyer le lien de réinitialisation</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
