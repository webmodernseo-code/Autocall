'use client';

import { ShieldCheck, Info } from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * Reusable legal document shell (Privacy / Terms) with a sticky table of contents.
 * `sections`: [{ h, body: (string | { list: string[] })[] }]
 */
export default function LegalDoc({ eyebrow, title, updated, intro, sections = [], metaTitle, description }) {
    return (
        <MarketingLayout title={metaTitle || `${title} — CallMindAI`} description={description}>
            <section className="relative pt-12 pb-12 md:pt-20 md:pb-16 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    {eyebrow && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 uppercase tracking-wider">
                            {eyebrow}
                        </span>
                    )}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {title}
                    </h1>
                    {updated && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            Dernière mise à jour : {updated}
                        </p>
                    )}
                    {intro && (
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                            {intro}
                        </p>
                    )}
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10 p-4 text-xs text-slate-700 dark:text-slate-300">
                        <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                        <p>
                            Document rédigé dans le respect des directives européennes relatives à la protection des données (RGPD) et des réglementations sur les télécommunications.
                        </p>
                    </div>
                </div>
            </section>

            <section className="pb-24">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 px-4 sm:px-6 lg:px-8">
                    {/* Sticky Table of Contents */}
                    <nav aria-label="Table des matières" className="hidden lg:block">
                        <div className="sticky top-28 space-y-3">
                            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Sommaire
                            </p>
                            <ul className="space-y-2 text-xs">
                                {sections.map((s) => (
                                    <li key={s.h}>
                                        <a
                                            href={`#${slug(s.h)}`}
                                            className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors block py-0.5"
                                        >
                                            {s.h}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>

                    {/* Content Sections */}
                    <div className="min-w-0 space-y-10">
                        {sections.map((s, i) => (
                            <div key={s.h} id={slug(s.h)} className="scroll-mt-28 space-y-3">
                                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span>{s.h}</span>
                                </h2>
                                <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                    {s.body.map((b, j) => typeof b === 'string'
                                        ? <p key={j}>{b}</p>
                                        : (
                                            <ul key={j} className="space-y-2 pl-2">
                                                {b.list.map((x) => (
                                                    <li key={x} className="flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                                                        <span>{x}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
