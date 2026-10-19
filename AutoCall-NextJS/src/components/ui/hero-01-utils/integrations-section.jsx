'use client';

import { Trans } from 'react-i18next';
import React, { useState } from 'react';
import { 
    Layers, 
    ArrowRight, 
    CheckCircle2, 
    PhoneCall, 
    Sparkles, 
    RefreshCw, 
    ShieldCheck, 
    Zap,
    ExternalLink
} from 'lucide-react';

/* =========================================================================
   LOGOS VECTORIELS OFFICIELS DES INTÉGRATIONS (SVG PURS, ZÉRO PIXEL)
   ========================================================================= */

function GoogleCalendarLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="17" rx="3" fill="#FFFFFF" stroke="#4285F4" strokeWidth="1.5" />
            <path d="M3 8.5H21" stroke="#4285F4" strokeWidth="1.5" />
            <rect x="7" y="2" width="2" height="3.5" rx="1" fill="#EA4335" />
            <rect x="15" y="2" width="2" height="3.5" rx="1" fill="#EA4335" />
            <text x="12" y="16.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#1A73E8" fontFamily="sans-serif">31</text>
        </svg>
    );
}

function OutlookLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="13" height="16" rx="2" fill="#0078D4" />
            <circle cx="8.5" cy="12" r="3.2" fill="#FFFFFF" />
            <circle cx="8.5" cy="12" r="1.6" fill="#0078D4" />
            <path d="M12 7L21 4V20L12 17V7Z" fill="#28A8EA" opacity="0.9" />
        </svg>
    );
}

function CalendlyLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#006BFF" />
            <path d="M14.5 8.5C13.5 7.5 12 7 10.5 7.5C8.5 8.2 7 10.2 7.2 12.3C7.4 14.5 9.2 16.5 11.5 16.5C13.5 16.5 15.2 15 15.8 13.2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
    );
}

function HubSpotLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path d="M17.5 7.5V5.5C17.5 4.7 16.8 4 16 4C15.2 4 14.5 4.7 14.5 5.5V7.5C13.4 8.1 12.6 9.1 12.2 10.3H7.5V8.5C7.5 7.7 6.8 7 6 7C5.2 7 4.5 7.7 4.5 8.5V15.5C4.5 16.3 5.2 17 6 17C6.8 17 7.5 16.3 7.5 15.5V13.7H12.2C12.6 14.9 13.4 15.9 14.5 16.5V18.5C14.5 19.3 15.2 20 16 20C16.8 20 17.5 19.3 17.5 18.5V16.5C19.2 15.6 20.2 13.9 20.2 12C20.2 10.1 19.2 8.4 17.5 7.5ZM16 14C14.9 14 14 13.1 14 12C14 10.9 14.9 10 16 10C17.1 10 18 10.9 18 12C18 13.1 17.1 14 16 14Z" fill="#FF7A59" />
        </svg>
    );
}

function SalesforceLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path d="M10 5.5C11.2 4 13.2 3.5 14.9 4.2C16.5 4.8 17.5 6.3 17.7 8C19.2 8.3 20.4 9.6 20.5 11.2C20.6 12.8 19.6 14.3 18.1 14.8C18.2 15.2 18.1 15.6 17.9 16C17.2 17.2 15.9 18 14.5 18H8.5C6.6 18 5 16.4 5 14.5C5 13.1 5.8 11.8 7.1 11.2C6.9 10.5 7 9.7 7.4 9.1C8 8.1 9 7.5 10.1 7.5L10 5.5Z" fill="#00A1E0" />
            <text x="12.5" y="13.2" textAnchor="middle" fontSize="4.2" fontWeight="800" fill="#FFFFFF" fontFamily="sans-serif"><Trans i18nKey="nav.crm" /></text>
        </svg>
    );
}

function WhatsAppLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#25D366" />
            <path d="M17 14.8C16.7 15.6 15.7 16.2 14.8 16.3C14.2 16.4 13.4 16.4 11.1 15.4C8.2 14.2 6.3 11.2 6.1 11C6 10.8 4.9 9.3 4.9 7.8C4.9 6.3 5.7 5.5 6 5.2C6.3 4.9 6.6 4.8 7 4.8C7.1 4.8 7.3 4.8 7.4 4.8C7.8 4.8 8 5.4 8.2 5.9C8.4 6.4 8.8 7.4 8.9 7.5C9 7.7 9 7.9 8.9 8.1C8.8 8.2 8.7 8.4 8.5 8.6C8.4 8.7 8.2 8.9 8.1 9C8 9.1 7.8 9.3 8 9.6C8.2 9.9 8.8 10.9 9.7 11.7C10.8 12.7 11.7 13 12.1 13.2C12.3 13.3 12.6 13.3 12.8 13.1C13 12.9 13.3 12.5 13.6 12.1C13.8 11.8 14 11.8 14.3 11.9C14.6 12 16.2 12.8 16.5 13C16.8 13.1 17 13.2 17.1 13.4C17.2 13.7 17.2 14.2 17 14.8Z" fill="#FFFFFF" />
        </svg>
    );
}

function SlackLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path d="M6 10.5C6 11.3 5.3 12 4.5 12C3.7 12 3 11.3 3 10.5C3 9.7 3.7 9 4.5 9H6V10.5Z" fill="#E01E5A" />
            <path d="M7.5 10.5C7.5 9.7 8.2 9 9 9C9.8 9 10.5 9.7 10.5 10.5V15C10.5 15.8 9.8 16.5 9 16.5C8.2 16.5 7.5 15.8 7.5 15V10.5Z" fill="#E01E5A" />
            <path d="M10.5 6C9.7 6 9 5.3 9 4.5C9 3.7 9.7 3 10.5 3C11.3 3 12 3.7 12 4.5V6H10.5Z" fill="#36C5F0" />
            <path d="M10.5 7.5C11.3 7.5 12 8.2 12 9C12 9.8 11.3 10.5 10.5 10.5H6C5.2 10.5 4.5 9.8 4.5 9C4.5 8.2 5.2 7.5 6 7.5H10.5Z" fill="#36C5F0" />
            <path d="M18 13.5C18 12.7 18.7 12 19.5 12C20.3 12 21 12.7 21 13.5C21 14.3 20.3 15 19.5 15H18V13.5Z" fill="#2EB67D" />
            <path d="M16.5 13.5C16.5 14.3 15.8 15 15 15C14.2 15 13.5 14.3 13.5 13.5V9C13.5 8.2 14.2 7.5 15 7.5C15.8 7.5 16.5 8.2 16.5 9V13.5Z" fill="#2EB67D" />
            <path d="M13.5 18C14.3 18 15 18.7 15 19.5C15 20.3 14.3 21 13.5 21C12.7 21 12 20.3 12 19.5V18H13.5Z" fill="#ECB22E" />
            <path d="M13.5 16.5C12.7 16.5 12 15.8 12 15C12 14.2 12.7 13.5 13.5 13.5H18C18.8 13.5 19.5 14.2 19.5 15C19.5 15.8 18.8 16.5 18 16.5H13.5Z" fill="#ECB22E" />
        </svg>
    );
}

function TwilioLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#F22F46" strokeWidth="2.2" />
            <circle cx="8.5" cy="8.5" r="1.8" fill="#F22F46" />
            <circle cx="15.5" cy="8.5" r="1.8" fill="#F22F46" />
            <circle cx="8.5" cy="15.5" r="1.8" fill="#F22F46" />
            <circle cx="15.5" cy="15.5" r="1.8" fill="#F22F46" />
        </svg>
    );
}

function ZapierLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#FF4A00" />
            <path d="M12 5V19M5 12H19M7 7L17 17M17 7L7 17" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
    );
}

function MakeLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" fill="#6D28D9" />
            <path d="M7 16V8L12 12L17 8V16" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function StripeLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="#635BFF" />
            <path d="M13.8 9.6C13.8 8.9 13.2 8.5 12.1 8.5C10.7 8.5 9.4 9.1 8.5 9.7V7.1C9.6 6.6 11 6.3 12.3 6.3C14.9 6.3 16.7 7.6 16.7 9.8C16.7 13.3 11.9 12.7 11.9 14.4C11.9 15.3 12.7 15.8 13.8 15.8C15.3 15.8 16.8 15 17.7 14.3V17C16.5 17.6 15.1 18 13.6 18C10.9 18 9 16.7 9 14.3C9 10.7 13.8 11.4 13.8 9.6Z" fill="#FFFFFF" />
        </svg>
    );
}

function PipedriveLogo({ className = "h-7 w-7" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#000000" stroke="#04CC80" strokeWidth="2" />
            <circle cx="10" cy="10" r="3.5" fill="#04CC80" />
            <rect x="8.5" y="10" width="3" height="7" rx="1.5" fill="#04CC80" />
        </svg>
    );
}

