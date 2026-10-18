export default function ClientAreaLoading() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950" role="status" aria-live="polite">
            <span className="sr-only">Chargement de la page...</span>

            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-neutral-200/80 bg-white/70 px-4 py-5 dark:border-white/[0.07] dark:bg-[#0E1017]">
                <div className="h-8 w-32 animate-pulse rounded-lg bg-neutral-200/80 dark:bg-white/[0.08]" />
                <div className="mt-8 space-y-3">
                    {[72, 88, 64, 92, 76, 84].map((width, index) => (
                        <div
                            key={index}
                            className="h-10 animate-pulse rounded-xl bg-neutral-100 dark:bg-white/[0.05]"
                            style={{ width: `${width}%` }}
                        />
                    ))}
                </div>
            </div>

            <div className="lg:pl-64">
                <div className="h-16 border-b border-neutral-200/80 bg-white/80 dark:border-white/[0.07] dark:bg-neutral-950" />
                <main className="space-y-6 p-4 sm:p-6 lg:p-8">
                    <div className="space-y-2">
                        <div className="h-8 w-56 animate-pulse rounded-lg bg-neutral-200/80 dark:bg-white/[0.08]" />
                        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-neutral-100 dark:bg-white/[0.05]" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[0, 1, 2, 3].map((item) => (
                            <div key={item} className="h-28 animate-pulse rounded-2xl border border-neutral-200/80 bg-white dark:border-white/[0.07] dark:bg-[#131622]" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        <div className="h-80 animate-pulse rounded-2xl border border-neutral-200/80 bg-white lg:col-span-2 dark:border-white/[0.07] dark:bg-[#131622]" />
                        <div className="h-80 animate-pulse rounded-2xl border border-neutral-200/80 bg-white dark:border-white/[0.07] dark:bg-[#131622]" />
                    </div>
                </main>
            </div>
        </div>
    );
}
