'use client';

import { 
    Headphones, 
    PhoneForwarded, 
    CalendarCheck, 
    BarChart3, 
    Layers, 
    ShieldCheck, 
    Sparkles, 
    Activity, 
    CheckCircle2, 
    ArrowUpRight,
    Cpu,
    GitBranch,
    SlidersHorizontal
} from 'lucide-react';

export default function BentoFeatures() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Natural Voice & Conversational Engine (Large span) */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-2xs group">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            <Headphones className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Latence Télécom &lt; 320ms
                        </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Une voix d’un naturel saisissant, capable d’écouter et d’interrompre avec tact
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        Fini les robots rigides. Nos agents comprennent l'intonation, acceptent d’être interrompus en pleine phrase, adaptent leur débit et répondent avec la chaleur d’un collaborateur chevronné.
                    </p>
                </div>

                {/* Micro preview widget */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Gestion intelligente des interruptions (Barge-in)
                        </span>
                        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">Actif</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full w-4/5 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                        <span>Écoute active continue</span>
                        <span>Détection d’hésitation</span>
                        <span>Reprise naturelle du fil</span>
                    </div>
                </div>
            </div>

            {/* Card 2: Predictive Dialer & CSV Import */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-2xs group">
                <div>
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 w-fit mb-4">
                        <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Dialer Prédictif & Campagnes de Masse
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        Importez vos listes de contacts en CSV. Le système cadence les appels, filtre les répondeurs et reprogramme intelligemment les numéros occupés.
                    </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Concurrence régulée</span>
                    <strong className="text-slate-900 dark:text-white font-mono">Jusqu’à 1 000 appels / min</strong>
                </div>
            </div>

            {/* Card 3: Live Transfer to Human Agent */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-2xs group">
                <div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit mb-4">
                        <PhoneForwarded className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Transfert Chaud à un Conseiller
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        Dès qu'un prospect demande un interlocuteur dédié ou une validation contractuelle, l’appel est basculé sans interruption avec le résumé de la conversation.
                    </p>
                </div>

                <div className="mt-6 p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Passation transparente avec fiche client pré-remplie</span>
                </div>
            </div>

            {/* Card 4: Calendar Booking Integration */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-2xs group">
                <div>
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 w-fit mb-4">
                        <CalendarCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Prise de Rendez-vous Automatisée
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        Connexion directe à Google Calendar, Microsoft Outlook ou Cal.com. L'agent propose les créneaux libres en temps réel et envoie l'invitation avec rappel SMS.
                    </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Synchronisation bi-directionnelle</span>
                    <strong className="text-slate-900 dark:text-white font-mono">0 conflit d’agenda</strong>
                </div>
            </div>

            {/* Card 5: Enterprise Analytics & AI Transcripts (Large span) */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-2xs group">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300">
                            Intelligence Commerciale
                        </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Enregistrements audio, transcriptions intégrales et scoring automatique
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        Chaque appel est consigné avec son enregistrement haute fidélité, sa transcription mot à mot, l'analyse du sentiment client, les objections soulevées et la synthèse des prochaines actions à mener.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 block">Taux de décroché</span>
                        <strong className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">+64%</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 block">Exactitude du scoring</span>
                        <strong className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">98.6%</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 block">Délai moyen de qualification</span>
                        <strong className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">1m 45s</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
