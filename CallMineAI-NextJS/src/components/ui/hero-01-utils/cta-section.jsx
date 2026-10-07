'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lock, KeyRound, UserPlus, LogIn, LayoutDashboard } from 'lucide-react';
import { ShadcnSpaceLogo } from '@/components/ui/hero-01-utils/header';

export default function CtaSection() {
    return (
        <section className="relative px-4 sm:px-6 py-8 sm:py-10 text-white overflow-hidden">
            {/* Halos d'ambiance subtils et discrets */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[500px] rounded-full blur-[110px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-4xl">
                
                {/* 1. CARTE CTA COMPACTE & SOBRE (STYLE LINEAR / STRIPE) */}
                <div className="relative rounded-xl border border-white/10 bg-[#0E1015]/90 px-6 py-6 sm:px-8 sm:py-7 shadow-lg backdrop-blur-xl text-center overflow-hidden">
                    <div className="relative z-10 max-w-xl mx-auto">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                            Prêt à automatiser vos appels ?{' '}
                            <span className="font-hero-serif italic text-white/95">
                                Activez votre standard IA.
                            </span>
                        </h2>

                        <p className="mt-2 text-xs text-white/60 leading-relaxed">
                            Mise en service en 3 minutes. Aucun matériel requis, 14 jours d&apos;essai gratuit sans engagement.
                        </p>

                        {/* Boutons d'action compacts */}
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                            <Link
                                href="/register"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-black transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-sm cursor-pointer"
                            >
                                <span>Démarrer l&apos;essai gratuit (14j)</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>

                            <Link
                                href="/login"
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 text-xs font-medium text-white transition-all hover:bg-white/10 cursor-pointer"
                            >
                                <LogIn className="h-3 w-3 text-sky-400" />
                                <span>Connexion</span>
                            </Link>

                            <a
                                href="#produit"
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-transparent px-3 text-xs font-medium text-white/70 transition-all hover:text-white cursor-pointer"
                            >
                                <span>Écouter la démo</span>
                            </a>
                        </div>

                        {/* Micro-réassurance sobre en 1 ligne */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/45">
                            <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                Sans carte bancaire
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                Aucun changement de numéro
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Lock className="h-3 w-3 text-emerald-400" />
                                Conforme RGPD
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. PIED DE PAGE (FOOTER) ÉPURÉ & ÉLÉGANT AVEC LIENS D'AUTHENTIFICATION */}
                <footer className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                        {/* Colonne 1 : Brand */}
                        <div className="col-span-2 sm:col-span-1 space-y-2">
                            <Link href="/" className="inline-block group">
                                <ShadcnSpaceLogo />
                            </Link>
                            <p className="text-[11px] text-white/50 leading-relaxed">
                                Standard téléphonique IA pour professionnels, cabinets et entreprises exigeantes.
                            </p>
                        </div>

                        {/* Colonne 2 : Plateforme */}
                        <div>
                            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2 font-mono">
                                Plateforme
                            </h4>
                            <ul className="space-y-1.5 text-xs text-white/55">
                                <li>
                                    <a href="#produit" className="hover:text-white transition-colors">
                                        Agent Vocal IA
                                    </a>
                                </li>
                                <li>
                                    <a href="#secteurs" className="hover:text-white transition-colors">
                                        Cas d&apos;usage
                                    </a>
                                </li>
                                <li>
                                    <a href="#integrations" className="hover:text-white transition-colors">
                                        Intégrations CRM
                                    </a>
                                </li>
                                <li>
                                    <a href="#tarifs" className="hover:text-white transition-colors">
                                        Grille tarifaire
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Colonne 3 : Espaces & Authentification */}
                        <div>
                            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2 font-mono">
                                Accès & Espace
                            </h4>
                            <ul className="space-y-1.5 text-xs text-white/55">
                                <li>
                                    <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5 font-medium text-white/80">
                                        <LogIn className="h-3 w-3 text-sky-400" />
                                        <span>Connexion</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register" className="hover:text-white transition-colors flex items-center gap-1.5 font-medium text-white/80">
                                        <UserPlus className="h-3 w-3 text-emerald-400" />
                                        <span>Créer un compte (14j)</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/forgot-password" className="hover:text-white transition-colors flex items-center gap-1.5">
                                        <KeyRound className="h-3 w-3 text-amber-400" />
                                        <span>Mot de passe oublié</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/app" className="hover:text-white transition-colors flex items-center gap-1.5">
                                        <LayoutDashboard className="h-3 w-3 text-brand-400" />
                                        <span>Tableau de bord</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Colonne 4 : Sécurité & Conformité */}
                        <div>
                            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2 font-mono">
                                Conformité
                            </h4>
                            <ul className="space-y-1.5 text-xs text-white/55">
                                <li>
                                    <Link href="/privacy" className="hover:text-white transition-colors">
                                        Confidentialité RGPD
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-white transition-colors">
                                        Conditions Générales
                                    </Link>
                                </li>
                                <li>
                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400/90">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        <span>Serveurs France / UE</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/40">
                        <p>© {new Date().getFullYear()} CallMind AI — Tous droits réservés.</p>
                        <p className="flex items-center gap-3">
                            <Link href="/login" className="hover:text-white transition-colors">Connexion</Link>
                            <span>•</span>
                            <Link href="/register" className="hover:text-white transition-colors">Inscription</Link>
                            <span>•</span>
                            <Link href="/forgot-password" className="hover:text-white transition-colors">Mot de passe oublié</Link>
                        </p>
                    </div>
                </footer>
            </div>
        </section>
    );
}
