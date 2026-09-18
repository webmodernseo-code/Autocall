'use client';

import { useState, useEffect } from 'react';
import { Phone, PhoneCall, Volume2, Mic, Activity, CheckCircle2, User, Building2, Calendar, Sparkles, RefreshCw, ArrowRight, ShieldCheck, Database } from 'lucide-react';

const SCENARIOS = [
    {
        id: 'b2b-lead',
        tag: 'Prospection B2B',
        title: 'Qualification de Prospect Logiciel',
        caller: 'Alexandre Renard',
        company: 'Nova Conseil SAS',
        phone: '+33 6 42 18 90 24',
        duration: '01:42',
        latency: '312 ms',
        sentiment: 'Chaud (94%)',
        sentimentColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
        intent: 'Déploiement 50 collaborateurs • Budget validé',
        nextAction: 'Rendez-vous démo fixé au Jeudi 14h',
        transcript: [
            { speaker: 'agent', name: 'Sophie (Agent IA)', text: 'Bonjour Monsieur Renard, je vous contacte suite à votre demande sur notre comparateur de solutions télécoms. Avez-vous deux minutes ?' },
            { speaker: 'lead', name: 'Alexandre Renard', text: 'Oui bonjour. Effectivement, nos 50 collaborateurs perdent un temps fou à qualifier les appels entrants et relancer les devis.' },
            { speaker: 'agent', name: 'Sophie (Agent IA)', text: 'C’est exactement ce que nous automatisons. Nos agents vocaux s’intègrent à votre CRM et gèrent jusqu’à 500 appels simultanés avec une diction humaine parfaite.' },
            { speaker: 'lead', name: 'Alexandre Renard', text: 'C’est bluffant, vous répondez instantanément. Est-ce qu’on peut caler une démonstration technique avec notre directeur des opérations ?' },
            { speaker: 'agent', name: 'Sophie (Agent IA)', text: 'Avec plaisir. J’ai un créneau disponible ce jeudi à 14h00. Cela vous convient-il ? Je vous envoie la confirmation par e-mail dans la seconde.' }
        ]
    },
    {
        id: 'medical-booking',
        tag: 'Santé & Cabinet',
        title: 'Prise de Rendez-vous & Filtrage',
        caller: 'Éléonore Mercier',
        company: 'Patiente Particulière',
        phone: '+33 7 81 09 45 12',
        duration: '01:15',
        latency: '298 ms',
        sentiment: 'Prioritaire (98%)',
        sentimentColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
        intent: 'Consultation urgente • Dossier pré-rempli',
        nextAction: 'Créneau validé sur Doctolib / Google Agenda',
        transcript: [
            { speaker: 'lead', name: 'Éléonore Mercier', text: 'Bonjour, j’ai une rage de dents terrible depuis ce matin, le Dr Lambert a-t-il une disponibilité aujourd’hui ?' },
            { speaker: 'agent', name: 'Claire (Secrétariat IA)', text: 'Bonjour Madame Mercier. Je comprends l’urgence. Le Dr Lambert a un désistement à 16h30 au cabinet de Paris 8e. Puis-je vous réserver ce créneau ?' },
            { speaker: 'lead', name: 'Éléonore Mercier', text: 'Oui parfait, 16h30 je serai là ! Merci infiniment.' },
            { speaker: 'agent', name: 'Claire (Secrétariat IA)', text: 'C’est enregistré. Vous recevrez un rappel par SMS dans 5 minutes avec le code d’accès. Prenez soin de vous.' }
        ]
    },
    {
        id: 'real-estate',
        tag: 'Immobilier & Promoteur',
        title: 'Relance d’Acquéreur & Pré-qualification',
        caller: 'Marc Vasseur',
        company: 'Investisseur Privé',
        phone: '+33 6 19 33 87 01',
        duration: '02:08',
        latency: '325 ms',
        sentiment: 'Très Chaud (91%)',
        sentimentColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
        intent: 'Budget 450k€ • T3/T4 Lyon Centre • Financement ok',
        nextAction: 'Fiche transmise à l’agent référent secteur',
        transcript: [
            { speaker: 'agent', name: 'Julien (Agent IA)', text: 'Bonjour Marc, Julien de l’agence Horizon. Vous avez consulté hier soir notre bien de 85m² situé quartier Préfecture à Lyon.' },
            { speaker: 'lead', name: 'Marc Vasseur', text: 'Bonjour Julien. Oui tout à fait, nous cherchons un T3 ou T4 lumineux avec balcon et parking.' },
            { speaker: 'agent', name: 'Julien (Agent IA)', text: 'Ce bien remplit tous vos critères et dispose d’une terrasse de 14m². Avez-vous déjà votre accord de principe bancaire pour 450 000 € ?' },
            { speaker: 'lead', name: 'Marc Vasseur', text: 'Oui, courtier validé à la Société Générale. J’aimerais visiter au plus vite.' },
            { speaker: 'agent', name: 'Julien (Agent IA)', text: 'Parfait Marc. Je transmets votre dossier complet à notre négociateur Pierre qui vous rappelle à 11h pour la visite.' }
        ]
    }
];

