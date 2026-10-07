'use client';

import React, { useState } from 'react';
import { 
    CreditCard, 
    Check, 
    ArrowRight, 
    ShieldCheck, 
    Zap, 
    Sparkles, 
    HelpCircle,
    Lock
} from 'lucide-react';

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            id: 'starter',
            name: "Starter",
            tagline: "Idéal pour indépendants, artisans & praticiens solos.",
            monthlyPrice: 29,
            annualPrice: 24,
            isPopular: false,
            credits: "500 minutes d'appels / mois",
            features: [
                "1 agent vocal IA dédié",
                "Renvoi d'appel depuis votre ligne actuelle (fixe/mobile)",
                "Prise de rendez-vous & synchronisation agenda",
                "Transcriptions textuelles & résumés par SMS / email",
                "Filtrage des démarchages et appels non prioritaires",
                "Support réactif par e-mail en français"
            ],
            cta: "Démarrer l'essai gratuit",
            ctaHref: "/register",
            ctaStyle: "border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black hover:border-white"
        },
        {
            id: 'growth',
            name: "Growth",
            tagline: "Pour cabinets médicaux, études d'avocats, agences & PME.",
            monthlyPrice: 79,
            annualPrice: 66,
            isPopular: true,
            badge: "Le plus populaire",
            credits: "5 000 minutes d'appels / mois",
            features: [
                "Jusqu'à 5 agents IA configurables (jour, nuit, astreinte)",
                "Synchronisation CRM & Agenda (Doctolib, HubSpot, Google)",
                "Qualification sur mesure & détection des urgences",
                "Alerte SMS immédiate lors d'appels prioritaires",
                "29 langues et accents régionaux supportés",
                "Routage intelligent vers collaborateurs",
                "Support prioritaire 7j/7"
            ],
            cta: "Essai gratuit 14 jours",
            ctaHref: "/register",
            ctaStyle: "bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10"
        },
        {
            id: 'scale',
            name: "Scale",
            tagline: "Pour agences, cliniques & entreprises à fort volume.",
            monthlyPrice: 199,
            annualPrice: 166,
            isPopular: false,
            credits: "25 000 minutes d'appels / mois",
            features: [
                "Nombre d'agents IA illimité",
                "Routage haute cadence & lignes directes multiples",
                "Trunks SIP personnalisés (Bring Your Own Carrier)",
                "Intégrations API REST avancées & Webhooks temps réel",
                "Multi-utilisateurs avec rôles d'équipe et audit logs",
                "Conformité RGPD Santé & chiffrement sur mesure",
                "Accompagnement & Account Manager dédié"
            ],
            cta: "Contacter l'équipe",
            ctaHref: "/register",
            ctaStyle: "border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black hover:border-white"
        }
    ];

    return (
        <section id="tarifs" className="relative px-6 py-20 sm:py-28 text-white scroll-mt-20">
            {/* Halo lumineux d'arrière-plan */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[1000px] rounded-full blur-[170px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                
                {/* 1. ENTÊTE DE SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md mb-4 shadow-xs">
                        <CreditCard className="h-3.5 w-3.5 text-white/60" />
                        <span>Tarification transparente & sans engagement</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.18]">
                        Une formule adaptée à{' '}
                        <span className="font-hero-serif italic text-white/95">
                            votre volume d&apos;appels.
                        </span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
                        Chaque formule comprend 14 jours d&apos;essai gratuit sans carte bancaire requise. Vous ne payez que lorsque votre standard tourne à plein régime.
                    </p>

                    {/* 2. SÉLECTEUR MENSUEL / ANNUEL */}
                    <div className="mt-9 inline-flex items-center gap-3 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                !isAnnual
                                    ? 'bg-white text-black font-semibold shadow-sm'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            Facturation mensuelle
                        </button>

                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                isAnnual
                                    ? 'bg-white text-black font-semibold shadow-sm'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <span>Facturation annuelle</span>
                            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                                -20% offert
                            </span>
                        </button>
                    </div>
                </div>

                {/* 3. GRILLE DES 3 FORMULES */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan) => {
                        const currentPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;

                        return (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-all duration-200 ${
                                    plan.isPopular
                                        ? 'bg-[#121520] border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 scale-[1.02] lg:-translate-y-2'
                                        : 'bg-[#0E1015]/90 border border-white/10 hover:border-white/20'
                                }`}
                            >
                                {/* Badge Populaire */}
                                {plan.isPopular && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-black shadow-md">
                                        <Sparkles className="h-3 w-3" />
                                        <span>{plan.badge}</span>
                                    </div>
                                )}

                                <div>
                                    {/* Titre & Description */}
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-white">
                                            {plan.name}
                                        </h3>
                                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                            {plan.credits}
                                        </span>
                                    </div>

                                    <p className="text-xs text-white/60 min-h-[34px] leading-relaxed mb-6">
                                        {plan.tagline}
                                    </p>

                                    {/* Prix */}
                                    <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-white/10">
                                        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white">
                                            {currentPrice}€
                                        </span>
                                        <span className="text-xs text-white/50 font-mono">
                                            / mois {isAnnual && <span className="text-[11px] text-emerald-400 block sm:inline">facturé annuellement</span>}
                                        </span>
                                    </div>

                                    {/* Liste des fonctionnalités */}
                                    <div className="space-y-3 mb-8">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                                            Inclus dans la formule :
                                        </div>
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5">
                                                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 mt-0.5">
                                                    <Check className="h-2.5 w-2.5" />
                                                </div>
                                                <span className="text-xs sm:text-sm text-white/80 leading-relaxed">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bouton d'action */}
                                <div className="pt-4 border-t border-white/10">
                                    <a
                                        href={plan.ctaHref}
                                        className={`inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${plan.ctaStyle}`}
                                    >
                                        <span>{plan.cta}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 4. MICRO-RÉASSURANCE DISCRÈTE (100% ANTI-SLOP) */}
                <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-white/60">
                    <div className="inline-flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-400" />
                        <span>Paiement sécurisé SSL 256-bit certifié PCI-DSS</span>
                    </div>

                    <div className="inline-flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>14 jours d&apos;essai gratuit sans carte bancaire</span>
                    </div>

                    <div className="inline-flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-400" />
                        <span>Sans engagement, résiliation en 1 clic</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
