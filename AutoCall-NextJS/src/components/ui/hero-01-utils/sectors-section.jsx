'use client';

import React from 'react';
import Link from 'next/link';
import {
    Building2,
    Scale,
    Stethoscope,
    Wrench,
    Clock,
    ShieldCheck,
    MessageSquare,
    TrendingUp,
    Quote,
} from 'lucide-react';

const SECTOR_CARDS = [
    {
        icon: Building2,
        title: 'Agences Immobilières',
        desc: 'Qualifiez le budget et le financement des acquéreurs et bloquez les visites dans l’agenda.',
    },
    {
        icon: Scale,
        title: "Cabinets d'Avocats",
        desc: 'Filtrez les urgences pénales 24h/24 et collectez les coordonnées sans interrompre vos audiences.',
    },
    {
        icon: Stethoscope,
        title: 'Santé & Cliniques',
        desc: 'Allégez votre secrétariat médical grâce à la gestion automatique des reports et confirmations.',
    },
    {
        icon: Wrench,
        title: 'Artisans & Dépannage',
        desc: 'Ne perdez plus de chantiers sur le terrain : l’IA qualifie l’adresse et planifie l’intervention.',
    },
    {
        icon: Clock,
        title: 'Réponse dès la 1ère sonnerie',
        desc: 'Zéro attente pour vos clients, de jour comme de nuit, week-ends et jours fériés inclus.',
    },
    {
        icon: MessageSquare,
        title: 'Relances WhatsApp & SMS',
        desc: 'Confirmez chaque rendez-vous automatiquement sur le mobile du client après l’appel.',
    },
    {
        icon: TrendingUp,
        title: 'Prospection sortante',
        desc: 'Relancez vos devis en attente et vos prospects dormants par campagnes automatisées.',
    },
    {
        icon: ShieldCheck,
        title: 'Filtrage anti-spam 100%',
        desc: 'Bloquez les démarchages indésirables avant même qu’ils n’atteignent votre ligne directe.',
    },
];

export default function SectorsSection() {
    return (
        <section id="secteurs" className="bg-white text-neutral-900 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-100 scroll-mt-20">
            <div className="mx-auto max-w-6xl">
                {/* En-tête gauche + CTA ("Elevate your revenue") */}
                <div className="max-w-xl">
                    <h2 className="font-hero-sans text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-950">
                        Augmentez votre chiffre d&apos;affaires
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Chaque appel manqué est une opportunité perdue. AutoCall s&apos;adapte à votre métier pour transformer chaque sonnerie en rendez-vous confirmé.
                    </p>
                    <div className="mt-5">
                        <Link
                            href="/register"
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1D4ED8]"
                        >
                            Commencer gratuitement
                        </Link>
                    </div>
                </div>

                {/* Grille 4x2 épurée */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SECTOR_CARDS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="rounded-xl border border-neutral-200/90 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-xs"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                                    <Icon className="h-4.5 w-4.5" />
                                </div>
                                <h3 className="mt-4 text-sm font-bold text-neutral-950">{item.title}</h3>
                                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Témoignages ("Trusted by teams") */}
                <div className="mt-20 pt-16 border-t border-neutral-200/80">
                    <div className="text-center max-w-xl mx-auto">
                        <h3 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-neutral-950">
                            Approuvé par les équipes sur le terrain
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600">
                            Des cabinets, agences et PME qui ne manquent plus aucun appel stratégique.
                        </p>
                    </div>

                    {/* Citation vedette */}
                    <div className="mt-10 mx-auto max-w-3xl rounded-2xl border border-neutral-200/90 bg-[#F8FAFC]/70 p-8 text-center">
                        <Quote className="h-6 w-6 text-[#2563EB] mx-auto mb-4" />
                        <p className="text-base sm:text-lg font-medium text-neutral-900 leading-relaxed">
                            « AutoCall a transformé la gestion de nos appels entrants. Nos négociateurs récupèrent en moyenne 14 visites qualifiées par semaine qui partaient auparavant chez la concurrence. »
                        </p>
                        <div className="mt-5">
                            <div className="text-sm font-bold text-neutral-950">Sophie Delacroix</div>
                            <div className="text-xs text-neutral-500">Directrice d&apos;agence · Groupe Foch Immobilier</div>
                        </div>
                    </div>

                    {/* 3 témoignages en grille */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            {
                                company: 'Cabinet Mercier & Associés',
                                quote: '« Les urgences pénales sont détectées et transférées en moins de 30 secondes, même la nuit. Un gain de sérénité immense. »',
                                author: 'Me Julien Mercier',
                                role: 'Avocat associé',
                            },
                            {
                                company: 'Clinique Saint-Honoré',
                                quote: '« Notre secrétariat a réduit de 65% le volume d’appels répétitifs pour les reports de rendez-vous. Les patients adorent la réactivité. »',
                                author: 'Dr Claire Moreau',
                                role: 'Responsable médicale',
                            },
                            {
                                company: 'Thermic & Habitat Services',
                                quote: '« En intervention sur chantier, je reçois directement le récapitulatif par SMS avec l’adresse et le motif. Zéro devis perdu. »',
                                author: 'Marc Lefèvre',
                                role: 'Gérant',
                            },
                        ].map((t) => (
                            <div
                                key={t.company}
                                className="rounded-2xl border border-neutral-200/90 bg-white p-6 flex flex-col justify-between shadow-2xs"
                            >
                                <div>
                                    <div className="text-xs font-bold text-[#2563EB]">{t.company}</div>
                                    <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{t.quote}</p>
                                </div>
                                <div className="mt-5 pt-4 border-t border-neutral-100">
                                    <div className="text-xs font-bold text-neutral-950">{t.author}</div>
                                    <div className="text-xs text-neutral-500">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
