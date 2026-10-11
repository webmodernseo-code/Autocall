'use client';

import React from 'react';
import { route } from '@/lib/route';
import { Head, Link, useForm } from '@/lib/page-router';
import AuthShell, { SubmitButton } from '@/components/auth/Auth';
import { Mail, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthShell
            eyebrow="Vérification requise"
            title="Vérifiez votre adresse e-mail"
            subtitle="Merci pour votre inscription ! Avant de commencer, veuillez cliquer sur le lien que nous venons de vous envoyer par e-mail."
            footer={
                <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Problème de compte ?</span>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-1 font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Se déconnecter</span>
                    </Link>
                </div>
            }
        >
            <Head title="Vérification de l’e-mail · AutoCall" />

            {status === 'verification-link-sent' && (
                <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Nouveau lien envoyé</span>
                    </div>
                    <p className="text-white/80 pl-6 leading-relaxed">
                        Un nouveau lien de vérification vous a été envoyé à l’adresse fournie lors de l’inscription.
                    </p>
                </div>
            )}

            {status === 'invalid' && (
                <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                        <AlertCircle className="h-4 w-4 text-rose-400" />
                        <span>Lien expiré ou invalide</span>
                    </div>
                    <p className="text-white/80 pl-6 leading-relaxed">
                        Ce lien de vérification a expiré. Vous pouvez en demander un nouveau ci-dessous.
                    </p>
                </div>
            )}

            {status === 'delivery-failed' && (
                <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                        <AlertCircle className="h-4 w-4 text-amber-300" />
                        <span>Envoi temporairement indisponible</span>
                    </div>
                    <p className="text-white/80 pl-6 leading-relaxed">
                        Votre compte est bien créé. Réessayez dans quelques instants pour recevoir le lien de vérification.
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4 pt-2">
                <SubmitButton processing={processing} loadingText="Envoi en cours…">
                    <Mail className="h-4 w-4 mr-1.5" />
                    <span>Renvoyer l’e-mail de vérification</span>
                </SubmitButton>
            </form>
        </AuthShell>
    );
}
