'use client';

import { route } from '@/lib/route';
import { Link } from '@/lib/page-router';
import { ArrowRight, Mail, HelpCircle, ShieldCheck } from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import { FAQ_FLAT } from '@/components/marketing/faqData';

export default function Faq() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_FLAT.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a }
        })),
    };

    return (
        <MarketingLayout
            title="Centre d'Aide & FAQ — CallMindAI"
            description="Réponses directes à toutes vos questions sur la téléphonie par IA, les intégrations CRM, la sécurité et la tarification."
            schema={schema}
        >
            <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 uppercase tracking-wider">
                            Centre d'Aide & Documentation
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Questions fréquemment posées
                        </h1>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Toutes les réponses pour bien démarrer, configurer vos premiers agents vocaux et intégrer votre téléphonie à vos outils quotidiens.
                        </p>
                    </div>

                    {/* Full Interactive Category FAQ Accordion */}
                    <div className="pt-4">
                        <FaqAccordion showCategories={true} />
                    </div>

                    {/* Support Card */}
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-8 text-center space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Vous n'avez pas trouvé la réponse à votre question ?
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                            Notre équipe d'ingénieurs télécoms et de spécialistes support vous répond sous 2 heures ouvrées.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <a
                                href="mailto:contact@callmindai.com"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-xs transition-colors shadow-2xs"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Écrire au support technique</span>
                            </a>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs transition-colors"
                            >
                                <span>Tester gratuitement</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
