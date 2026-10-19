'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/page-router';

/**
 * PageHeader — En-tête standardisé de page senior SaaS B2B.
 * 
 * Garantit la hiérarchie visuelle stricte :
 * 1. Titre compréhensible
 * 2. Description courte orientée bénéfice
 * 3. Action principale unique et visible
 * 4. Actions secondaires moins dominantes
 * 5. Statut ou contexte utile (badge / métadonnée)
 */
export default function PageHeader({
    title,
    description,
    badge,
    primaryAction,
    secondaryActions = [],
    breadcrumbs,
    className = '',
    children,
}) {
    return (
        <div className={cn('mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
            <div className="min-w-0 flex-1">
                {breadcrumbs && (
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {breadcrumbs}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {title}
                    </h1>
                    {badge && (
                        <div className="shrink-0">
                            {badge}
                        </div>
                    )}
                </div>

                {description && (
                    <p className="mt-1 max-w-3xl text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {description}
                    </p>
                )}

                {children}
            </div>

            {/* Actions group */}
            {(primaryAction || secondaryActions.length > 0) && (
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {/* Secondary actions first on desktop to give rightmost prominence to primary */}
                    {secondaryActions.map((action, i) => (
                        action.href ? (
                            <Link
                                key={i}
                                href={action.href}
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-2xs transition hover:bg-neutral-50 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white cursor-pointer"
                            >
                                {action.icon && <span className="shrink-0">{action.icon}</span>}
                                <span>{action.label}</span>
                            </Link>
                        ) : (
                            <button
                                key={i}
                                type="button"
                                onClick={action.onClick}
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-2xs transition hover:bg-neutral-50 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white cursor-pointer"
                            >
                                {action.icon && <span className="shrink-0">{action.icon}</span>}
                                <span>{action.label}</span>
                            </button>
                        )
                    ))}

                    {/* Primary prominent action */}
                    {primaryAction && (
                        primaryAction.href ? (
                            <Link
                                href={primaryAction.href}
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer"
                            >
                                {primaryAction.icon && <span className="shrink-0">{primaryAction.icon}</span>}
                                <span>{primaryAction.label}</span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={primaryAction.onClick}
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer"
                            >
                                {primaryAction.icon && <span className="shrink-0">{primaryAction.icon}</span>}
                                <span>{primaryAction.label}</span>
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
