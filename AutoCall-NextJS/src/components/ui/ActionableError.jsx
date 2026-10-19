'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle, ArrowRight, ShieldAlert, Check } from 'lucide-react';
import { Link } from '@/lib/page-router';
import { cn } from '@/lib/utils';

/**
 * ActionableError — Composant d'erreur actionnable anti "AI slop".
 * 
 * Élimine les messages vagues ("Une erreur est survenue") et fournit :
 * - Ce qui n'a pas fonctionné
 * - La cause probable identifiée
 * - La solution concrète ou bouton de récupération
 * - La garantie de conservation des données
 */
export default function ActionableError({
    title = 'Action interrompue',
    message,
    cause,
    recoveryAction,
    secondaryAction,
    isDataSafe = true,
    variant = 'error', // 'error' | 'warning' | 'info'
    className = '',
}) {
    const config = {
        error: {
            container: 'border-red-200/90 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/[0.06]',
            iconBg: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
            titleText: 'text-red-950 dark:text-red-200',
            bodyText: 'text-red-900/80 dark:text-red-300/80',
            button: 'bg-red-600 hover:bg-red-700 text-white shadow-2xs',
            icon: AlertTriangle,
        },
        warning: {
            container: 'border-amber-200/90 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/[0.06]',
            iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
            titleText: 'text-amber-950 dark:text-amber-200',
            bodyText: 'text-amber-900/80 dark:text-amber-300/80',
            button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs',
            icon: AlertTriangle,
        },
        info: {
            container: 'border-blue-200/90 bg-blue-50/60 dark:border-blue-500/20 dark:bg-blue-500/[0.06]',
            iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
            titleText: 'text-blue-950 dark:text-blue-200',
            bodyText: 'text-blue-900/80 dark:text-blue-300/80',
            button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs',
            icon: HelpCircle,
        },
    }[variant] || config.error;

    const Icon = config.icon;

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={cn(
                'rounded-2xl border p-4 sm:p-5 shadow-xs transition-all',
                config.container,
                className
            )}
        >
            <div className="flex items-start gap-3.5">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', config.iconBg)}>
                    <Icon className="h-4.5 w-4.5 stroke-[2]" />
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className={cn('text-sm font-semibold tracking-tight', config.titleText)}>
                        {title}
                    </h4>

                    {message && (
                        <p className={cn('mt-1 text-xs sm:text-sm leading-relaxed', config.bodyText)}>
                            {message}
                        </p>
                    )}

                    {cause && (
                        <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                            <span className="font-semibold">Cause probable :</span> {cause}
                        </p>
                    )}

                    {isDataSafe && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Vos saisies actuelles ont été conservées en mémoire.</span>
                        </p>
                    )}

                    {(recoveryAction || secondaryAction) && (
                        <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                            {recoveryAction && (
                                recoveryAction.href ? (
                                    <Link
                                        href={recoveryAction.href}
                                        className={cn(
                                            'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer',
                                            config.button
                                        )}
                                    >
                                        <span>{recoveryAction.label}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={recoveryAction.onClick}
                                        className={cn(
                                            'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer',
                                            config.button
                                        )}
                                    >
                                        {recoveryAction.isRetry && <RefreshCw className="h-3.5 w-3.5" />}
                                        <span>{recoveryAction.label}</span>
                                    </button>
                                )
                            )}

                            {secondaryAction && (
                                secondaryAction.href ? (
                                    <Link
                                        href={secondaryAction.href}
                                        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.08] transition cursor-pointer"
                                    >
                                        {secondaryAction.label}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={secondaryAction.onClick}
                                        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.08] transition cursor-pointer"
                                    >
                                        {secondaryAction.label}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
