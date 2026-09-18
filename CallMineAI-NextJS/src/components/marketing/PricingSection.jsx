'use client';

import { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Lock, HelpCircle } from 'lucide-react';

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        tagline: 'Pour indépendants, cabinets & premières campagnes',
        monthlyPrice: 49,
        annualPrice: 39,
        minutes: '300 minutes incluses / mois',
        extraMinute: '0,14 € / minute supplémentaire',
        isPopular: false,
        features: [
            '2 agents vocaux configurables',
            '300 minutes de communication HD incluses',
            'Prise de rendez-vous Google Calendar & Outlook',
            'Transcription intégrale & résumés IA',
            'Webhooks standards & export CSV',
            'Support par e-mail en français'
        ],
        ctaText: 'Démarrer avec le Starter',
        ctaHref: '/register?plan=starter'
    },
    {
        id: 'pro',
        name: 'Professionnel',
        tagline: 'Pour PME, équipes commerciales & forte qualification',
        monthlyPrice: 149,
        annualPrice: 119,
        minutes: '1 500 minutes incluses / mois',
        extraMinute: '0,09 € / minute supplémentaire',
        isPopular: true,
        features: [
            '10 agents vocaux simultanés',
            '1 500 minutes de communication HD incluses',
            'Synchronisation CRM native (HubSpot, Salesforce, Pipedrive)',
            'Transfert chaud à un conseiller humain en direct',
            'Dialer asynchrone & relance des répondeurs',
            'Scoring de sentiment & détection d’objections',
            'Support prioritaire par chat & e-mail'
        ],
        ctaText: 'Choisir le forfait Pro',
        ctaHref: '/register?plan=pro'
    },
    {
        id: 'scale',
        name: 'Scale & Agences',
        tagline: 'Pour agences, promoteurs & volumes industriels',
        monthlyPrice: 399,
        annualPrice: 319,
        minutes: '5 000 minutes incluses / mois',
        extraMinute: '0,06 € / minute supplémentaire',
        isPopular: false,
        features: [
            'Agents vocaux illimités en simultané',
            '5 000 minutes de communication HD incluses',
            'Option Marque Blanche (White-label) complète',
            'Dialer prédictif haute cadence (jusqu’à 1 000 appels/min)',
            'Base de connaissances RAG dédiée sur vos documents',
            'Gestion multi-comptes clients avec sous-facturation',
            'SLA 99.98% & Account Manager dédié'
        ],
        ctaText: 'Déployer la solution Scale',
        ctaHref: '/register?plan=scale'
    }
];

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <div className="w-full space-y-10">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center">
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1 text-xs font-semibold">
                    <button
                        onClick={() => setIsAnnual(false)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            !isAnnual
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Facturation mensuelle
                    </button>
                    <button
                        onClick={() => setIsAnnual(true)}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                            isAnnual
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <span>Facturation annuelle</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                            -20% d'économie
                        </span>
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {PLANS.map((plan) => {
                    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
                    return (
                        <div
                            key={plan.id}
                            className={`rounded-2xl flex flex-col justify-between p-6 md:p-8 transition-all duration-200 ${
                                plan.isPopular
                                    ? 'border-2 border-sky-600 dark:border-sky-500 bg-white dark:bg-slate-900 shadow-md relative ring-4 ring-sky-500/10'
                                    : 'border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs'
                            }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-sky-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                    <Sparkles className="w-3.5 h-3.5" /> Choix Recommandé
                                </div>
                            )}

                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>

                                <div className="mt-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                                            {price} €
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">/ mois</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-1">
                                        {isAnnual ? 'Facturé annuellement (TVA déductible)' : 'Sans engagement, facturé au mois'}
                                    </div>

                                    <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                        <div className="font-semibold text-slate-900 dark:text-white">{plan.minutes}</div>
                                        <div className="text-slate-500 mt-0.5">{plan.extraMinute}</div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">Inclus dans ce forfait :</span>
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                                            <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <a
                                    href={plan.ctaHref}
                                    className={`w-full inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl font-semibold text-xs transition-colors shadow-2xs ${
                                        plan.isPopular
                                            ? 'bg-sky-600 hover:bg-sky-700 text-white'
                                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{plan.ctaText}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Micro-Reassurance Line */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400 text-center">
                <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paiement chiffré SSL 256-bit certifié PCI-DSS</span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <span>Sans engagement de durée</span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <span>10 minutes d'essais offertes sans carte bancaire</span>
            </div>
        </div>
    );
}