export default function IntegrationsSection() {
    const categories = [
        { id: 'all', label: "Toutes" },
        { id: 'calendar', label: "Agendas & RDV" },
        { id: 'crm', label: "CRM & Vente" },
        { id: 'messaging', label: "Messages & Alertes" },
        { id: 'telephony', label: "Téléphonie & Flux" },
    ];

    const [activeCategory, setActiveCategory] = useState('all');

    const integrations = [
        {
            name: "Google Calendar",
            category: 'calendar',
            categoryLabel: "Agenda",
            logo: GoogleCalendarLogo,
            role: "Réservation en temps réel",
            description: "Bloque les créneaux libres en direct pendant la conversation téléphonique et évite les doublons.",
            syncTime: "Instantané"
        },
        {
            name: "Microsoft Outlook 365",
            category: 'calendar',
            categoryLabel: "Agenda",
            logo: OutlookLogo,
            role: "Synchronisation Exchange & 365",
            description: "Ajoute les réunions sur votre agenda d'entreprise et envoie une invitation automatique au client.",
            syncTime: "Instantané"
        },
        {
            name: "Calendly",
            category: 'calendar',
            categoryLabel: "Prise de RDV",
            logo: CalendlyLogo,
            role: "Gestion des créneaux & types d'événements",
            description: "Respecte vos plages de consultation, vos temps de battement et vos formulaires de qualification.",
            syncTime: "Temps réel"
        },
        {
            name: "HubSpot",
            category: 'crm',
            categoryLabel: "CRM",
            logo: HubSpotLogo,
            role: "Création automatique de contacts",
            description: "Crée la fiche prospect, attache la transcription de l'appel et ouvre une opportunité dans le pipeline.",
            syncTime: "Temps réel"
        },
        {
            name: "Salesforce",
            category: 'crm',
            categoryLabel: "CRM",
            logo: SalesforceLogo,
            role: "Enrichissement des comptes & leads",
            description: "Synchronise les données de qualification de chaque appel directement dans vos objets standards ou sur mesure.",
            syncTime: "Temps réel"
        },
        {
            name: "Pipedrive",
            category: 'crm',
            categoryLabel: "CRM",
            logo: PipedriveLogo,
            role: "Pipeline commercial automatisé",
            description: "Génère un nouveau deal qualifié et assigne la tâche de rappel au commercial responsable.",
            syncTime: "Instantané"
        },
        {
            name: "WhatsApp Business",
            category: 'messaging',
            categoryLabel: "Messagerie",
            logo: WhatsAppLogo,
            role: "Envoi de récapitulatif & devis",
            description: "Transmet au client un récapitulatif de l'échange ou un lien utile directement sur son WhatsApp.",
            syncTime: "1 seconde"
        },
        {
            name: "Slack",
            category: 'messaging',
            categoryLabel: "Collaboration",
            logo: SlackLogo,
            role: "Notifications d'appels dans vos canaux",
            description: "Poste une alerte propre dans #urgences ou #leads avec le résumé, l'urgence et le numéro de rappel.",
            syncTime: "Instantané"
        },
        {
            name: "Twilio",
            category: 'telephony',
            categoryLabel: "Téléphonie",
            logo: TwilioLogo,
            role: "Numéros locaux & routage voix",
            description: "Fournit des numéros géographiques (+33 1, +33 4...) ou prend en charge le renvoi de votre ligne fixe/mobile.",
            syncTime: "Haute fiabilité"
        },
        {
            name: "Zapier",
            category: 'telephony',
            categoryLabel: "Automatisation",
            logo: ZapierLogo,
            role: "Connexion à +5 000 applications",
            description: "Déclenche vos flux de travail personnalisés vers n'importe quel logiciel métier dès qu'un appel se termine.",
            syncTime: "Automatique"
        },
        {
            name: "Make (Integromat)",
            category: 'telephony',
            categoryLabel: "Automatisation",
            logo: MakeLogo,
            role: "Scénarios avancés multi-étapes",
            description: "Exécute des automatisations complexes, génération de PDF, alertes multi-canaux et webhooks.",
            syncTime: "Automatique"
        },
        {
            name: "Stripe",
            category: 'crm',
            categoryLabel: "Paiement",
            logo: StripeLogo,
            role: "Envoi de liens de paiement sécurisés",
            description: "Génère et transmet par SMS un lien de règlement ou d'acompte avant confirmation de prestation.",
            syncTime: "Certifié PCI"
        }
    ];

    const filteredIntegrations = activeCategory === 'all'
        ? integrations
        : integrations.filter(item => item.category === activeCategory);

    return (
        <section id="integrations" className="relative px-6 py-20 sm:py-28 bg-[#090A0F] text-white border-y border-white/[0.08] scroll-mt-20">
            {/* Lueur de fond diffuse */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[950px] rounded-full blur-[160px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                
                {/* 1. ENTÊTE SIMPLE & PERCUTANT */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md mb-4 shadow-xs">
                        <Layers className="h-3.5 w-3.5 text-white/60" />
                        <span>Intégrations & Écosystème</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.18]">
                        Connecté à vos outils quotidiens.{' '}
                        <span className="font-hero-serif italic text-white/95">
                            Sans changer vos habitudes.
                        </span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
                        AutoCall s&apos;insère dans votre infrastructure existante en moins de 3 minutes. Vos agendas, CRM et messageries sont alimentés automatiquement après chaque appel.
                    </p>
                </div>

                {/* 2. LE FLUX EN 3 ÉTAPES LIMPIDES (SIMPLE À COMPRENDRE) */}
                <div className="mb-16 rounded-3xl border border-white/10 bg-[#0E1015]/80 p-6 sm:p-8 backdrop-blur-2xl">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-6 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-white/80" />
                        <span>Comment ça fonctionne en direct :</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {/* Étape 1 */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 relative">
                            <div className="flex items-center justify-between mb-4">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white text-xs font-bold font-mono">
                                    01
                                </span>
                                <span className="text-[11px] font-mono text-white/40">Renvoi d&apos;appel</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2 text-white font-semibold text-sm sm:text-base">
                                <PhoneCall className="h-4 w-4 text-sky-400" />
                                <h3>Un client vous appelle</h3>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed">
                                Votre opérateur actuel (Orange, SFR, Free, VoIP) transfère la sonnerie vers AutoCall sans aucun matériel à installer.
                            </p>
                        </div>

                        {/* Étape 2 */}
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 relative">
                            <div className="flex items-center justify-between mb-4">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                                    02
                                </span>
                                <span className="text-[11px] font-mono text-emerald-400">Voix & Synthèse</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2 text-white font-semibold text-sm sm:text-base">
                                <Sparkles className="h-4 w-4 text-emerald-400" />
                                <h3>L&apos;IA dialogue & qualifie</h3>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">
                                L&apos;assistant répond avec une voix naturelle, comprend la demande, consulte vos disponibilités et recueille les détails clés.
                            </p>
                        </div>

                        {/* Étape 3 */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 relative">
                            <div className="flex items-center justify-between mb-4">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white text-xs font-bold font-mono">
                                    03
                                </span>
                                <span className="text-[11px] font-mono text-white/40">Synchronisation</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2 text-white font-semibold text-sm sm:text-base">
                                <RefreshCw className="h-4 w-4 text-blue-400" />
                                <h3>Vos logiciels s&apos;actualisent</h3>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed">
                                Le créneau est bloqué dans votre agenda, le contact est créé dans votre CRM et un SMS de confirmation est envoyé au client.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. FILTRES PAR CATÉGORIE */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    {categories.map((cat) => {
                        const isSelected = cat.id === activeCategory;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`rounded-xl px-4 py-2 text-xs font-medium transition-all duration-150 cursor-pointer ${
                                    isSelected
                                        ? 'bg-white text-black font-semibold shadow-md'
                                        : 'bg-white/[0.03] border border-white/10 text-white/70 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* 4. GRILLE DES CARTES D'INTÉGRATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIntegrations.map((item, idx) => {
                        const LogoComponent = item.logo;
                        return (
                            <div
                                key={idx}
                                className="group rounded-2xl border border-white/10 bg-[#0E1015]/90 p-5 backdrop-blur-xl transition-all duration-200 hover:border-white/20 hover:bg-[#12151D]"
                            >
                                <div className="flex items-start justify-between mb-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 transition-transform group-hover:scale-105">
                                            <LogoComponent className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                                                {item.name}
                                            </h4>
                                            <span className="text-[11px] text-white/40 font-mono">
                                                {item.categoryLabel}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                        {item.syncTime}
                                    </span>
                                </div>

                                <div className="text-xs font-medium text-white/80 mb-1">
                                    {item.role}
                                </div>

                                <p className="text-xs text-white/55 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* 5. RÉASSURANCE SANS CODE & WEBHOOKS */}
                <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs sm:text-sm font-semibold text-white">
                                Vous utilisez un outil métier spécifique ou un CRM interne ?
                            </div>
                            <div className="text-xs text-white/60">
                                AutoCall propose une API REST documentée et des Webhooks sécurisés pour connecter n&apos;importe quelle base de données en toute autonomie.
                            </div>
                        </div>
                    </div>

                    <a
                        href="/register"
                        className="shrink-0 inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-xs font-semibold text-white transition-all hover:bg-white hover:text-black cursor-pointer"
                    >
                        <span>Voir la documentation API</span>
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </div>

            </div>
        </section>
    );
}
