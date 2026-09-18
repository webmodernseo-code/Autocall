'use client';

export default function BrandLogo({ className = 'h-8', textClassName = 'text-xl font-bold tracking-tight text-slate-900 dark:text-white', iconSize = 32 }) {
    return (
        <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
            {/* Pure SVG acoustic waveform icon */}
            <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs">
                <svg
                    width={iconSize - 6}
                    height={iconSize - 6}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                >
                    {/* Soundwave bars and handset silhouette */}
                    <rect x="2" y="9" width="2.5" height="6" rx="1.25" fill="currentColor" fillOpacity="0.6" />
                    <rect x="6.5" y="5" width="2.5" height="14" rx="1.25" fill="currentColor" />
                    <rect x="11" y="2" width="2.5" height="20" rx="1.25" fill="#38BDF8" />
                    <rect x="15.5" y="5" width="2.5" height="14" rx="1.25" fill="currentColor" />
                    <rect x="20" y="9" width="2.5" height="6" rx="1.25" fill="currentColor" fillOpacity="0.6" />
                </svg>
            </div>
            <div className="flex flex-col">
                <span className={textClassName}>
                    Call<span className="text-sky-600 dark:text-sky-400">Mind</span><span className="text-xs font-semibold px-1.5 py-0.5 ml-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 tracking-normal uppercase">AI</span>
                </span>
            </div>
        </div>
    );
}
