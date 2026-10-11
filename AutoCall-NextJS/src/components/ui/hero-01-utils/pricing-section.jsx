'use client';

import React from 'react';
import { PricingSection } from '@/components/ui/pricing';
import { Lock, ShieldCheck, Zap } from 'lucide-react';

export default function PricingWrapperSection() {
    const plans = [
        {
            id: 'starter',
            name: "Starter",
            info: "Idéal pour indépendants, artisans & praticiens solos.",
            price: {
                monthly: 29,
                yearly: 24,
            },
            features: [
                { 
                    text: "1 agent vocal IA dédié", 
                    tooltip: "Agent configuré avec votre personnalité et vos consignes spécifiques." 
                },
                { 
                    text: "500 minutes d'appels / mois", 
                    tooltip: "Décompte à la seconde, sans engagement." 
                },
                { 
                    text: "Renvoi d'appel depuis votre ligne", 
                    tooltip: "Activez le transfert depuis Orange, SFR, Bouygues, Free ou VoIP." 
                },
                { 
                    text: "Prise de RDV & synchronisation agenda", 
                    tooltip: "Connecté en direct à Google Calendar, Outlook ou Calendly." 
                },
                { 
                    text: "Transcriptions & résumés par SMS / email", 
                    tooltip: "Revue complète de chaque conversation instantanément." 
                },
                { 
                    text: "Filtrage des démarchages indésirables", 
                    tooltip: "Bloque 100% des spams téléphoniques sans vous déranger." 
                },
            ],
            btn: {
                text: "Démarrer l'essai gratuit",
                href: "/register",
            },
            highlighted: false,
        },
        {
            id: 'growth',
            name: "Growth",
            info: "Pour cabinets médicaux, études d'avocats, agences & PME.",
            badge: "Recommandé",
            price: {
                monthly: 79,
                yearly: 66,
            },
            features: [
                { 
                    text: "Jusqu'à 5 agents IA configurables", 
                    tooltip: "Scénarios distincts : journée, nuit, astreinte ou urgences." 
                },
                { 
                    text: "5 000 minutes d'appels / mois", 
                    tooltip: "Idéal pour absorber de 20 à 60 appels quotidiens." 
                },
                { 
                    text: "Synchronisation CRM & Agendas", 
                    tooltip: "Doctolib, HubSpot, Salesforce, Pipedrive, Notion & Zapier." 
                },
                { 
                    text: "Qualification sur mesure & urgences", 
                    tooltip: "Détection des mots-clés critiques et alerte SMS instantanée." 
                },
                { 
                    text: "29 langues et accents supportés", 
                    tooltip: "Interagit dans la langue maternelle de vos appelants." 
                },
                { 
                    text: "Routage d'appel vers collaborateurs", 
                    tooltip: "Transfère l'appel en direct vers le bon interlocuteur si besoin." 
                },
                { 
                    text: "Support prioritaire 7j/7", 
                    tooltip: "Assistance dédiée avec temps de réponse garanti < 2h." 
                },
            ],
            btn: {
                text: "100 minutes offertes",
                href: "/register",
            },
            highlighted: true,
        },
        {
            id: 'scale',
            name: "Scale",
            info: "Pour agences, cliniques & entreprises à fort volume.",
            price: {
                monthly: 199,
                yearly: 166,
            },
            features: [
                { 
                    text: "Nombre d'agents IA illimité", 
                    tooltip: "Créez autant de profils vocaux et de lignes que nécessaire." 
                },
                { 
                    text: "25 000 minutes d'appels / mois", 
                    tooltip: "Volume haute cadence pour les standards très sollicités." 
                },
                { 
                    text: "Trunks SIP personnalisés (BYOC)", 
                    tooltip: "Connectez directement votre propre opérateur télécom." 
                },
                { 
                    text: "API REST complète & Webhooks", 
                    tooltip: "Intégration poussée avec votre logiciel métier propriétaire." 
                },
                { 
                    text: "Multi-utilisateurs & rôles d'équipe", 
                    tooltip: "Permissions granulaires et journal d'audit des actions." 
                },
                { 
                    text: "Account Manager & Onboarding dédié", 
                    tooltip: "Accompagnement personnalisé à la configuration des scénarios." 
                },
            ],
            btn: {
                text: "Contacter l'équipe",
                href: "/register",
            },
            highlighted: false,
        },
    ];

    return (
        <section id="tarifs" className="relative px-6 py-20 sm:py-28 bg-[#F8F9FA] text-neutral-900 border-y border-neutral-200/90 scroll-mt-20">
            {/* Halo lumineux d'arrière-plan subtil */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[1000px] rounded-full blur-[170px] opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                <PricingSection
                    plans={plans}
                    heading="Une formule adaptée à votre volume d'appels."
                    description="Créez votre compte sans carte bancaire et profitez de 100 minutes d'appels offertes. Vous choisissez ensuite votre formule, sans engagement."
                    theme="light"
                />

                {/* Micro-réassurance discrète (Directive Anti-Slop) */}
                <div className="mt-14 pt-8 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-neutral-600">
                    <div className="inline-flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-600" />
                        <span>Paiement sécurisé SSL 256-bit certifié PCI-DSS</span>
                    </div>

                    <div className="inline-flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>100 minutes offertes sans carte bancaire</span>
                    </div>

                    <div className="inline-flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-600" />
                        <span>Sans engagement, résiliation en 1 clic</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
