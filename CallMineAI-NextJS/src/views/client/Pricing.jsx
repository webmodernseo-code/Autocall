'use client';

import { route } from '@/lib/route';
import ClientLayout from '@/layouts/ClientLayout';
import { Button, Card } from '@/components/ui';
import { Head, router, usePage } from '@/lib/page-router';
import { useState } from 'react';
import { Check, CreditCard, Lock, ShieldCheck } from 'lucide-react';

/**
 * Pricing page: monthly/yearly toggle, payable plans, Stripe checkout, paywall alert.
 */
export default function Pricing({ plans = [], gateways = [], flash = {}, isRequired = false }) {
    const [billingCycle, setBillingCycle] = useState('month');
    const [loadingGateway, setLoadingGateway] = useState(null);
    const { url } = usePage();

    const hasSuccess = url.includes('checkout=success');
    const hasCanceled = url.includes('checkout=canceled');
    const flashError = flash?.error;
    const flashSuccess = flash?.success;

    const configuredGateways = gateways.filter((g) => g.configured);

    const handleCheckout = (planId, gatewayKey) => {
        if (!planId || !gatewayKey) return;
        const loadingKey = `${planId}-${gatewayKey}`;
        setLoadingGateway(loadingKey);
        router.post(route('client.checkout.store'), {
            plan_id: planId,
            billing_cycle: billingCycle,
            gateway: gatewayKey,
        }, {
            preserveScroll: true,
            onFinish: () => setLoadingGateway(null),
        });
    };

    return (
        <ClientLayout title="Abonnements & Forfaits">
            <Head title="Forfaits & Tarifs" />

            <div className="space-y-6 max-w-6xl mx-auto py-2">
                {isRequired && (
                    <div className="flex items-center gap-3.5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-amber-900 shadow-2xs dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            <Lock className="h-4.5 w-4.5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold">Activation de compte requise</h4>
                            <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                                Choisissez l&apos;un de nos forfaits ci-dessous pour activer instantanément votre espace de travail et commencer à déployer vos agents d&apos;appel IA.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Choisissez votre forfait
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Accédez aux agents vocaux autonomes, campagnes d&apos;appels et qualification automatique.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                        <button
                            type="button"
                            onClick={() => setBillingCycle('month')}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${billingCycle === 'month' ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white' : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}`}
                        >
                            Facturation mensuelle
                        </button>
                        <button
                            type="button"
                            onClick={() => setBillingCycle('year')}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${billingCycle === 'year' ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white' : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}`}
                        >
                            Facturation annuelle <span className="ml-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">(-17%)</span>
                        </button>
                    </div>
                </div>

                {(flashError || hasCanceled) && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800 dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-300">
                        {flashError || 'Le paiement a été interrompu. Vous pouvez réessayer à tout moment.'}
                    </div>
                )}
                {(flashSuccess || hasSuccess) && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-300">
                        {flashSuccess || 'Paiement confirmé avec succès ! Votre compte est activé.'}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => {
                        const priceDisplay = billingCycle === 'year' ? plan.yearly_price_display : plan.monthly_price_display;

                        return (
                            <Card key={plan.id} className="flex flex-col border border-neutral-200/90 bg-white shadow-xs transition hover:border-brand-500/50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <Card.Body className="flex flex-1 flex-col p-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                                            {plan.name}
                                        </h3>
                                        {plan.slug === 'pro' && (
                                            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/40">
                                                Populaire
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                                            {priceDisplay ?? '—'}
                                        </span>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                            /{billingCycle === 'year' ? 'an' : 'mois'}
                                        </span>
                                    </div>

                                    <div className="mt-6 border-t border-neutral-100 pt-5 dark:border-neutral-800">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                                            Inclus dans ce forfait
                                        </p>
                                        <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                                <span><strong>{plan.ai_credits?.toLocaleString()}</strong> crédits IA inclus</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                                <span>Agents conversationnels illimités</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                                <span>Routage entrant & sortant 24h/24</span>
                                            </li>
                                            {plan.export_enabled && (
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                                    <span>Export des débriefings & webhooks</span>
                                                </li>
                                            )}
                                            {plan.custom_domain_enabled && (
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                                    <span>Domaine personnalisé</span>
                                                </li>
                                            )}
                                            {plan.white_label_enabled && (
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                                    <span>Option marque blanche complète</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="mt-auto pt-6">
                                        {configuredGateways.length === 0 ? (
                                            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-center text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-300">
                                                Paiement en cours de configuration par l&apos;administrateur.
                                            </div>
                                        ) : (
                                            configuredGateways.map((gw) => {
                                                const buttonKey = `${plan.id}-${gw.key}`;
                                                const isThisLoading = loadingGateway === buttonKey;
                                                return (
                                                    <Button
                                                        key={buttonKey}
                                                        type="button"
                                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-500 active:scale-[0.99] transition"
                                                        disabled={loadingGateway !== null}
                                                        onClick={() => handleCheckout(plan.id, gw.key)}
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                        {isThisLoading ? 'Redirection vers Stripe…' : `Activer avec ${gw.name}`}
                                                    </Button>
                                                );
                                            })
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Paiements sécurisés par Stripe — Chiffrement SSL 256-bit certifié PCI-DSS</span>
                </div>
            </div>
        </ClientLayout>
    );
}


