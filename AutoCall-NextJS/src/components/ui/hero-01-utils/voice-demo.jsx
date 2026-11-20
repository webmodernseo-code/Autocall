'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    PhoneCall,
    CalendarCheck2,
    CheckCircle2,
    ArrowUpRight,
    Clock,
    ShieldCheck,
    User,
    Bot,
} from 'lucide-react';

const SCENARIOS = [
    {
        id: 'avocat',
        tabTitle: "Cabinet d'avocats",
        badge: 'Urgence juridique',
        time: '21h45',
        callerName: 'M. Thomas Laurent',
        callerPhone: '+33 6 14 ** ** 89',
        duration: 28,
        qualification: 'Audition libre urgente · 8ème arr.',
        actionTaken: 'Alerte SMS prioritaire & RDV bloqué à 08h15',
        dialogue: [
            {
                speaker: 'client',
                name: 'M. Laurent',
                text: "Bonjour, je cherche à joindre Maître Mercier en urgence concernant une convocation demain matin...",
                timestamp: '00:03',
            },
            {
                speaker: 'ai',
                name: 'Assistant IA AutoCall',
                text: "Bonjour Monsieur. Maître Mercier n'est plus joignable à cette heure, mais je prends en charge votre demande immédiatement. S'agit-il d'une garde à vue ou d'une convocation ?",
                timestamp: '00:10',
            },
            {
                speaker: 'client',
                name: 'M. Laurent',
                text: "C'est une audition libre à 9h au commissariat du 8ème arrondissement.",
                timestamp: '00:18',
            },
            {
                speaker: 'ai',
                name: 'Assistant IA AutoCall',
                text: "Parfaitement noté. J'envoie une alerte SMS prioritaire à l'avocat et je réserve un point téléphonique d'urgence à 8h15 sur son agenda.",
                timestamp: '00:25',
            },
        ],
    },
    {
        id: 'immobilier',
        tabTitle: 'Agence Immobilière',
        badge: 'Visite & Mandat',
        time: '13h10',
        callerName: 'Claire Dumont',
        callerPhone: '+33 6 88 ** ** 12',
        duration: 24,
        qualification: 'Achat T3 450 000€ · Accord bancaire validé',
        actionTaken: 'Visite programmée Jeudi à 14h00',
        dialogue: [
            {
                speaker: 'client',
                name: 'Mme Dumont',
                text: "Bonjour, j'appelle au sujet du T3 avec terrasse avenue Foch vu sur SeLoger, est-il toujours disponible ?",
                timestamp: '00:03',
            },
            {
                speaker: 'ai',
                name: 'Assistant IA AutoCall',
                text: "Bonjour Madame. Oui, le bien est toujours en vente au prix de 450 000€. Avez-vous déjà validé votre plan de financement ?",
                timestamp: '00:09',
            },
            {
                speaker: 'client',
                name: 'Mme Dumont',
                text: "Oui tout à fait, nous avons notre accord de principe bancaire.",
                timestamp: '00:16',
            },
            {
                speaker: 'ai',
                name: 'Assistant IA AutoCall',
                text: "Excellent. Je vous propose un créneau de visite ce jeudi à 14h00 ou vendredi à 10h30 avec notre négociateur ?",
                timestamp: '00:22',
            },
        ],
    },
    {
        id: 'artisan',
        tabTitle: 'Artisan & Dépannage',
        badge: 'Intervention rapide',
        time: '07h40',
        callerName: 'Résidence Les Lilas',
        callerPhone: '+33 7 49 ** ** 33',
        duration: 22,
        qualification: 'Fuite continue sous chauffe-eau · Boulogne',
        actionTaken: 'Passage technicien confirmé 09h30–10h30',
        dialogue: [
            {
                speaker: 'client',
                name: 'Syndic / Client',
                text: "Bonjour, nous avons une fuite d'eau continue sous un chauffe-eau au 2ème étage, c'est très urgent !",
                timestamp: '00:03',
            },
            {
                speaker: 'ai',
                name: 'Assistant IA AutoCall',
                text: "Bonjour. Avez-vous pu couper l'arrivée générale pour limiter les dégâts d'ici l'arrivée du technicien ?",
                timestamp: '00:08',
            },
            {
                speaker: 'client',
                name: 'Syndic / Client',
                text: "Oui la vanne est fermée, nous sommes au 14 rue Victor Hugo à Boulogne.",
                timestamp: '00:15',
            },
            {
                speaker: 'ai',
                name: 'Assistant IA AutoCall',
                text: "C'est noté. Notre dépanneur d'astreinte est prévenu et intervient chez vous entre 9h30 et 10h30 ce matin.",
                timestamp: '00:21',
            },
        ],
    },
    {
        id: 'sante',
        tabTitle: 'Cabinet Médical',
        badge: 'Secrétariat de soins',
        time: '12h15',
        callerName: 'Marc Vasseur',
        callerPhone: '+33 6 22 ** ** 70',
        duration: 20,
        qualification: 'Report de consultation Dr Simon',
        actionTaken: 'Créneau reporté au Vendredi 18 à 16h20',
        dialogue: [
            {
                speaker: 'client',
                name: 'M. Vasseur',
                text: "Bonjour, je suis bloqué au travail, je ne pourrai pas venir à mon rendez-vous de 15h avec le Dr Simon...",
                timestamp: '00:03',
            },
            {
                speaker: 'ai',
                name: 'Assistant IA AutoCall',
                text: "Bonjour Monsieur Vasseur. Je libère votre créneau de cet après-midi pour un autre patient. Souhaitez-vous reprogrammer votre consultation ?",
                timestamp: '00:09',
            },
            {
                speaker: 'client',
                name: 'M. Vasseur',
                text: "Oui svp, en fin d'après-midi la semaine prochaine.",
                timestamp: '00:14',
            },
            {
                speaker: 'ai',
                name: 'Assistant IA AutoCall',
                text: "C'est parfait. Je vous réserve le vendredi 18 à 16h20. Vous allez recevoir la confirmation par SMS.",
                timestamp: '00:19',
            },
        ],
    },
];

