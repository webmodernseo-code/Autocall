'use client';

import { Check, X, Minus, Sparkles } from 'lucide-react';

const COMPARISONS = [
    {
        feature: 'Disponibilité horaire & gestion des pics',
        callmind: '24/7/365 instantané, 0 file d’attente',
        traditional: 'Limité aux heures ouvrées (9h-18h)',
        bots: '24/7 mais limité aux arbres textuels rigides',
        status: [true, false, 'partial']
    },
    {
        feature: 'Coût moyen par appel traité',
        callmind: '0,10 € à 0,18 € / appel',
        traditional: '3,50 € à 8,00 € / appel',
        bots: '0,05 € (mais sans conversion réelle)',
        status: [true, false, false]
    },
    {
        feature: 'Capacité d’appels simultanés',
        callmind: 'Jusqu’à 1 000+ appels en parallèle',
        traditional: 'Strictement plafonné au nombre d’opérateurs',
        bots: 'Illimité (messages textuels uniquement)',
        status: [true, false, 'partial']
    },
    {
        feature: 'Compréhension du langage naturel & interruptions',
        callmind: 'Diction fluide, gestion du barge-in',
        traditional: 'Humain mais variable selon la fatigue',
        bots: 'Incapable de gérer une interruption',
        status: [true, true, false]
    },
    {
        feature: 'Synchronisation CRM automatique (HubSpot, Salesforce)',
        callmind: 'Temps réel avec scoring & notes',
        traditional: 'Saisie manuelle fastidieuse (erreurs fréquentes)',
        bots: 'Webhooks basiques sans qualification',
        status: [true, false, 'partial']
    },
    {
        feature: 'Prise de rendez-vous directe sur agenda',
        callmind: 'Google Calendar / Outlook / Cal.com',
        traditional: 'Oui (mais chronophage)',
        bots: 'Lien externe partagé sans confirmation',
        status: [true, 'partial', false]
    },
    {
        feature: 'Enregistrement audio HD & transcription mot à mot',
        callmind: 'Inclus avec analyse de sentiment',
        traditional: 'Option payante ou absente',
        bots: 'Historique texte brut sans synthèse',
        status: [true, false, false]
    }
];

export default function ComparisonMatrix() {
    return (
        <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
                            <th className="p-4 md:p-6 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider w-2/5">
                                Fonctionnalité Télécom
                            </th>
                            <th className="p-4 md:p-6 text-xs font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider bg-sky-500/5 dark:bg-sky-500/10 border-x border-sky-500/20 w-2/5">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-sky-500" />
                                    <span>CallMindAI</span>
                                </div>
                            </th>
                            <th className="p-4 md:p-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-1/5 hidden md:table-cell">
                                Centres d’Appels Humains
                            </th>
                            <th className="p-4 md:p-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-1/5 hidden lg:table-cell">
                                Chatbots / SVI Vocaux
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-xs md:text-sm">
                        {COMPARISONS.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="p-4 md:p-6 font-semibold text-slate-800 dark:text-slate-200">
                                    {row.feature}
                                </td>

                                {/* CallMindAI column */}
                                <td className="p-4 md:p-6 bg-sky-500/5 dark:bg-sky-500/10 border-x border-sky-500/20">
                                    <div className="flex items-start gap-2 font-medium text-slate-900 dark:text-white">
                                        <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span>{row.callmind}</span>
                                    </div>
                                </td>

                                {/* Traditional Call Centers */}
                                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-400 hidden md:table-cell">
                                    <div className="flex items-start gap-2">
                                        {row.status[1] === true ? (
                                            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                        ) : row.status[1] === 'partial' ? (
                                            <div className="p-1 rounded-full bg-amber-500/10 text-amber-600 shrink-0 mt-0.5">
                                                <Minus className="w-3.5 h-3.5" />
                                            </div>
                                        ) : (
                                            <div className="p-1 rounded-full bg-rose-500/10 text-rose-500 shrink-0 mt-0.5">
                                                <X className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                        <span>{row.traditional}</span>
                                    </div>
                                </td>

                                {/* Generic Bots */}
                                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                                    <div className="flex items-start gap-2">
                                        {row.status[2] === true ? (
                                            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                        ) : row.status[2] === 'partial' ? (
                                            <div className="p-1 rounded-full bg-amber-500/10 text-amber-600 shrink-0 mt-0.5">
                                                <Minus className="w-3.5 h-3.5" />
                                            </div>
                                        ) : (
                                            <div className="p-1 rounded-full bg-rose-500/10 text-rose-500 shrink-0 mt-0.5">
                                                <X className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                        <span>{row.bots}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
