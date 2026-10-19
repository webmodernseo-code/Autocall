'use client';

import translationI18n from '@/i18n';
import { Trans } from 'react-i18next';
import React, { useState } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Bot,
    PhoneCall,
    Terminal,
    Code2,
    Shield,
    Webhook,
    Search,
    ChevronRight,
    Copy,
    Check,
    ArrowLeft,
    Sparkles,
    Radio,
    FileText,
    ExternalLink,
    HelpCircle,
    Zap,
    Cpu,
    ArrowUpRight
} from 'lucide-react';

const DOCS_NAV = [
    {
        category: "Prise en main",
        items: [
            { id: "intro", title: "Introduction à AutoCall", icon: Sparkles },
            { id: "quickstart", title: "Démarrage rapide (3 min)", icon: Zap },
            { id: "architecture", title: "Architecture & Sécurité", icon: Shield },
        ]
    },
    {
        category: "Agents Vocaux IA",
        items: [
            { id: "agents-creation", title: "Création d'un agent vocal", icon: Bot },
            { id: "prompts-voices", title: "Prompts & Voix ElevenLabs", icon: Cpu },
            { id: "call-transfers", title: "Transferts d'appels & Détection", icon: PhoneCall },
        ]
    },
    {
        category: "Téléphonie & Réseau",
        items: [
            { id: "sip-trunking", title: "SIP Trunking & Opérateurs", icon: Radio },
            { id: "numbers", title: "Gestion des numéros & Pool", icon: PhoneCall },
            { id: "webhooks", title: "Webhooks en temps réel", icon: Webhook },
        ]
    },
    {
        category: "Développeurs & API",
        items: [
            { id: "api-auth", title: "Authentification API", icon: Code2 },
            { id: "api-calls", title: "Endpoints Appels (/v1/calls)", icon: Terminal },
            { id: "api-agents", title: "Endpoints Agents (/v1/agents)", icon: FileText },
        ]
    }
];

