'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ShieldCheck, CheckCircle2, Lock, Headphones, Sparkles } from 'lucide-react';
import { ShadcnSpaceLogo } from '@/components/ui/hero-01-utils/header';

export default function CtaSection() {
    return (
        <section className="relative px-6 pt-20 pb-12 sm:pt-28 sm:pb-16 text-white overflow-hidden">
            {/* Halos lumineux d'ambiance */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[1000px] rounded-full blur-[180px] opacity-25"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                
                {/* 1. BANDEAU MAJEUR DE CONVERSION */}
                <div className="relative rounded-3xl border border-white/10 bg-[#0E1015]/90 p-8 sm:p-14 lg:p-16 shadow-2xl backdrop-blur-2xl text-center overflow-hidden">
                    {/* Motif lumineux interne */}
                    <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-[600px] rounded-full bg-white/5 blur-3xl" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-6 shadow-xs">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Déploiement immédiat en 5 minutes</span>
                        </div>

                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                            Prêt à ne plus manquer aucun appel ?{' '}
                            <span className="font-hero-serif italic text-white/95 block sm:inline">
                                Activez votre standard IA dès aujourd&apos;hui.
                            </span>
                        </h2>

                        <p className="mt-5 text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl mx-auto">
                            Rejoignez plus de 500 cabinets médicaux, études d&apos;avocats, agences et artisans qui automatisent leur accueil téléphonique en toute sérénité.
                        </p>

                        {/* Boutons d'action */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-8 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-lg shadow-white/10 cursor-pointer"
                            >
                                <span>Démarrer mon essai gratuit de 14 jours</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <a
                                href="#produit"
                                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30 cursor-pointer"
                            >
                                <span>Écouter la démo audio</span>
                            </a>
                        </div>

                        {/* Micro-réassurance (Directive Anti-Slop) */}
                        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-white/60">
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                14 jours offerts sans carte bancaire
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                Aucun numéro à changer
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                                Données sécurisées RGPD
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. PIED DE PAGE (FOOTER) ÉLÉGANT */}
                <footer className="mt-16 pt-10 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                        {/* Colonne 1 : Brand */}
                        <div className="md:col-span-1 space-y-3">
                            <Link href="/" className="inline-block group">
                                <ShadcnSpaceLogo />
                            </Link>
                            <p className="text-xs text-white/50 leading-relaxed">
                                Standard téléphonique par intelligence artificielle pour les professionnels, cabinets et entreprises exigeantes.
                            </p>
                        </div>

                        {/* Colonne 2 : Produit & Navigation */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-3 font-mono">
                                Plateforme
                            </h4>
                            <ul className="space-y-2 text-xs text-white/60">
                                <li><a href="#produit" className="hover:text-white transition-colors">Démo interactive</a></li>
                                <li><a href="#secteurs" className="hover:text-white transition-colors">Secteurs & Métiers</a></li>
                                <li><a href="#integrations" className="hover:text-white transition-colors">Intégrations & API</a></li>
                                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs & Abonnements</a></li>
                                <li><a href="#faq" className="hover:text-white transition-colors">Foire aux questions</a></li>
                            </ul>
                        </div>

                        {/* Colonne 3 : Accès & Connexion */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-3 font-mono">
                                Accès Client
                            </h4>
                            <ul className="space-y-2 text-xs text-white/60">
                                <li><Link href="/login" className="hover:text-white transition-colors">Espace Connexion</Link></li>
                                <li><Link href="/register" className="hover:text-white transition-colors">Créer un compte</Link></li>
                                <li><Link href="/forgot-password" className="hover:text-white transition-colors">Mot de passe oublié</Link></li>
                                <li><a href="#faq" className="hover:text-white transition-colors">Centre d&apos;assistance</a></li>
                            </ul>
                        </div>

                        {/* Colonne 4 : Sécurité & Conformité */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-3 font-mono">
                                Conformité
                            </h4>
                            <ul className="space-y-2 text-xs text-white/60">
                                <li className="flex items-center gap-1.5 text-white/70">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Hébergé en Europe (RGPD)</span>
                                </li>
                                <li className="flex items-center gap-1.5 text-white/70">
                                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Chiffrement SSL 256-bit</span>
                                </li>
                                <li className="text-white/40 pt-1">
                                    Conforme aux exigences de secret professionnel médical et juridique.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright bas */}
                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40">
                        <p>© 2026 CallMind AI. Tous droits réservés.</p>
                        <div className="flex items-center gap-4">
                            <span className="hover:text-white/60 cursor-pointer">Mentions légales</span>
                            <span className="hover:text-white/60 cursor-pointer">Politique de confidentialité</span>
                            <span className="hover:text-white/60 cursor-pointer">CGU & Conditions</span>
                        </div>
                    </div>
                </footer>

            </div>
        </section>
    );
}
