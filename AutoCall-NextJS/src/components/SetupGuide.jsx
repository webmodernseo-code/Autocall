'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ChevronDown, ExternalLink, AlertTriangle } from 'lucide-react';
import { INTEGRATION_GUIDES } from '@/lib/integrationGuides';

/**
 * Collapsible per-integration setup guide.
 * Pass a `guide` key defined in lib/integrationGuides.js.
 * Renders numbered steps with sharp contrast and dynamic French/English copy.
 */
export default function SetupGuide({ guide, defaultOpen = false, className = '' }) {
    const { i18n } = useTranslation();
    const isFr = (i18n?.language || 'fr').startsWith('fr');

    const g = INTEGRATION_GUIDES[guide];
    const [open, setOpen] = useState(defaultOpen);
    if (!g) return null;

    const title = isFr && g.title_fr ? g.title_fr : g.title;
    const intro = isFr && g.intro_fr ? g.intro_fr : g.intro;
    const steps = isFr && g.steps_fr ? g.steps_fr : g.steps;
    const notes = isFr && g.notes_fr ? g.notes_fr : (g.notes || []);

    return (
        <div className={`overflow-hidden rounded-2xl border border-blue-200/80 bg-blue-50/40 dark:border-blue-500/20 dark:bg-blue-500/[0.05] shadow-[0_1px_3px_rgba(15,23,42,0.04)] ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left cursor-pointer transition hover:bg-blue-50/60 dark:hover:bg-blue-500/[0.08]"
                aria-expanded={open}
            >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-300">
                    <BookOpen className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                        {isFr ? 'Guide de configuration' : 'Setup guide'}: {title}
                    </span>
                    {intro && <span className="block truncate text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{intro}</span>}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="space-y-4 border-t border-blue-200/60 px-4 py-4 dark:border-blue-500/15 bg-white/70 dark:bg-transparent">
                    {intro && <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">{intro}</p>}

                    <ol className="space-y-2.5">
                        {steps.map((s, i) => (
                            <li key={i} className="flex gap-3 text-xs sm:text-sm text-slate-700 dark:text-neutral-200">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-2xs">{i + 1}</span>
                                <span className="min-w-0">
                                    {s.text}
                                    {s.href && (
                                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="ml-1.5 inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                            {s.linkText || (isFr ? 'Ouvrir' : 'Open')} <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                    {s.code && <code className="ml-1.5 rounded-lg border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:border-white/10 dark:bg-white/[0.08] dark:text-neutral-200">{s.code}</code>}
                                </span>
                            </li>
                        ))}
                    </ol>

                    {(notes || []).map((n, i) => (
                        <div key={i} className="flex gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-2.5 text-xs text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <span>{n}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
