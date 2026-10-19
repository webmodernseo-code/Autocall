'use client';

import React from 'react';
import { Link } from '@/lib/page-router';
import { cn } from '@/lib/utils';
import { 
    Sparkles, 
    Search, 
    Filter, 
    AlertCircle, 
    ShieldAlert, 
    RefreshCw, 
    HelpCircle,
    ArrowRight
} from 'lucide-react';

const VARIANT_ICONS = {
    search: Search,
    filter: Filter,
    unconfigured: AlertCircle,
    permission: ShieldAlert,
    syncing: RefreshCw,
    default: HelpCircle,
};

/**
 * EmptyState — Composant d'état vide ultra-premium anti "AI slop".
 * 
 * Répond obligatoirement aux 4 questions clés du produit :
 * 1. Pourquoi cette page est-elle vide ?
 * 2. À quoi sert cette fonctionnalité ?
 * 3. Quelle est la prochaine action recommandée ?
 * 4. Existe-t-il un exemple, modèle ou conseil pour commencer ?
 */
export default function EmptyState({
    variant = 'default',
    icon: CustomIcon,
    title,
    description,
    primaryAction,
    secondaryAction,
    tips = [],
    className = '',
}) {
    const IconComponent = CustomIcon || VARIANT_ICONS[variant] || VARIANT_ICONS.default;

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#12151F] p-8 sm:p-12 text-center shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.02)] transition-all',
                className
            )}
            role="status"
            aria-live="polite"
        >
            {/* Subtle radial decorative background blur */}
            <div 
                aria-hidden="true" 
                className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-400/[0.04]" 
            />

            {/* Vector Icon Container */}
            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/80 text-blue-600 shadow-2xs dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                {React.isValidElement(IconComponent) ? (
                    IconComponent
                ) : (
                    <IconComponent className={cn('h-6 w-6 stroke-[1.8]', variant === 'syncing' && 'animate-spin')} />
                )}
            </div>

            {/* Title & Description */}
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                {title}
            </h3>

            {description && (
                <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {description}
                </p>
            )}

            {/* Action Buttons */}
            {(primaryAction || secondaryAction) && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {primaryAction && (
                        primaryAction.href ? (
                            <Link
                                href={primaryAction.href}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer"
                            >
                                {primaryAction.icon && <span className="shrink-0">{primaryAction.icon}</span>}
                                <span>{primaryAction.label}</span>
                                {!primaryAction.icon && <ArrowRight className="h-4 w-4" />}
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={primaryAction.onClick}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer"
                            >
                                {primaryAction.icon && <span className="shrink-0">{primaryAction.icon}</span>}
                                <span>{primaryAction.label}</span>
                                {!primaryAction.icon && <ArrowRight className="h-4 w-4" />}
                            </button>
                        )
                    )}

                    {secondaryAction && (
                        secondaryAction.href ? (
                            <Link
                                href={secondaryAction.href}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white cursor-pointer"
                            >
                                {secondaryAction.icon && <span className="shrink-0">{secondaryAction.icon}</span>}
                                <span>{secondaryAction.label}</span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={secondaryAction.onClick}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white cursor-pointer"
                            >
                                {secondaryAction.icon && <span className="shrink-0">{secondaryAction.icon}</span>}
                                <span>{secondaryAction.label}</span>
                            </button>
                        )
                    )}
                </div>
            )}

            {/* Contextual Tips / Micro-reassurance (Zero informal emojis, 100% SVG) */}
            {tips && tips.length > 0 && (
                <div className="mt-8 border-t border-neutral-100 pt-5 dark:border-white/[0.06]">
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                        {tips.map((tip, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                <span>{tip}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
