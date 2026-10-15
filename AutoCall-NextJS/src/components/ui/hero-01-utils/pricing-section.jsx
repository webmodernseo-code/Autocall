'use client';

import React from 'react';
import { PricingSection } from '@/components/ui/pricing';
import { Lock, ShieldCheck, Zap } from 'lucide-react';

export default function PricingWrapperSection() {
    const plans = [
        {
            id: 'decouverte',
            name: "Découverte",
            info: "Testez la voix IA en direct sans carte bancaire.",
            price: {
                monthly: 0,
                yearly: 0,
            },
            features: [
                { 
                    text: "10 minutes d'appels offertes (One-shot)", 
                    tooltip: "Crédit d'essai immédiat pour tester l'agent en conditions réelles." 
                },
                { 
                    text: "1 agent vocal IA personnalisable", 
                    tooltip: "Définissez le rôle, les consignes et la voix de votre assistant." 
                },
                { 
                    text: "Simulateur vocal web interactif", 
                    tooltip: "Parlez en direct avec l'agent depuis votre micro de navigateur." 
                },
                { 
                    text: "Test d'appel direct sur votre mobile", 
                    tooltip: "Faites sonner votre smartphone pour évaluer la réactivité vocale." 
                },
                { 
                    text: "Transcriptions & récapitulatifs", 
                    tooltip: "Accès à l'historique complet et à l'audio de vos tests." 
                },
                { 
                    text: "Sans carte bancaire requise", 
                    tooltip: "Inscription instantanée en 1 clic avec Google ou email." 
                },
            ],
            btn: {
                text: "Tester gratuitement",
                href: "/register",
            },
            highlighted: false,
        },
        {
            id: 'starter',
            name: "Starter",
            info: "Idéal pour indépendants, artisans & praticiens solos.",
            price: {
                monthly: 39,
                yearly: 32,
            },
            features: [
                { 
                    text: "1 agent vocal IA dédié 24h/24", 
                    tooltip: "Agent configuré avec votre personnalité et vos consignes spécifiques." 
                },
                { 
                    text: "80 minutes d'appels / mois (~50-60 appels)", 
                    tooltip: "Décompte à la seconde, idéal pour ne plus jamais manquer un appel." 
                },
                { 
                    text: "1 numéro français (+33 9) dédié inclus", 
                    tooltip: "Numéro national propre inclus sans frais supplémentaires." 
                },
                { 
                    text: "Renvoi d'appel mobile/fixe vers l'IA", 
                    tooltip: "Faites basculer vos appels quand vous êtes occupé ou sur un chantier." 
                },
                { 
                    text: "Alertes immédiates par Email & SMS", 
                    tooltip: "Recevez immédiatement un récapitulatif par SMS après chaque appel client." 
                },
                { 
                    text: "Filtrage 100% des spams téléphoniques", 
                    tooltip: "Bloque les démarchages indésirables sans vous déranger." 
                },
            ],
            btn: {
                text: "Choisir Starter",
                href: "/register",
            },
            highlighted: false,
        },
        {
            id: 'growth',
            name: "Pro",
            info: "Pour cabinets, PME, commerces & agences.",
            badge: "Recommandé",
            price: {
                monthly: 89,
                yearly: 74,
            },
            features: [
                { 
                    text: "3 agents IA configurables (Accueil, SAV, RDV)", 
                    tooltip: "Scénarios distincts selon le besoin de votre appelant." 
                },
                { 
                    text: "250 minutes d'appels / mois (~180 appels)", 
                    tooltip: "Idéal pour absorber de 8 à 15 appels quotidiens sans attente." 
                },
                { 
                    text: "2 numéros français dédiés inclus", 
                    tooltip: "Lignes distinctes pour vos différents services." 
                },
                { 
                    text: "Agent autonome WhatsApp & Relances post-appel", 
                    tooltip: "L'IA échange automatiquement avec vos clients sur WhatsApp avec votre numéro pro et confirme les rendez-vous." 
                },
                { 
                    text: "Prise de rendez-vous automatique", 
                    tooltip: "Réservation directe synchronisée dans votre calendrier." 
                },
                { 
                    text: "Campagnes d'appels sortants automatiques", 
                    tooltip: "Relances de devis et confirmations de RDV par fichier de contacts." 
                },
                { 
                    text: "Scénarios & Automatisations (Flows)", 
                    tooltip: "Arbre de décision intelligent selon les réponses des clients." 
                },
                { 
                    text: "Support prioritaire 7j/7", 
                    tooltip: "Assistance dédiée avec temps de réponse garanti < 2h." 
                },
            ],
            btn: {
                text: "Choisir Pro",
                href: "/register",
            },
            highlighted: true,
        },
        {
            id: 'scale',
            name: "Agency / Scale",
            info: "Pour agences, réseaux d'entreprises & centres d'appels.",
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
                    text: "750 minutes d'appels / mois (~500 appels)", 
                    tooltip: "Volume haute cadence pour les standards très sollicités." 
                },
                { 
                    text: "5 numéros français dédiés inclus", 
                    tooltip: "Numéros supplémentaires configurables à volonté." 
                },
                { 
                    text: "Multi-comptes WhatsApp & API illimitée", 
                    tooltip: "Connectez plusieurs lignes WhatsApp et intégrez vos CRM propriétaires." 
                },
                { 
                    text: "Marque blanche totale (White-Label)", 
                    tooltip: "Votre propre logo, domaine et couleurs pour vos clients." 
                },
                { 
                    text: "Gestion multi-comptes clients (Sub-accounts)", 
                    tooltip: "Espaces cloisonnés pour gérer plusieurs entreprises clientes." 
                },
                { 
                    text: "Trunks SIP personnalisés & Lignes VoIP", 
                    tooltip: "Connectez directement votre propre opérateur télécom d'entreprise." 
                },
                { 
                    text: "Account Manager & Onboarding dédié", 
                    tooltip: "Accompagnement personnalisé à la configuration des scénarios." 
                },
            ],
            btn: {
                text: "Choisir l'Agence",
                href: "/register",
            },
            highlighted: false,
        },
    ];

    return (
        <section id="tarifs" className="relative px-4 sm:px-6 py-20 sm:py-28 bg-[#F8F9FA] text-neutral-900 border-y border-neutral-200/90 scroll-mt-20">
            {/* Halo lumineux d'arrière-plan subtil */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[1100px] rounded-full blur-[170px] opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl">
                <PricingSection
                    plans={plans}
                    heading="Une formule adaptée à votre volume d'appels."
                    description="Créez votre compte sans carte bancaire et commencez à tester votre agent vocal immédiatement. Choisissez ensuite votre formule, sans engagement."
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
                        <span>Essai offert sans carte bancaire</span>
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
