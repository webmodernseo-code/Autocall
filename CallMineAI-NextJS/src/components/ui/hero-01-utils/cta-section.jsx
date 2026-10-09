'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    CheckCircle2,
    Lock,
    KeyRound,
    UserPlus,
    LogIn,
    LayoutDashboard,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    ArrowUpRight,
    Radio,
    Sparkles
} from 'lucide-react';
import { ShadcnSpaceLogo } from '@/components/ui/hero-01-utils/header';

function XIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function GitHubIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

function LinkedInIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}

function DiscordIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
    );
}

export default function CtaSection() {
    return (
        <>
            {/* 1. SECTION CTA : ESPACE AUTOUR EN CLAIR (#F8F9FA), CARTE CTA CENTRALE EN SOMBRE (#0C1210 / FOREST) */}
            <section className="relative px-4 sm:px-6 py-20 sm:py-28 bg-[#F8F9FA] text-neutral-900 border-y border-neutral-200/90 overflow-hidden">
                {/* Lueur d'ambiance claire très douce */}
                <div
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[850px] rounded-full blur-[140px] opacity-40"
                    style={{
                        background: 'radial-gradient(circle, rgba(39, 98, 81, 0.12) 0%, rgba(197, 147, 65, 0.08) 45%, transparent 70%)',
                    }}
                    aria-hidden="true"
                />

                {/* CARTE CTA CENTRALE EN SOMBRE (MONOLITHE ÉLÉGANT AVEC TOUCHES FOREST & GOLD) */}
                <div className="relative mx-auto max-w-4xl">
                    <div className="relative rounded-3xl border border-white/15 bg-[#0C1210] px-6 py-10 sm:px-12 sm:py-14 shadow-[0_25px_60px_-15px_rgba(22,56,43,0.3),0_10px_30px_-5px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-center overflow-hidden">
                        {/* Halo interne feutré */}
                        <div
                            className="pointer-events-none absolute left-1/2 -top-20 -translate-x-1/2 h-[260px] w-[600px] rounded-full blur-[90px] opacity-35"
                            style={{
                                background: 'radial-gradient(ellipse at 50% 0%, rgba(39, 98, 81, 0.45) 0%, rgba(197, 147, 65, 0.25) 50%, transparent 80%)',
                            }}
                            aria-hidden="true"
                        />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            {/* Petit badge de réassurance */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-5 shadow-xs">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Installation express sans changer d&apos;opérateur</span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                Prêt à automatiser vos appels ?{' '}
                                <span className="font-hero-serif italic text-emerald-300 block sm:inline">
                                    Activez votre standard IA.
                                </span>
                            </h2>

                            <p className="mt-3.5 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto">
                                Mise en service en 3 minutes. Aucun matériel requis, 14 jours d&apos;essai gratuit sans engagement et sans carte bancaire.
                            </p>

                            {/* Boutons d'action compacts */}
                            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href="/register"
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-xs sm:text-sm font-bold text-neutral-950 transition-all hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/30 cursor-pointer"
                                >
                                    <span>Démarrer l&apos;essai gratuit (14j)</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>

                                <Link
                                    href="/login"
                                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-white/15 cursor-pointer"
                                >
                                    <LogIn className="h-3.5 w-3.5 text-sky-400" />
                                    <span>Connexion</span>
                                </Link>

                                <a
                                    href="#produit"
                                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-transparent px-4 text-xs font-medium text-white/80 transition-all hover:text-white cursor-pointer"
                                >
                                    <span>Écouter la démo</span>
                                </a>
                            </div>

                            {/* Micro-réassurance sobre en 1 ligne */}
                            <div className="mt-7 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-5 text-xs text-white/70">
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    Sans carte bancaire
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    Aucun changement de numéro
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                                    Conforme RGPD
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. FOOTER DE SAAS SOMBRE */}
            <footer className="relative bg-[#08090C] text-white px-4 sm:px-6 pt-16 pb-12 border-t border-white/[0.08] overflow-hidden">
                <div className="relative mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
                    
                    {/* Colonne Marque & Identité SaaS (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col space-y-4">
                        <Link href="/" className="inline-block group focus:outline-hidden">
                            <ShadcnSpaceLogo />
                        </Link>
                        
                        <p className="text-xs text-white/55 leading-relaxed max-w-sm">
                            Infrastructure vocale IA de nouvelle génération pour la qualification d&apos;appels, la prise de rendez-vous et le support téléphonique 24/7.
                        </p>

                        {/* SaaS Live Status Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/70 backdrop-blur-sm w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-medium text-white/80">Systèmes opérationnels</span>
                            <span className="text-white/30">•</span>
                            <span className="text-emerald-400 font-mono text-[10px]">99.98%</span>
                        </div>

                        {/* Coordonnées directes */}
                        <div className="pt-2 space-y-1.5 text-xs text-white/50">
                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                                <a href="mailto:contact@autocall.co" className="hover:text-white transition-colors">
                                    contact@autocall.co
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                                <span>Paris, France</span>
                            </div>
                        </div>

                        {/* SaaS Social Icons */}
                        <div className="flex items-center gap-2 pt-2">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X (Twitter)"
                                className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                            >
                                <XIcon className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                            >
                                <GitHubIcon className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                            >
                                <LinkedInIcon className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://discord.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Discord"
                                className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                            >
                                <DiscordIcon className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Colonne Produit (2-3 cols) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white/80 mb-3 font-mono">
                            Solution SaaS
                        </h4>
                        <ul className="space-y-2 text-xs text-white/60">
                            <li>
                                <a href="#produit" className="hover:text-white transition-colors flex items-center justify-between group">
                                    <span>Agent Vocal IA</span>
                                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-sky-400" />
                                </a>
                            </li>
                            <li>
                                <a href="#secteurs" className="hover:text-white transition-colors">
                                    Cas d&apos;usage métiers
                                </a>
                            </li>
                            <li>
                                <a href="#integrations" className="hover:text-white transition-colors">
                                    Intégrations CRM & Téléphonie
                                </a>
                            </li>
                            <li>
                                <a href="#tarifs" className="hover:text-white transition-colors">
                                    Grille tarifaire
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-white transition-colors">
                                    Foire aux questions
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Colonne Espaces & Authentification (3 cols) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white/80 mb-3 font-mono">
                            Espace Client
                        </h4>
                        <ul className="space-y-2 text-xs text-white/60">
                            <li>
                                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-2 group font-medium text-white/75">
                                    <div className="h-5 w-5 rounded-md border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-sky-500/10 group-hover:border-sky-500/30 transition-colors">
                                        <LogIn className="h-2.5 w-2.5 text-sky-400" />
                                    </div>
                                    <span>Connexion</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="hover:text-white transition-colors flex items-center gap-2 group font-medium text-white/75">
                                    <div className="h-5 w-5 rounded-md border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                                        <UserPlus className="h-2.5 w-2.5 text-emerald-400" />
                                    </div>
                                    <span>Créer un compte</span>
                                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-400 font-medium ml-auto">
                                        14j gratuits
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/forgot-password" className="hover:text-white transition-colors flex items-center gap-2 group text-white/60">
                                    <div className="h-5 w-5 rounded-md border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-colors">
                                        <KeyRound className="h-2.5 w-2.5 text-white/70" />
                                    </div>
                                    <span>Mot de passe oublié</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/app" className="hover:text-white transition-colors flex items-center gap-2 group text-white/60">
                                    <div className="h-5 w-5 rounded-md border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                                        <LayoutDashboard className="h-2.5 w-2.5 text-blue-400" />
                                    </div>
                                    <span>Tableau de bord</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Colonne Légal & Sécurité (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white/80 mb-3 font-mono">
                            Conformité
                        </h4>
                        <ul className="space-y-2 text-xs text-white/60">
                            <li>
                                <Link href="/terms" className="hover:text-white transition-colors">
                                    Conditions Générales (CGVU)
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    Confidentialité RGPD
                                </Link>
                            </li>
                            <li>
                                <Link href="/mentions-legales" className="hover:text-white transition-colors">
                                    Mentions Légales
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="hover:text-white transition-colors">
                                    Gestion des Cookies
                                </Link>
                            </li>
                            <li>
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/60 font-medium pt-1">
                                    <ShieldCheck className="h-3.5 w-3.5 text-white/70 shrink-0" />
                                    <span>Hébergement UE (France)</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Ligne de réassurance sobre PCI-DSS & RGPD */}
                <div className="my-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/45">
                    <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 text-white/60 shrink-0" />
                        <span>Transaction chiffrée SSL 256-bit certifiée PCI-DSS</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400/90">
                        <Radio className="h-3 w-3 shrink-0" />
                        <span>Téléphonie VoIP souveraine &amp; zéro stockage tiers</span>
                    </div>
                </div>

                {/* Barre de copyright et liens discrets */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40">
                    <p>© {new Date().getFullYear()} AutoCall. Tous droits réservés.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hover:text-white transition-colors">Connexion</Link>
                        <span>•</span>
                        <Link href="/register" className="hover:text-white transition-colors">Inscription</Link>
                        <span>•</span>
                        <Link href="/forgot-password" className="hover:text-white transition-colors">Mot de passe oublié</Link>
                    </div>
                </div>
            </div>
        </footer>
    </>
);
}
