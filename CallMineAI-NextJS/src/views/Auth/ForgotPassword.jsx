'use client';

import React from 'react';
import { route } from '@/lib/route';
import { Head, Link, useForm, usePage } from '@/lib/page-router';
import AuthShell, { AuthField, SubmitButton } from '@/components/auth/Auth';
import { MailCheck } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { props } = usePage();
    const brand = props.branding?.company_name || props.branding?.system_title || 'CallMind AI';
    const logoUrl = props.branding?.site_logo_url ?? null;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthShell
            brand={brand}
            logoUrl={logoUrl}
            eyebrow="Sécurité & Récupération"
            title="Mot de passe oublié"
            subtitle="Saisissez l'adresse e-mail associée à votre compte. Nous vous enverrons immédiatement un lien sécurisé pour définir un nouveau mot de passe."
            footer={
                <div className="text-xs text-white/60">
                    Vous vous souvenez de votre mot de passe ?{' '}
                    <Link href={route('login')} className="font-semibold text-white hover:underline">
                        Retour à la connexion
                    </Link>
                </div>
            }
        >
            <Head title="Mot de passe oublié · CallMind AI" />

            {status && (
                <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                        <MailCheck className="h-4 w-4" />
                        <span>E-mail envoyé avec succès</span>
                    </div>
                    <p className="text-white/80 pl-6">
                        {status}
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <AuthField
                    id="email"
                    label="Adresse e-mail de votre compte"
                    type="email"
                    name="email"
                    autoComplete="username"
                    autoFocus
                    required
                    placeholder="nom@entreprise.fr"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <div className="pt-2">
                    <SubmitButton processing={processing} loadingText="Envoi en cours…">
                        Envoyer le lien de réinitialisation
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
