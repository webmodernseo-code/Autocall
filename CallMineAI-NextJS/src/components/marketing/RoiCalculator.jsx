'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Clock, PiggyBank, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

export default function RoiCalculator() {
    const [monthlyCalls, setMonthlyCalls] = useState(2500);
    const [callDuration, setCallDuration] = useState(4); // minutes
    const [hourlyRate, setHourlyRate] = useState(32); // €/h

    // Calculate metrics
    const totalMinutes = monthlyCalls * callDuration;
    const hoursSavedMonth = Math.round(totalMinutes / 60);
    const humanCostMonth = Math.round(hoursSavedMonth * hourlyRate);
    const estimatedCallMindCost = Math.round(monthlyCalls * 0.12 + 149); // Est ~0.12€/call + plan
    const monthlyNetSavings = Math.max(0, humanCostMonth - estimatedCallMindCost);
    const annualNetSavings = monthlyNetSavings * 12;
    const roiMultiplier = Math.max(1, (humanCostMonth / Math.max(1, estimatedCallMindCost))).toFixed(1);

    return (
        <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/60">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 uppercase tracking-wider">
                            Simulateur de Rentabilité Télécom
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
                            Calculez vos économies réelles et votre retour sur investissement
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Ajustez les curseurs selon votre volume d’appels et visualisez l'impact immédiat sur vos marges.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800">
                {/* Sliders Input Column */}
                <div className="p-6 md:p-8 lg:col-span-6 space-y-7">
                    {/* Slider 1: Monthly Calls */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <PhoneCall className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                Volume d’appels mensuels
                            </label>
                            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md tabular-nums">
                                {monthlyCalls.toLocaleString('fr-FR')} appels / mois
                            </span>
                        </div>
                        <input
                            type="range"
                            min="200"
                            max="20000"
                            step="100"
                            value={monthlyCalls}
                            onChange={(e) => setMonthlyCalls(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600 dark:accent-sky-500"
                        />
                        <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                            <span>200</span>
                            <span>5 000</span>
                            <span>10 000</span>
                            <span>20 000+</span>
                        </div>
                    </div>

                    {/* Slider 2: Call Duration */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                Durée moyenne par appel
                            </label>
                            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md tabular-nums">
                                {callDuration} minutes
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={callDuration}
                            onChange={(e) => setCallDuration(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                        />
                        <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                            <span>1 min</span>
                            <span>3 min</span>
                            <span>6 min</span>
                            <span>10 min</span>
                        </div>
                    </div>

                    {/* Slider 3: Hourly Cost */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                Coût horaire moyen opérateur / commercial chargé
                            </label>
                            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md tabular-nums">
                                {hourlyRate} € / heure
                            </span>
                        </div>
                        <input
                            type="range"
                            min="15"
                            max="70"
                            step="1"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
                        />
                        <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                            <span>15 €</span>
                            <span>30 €</span>
                            <span>50 €</span>
                            <span>70 €</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Résultats mesurés sur plus de 120 entreprises déployées :</span>
                        </div>
                        <p className="leading-relaxed">
                            Les agents CallMindAI absorbent les pics d’appels à 100%, traitent les demandes sans temps d’attente et transmettent uniquement les leads à fort potentiel à vos équipes.
                        </p>
                    </div>
                </div>

                {/* Live Output ROI Metrics Column */}
                <div className="p-6 md:p-8 lg:col-span-6 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Metric 1 */}
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                <span>Temps libéré par mois</span>
                                <Clock className="w-4 h-4 text-sky-500" />
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                                {hoursSavedMonth} <span className="text-sm font-sans font-medium text-slate-500">heures</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">Soit l’équivalent de {((hoursSavedMonth / 151.67)).toFixed(1)} équivalent temps plein</p>
                        </div>

                        {/* Metric 2 */}
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                <span>Multiplicateur ROI</span>
                                <TrendingUp className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                                {roiMultiplier}x
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">Gain net calculé par euro investi</p>
                        </div>

                        {/* Metric 3: Monthly Net Savings */}
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Économies nettes / mois</div>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                                {monthlyNetSavings.toLocaleString('fr-FR')} €
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">Comparé à une équipe humaine dédiée</p>
                        </div>

                        {/* Metric 4: Annual Net Savings */}
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-2xs">
                            <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium mb-1">Économies nettes / an</div>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 font-mono tabular-nums">
                                {annualNetSavings.toLocaleString('fr-FR')} €
                            </div>
                            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-1">Réinvestis directement dans votre croissance</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-900 text-white dark:bg-black border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold">Prêt à tester sur votre propre flux d’appels ?</div>
                            <div className="text-xs text-slate-400 mt-0.5">10 minutes d’appels offertes sans engagement.</div>
                        </div>
                        <a
                            href="/register"
                            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors shrink-0 shadow-xs"
                        >
                            Démarrer mon essai <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
