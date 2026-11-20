'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Activity,
    ArrowUpRight,
    BellRing,
    Bot,
    CalendarCheck2,
    CheckCircle2,
    GitBranch,
    Layers,
    Megaphone,
    PhoneForwarded,
    ShieldCheck,
    SlidersHorizontal,
    TrendingUp,
} from 'lucide-react';

const EXPLORER_ITEMS = [
    {
        id: 'scoring',
        title: 'Qualification & scoring IA en direct',
        desc: "Chaque appelant est analysé en temps réel selon vos critères métiers (budget, urgence, zone géographique) avant même la fin de l'appel.",
        metric: '94,2%',
        metricLabel: 'Précision de qualification',
    },
    {
        id: 'calendar',
        title: 'Prise de rendez-vous bidirectionnelle',
        desc: "AutoCall vérifie vos disponibilités Google Calendar, Outlook ou Calendly à la seconde près et bloque le créneau sans aucun doublon.",
        metric: '0',
        metricLabel: 'Conflit d’agenda',
    },
    {
        id: 'outbound',
        title: 'Campagnes sortantes & détection répondeur',
        desc: "Relancez vos devis en attente ou prospectez par lots CSV. L'agent détecte les boîtes vocales en moins de 2 secondes.",
        metric: '1 000+',
        metricLabel: 'Appels simultanés',
    },
    {
        id: 'compliance',
        title: 'Hébergement européen & conformité RGPD',
        desc: "Toutes les transcriptions et enregistrements audio sont chiffrés de bout en bout (SSL 256-bit) et hébergés en Union Européenne.",
        metric: '100%',
        metricLabel: 'Chiffrement UE',
    },
];