export default function CallSimulator() {
    const [selectedScenarioId, setSelectedScenarioId] = useState('b2b-lead');
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeLine, setActiveLine] = useState(2);

    const currentScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

    // Cycle dialog lines gently to showcase realism
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setActiveLine((prev) => (prev + 1) % currentScenario.transcript.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [isPlaying, currentScenario.transcript.length]);

    return (
        <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            {/* Softphone Top Bar */}
            <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="pulse-dot-active absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">Appel Téléphonique HD en Direct</span>
                    </div>
                    <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">Durée : {currentScenario.duration}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 font-mono text-[11px] font-medium">
                        Latence : {currentScenario.latency}
                    </span>
                </div>

                {/* Scenario Selector Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-xs">
                    {SCENARIOS.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => {
                                setSelectedScenarioId(s.id);
                                setActiveLine(0);
                            }}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                                selectedScenarioId === s.id
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {s.tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Console Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800">
                {/* Left: Caller Info & Audio Waveform Visualizer */}
                <div className="p-6 lg:col-span-5 flex flex-col justify-between space-y-6 bg-slate-50/30 dark:bg-slate-900/40">
                    <div>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/20 dark:from-sky-500/20 dark:to-indigo-500/30 border border-sky-500/20 flex items-center justify-center text-sky-700 dark:text-sky-300 font-bold text-base">
                                    {currentScenario.caller.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{currentScenario.caller}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                        {currentScenario.company}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                {currentScenario.phone}
                            </span>
                        </div>

                        {/* Real-time Voice Frequency Waveform */}
                        <div className="mt-6 p-4 rounded-xl bg-slate-900 dark:bg-black text-white shadow-inner">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                                <div className="flex items-center gap-2">
                                    <Volume2 className="w-4 h-4 text-sky-400" />
                                    <span className="font-medium text-slate-200">Spectre Audio Voix HD</span>
                                </div>
                                <span className="font-mono text-emerald-400 text-[11px]">Échantillonnage 48 kHz</span>
                            </div>

                            {/* Animated SVG Audio Waveform */}
                            <div className="h-10 flex items-center justify-center gap-1.5 px-2">
                                <div className="w-1.5 bg-sky-400 rounded-full animate-wave-1"></div>
                                <div className="w-1.5 bg-sky-300 rounded-full animate-wave-2"></div>
                                <div className="w-1.5 bg-indigo-400 rounded-full animate-wave-3"></div>
                                <div className="w-1.5 bg-sky-400 rounded-full animate-wave-4"></div>
                                <div className="w-1.5 bg-emerald-400 rounded-full animate-wave-5"></div>
                                <div className="w-1.5 bg-sky-300 rounded-full animate-wave-6"></div>
                                <div className="w-1.5 bg-indigo-400 rounded-full animate-wave-7"></div>
                                <div className="w-1.5 bg-sky-400 rounded-full animate-wave-8"></div>
                                <div className="w-1.5 bg-emerald-300 rounded-full animate-wave-3"></div>
                                <div className="w-1.5 bg-sky-400 rounded-full animate-wave-5"></div>
                                <div className="w-1.5 bg-indigo-300 rounded-full animate-wave-2"></div>
                                <div className="w-1.5 bg-sky-300 rounded-full animate-wave-6"></div>
                                <div className="w-1.5 bg-sky-400 rounded-full animate-wave-1"></div>
                                <div className="w-1.5 bg-emerald-400 rounded-full animate-wave-4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Live Lead Qualification Telemetry Box */}
                    <div className="space-y-3 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/60">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Scoring IA Prospect</span>
                            <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${currentScenario.sentimentColor}`}>
                                {currentScenario.sentiment}
                            </span>
                        </div>
                        <div className="text-xs">
                            <div className="text-slate-500 dark:text-slate-400 mb-0.5">Intention détectée :</div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">{currentScenario.intent}</div>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <Database className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Synchro CRM (HubSpot / Salesforce)</span>
                            </div>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> En direct
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Live Conversational Stream */}
                <div className="p-6 lg:col-span-7 flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800 text-xs">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">Transcription Vocale Instantanée</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Modèle de diction humaine avancée</span>
                        </div>

                        {/* Dialogue Bubbles */}
                        <div className="space-y-3.5 min-h-[220px]">
                            {currentScenario.transcript.map((line, idx) => {
                                const isAgent = line.speaker === 'agent';
                                const isActive = idx === activeLine;
                                return (
                                    <div
                                        key={idx}
                                        className={`p-3.5 rounded-xl text-xs transition-all duration-300 ${
                                            isActive
                                                ? 'ring-2 ring-sky-500/30 dark:ring-sky-400/30 bg-sky-50/70 dark:bg-sky-950/40'
                                                : isAgent
                                                ? 'bg-slate-100/70 dark:bg-slate-800/60'
                                                : 'bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`font-semibold flex items-center gap-1.5 ${
                                                isAgent ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-200'
                                            }`}>
                                                {isAgent ? <Sparkles className="w-3.5 h-3.5 text-sky-500" /> : <User className="w-3.5 h-3.5 text-slate-500" />}
                                                {line.name}
                                            </span>
                                            {isActive && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-600 dark:text-sky-400 animate-pulse">
                                                    <Mic className="w-3 h-3" /> En cours d’élocution
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {line.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            <span>Action déclenchée : <strong className="text-slate-900 dark:text-white font-medium">{currentScenario.nextAction}</strong></span>
                        </div>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
                            {isPlaying ? 'Pause simulation' : 'Reprendre démo'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