const WAVE_BARS = [28, 52, 78, 42, 92, 65, 38, 84, 70, 48, 95, 60, 34, 76, 88, 50, 68, 40, 82, 56, 72, 44, 90, 58];

export default function VoiceDemoSection() {
    const [activeScenarioId, setActiveScenarioId] = useState('avocat');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);

    const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
    const timerRef = useRef(null);

    const stopPlayback = () => {
        setIsPlaying(false);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };

    const handleSelectScenario = (id) => {
        if (isPlaying) stopPlayback();
        setActiveScenarioId(id);
        setCurrentTime(0);
        setActiveDialogueIndex(0);
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev >= activeScenario.duration) {
                        stopPlayback();
                        return 0;
                    }
                    const next = prev + 1;
                    if (next < 7) setActiveDialogueIndex(0);
                    else if (next < 14) setActiveDialogueIndex(1);
                    else if (next < 20) setActiveDialogueIndex(2);
                    else setActiveDialogueIndex(3);
                    return next;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, activeScenario.duration]);

    const startPlayback = () => {
        setIsPlaying(true);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isMuted) {
            window.speechSynthesis.cancel();
            const phrase = activeScenario.dialogue[1].text;
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.04;
            utterance.pitch = 1.0;
            const voices = window.speechSynthesis.getVoices();
            const frVoice = voices.find((v) => v.lang.startsWith('fr'));
            if (frVoice) utterance.voice = frVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    const togglePlay = () => {
        if (isPlaying) stopPlayback();
        else startPlayback();
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progressPct = Math.min(100, Math.round((currentTime / activeScenario.duration) * 100));

    return (
        <section id="demo" className="bg-[#F8FAFC] text-neutral-900 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 scroll-mt-20">
            <div id="produit" className="sr-only" />
            <div className="mx-auto max-w-6xl">
                {/* En-tête centré */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-xs font-medium text-neutral-600 shadow-2xs">
                        <PhoneCall className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span>Démonstration vocale interactive</span>
                    </span>
                    <h2 className="mt-4 font-hero-sans text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-950">
                        Des conversations naturelles, des fiches qualifiées
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Écoutez comment AutoCall gère vos appels en direct et structure automatiquement chaque compte-rendu.
                    </p>
                </div>

                {/* Onglets */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    {SCENARIOS.map((sc) => {
                        const active = sc.id === activeScenarioId;
                        return (
                            <button
                                key={sc.id}
                                type="button"
                                onClick={() => handleSelectScenario(sc.id)}
                                className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                                    active
                                        ? 'bg-[#2563EB] text-white shadow-xs'
                                        : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-neutral-950'
                                }`}
                            >
                                {sc.tabTitle}
                            </button>
                        );
                    })}
                </div>

                {/* Studio 2 colonnes */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Lecteur + Résumé */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-5">
                        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-2xs">
                            <div className="flex items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                                <div>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2563EB]">
                                        {activeScenario.badge}
                                    </span>
                                    <h3 className="mt-2 text-base font-bold text-neutral-950">
                                        {activeScenario.callerName}
                                    </h3>
                                    <p className="text-xs text-neutral-500 font-mono tabular-nums mt-0.5">
                                        {activeScenario.callerPhone} · {activeScenario.time}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-neutral-500 bg-neutral-50 border border-neutral-200/80 rounded-lg px-2.5 py-1">
                                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                                    <span>{formatTime(activeScenario.duration)}</span>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={togglePlay}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white transition-transform hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                                    aria-label={isPlaying ? 'Mettre en pause' : 'Écouter la conversation'}
                                >
                                    {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 ml-0.5" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-end justify-between gap-1 h-9">
                                        {WAVE_BARS.map((height, idx) => {
                                            const barPct = (idx / WAVE_BARS.length) * 100;
                                            const isPassed = barPct <= progressPct;
                                            return (
                                                <span
                                                    key={idx}
                                                    className={`w-1 rounded-full transition-colors duration-200 ${
                                                        isPassed ? 'bg-[#2563EB]' : 'bg-neutral-200'
                                                    }`}
                                                    style={{ height: `${height}%` }}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs font-mono tabular-nums text-neutral-500">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(activeScenario.duration)}</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
                                    aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                                >
                                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-2xs flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span>Synthèse post-appel générée par l&apos;IA</span>
                                </div>
                                <div className="mt-4 space-y-3">
                                    <div className="rounded-xl border border-neutral-100 bg-[#F8FAFC] p-3.5">
                                        <div className="text-xs text-neutral-500">Qualification détectée</div>
                                        <div className="mt-1 text-sm font-semibold text-neutral-900">
                                            {activeScenario.qualification}
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                                            <CalendarCheck2 className="h-3.5 w-3.5" />
                                            <span>Action exécutée</span>
                                        </div>
                                        <div className="mt-1 text-sm font-semibold text-neutral-900">
                                            {activeScenario.actionTaken}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                                    <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
                                    <span>Latence &lt; 420 ms</span>
                                </span>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                                >
                                    <span>Tester avec mon numéro</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Transcription synchronisée */}
                    <div className="lg:col-span-7 rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                            <div className="flex items-center gap-2.5">
                                <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300'}`} />
                                <span className="text-sm font-semibold text-neutral-900">Transcription synchronisée</span>
                            </div>
                            <span className="text-xs text-neutral-500 font-mono">FR · Audio HD</span>
                        </div>

                        <div className="my-5 space-y-3.5 flex-1">
                            {activeScenario.dialogue.map((msg, idx) => {
                                const isAI = msg.speaker === 'ai';
                                const isActive = isPlaying && activeDialogueIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        className={`flex gap-3 rounded-xl p-3.5 transition-all duration-200 border ${
                                            isActive
                                                ? 'border-blue-300 bg-blue-50/40'
                                                : isAI
                                                    ? 'border-neutral-200/70 bg-[#F8FAFC]'
                                                    : 'border-neutral-100 bg-white'
                                        }`}
                                    >
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                                isAI
                                                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                                                    : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                                            }`}
                                        >
                                            {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-neutral-900">{msg.name}</span>
                                                <span className="text-xs font-mono tabular-nums text-neutral-400">
                                                    {msg.timestamp}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm leading-relaxed text-neutral-700">{msg.text}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-500">
                            <span>Chaque appel est transcrit, scoré et archivé dans votre console.</span>
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
                            >
                                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                                <span>{isPlaying ? 'Arrêter' : 'Écouter la réponse IA'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tableau structuré des appels qualifiés (style "Smart lead scoring intelligence") */}
                <div className="mt-12 rounded-2xl border border-neutral-200/90 bg-white shadow-2xs overflow-hidden">
                    <div className="border-b border-neutral-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F8FAFC]/60">
                        <div>
                            <h3 className="text-sm font-bold text-neutral-950">
                                Journal de qualification automatique des appels
                            </h3>
                            <p className="text-xs text-neutral-500">
                                Extraction structurée des informations clés après chaque conversation.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Synchronisation CRM temps réel
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-100 text-xs font-semibold text-neutral-500 bg-neutral-50/50">
                                    <th className="py-3 px-6">Appelant</th>
                                    <th className="py-3 px-6">Secteur</th>
                                    <th className="py-3 px-6">Synthèse IA</th>
                                    <th className="py-3 px-6">Action &amp; Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
                                {SCENARIOS.map((row) => (
                                    <tr
                                        key={row.id}
                                        onClick={() => handleSelectScenario(row.id)}
                                        className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                                    >
                                        <td className="py-3.5 px-6 font-semibold text-neutral-900 whitespace-nowrap">
                                            <div>{row.callerName}</div>
                                            <div className="text-xs font-mono text-neutral-400 font-normal">{row.callerPhone}</div>
                                        </td>
                                        <td className="py-3.5 px-6 text-neutral-600 whitespace-nowrap">{row.tabTitle}</td>
                                        <td className="py-3.5 px-6 text-neutral-700">{row.qualification}</td>
                                        <td className="py-3.5 px-6 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                {row.actionTaken}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