export default function CapabilitiesSection() {
    const [activeExplorer, setActiveExplorer] = useState('scoring');
    const currentExplorer = EXPLORER_ITEMS.find((i) => i.id === activeExplorer) || EXPLORER_ITEMS[0];

    return (
        <section id="fonctionnalites" className="bg-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-100 scroll-mt-20">
            <div className="mx-auto max-w-6xl">
                {/* En-tête centré ("Power up your calls") */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-hero-sans text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-950">
                        Propulsez votre accueil téléphonique
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Automatisez les appels entrants et sortants avec des agents vocaux intelligents, conçus pour qualifier chaque opportunité.
                    </p>
                </div>

                {/* 3 Cartes Bento principales */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Carte 1 : Qualification IA */}
                    <div className="rounded-2xl border border-neutral-200/90 bg-[#F8FAFC]/60 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-2xs">
                                <Bot className="h-4.5 w-4.5" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-neutral-950">
                                Qualification IA en direct
                            </h3>
                            <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                Notre IA pose les bonnes questions, détecte l&apos;intention et attribue un score de priorité à chaque appelant.
                            </p>
                        </div>

                        <div className="mt-6 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs space-y-3">
                            <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-3 text-xs text-neutral-700 leading-relaxed">
                                « Bonjour, je souhaite visiter le T3 avenue Foch. Notre accord bancaire est déjà validé. »
                            </div>
                            <div className="flex items-center justify-between text-xs pt-1">
                                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-md px-2 py-0.5">
                                    Prospect chaud · 96/100
                                </span>
                                <span className="font-mono text-neutral-400">0,38 s</span>
                            </div>
                        </div>
                    </div>

                    {/* Carte 2 : Agenda & Volume */}
                    <div className="rounded-2xl border border-neutral-200/90 bg-[#F8FAFC]/60 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-2xs">
                                <CalendarCheck2 className="h-4.5 w-4.5" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-neutral-950">
                                Prise de rendez-vous instantanée
                            </h3>
                            <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                Remplissez votre calendrier sans intervention humaine grâce à la synchronisation temps réel.
                            </p>
                        </div>

                        <div className="mt-6 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
                            <div className="flex items-baseline justify-between mb-3">
                                <div>
                                    <div className="text-[11px] text-neutral-500">RDV confirmés ce mois</div>
                                    <div className="text-xl font-bold text-neutral-950 font-mono tabular-nums">312</div>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600">+24%</span>
                            </div>
                            <div className="flex items-end justify-between gap-2 h-20 pt-2">
                                {[35, 55, 85, 65, 50, 75].map((h, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className={`w-full rounded-t-md ${
                                                idx === 2 ? 'bg-[#2563EB]' : 'bg-blue-100'
                                            }`}
                                            style={{ height: `${h}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Carte 3 : Automatisations post-appel */}
                    <div className="rounded-2xl border border-neutral-200/90 bg-[#F8FAFC]/60 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-2xs">
                                <Megaphone className="h-4.5 w-4.5" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-neutral-950">
                                Actions &amp; relances automatisées
                            </h3>
                            <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                Déclenchez vos SMS, messages WhatsApp et mises à jour CRM dès que l&apos;appel se termine.
                            </p>
                        </div>

                        <div className="mt-6 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs space-y-2.5">
                            {[
                                { label: 'Transcription HD enregistrée', status: 'Fait' },
                                { label: 'Créneau bloqué dans Google Calendar', status: 'Synchronisé' },
                                { label: 'Confirmation WhatsApp envoyée', status: 'Délivré' },
                                { label: 'Fiche contact créée dans HubSpot', status: 'À jour' },
                            ].map((step) => (
                                <div
                                    key={step.label}
                                    className="flex items-center justify-between gap-2 rounded-lg border border-neutral-100 bg-neutral-50/70 px-3 py-2 text-xs"
                                >
                                    <span className="flex items-center gap-2 text-neutral-800 font-medium truncate">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                        <span className="truncate">{step.label}</span>
                                    </span>
                                    <span className="text-[11px] font-medium text-neutral-500 shrink-0">
                                        {step.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bande 4 micro-fonctionnalités */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-neutral-200/80">
                    {[
                        {
                            icon: Layers,
                            title: 'Synchronisation CRM',
                            desc: 'Connectez HubSpot, Salesforce ou votre ERP sans écrire une ligne de code.',
                        },
                        {
                            icon: Activity,
                            title: 'Analytics équipe',
                            desc: 'Suivez les taux de décroché, la durée moyenne et les conversions en direct.',
                        },
                        {
                            icon: GitBranch,
                            title: 'Routage intelligent',
                            desc: 'Transférez les appels critiques vers le bon interlocuteur selon l’horaire.',
                        },
                        {
                            icon: BellRing,
                            title: 'Alertes prioritaires',
                            desc: 'Recevez un récapitulatif immédiat par SMS ou Slack sur les urgences.',
                        },
                    ].map((feat) => {
                        const Icon = feat.icon;
                        return (
                            <div key={feat.title} className="flex flex-col">
                                <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                                    <Icon className="h-4 w-4 text-[#2563EB]" />
                                    <span>{feat.title}</span>
                                </div>
                                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                                    {feat.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Explorer les fonctionnalités (Split List + Graphique) */}
                <div className="mt-20 pt-16 border-t border-neutral-200/80">
                    <div className="mx-auto max-w-2xl text-center">
                        <h3 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-neutral-950">
                            Explorez chaque module AutoCall
                        </h3>
                        <p className="mt-2.5 text-sm text-neutral-600">
                            Une architecture complète pour piloter votre téléphonie entrante et sortante depuis une interface unique.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Liste interactive gauche */}
                        <div className="lg:col-span-5 space-y-2">
                            {EXPLORER_ITEMS.map((item) => {
                                const isSelected = item.id === activeExplorer;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setActiveExplorer(item.id)}
                                        className={`w-full text-left rounded-xl p-4 transition-all border-l-2 cursor-pointer ${
                                            isSelected
                                                ? 'border-l-[#2563EB] bg-[#F8FAFC] border border-neutral-200/80 shadow-2xs'
                                                : 'border-l-transparent hover:bg-neutral-50'
                                        }`}
                                    >
                                        <div className={`text-sm font-bold ${isSelected ? 'text-neutral-950' : 'text-neutral-700'}`}>
                                            {item.title}
                                        </div>
                                        {isSelected && (
                                            <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Carte droite avec graphique SVG */}
                        <div className="lg:col-span-7 rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                                <div>
                                    <div className="text-xs font-medium text-neutral-500">{currentExplorer.metricLabel}</div>
                                    <div className="mt-0.5 flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-neutral-950 font-mono tabular-nums">
                                            {currentExplorer.metric}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                            Performance vérifiée
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                                >
                                    <span>Tester dans mon espace</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="mt-6 h-52 w-full">
                                <svg viewBox="0 0 500 170" className="h-full w-full overflow-visible" fill="none">
                                    <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                                    <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                                    <line x1="0" y1="130" x2="500" y2="130" stroke="#F1F5F9" strokeWidth="1" />

                                    <path
                                        d="M0 125 C60 115, 110 85, 170 92 C230 98, 280 55, 340 60 C400 64, 445 28, 500 22"
                                        stroke="#2563EB"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M0 140 C70 132, 130 115, 195 118 C255 120, 310 92, 375 96 C430 100, 465 72, 500 66"
                                        stroke="#93C5FD"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <circle cx="340" cy="60" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                                    <circle cx="500" cy="22" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                                </svg>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
                                <span className="inline-flex items-center gap-1.5">
                                    <PhoneForwarded className="h-3.5 w-3.5 text-[#2563EB]" />
                                    <span>Compatible renvoi d&apos;appel &amp; Trunks SIP</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>Hébergement sécurisé en France / UE</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