export default function DocsView() {
    const [activeSection, setActiveSection] = useState('intro');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedSnippet, setCopiedSnippet] = useState(null);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedSnippet(id);
        setTimeout(() => setCopiedSnippet(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#08090C] text-neutral-100 selection:bg-sky-500/30 selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#08090C]/85 backdrop-blur-xl px-4 sm:px-8 py-3.5">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img
                                src="/images/autocall-logo.png"
                                alt={translationI18n.t('app.name')}
                                className="h-[20px] w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                            />
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-neutral-400">
                            <span>Docs v1.0</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/status"
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/15 transition-colors"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Statut des services</span>
                        </Link>
                        <Link
                            href="/login"
                            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Connexion
                        </Link>
                        <Link
                            href="/app"
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-xs font-bold text-neutral-950 hover:bg-neutral-200 transition-all shadow-sm"
                        >
                            <span><Trans i18nKey="nav.dashboard" /></span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar Navigation */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans la documentation..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-all"
                                />
                            </div>

                            {/* Nav Groups */}
                            <nav className="space-y-6">
                                {DOCS_NAV.map((group, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <h3 className="text-xs font-semibold normal-case tracking-wider text-neutral-400 font-mono">
                                            {group.category}
                                        </h3>
                                        <ul className="space-y-1">
                                            {group.items
                                                .filter(item => !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((item) => {
                                                    const Icon = item.icon;
                                                    const isActive = activeSection === item.id;
                                                    return (
                                                        <li key={item.id}>
                                                            <button
                                                                onClick={() => setActiveSection(item.id)}
                                                                className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-all cursor-pointer ${
                                                                    isActive
                                                                        ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20'
                                                                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                                                }`}
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    <Icon className="h-3.5 w-3.5 shrink-0" />
                                                                    <span>{item.title}</span>
                                                                </span>
                                                                {isActive && <ChevronRight className="h-3 w-3" />}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Right Content Area */}
                    <main className="lg:col-span-9 space-y-10">
                        {/* Section 1 : Introduction */}
                        {activeSection === 'intro' && (
                            <section className="space-y-6">
                                <div className="space-y-2 border-b border-white/10 pb-6">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span>Guide Officiel AutoCall</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                                        Documentation & Centre d&apos;aide
                                    </h1>
                                    <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-3xl">
                                        AutoCall est une plateforme d&apos;agents vocaux intelligents conçue pour automatiser le standard téléphonique, la qualification de prospects et la prise de rendez-vous avec un niveau de fluidité naturelle sans précédent.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2 hover:border-white/20 transition-all">
                                        <div className="h-9 w-9 rounded-xl border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-400">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-bold text-sm text-white">Mise en service en 3 min</h3>
                                        <p className="text-xs text-neutral-400 leading-relaxed">
                                            Connectez vos numéros ou utilisez notre passerelle SIP pour recevoir et émettre des appels instantanément.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2 hover:border-white/20 transition-all">
                                        <div className="h-9 w-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-bold text-sm text-white">Modèles Vocaux Réactifs</h3>
                                        <p className="text-xs text-neutral-400 leading-relaxed">
                                            Latence inférieure à 350ms, gestion des interruptions et voix ultra-naturelles en français et multilingue.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2 hover:border-white/20 transition-all">
                                        <div className="h-9 w-9 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-bold text-sm text-white">Sécurité & RGPD</h3>
                                        <p className="text-xs text-neutral-400 leading-relaxed">
                                            Hébergement des données en France/UE, chiffrement AES-256 et conformité stricte aux directives CNIL.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Section 2 : Démarrage Rapide */}
                        {(activeSection === 'quickstart' || activeSection === 'intro') && (
                            <section className="space-y-6 pt-6 border-t border-white/10">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-amber-400" />
                                        <span>Démarrage rapide en 3 étapes</span>
                                    </h2>
                                    <p className="text-xs sm:text-sm text-neutral-400">
                                        Suivez ces instructions pour lancer votre premier agent vocal opérationnel.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                                        <div className="flex items-center gap-2 font-bold text-sm text-white">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 text-xs font-mono">1</span>
                                            <span>Créer votre compte et configurer votre entreprise</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 pl-8">
                                            Rendez-vous sur <Link href="/register" className="text-sky-400 hover:underline">/register</Link> pour activer vos 100 minutes d&apos;appels offertes. Renseignez le nom de votre société et vos horaires de standard.
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                                        <div className="flex items-center gap-2 font-bold text-sm text-white">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 text-xs font-mono">2</span>
                                            <span>Définir le prompt et la voix de l&apos;agent</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 pl-8">
                                            Dans votre tableau de bord <Link href="/app/agents" className="text-sky-400 hover:underline">/app/agents</Link>, choisissez parmi les modèles pré-configurés (Immobilier, Médical, Juridique, Support) ou écrivez vos consignes personnalisées.
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                                        <div className="flex items-center gap-2 font-bold text-sm text-white">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 text-xs font-mono">3</span>
                                            <span>Connecter votre ligne téléphonique</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 pl-8">
                                            Transférez simplement vos appels entrants vers le numéro attribué par AutoCall ou intégrez votre Trunk SIP existant en 1 clic.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Section 3 : API & Endpoints Développeurs */}
                        {(activeSection === 'api-calls' || activeSection === 'api-auth' || activeSection === 'intro') && (
                            <section className="space-y-6 pt-6 border-t border-white/10">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs text-sky-400 font-mono">
                                        <Terminal className="h-3 w-3" />
                                        <span>API REST v1</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Déclencher un appel via l&apos;API
                                    </h2>
                                    <p className="text-xs sm:text-sm text-neutral-400">
                                        Intégrez les appels automatisés directement dans vos CRM, formulaires ou pipelines d&apos;automatisation (Zapier / Make / n8n).
                                    </p>
                                </div>

                                {/* Code Snippet cURL */}
                                <div className="rounded-2xl border border-white/10 bg-[#0B0D13] overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
                                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                                            <span>POST https://api.getautocall.fr/api/v1/calls</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(`curl -X POST https://api.getautocall.fr/api/v1/calls \\\n  -H "Authorization: Bearer VOTRE_CLE_API" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "agent_id": "ag_94ec6e9e",\n    "phone_number": "+33612345678",\n    "first_name": "Thomas",\n    "variables": {\n      "lead_source": "site_web",\n      "property_id": "villa_paris_16"\n    }\n  }'`, 'curl')}
                                            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                        >
                                            {copiedSnippet === 'curl' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                            <span>{copiedSnippet === 'curl' ? 'Copié !' : 'Copier'}</span>
                                        </button>
                                    </div>
                                    <pre className="p-4 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.getautocall.fr/api/v1/calls \\
  -H "Authorization: Bearer VOTRE_CLE_API" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "ag_94ec6e9e",
    "phone_number": "+33612345678",
    "first_name": "Thomas",
    "variables": {
      "lead_source": "site_web",
      "property_id": "villa_paris_16"
    }
  }'`}
                                    </pre>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
