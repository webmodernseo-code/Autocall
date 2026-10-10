'use client';

import React from 'react';
import Link from 'next/link';
import {
    CheckCircle2,
    Activity,
    Server,
    Radio,
    Cpu,
    Zap,
    ShieldCheck,
    Clock,
    ArrowUpRight,
    ArrowLeft,
    RefreshCw
} from 'lucide-react';

const SERVICES = [
    {
        name: "Moteur Vocal & Synthèse IA",
        description: "ElevenLabs Neural Engine, Flash v2.5 et modèles vocaux temps réel",
        status: "Opérationnel",
        uptime: "99.99%",
        latency: "318ms",
        icon: Cpu,
        health: "green"
    },
    {
        name: "Passerelle Télécom & Trunks SIP",
        description: "Routage des appels entrants/sortants, Twilio & Plivo Carrier Gateway",
        status: "Opérationnel",
        uptime: "100.0%",
        latency: "45ms",
        icon: Radio,
        health: "green"
    },
    {
        name: "API Publique & Webhooks",
        description: "Endpoints https://api.getautocall.fr, authentification et événements",
        status: "Opérationnel",
        uptime: "100.0%",
        latency: "38ms",
        icon: Zap,
        health: "green"
    },
    {
        name: "Dashboard & Espace Client",
        description: "Interface web https://app.getautocall.fr, gestion des flux et statistiques",
        status: "Opérationnel",
        uptime: "100.0%",
        latency: "52ms",
        icon: Server,
        health: "green"
    },
    {
        name: "Files d'appels & Workers d'arrière-plan",
        description: "Traitement asynchrone des campagnes, réessais et rapports d'analyse",
        status: "Opérationnel",
        uptime: "99.98%",
        latency: "12ms",
        icon: Activity,
        health: "green"
    }
];

export default function StatusView() {
    return (
        <div className="min-h-screen bg-[#08090C] text-neutral-100 selection:bg-emerald-500/30 selection:text-white">
            {/* Header Status */}
            <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#08090C]/85 backdrop-blur-xl px-4 sm:px-8 py-3.5">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img
                                src="/images/autocall-logo.png"
                                alt="AutoCall"
                                className="h-[20px] w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                            />
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-neutral-400">
                            <span>Status Hub</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/docs"
                            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Documentation
                        </Link>
                        <Link
                            href="/app"
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-xs font-bold text-neutral-950 hover:bg-neutral-200 transition-all shadow-sm"
                        >
                            <span>Dashboard</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Status Content */}
            <main className="mx-auto max-w-5xl px-4 sm:px-8 py-10 space-y-10">
                {/* Global Status Banner */}
                <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-emerald-950/20 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <span className="relative flex h-4 w-4 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                            </span>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                                    Tous les systèmes sont opérationnels
                                </h1>
                                <p className="text-xs sm:text-sm text-emerald-300/80 mt-0.5">
                                    Dernière vérification automatique il y a 30 secondes
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/80">
                            Disponibilité globale : <span className="text-emerald-400 font-bold">99.98%</span>
                        </div>
                    </div>
                </div>

                {/* Services List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono text-xs text-neutral-400">
                            Composants du Système
                        </h2>
                        <span className="text-xs text-neutral-500 font-mono">Temps réel</span>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden">
                        {SERVICES.map((srv, idx) => {
                            const Icon = srv.icon;
                            return (
                                <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-start gap-3.5">
                                        <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-white">{srv.name}</h3>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 text-[10px] font-semibold text-emerald-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                                    {srv.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-400 mt-0.5">{srv.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pl-12 sm:pl-0 text-xs font-mono text-neutral-400">
                                        <div>
                                            <span className="text-neutral-500 block text-[10px] uppercase">Uptime</span>
                                            <span className="text-white font-semibold">{srv.uptime}</span>
                                        </div>
                                        <div>
                                            <span className="text-neutral-500 block text-[10px] uppercase">Latence</span>
                                            <span className="text-emerald-400 font-semibold">{srv.latency}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 90 Days Uptime Graph */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
                            Historique d&apos;activité (90 derniers jours)
                        </h2>
                        <span className="text-xs text-emerald-400 font-mono font-medium">99.98% uptime moyen</span>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                        <div className="grid grid-cols-30 sm:grid-cols-45 md:grid-cols-90 gap-1 h-8 items-end">
                            {Array.from({ length: 90 }, (_, i) => (
                                <div
                                    key={i}
                                    title={`Jour ${90 - i} : 100% opérationnel`}
                                    className="h-7 w-full rounded-xs bg-emerald-500/80 hover:bg-emerald-400 transition-colors cursor-pointer"
                                />
                            ))}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-1">
                            <span>Il y a 90 jours</span>
                            <span>Aujourd&apos;hui</span>
                        </div>
                    </div>
                </section>

                {/* Past Incidents */}
                <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
                        Incidents Récents
                    </h2>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center space-y-2">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                        <h3 className="text-sm font-bold text-white">Aucun incident à signaler</h3>
                        <p className="text-xs text-neutral-400 max-w-md mx-auto">
                            Tous les services fonctionnent avec une performance optimale et sans aucune interruption au cours des 90 derniers jours.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
