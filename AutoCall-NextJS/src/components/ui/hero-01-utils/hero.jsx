'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    BarChart3,
    Bell,
    Bot,
    Calendar,
    LayoutGrid,
    Megaphone,
    PhoneCall,
    Search,
    Send,
    Settings,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

export default function HeroSection({ avatarList = [] }) {
    const [activeNav, setActiveNav] = useState('Vue d’ensemble');
    const [promptInput, setPromptInput] = useState('');

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-white pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-100">
            {/* Grille architecturale très subtile */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-60"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, rgba(226,232,240,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(226,232,240,0.45) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    maskImage: 'radial-gradient(ellipse 80% 70% at 50% 25%, black 30%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 25%, black 30%, transparent 100%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl text-center">
                {/* Pilule d'annonce supérieure */}
                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white px-4 py-1.5 text-xs font-medium text-neutral-600 shadow-2xs transition-colors hover:border-neutral-300 hover:text-neutral-900"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                    <span>Standard téléphonique IA · Réponse 24h/24 et prise de RDV</span>
                    <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                </Link>

                {/* Titre principal centré */}
                <h1 className="mx-auto mt-6 max-w-3xl font-hero-sans text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.035em] text-neutral-950 leading-[1.08]">
                    La gestion d&apos;appels IA pour les{' '}
                    <span className="text-[#2563EB]">équipes modernes.</span>
                </h1>

                {/* Sous-titre */}
                <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-600">
                    AutoCall répond dès la première sonnerie avec une voix naturelle, qualifie vos prospects, réserve vos rendez-vous et synchronise chaque échange dans votre CRM.
                </p>

                {/* Boutons CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                        href="#demo"
                        className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 shadow-2xs transition-colors hover:bg-neutral-50 hover:border-neutral-300 cursor-pointer"
                    >
                        <span>Écouter une démo</span>
                    </a>

                    <Link
                        href="/register"
                        className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1D4ED8] active:scale-[0.98] cursor-pointer"
                    >
                        <span>Essai gratuit — 10 min offertes</span>
                    </Link>
                </div>

                {/* Aperçu Dashboard Produit (style Flow AI / Stripe) */}
                <div className="relative mx-auto mt-12 max-w-5xl text-left">
                    <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-[0_24px_60px_-15px_rgba(15,23,42,0.12)] overflow-hidden">
                        {/* Barre fenêtre / top bar */}
                        <div className="flex items-center justify-between gap-4 border-b border-neutral-200/80 bg-[#F8FAFC] px-4 sm:px-6 py-3">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/images/autocall-logo-dark.png"
                                    alt="AutoCall"
                                    className="h-4 w-auto object-contain"
                                />
                            </div>

                            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-400 w-64">
                                <Search className="h-3.5 w-3.5" />
                                <span>Rechercher un appel, un contact...</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Agent actif
                                </span>
                                <Bell className="h-4 w-4 text-neutral-400" />
                                <div className="flex items-center gap-2">
                                    {avatarList[0]?.image ? (
                                        <img
                                            src={avatarList[0].image}
                                            alt="Profil"
                                            className="h-6 w-6 rounded-full object-cover border border-neutral-200"
                                        />
                                    ) : (
                                        <span className="h-6 w-6 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-xs font-bold">
                                            AC
                                        </span>
                                    )}
                                    <span className="hidden md:inline text-xs font-medium text-neutral-700">
                                        Camille Martin
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Corps du Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-12">
                            {/* Sidebar */}
                            <aside className="hidden md:flex md:col-span-3 flex-col justify-between border-r border-neutral-200/80 bg-[#F8FAFC]/60 p-4">
                                <div className="space-y-1">
                                    {[
                                        { label: 'Vue d’ensemble', icon: LayoutGrid },
                                        { label: 'Appels entrants', icon: PhoneCall, badge: '12' },
                                        { label: 'Agents IA', icon: Bot },
                                        { label: 'Campagnes', icon: Megaphone },
                                        { label: 'Agenda RDV', icon: Calendar },
                                        { label: 'Analytics', icon: BarChart3 },
                                        { label: 'Paramètres', icon: Settings },
                                    ].map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeNav === item.label;
                                        return (
                                            <button
                                                key={item.label}
                                                type="button"
                                                onClick={() => setActiveNav(item.label)}
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                                                    isActive
                                                        ? 'bg-white text-neutral-950 shadow-2xs border border-neutral-200/80 font-semibold'
                                                        : 'text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#2563EB]' : 'text-neutral-400'}`} />
                                                    {item.label}
                                                </span>
                                                {item.badge && (
                                                    <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#2563EB]">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 rounded-xl border border-neutral-200/80 bg-white p-3">
                                    <div className="text-xs font-semibold text-neutral-900">Ligne +33 1 86 95 ** **</div>
                                    <div className="mt-1 text-[11px] text-neutral-500">Renvoi actif · Latence 390 ms</div>
                                </div>
                            </aside>

                            {/* Zone principale KPIs + Graphiques */}
                            <div className="md:col-span-9 p-4 sm:p-6 bg-white">
                                {/* 4 KPIs */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                    {[
                                        { label: 'Appels traités', value: '1 428', delta: '+18%', up: true },
                                        { label: 'RDV réservés', value: '312', delta: '+24%', up: true },
                                        { label: 'Qualification', value: '94,2%', delta: '+6,4%', up: true },
                                        { label: 'Temps de réponse', value: '0,4 s', delta: '24h/24', up: true },
                                    ].map((kpi) => (
                                        <div
                                            key={kpi.label}
                                            className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC]/50 p-3.5"
                                        >
                                            <div className="text-xs text-neutral-500 font-medium">{kpi.label}</div>
                                            <div className="mt-1.5 flex items-baseline justify-between gap-2">
                                                <span className="text-xl sm:text-2xl font-bold text-neutral-950 font-mono tabular-nums">
                                                    {kpi.value}
                                                </span>
                                                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
                                                    <TrendingUp className="h-3 w-3" />
                                                    {kpi.delta}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Graphiques */}
                                <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                                    {/* Courbe volume d'appels */}
                                    <div className="lg:col-span-8 rounded-xl border border-neutral-200/80 bg-white p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <div className="text-xs font-semibold text-neutral-900">
                                                    Appels qualifiés dans le temps
                                                </div>
                                                <div className="text-[11px] text-neutral-500">
                                                    Comparaison appels reçus vs rendez-vous confirmés
                                                </div>
                                            </div>
                                            <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] font-medium text-neutral-600">
                                                30 derniers jours
                                            </span>
                                        </div>

                                        <div className="relative h-36 w-full">
                                            <svg viewBox="0 0 420 120" className="h-full w-full overflow-visible" fill="none">
                                                <defs>
                                                    <linearGradient id="autocallArea" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
                                                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                                                    </linearGradient>
                                                </defs>
                                                <line x1="0" y1="30" x2="420" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                                                <line x1="0" y1="65" x2="420" y2="65" stroke="#F1F5F9" strokeWidth="1" />
                                                <line x1="0" y1="100" x2="420" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                                                <path
                                                    d="M0 92 C45 86, 75 58, 120 62 C165 66, 195 34, 240 40 C285 46, 330 20, 420 14 L420 110 L0 110 Z"
                                                    fill="url(#autocallArea)"
                                                />
                                                <path
                                                    d="M0 92 C45 86, 75 58, 120 62 C165 66, 195 34, 240 40 C285 46, 330 20, 420 14"
                                                    stroke="#2563EB"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                />
                                                <path
                                                    d="M0 102 C50 98, 90 80, 140 84 C190 88, 220 64, 275 68 C325 72, 365 52, 420 46"
                                                    stroke="#94A3B8"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="4 4"
                                                />
                                                <circle cx="240" cy="40" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                                            </svg>

                                            {/* Tooltip flottant sobre */}
                                            <div className="absolute left-[48%] top-2 rounded-lg bg-neutral-950 px-2.5 py-1.5 text-[11px] text-white shadow-md">
                                                <div className="font-semibold font-mono tabular-nums">48 RDV / jour</div>
                                                <div className="text-neutral-400 text-[10px]">Conversion 78%</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Donut répartition */}
                                    <div className="lg:col-span-4 rounded-xl border border-neutral-200/80 bg-white p-4 flex flex-col justify-between">
                                        <div className="text-xs font-semibold text-neutral-900">Motifs d&apos;appels</div>

                                        <div className="my-2 flex items-center justify-center">
                                            <div className="relative h-24 w-24">
                                                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                                                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="14"
                                                        fill="none"
                                                        stroke="#2563EB"
                                                        strokeWidth="4"
                                                        strokeDasharray="58 100"
                                                        strokeLinecap="round"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="14"
                                                        fill="none"
                                                        stroke="#10B981"
                                                        strokeWidth="4"
                                                        strokeDasharray="24 100"
                                                        strokeDashoffset="-60"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-sm font-bold text-neutral-950 font-mono tabular-nums">94%</span>
                                                    <span className="text-[10px] text-neutral-500">Traités</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-[11px]">
                                            <div className="flex items-center justify-between text-neutral-600">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                                                    Prise de RDV
                                                </span>
                                                <span className="font-mono font-semibold text-neutral-900">58%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-neutral-600">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    Qualification
                                                </span>
                                                <span className="font-mono font-semibold text-neutral-900">24%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Barre d'instruction IA flottante */}
                                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-[#F8FAFC] px-3.5 py-2.5">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                        <Sparkles className="h-4 w-4 text-[#2563EB] shrink-0" />
                                        <input
                                            type="text"
                                            value={promptInput}
                                            onChange={(e) => setPromptInput(e.target.value)}
                                            placeholder="Ex : Transférer les urgences juridiques vers mon mobile après 19h..."
                                            className="w-full bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                                            aria-label="Tester une consigne pour l'agent IA"
                                        />
                                    </div>
                                    <Link
                                        href="/register"
                                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-white hover:bg-[#2563EB] transition-colors"
                                        aria-label="Appliquer et tester gratuitement"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
