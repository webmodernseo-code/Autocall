'use client';

import { ShieldCheck, Lock, Server, Zap, CheckCircle2 } from 'lucide-react';

export default function TrustBadgeLine({ className = '' }) {
    const badges = [
        {
            icon: ShieldCheck,
            label: 'Conforme RGPD & Données Hébergées en UE',
        },
        {
            icon: Zap,
            label: 'Latence Télécom Ultra-Faible < 320ms',
        },
        {
            icon: Lock,
            label: 'Chiffrement Téléphonique TLS 1.3 & SRTP',
        },
        {
            icon: Server,
            label: 'Disponibilité Infrastructure 99.98%',
        },
    ];

    return (
        <div className={`w-full py-4 border-y border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-y-3 gap-x-6 text-xs text-slate-600 dark:text-slate-400">
                    {badges.map((b, idx) => {
                        const Icon = b.icon;
                        return (
                            <div key={idx} className="flex items-center gap-2 font-medium">
                                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span>{b.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
