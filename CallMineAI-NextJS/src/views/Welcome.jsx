'use client';

import { route } from '@/lib/route';
import { useState } from 'react';
import { Link, usePage } from '@/lib/page-router';
import MarketingLayout from '@/layouts/MarketingLayout';
import CallSimulator from '@/components/marketing/CallSimulator';
import RoiCalculator from '@/components/marketing/RoiCalculator';
import BentoFeatures from '@/components/marketing/BentoFeatures';
import IntegrationLogos from '@/components/marketing/IntegrationLogos';
import UseCasesTabs from '@/components/marketing/UseCasesTabs';
import ComparisonMatrix from '@/components/marketing/ComparisonMatrix';
import PricingSection from '@/components/marketing/PricingSection';
import TestimonialsGrid from '@/components/marketing/TestimonialsGrid';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import TrustBadgeLine from '@/components/marketing/TrustBadgeLine';
import { 
    PhoneCall, 
    ArrowRight, 
    ShieldCheck, 
    Zap, 
    Sparkles, 
    Clock, 
    CheckCircle2, 
    Headphones, 
    Database, 
    BarChart3, 
    TrendingUp, 
    Users, 
    Calendar,
    Award
} from 'lucide-react';

export default function Welcome({ plans = [] }) {
    const page = usePage().props;
    const brand = page?.branding?.system_title || 'CallMindAI';

    return (
        <MarketingLayout>
            {/* HERO SECTION */}
            <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
                {/* Subtle gradient glow in background */}
                <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-[600px] bg-radial from-sky-500/10 via-slate-500/5 to-transparent blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Header */}
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        {/* Status / Announcement Pill */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-800 dark:text-sky-300 text-xs font-semibold shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                            <span>Nouvelle Génération Télécom : Latence Réduite à 320ms</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                            La téléphonie commerciale réinventée avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">humanité et précision</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            Déployez des agents vocaux d'une authenticité troublante pour qualifier vos prospects, fixer vos rendez-vous et désengorger vos équipes 24h/24, sans aucun compromis sur la qualité relationnelle.
                        </p>

                        {/* Call to Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                            <Link
                                href={route('register')}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-xs transition-colors"
                            >
                                <span>Essayer gratuitement (10 min offertes)</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <a
                                href="#simulator"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors shadow-2xs"
                            >
                                <Headphones className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                <span>Tester la console d'appel</span>
                            </a>
                        </div>

                        {/* Trust Micro-Bullets */}
                        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pt-2 font-medium">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sans carte bancaire requise
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Déploiement en moins de 5 minutes
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Compatible avec vos numéros actuels
                            </span>
                        </div>
                    </div>

                    {/* Interactive Softphone Simulator */}
                    <div id="simulator" className="mt-12 md:mt-16 max-w-5xl mx-auto scroll-mt-24">
                        <CallSimulator />
                    </div>
                </div>
            </section>

            {/* MICRO REASSURANCE LINE */}
            <TrustBadgeLine />

            {/* INTEGRATIONS RIBBON */}
            <section className="py-12 md:py-16 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <IntegrationLogos />
                </div>
            </section>

            {/* 3 STEPS WORKFLOW */}
            <section id="how" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Workflow Simple & Éprouvé
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        De la configuration au premier appel en 3 étapes
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Une mise en route intuitive conçue pour les équipes opérationnelles, sans jargon technique.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-4 shadow-2xs relative">
                        <div className="flex items-center justify-between">
                            <span className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-bold text-sm flex items-center justify-center border border-sky-500/20">
                                01
                            </span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Étape 1</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            Personnalisez votre agent vocal
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Choisissez le timbre de voix, définissez l'objectif (prospection, relance, support) et transmettez vos arguments clés ou votre documentation d'entreprise.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-1.5">
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Voix HD</span>
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Scénario de vente</span>
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">RAG personnalisé</span>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-4 shadow-2xs relative">
                        <div className="flex items-center justify-between">
                            <span className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm flex items-center justify-center border border-indigo-500/20">
                                02
                            </span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Étape 2</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            Lancez vos campagnes d’appels
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Importez votre fichier de contacts CSV ou déclenchez des appels automatisés dès qu'un formulaire web est soumis. Le composeur régule la cadence et gère les fuseaux horaires.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-1.5">
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Import CSV</span>
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Dialer asynchrone</span>
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Relance répondeurs</span>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-4 shadow-2xs relative">
                        <div className="flex items-center justify-between">
                            <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center border border-emerald-500/20">
                                03
                            </span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Étape 3</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            Recevez vos opportunités qualifiées
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Les prospects chauds sont directement notés dans votre CRM, les rendez-vous inscrits dans vos agendas et les enregistrements disponibles avec résumé instantané.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-1.5">
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Scoring en direct</span>
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Synchro CRM</span>
                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Alertes Slack/SMS</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO GRID OF CAPABILITIES */}
            <section id="features" className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 uppercase tracking-wider">
                            Capacités de Grade Télécom
                        </span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            L'intelligence vocale conçue pour générer des résultats tangibles
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Une suite complète d'outils pour automatiser sans déshumaniser.
                        </p>
                    </div>

                    <BentoFeatures />
                </div>
            </section>

            {/* ROI & SAVINGS CALCULATOR */}
            <section id="roi" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <RoiCalculator />
            </section>

            {/* SECTOR-SPECIFIC USE CASES */}
            <section id="usecases" className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                            Solutions Adaptées à Votre Secteur
                        </span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Comment chaque industrie accélère avec CallMindAI
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Découvrez les retombées mesurées par secteur d’activité.
                        </p>
                    </div>

                    <UseCasesTabs />
                </div>
            </section>

            {/* COMPARISON MATRIX */}
            <section id="comparison" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Pourquoi Nous Choisir
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Tableau comparatif face aux solutions traditionnelles
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        La performance des grands centres d'appels, au dixième du coût unitaire.
                    </p>
                </div>

                <ComparisonMatrix />
            </section>

            {/* TESTIMONIALS */}
            <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                            Retours d'Expérience
                        </span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Plébiscité par les dirigeants et directeurs commerciaux
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Des résultats concrets sur le terrain, mesurés en chiffre d’affaires et en sérénité.
                        </p>
                    </div>

                    <TestimonialsGrid />
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                        Tarification Transparente
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Des forfaits clairs, évolutifs et sans frais cachés
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Payez uniquement ce que vous consommez avec nos forfaits tout compris.
                    </p>
                </div>

                <PricingSection />
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Questions Fréquentes
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Tout ce que vous devez savoir avant de démarrer
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Vous avez une question particulière ? Notre équipe d'assistance vous répond sous 2 heures.
                        </p>
                    </div>

                    <FaqAccordion defaultLimit={5} />

                    <div className="text-center pt-4">
                        <Link
                            href={route('frontend.faq')}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
                        >
                            <span>Consulter toutes les 20+ questions du centre d'aide</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FINAL CONVERSION CTA BANNER */}
            <section className="py-16 md:py-24 bg-slate-900 text-white dark:bg-black relative overflow-hidden">
                <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 -top-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Prêt en 5 minutes • 10 minutes d'essais offertes</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                        Transformez chaque appel téléphonique en opportunité commerciale
                    </h2>

                    <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Rejoignez les entreprises qui ont choisi d'éliminer les tâches téléphoniques répétitives et de libérer le plein potentiel de leurs équipes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                        <Link
                            href={route('register')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md transition-colors"
                        >
                            <span>Démarrer mon essai gratuit</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href={route('login')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors"
                        >
                            <span>Espace client existant</span>
                        </Link>
                    </div>

                    <p className="text-xs text-slate-400 pt-2 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Transaction chiffrée SSL 256-bit certifiée PCI-DSS • Hébergement européen</span>
                    </p>
                </div>
            </section>
        </MarketingLayout>
    );
}
