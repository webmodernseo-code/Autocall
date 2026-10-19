'use client';

import { useTranslation } from 'react-i18next';
import { getFeatureOverview } from '@/lib/featureOverviews';

const ACCENTS = {
    brand: { tile: 'from-blue-600 to-sky-400', ring: 'border-blue-200/80 dark:border-blue-500/20', wash: 'from-blue-50/60 dark:from-blue-500/10', glow: 'bg-blue-400/20', num: 'bg-blue-600' },
    signal: { tile: 'from-emerald-600 to-teal-400', ring: 'border-emerald-200/80 dark:border-emerald-500/20', wash: 'from-emerald-50/60 dark:from-emerald-500/10', glow: 'bg-emerald-400/20', num: 'bg-emerald-600' },
    warm: { tile: 'from-amber-500 to-orange-400', ring: 'border-amber-200/80 dark:border-amber-500/20', wash: 'from-amber-50/60 dark:from-amber-500/10', glow: 'bg-amber-400/20', num: 'bg-amber-600' },
    cold: { tile: 'from-indigo-600 to-blue-400', ring: 'border-indigo-200/80 dark:border-indigo-500/20', wash: 'from-indigo-50/60 dark:from-indigo-500/10', glow: 'bg-indigo-400/20', num: 'bg-indigo-600' },
};

/**
 * Branded feature-overview banner. Automatically bilingual (French / English)
 * with sharp contrast and clean Apple/Stripe aesthetics.
 */
export default function PageOverview({ feature, icon, title, description, steps, accent, className = '' }) {
    const { i18n } = useTranslation();
    const lang = (i18n?.language || 'fr').startsWith('fr') ? 'fr' : 'en';

    const cfg = (feature && getFeatureOverview(feature, lang)) || {};
    const Icon = icon || cfg.icon;
    const t = title || cfg.title;
    const desc = description || cfg.description;
    const list = steps || cfg.steps || [];
    const a = ACCENTS[accent || cfg.accent || 'brand'];
    if (!t) return null;

    return (
        <section className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r to-white p-5 shadow-soft-md dark:to-[#0F1117] dark:shadow-none sm:p-6 ${a.ring} ${a.wash} ${className}`}>
            <div className={`pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full blur-3xl opacity-70 ${a.glow}`} />
            <div className="relative flex flex-col items-start gap-4 sm:flex-row">
                {Icon && (
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-xs ${a.tile}`}>
                        <Icon className="h-5 w-5" />
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <h2 className="font-hero-sans text-lg font-bold leading-7 tracking-tight text-neutral-950 dark:text-white">{t}</h2>
                    {desc && <p className="mt-1.5 max-w-4xl text-sm leading-6 text-slate-600 dark:text-neutral-300">{desc}</p>}
                    {list.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-2">
                            {list.map((s, i) => (
                                <span key={i} className="inline-flex max-w-full items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium leading-5 text-slate-700 shadow-2xs dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200">
                                    <span className={`flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white ${a.num}`}>{i + 1}</span>
                                    <span className="min-w-0 break-words">{s}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
