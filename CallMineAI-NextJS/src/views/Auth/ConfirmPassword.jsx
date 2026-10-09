'use client';

import React from 'react';
import { route } from '@/lib/route';
import { Head, useForm } from '@/lib/page-router';
import AuthShell, { AuthField, SubmitButton } from '@/components/auth/Auth';
import { Lock, ArrowRight } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthShell
            eyebrow="Sécurité renforcée"
            title="Confirmez votre mot de passe"
            subtitle="Cette zone est sécurisée. Veuillez confirmer votre mot de passe actuel avant de continuer."
        >
            <Head title="Confirmer le mot de passe · AutoCall" />

            <form onSubmit={submit} className="space-y-4">
                <AuthField
                    id="password"
                    label="Mot de passe actuel"
                    secret
                    name="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    icon={Lock}
                    placeholder="Votre mot de passe"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <div className="pt-2">
                    <SubmitButton processing={processing} loadingText="Vérification…">
                        <span>Confirmer l’accès</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
