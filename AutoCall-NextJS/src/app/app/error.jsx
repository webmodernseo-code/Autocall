'use client';

import { RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AppError({ error, reset }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E1017] p-7 shadow-sm text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-6 w-6 stroke-[2]" />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                    Impossible de charger cette page
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    Une difficulté temporaire est survenue lors de l&apos;affichage de votre espace. Cliquez sur recharger pour réessayer.
                </p>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={() => reset ? reset() : window.location.reload()}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-500 transition cursor-pointer"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Recharger la page
                    </button>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition cursor-pointer"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}
