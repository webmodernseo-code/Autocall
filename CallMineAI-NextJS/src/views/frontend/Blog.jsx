'use client';

import { route } from '@/lib/route';
import { Link } from '@/lib/page-router';
import { ArrowRight, BookOpen, Clock, Tag, Sparkles } from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';

const POSTS = [
    {
        slug: 'comment-qualifier-leads-telephoniques-ia',
        title: 'Comment qualifier 1 000 prospects par téléphone en moins de 2 heures',
        excerpt: 'Découvrez la méthodologie pas-à-pas pour structurer votre script d\'appel, configurer votre dialer et synchroniser les résultats chauds avec votre CRM.',
        category: 'Méthodologie Commerciale',
        readTime: '6 min de lecture',
        date: '12 Septembre 2026',
    },
    {
        slug: 'reduire-latence-vocale-telecom',
        title: 'Pourquoi la latence sous les 350ms est la clé de la crédibilité des agents vocaux',
        excerpt: 'Analyse technique des architectures WebRTC et SIP : comment éliminer les temps de blanc pour une conversation indistinguable d\'un humain.',
        category: 'Ingénierie Télécom',
        readTime: '8 min de lecture',
        date: '4 Septembre 2026',
    },
    {
        slug: 'rgpd-conformite-appels-vocaux-france',
        title: 'Conformité RGPD et démarchage téléphonique : le guide légal complet',
        excerpt: 'Tout ce que vous devez savoir sur le consentement, les listes d\'opposition, l\'anonymisation des enregistrements et l\'hébergement en Union Européenne.',
        category: 'Réglementation & RGPD',
        readTime: '5 min de lecture',
        date: '28 Août 2026',
    }
];

export default function Blog() {
    return (
        <MarketingLayout
            title="Blog & Guides — CallMindAI"
            description="Guides pratiques, ingénierie télécom et stratégies commerciales pour réussir vos campagnes d'appels par IA."
        >
            <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 uppercase tracking-wider">
                            Ressources & Guides Télécoms
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            L'intelligence commerciale au service de votre croissance
                        </h1>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                            Études de cas concrètes, benchmarks de conversion et astuces techniques rédigés par nos ingénieurs et experts en prospection.
                        </p>
                    </div>

                    {/* Blog Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {POSTS.map((post, idx) => (
                            <article
                                key={idx}
                                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                        <span className="font-semibold text-sky-600 dark:text-sky-400">{post.category}</span>
                                        <span className="flex items-center gap-1 font-mono text-[11px]"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                    <span className="text-slate-400">{post.date}</span>
                                    <span className="font-semibold text-sky-600 dark:text-sky-400 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Lire l'article <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* CTA Box */}
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-8 text-center space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Prêt à tester la puissance de la téléphonie par IA ?
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                            Rejoignez les entreprises qui ont automatisé leur qualification d'appels avec CallMindAI.
                        </p>
                        <div className="pt-2">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors shadow-xs"
                            >
                                <span>Démarrer 10 min d'essai offertes</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
