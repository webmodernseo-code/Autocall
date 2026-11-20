'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, TrendingUp } from 'lucide-react';

function XIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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

export default function CtaSection() {
    return (
        <>
            {/* 1. BANNIÈRE CTA SPLIT (style Flow AI) */}
            <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-neutral-200/90 bg-[#F8FAFC] overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-12 items-center">
                        {/* Gauche : Titre + CTA */}
                        <div className="lg:col-span-6 p-8 sm:p-12">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Mise en service en 3 minutes
                            </span>

                            <h2 className="mt-4 font-hero-sans text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-neutral-950">
                                Essayez AutoCall gratuitement
                            </h2>

                            <p className="mt-3 text-sm text-neutral-600 leading-relaxed max-w-md">
                                Créez votre premier agent vocal IA en quelques clics. 10 minutes d&apos;appels offertes, sans carte bancaire et sans engagement.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Link
                                    href="/register"
                                    className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1D4ED8]"
                                >
                                    Démarrer gratuitement
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                                >
                                    Connexion
                                </Link>
                            </div>
                        </div>

                        {/* Droite : Mini aperçu console */}
                        <div className="lg:col-span-6 pt-6 pl-6 sm:pt-10 sm:pl-10">
                            <div className="rounded-tl-2xl border-t border-l border-neutral-200/90 bg-white p-5 shadow-lg">
                                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                                    <img
                                        src="/images/autocall-logo-dark.png"
                                        alt="AutoCall"
                                        className="h-4 w-auto object-contain"
                                    />
                                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 rounded-full px-2 py-0.5">
                                        Standard actif 24/7
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-neutral-100 bg-[#F8FAFC] p-3">
                                        <div className="text-[11px] text-neutral-500">Appels qualifiés</div>
                                        <div className="mt-1 flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-neutral-950 font-mono tabular-nums">1 428</span>
                                            <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-0.5">
                                                <TrendingUp className="h-3 w-3" /> +18%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-neutral-100 bg-[#F8FAFC] p-3">
                                        <div className="text-[11px] text-neutral-500">RDV confirmés</div>
                                        <div className="mt-1 flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-neutral-950 font-mono tabular-nums">312</span>
                                            <span className="text-[11px] font-semibold text-emerald-600">+24%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 h-24 w-full">
                                    <svg viewBox="0 0 360 80" className="h-full w-full" fill="none">
                                        <path
                                            d="M0 68 C50 60, 90 42, 145 48 C200 54, 245 24, 300 28 C330 30, 345 16, 360 12"
                                            stroke="#2563EB"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. FOOTER ARCHITECTURAL CLAIR */}
            <footer className="bg-[#F8FAFC] text-neutral-700 pt-14 pb-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-neutral-200/80">
                        {/* Marque (4 cols) */}
                        <div className="lg:col-span-4 space-y-4">
                            <Link href="/" className="inline-block">
                                <img
                                    src="/images/autocall-logo-dark.png"
                                    alt="AutoCall"
                                    className="h-5 w-auto object-contain"
                                />
                            </Link>
                            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
                                La plateforme d&apos;agents vocaux IA pour automatiser votre accueil téléphonique, qualifier vos prospects et remplir votre agenda 24h/24.
                            </p>
                            <div className="flex items-center gap-2.5">
                                <a
                                    href="https://x.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                    <XIcon className="h-3.5 w-3.5" />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                    <LinkedInIcon className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Produit (2 cols) */}
                        <div className="lg:col-span-2">
                            <h4 className="text-xs font-bold text-neutral-950 mb-3">Produit</h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li><a href="#fonctionnalites" className="hover:text-neutral-950 transition-colors">Fonctionnalités</a></li>
                                <li><a href="#demo" className="hover:text-neutral-950 transition-colors">Démonstration</a></li>
                                <li><a href="#secteurs" className="hover:text-neutral-950 transition-colors">Secteurs</a></li>
                                <li><a href="#integrations" className="hover:text-neutral-950 transition-colors">Intégrations</a></li>
                                <li><a href="#tarifs" className="hover:text-neutral-950 transition-colors">Tarifs</a></li>
                            </ul>
                        </div>

                        {/* Ressources (2 cols) */}
                        <div className="lg:col-span-2">
                            <h4 className="text-xs font-bold text-neutral-950 mb-3">Ressources</h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li><Link href="/docs" className="hover:text-neutral-950 transition-colors">Documentation</Link></li>
                                <li><Link href="/faq" className="hover:text-neutral-950 transition-colors">FAQ complète</Link></li>
                                <li><Link href="/status" className="hover:text-neutral-950 transition-colors">Statut réseau</Link></li>
                                <li><Link href="/blog" className="hover:text-neutral-950 transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        {/* Espace Client (2 cols) */}
                        <div className="lg:col-span-2">
                            <h4 className="text-xs font-bold text-neutral-950 mb-3">Espace Client</h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li><Link href="/login" className="hover:text-neutral-950 transition-colors font-medium">Connexion</Link></li>
                                <li><Link href="/register" className="hover:text-neutral-950 transition-colors font-medium text-[#2563EB]">Créer un compte</Link></li>
                                <li><Link href="/forgot-password" className="hover:text-neutral-950 transition-colors">Mot de passe oublié</Link></li>
                                <li><Link href="/app" className="hover:text-neutral-950 transition-colors">Tableau de bord</Link></li>
                            </ul>
                        </div>

                        {/* Conformité (2 cols) */}
                        <div className="lg:col-span-2">
                            <h4 className="text-xs font-bold text-neutral-950 mb-3">Conformité</h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li><Link href="/terms" className="hover:text-neutral-950 transition-colors">CGVU</Link></li>
                                <li><Link href="/privacy" className="hover:text-neutral-950 transition-colors">Confidentialité RGPD</Link></li>
                                <li><Link href="/mentions-legales" className="hover:text-neutral-950 transition-colors">Mentions légales</Link></li>
                                <li><Link href="/cookies" className="hover:text-neutral-950 transition-colors">Cookies</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Barre de réassurance + Copyright */}
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="inline-flex items-center gap-1.5">
                                <Lock className="h-3.5 w-3.5 text-neutral-400" />
                                <span>Transaction chiffrée SSL 256-bit certifiée PCI-DSS</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Hébergement souverain UE</span>
                            </span>
                        </div>
                        <p>© {new Date().getFullYear()} AutoCall. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
