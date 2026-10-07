'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, PhoneCall, Calendar, CheckCircle2, MessageSquare, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export default function VoiceDemoSection() {
    // 4 Scénarios réalistes B2B
    const scenarios = [
        {
            id: 'avocat',
            tabTitle: "Cabinet d'avocats",
            badge: "Urgence juridique",
            time: "21h45",
            callerName: "M. Thomas Laurent",
            callerPhone: "+33 6 14 ** ** 89",
            duration: 28,
            qualification: "Audition libre urgente",
            actionTaken: "Alerte SMS transmise & RDV calé à 08h15",
            dialogue: [
                {
                    speaker: 'client',
                    name: 'M. Laurent (Client)',
                    text: "Bonjour, je cherche à joindre Maître Mercier en urgence concernant une convocation demain matin...",
                    timestamp: '00:03'
                },
                {
                    speaker: 'ai',
                    name: 'Assistant IA du cabinet',
                    text: "Bonjour Monsieur. Maître Mercier n'est plus joignable à cette heure, mais je prends en charge votre demande immédiatement. S'agit-il d'une garde à vue ou d'une convocation ?",
                    timestamp: '00:10'
                },
                {
                    speaker: 'client',
                    name: 'M. Laurent (Client)',
                    text: "C'est une audition libre à 9h au commissariat du 8ème arrondissement.",
                    timestamp: '00:18'
                },
                {
                    speaker: 'ai',
                    name: 'Assistant IA du cabinet',
                    text: "Parfaitement noté. J'envoie une alerte SMS prioritaire à l'avocat et je réserve un point téléphonique d'urgence à 8h15 sur son agenda.",
                    timestamp: '00:25'
                }
            ]
        },
        {
            id: 'immobilier',
            tabTitle: "Agence Immobilière",
            badge: "Visite & Mandat",
            time: "13h10",
            callerName: "Claire Dumont",
            callerPhone: "+33 6 88 ** ** 12",
            duration: 24,
            qualification: "Achat T3 450 000€ financé",
            actionTaken: "Visite programmée Jeudi 14h00",
            dialogue: [
                {
                    speaker: 'client',
                    name: 'Mme Dumont (Prospect)',
                    text: "Bonjour, j'appelle au sujet du T3 avec terrasse avenue Foch vu sur SeLoger, est-il toujours disponible ?",
                    timestamp: '00:03'
                },
                {
                    speaker: 'ai',
                    name: 'Assistant IA Immo',
                    text: "Bonjour Madame. Oui, le bien est toujours en vente au prix de 450 000€. Avez-vous déjà validé votre plan de financement ?",
                    timestamp: '00:09'
                },
                {
                    speaker: 'client',
                    name: 'Mme Dumont (Prospect)',
                    text: "Oui tout à fait, nous avons notre accord de principe bancaire.",
                    timestamp: '00:16'
                },
                {
                    speaker: 'ai',
                    name: 'Assistant IA Immo',
                    text: "Excellent. Je vous propose un créneau de visite ce jeudi à 14h00 ou vendredi à 10h30 avec notre négociateur ?",
                    timestamp: '00:22'
                }
            ]
        },
        {
            id: 'artisan',
            tabTitle: "Artisan & Dépannage",
            badge: "Intervention rapide",
            time: "07h40",
            callerName: "Résidence Les Lilas",
            callerPhone: "+33 7 49 ** ** 33",
            duration: 22,
            qualification: "Fuite importante sous évier",
            actionTaken: "Passage planifié ce matin entre 09h30 et 10h30",
            dialogue: [
                {
                    speaker: 'client',
                    name: 'Syndic / Client',
                    text: "Bonjour, nous avons une fuite d'eau continue sous un chauffe-eau au 2ème étage, c'est très urgent !",
                    timestamp: '00:03'
                },
                {
                    speaker: 'ai',
                    name: 'Standard IA Plomberie',
                    text: "Bonjour. Avez-vous pu couper l'arrivée générale pour limiter les dégâts d'ici l'arrivée du technicien ?",
                    timestamp: '00:08'
                },
                {
                    speaker: 'client',
                    name: 'Syndic / Client',
                    text: "Oui la vanne est fermée, nous sommes au 14 rue Victor Hugo à Boulogne.",
                    timestamp: '00:15'
                },
                {
                    speaker: 'ai',
                    name: 'Standard IA Plomberie',
                    text: "C'est noté. Notre dépanneur d'astreinte est prévenu et intervient chez vous entre 9h30 et 10h30 ce matin.",
                    timestamp: '00:21'
                }
            ]
        },
        {
            id: 'sante',
            tabTitle: "Cabinet Médical",
            badge: "Secrétariat de soins",
            time: "12h15",
            callerName: "Marc Vasseur",
            callerPhone: "+33 6 22 ** ** 70",
            duration: 20,
            qualification: "Report de consultation",
            actionTaken: "Créneau décalé au 18 octobre à 16h20",
            dialogue: [
                {
                    speaker: 'client',
                    name: 'M. Vasseur (Patient)',
                    text: "Bonjour, je suis bloqué au travail, je ne pourrai pas venir à mon rendez-vous de 15h avec le Dr Simon...",
                    timestamp: '00:03'
                },
                {
                    speaker: 'ai',
                    name: 'Secrétariat IA Médical',
                    text: "Bonjour Monsieur Vasseur. Je libère votre créneau de cet après-midi pour un autre patient. Souhaitez-vous reprogrammer votre consultation ?",
                    timestamp: '00:09'
                },
                {
                    speaker: 'client',
                    name: 'M. Vasseur (Patient)',
                    text: "Oui svp, en fin d'après-midi la semaine prochaine.",
                    timestamp: '00:14'
                },
                {
                    speaker: 'ai',
                    name: 'Secrétariat IA Médical',
                    text: "C'est parfait. Je vous réserve le vendredi 18 à 16h20. Vous allez recevoir la confirmation par SMS.",
                    timestamp: '00:19'
                }
            ]
        }
    ];

    const [activeScenarioId, setActiveScenarioId] = useState('avocat');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);

    const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
    const timerRef = useRef(null);

    // Changement de scénario
    const handleSelectScenario = (id) => {
        if (isPlaying) {
            stopPlayback();
        }
        setActiveScenarioId(id);
        setCurrentTime(0);
        setActiveDialogueIndex(0);
    };

    // Gestion du timer de lecture
    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= activeScenario.duration) {
                        stopPlayback();
                        return 0;
                    }
                    const next = prev + 1;
                    // Déterminer la bulle de dialogue active
                    if (next < 8) setActiveDialogueIndex(0);
                    else if (next < 16) setActiveDialogueIndex(1);
                    else if (next < 22) setActiveDialogueIndex(2);
                    else setActiveDialogueIndex(3);
                    return next;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, activeScenario.duration]);

    // Synthèse vocale ou son simulé
    const togglePlay = () => {
        if (isPlaying) {
            stopPlayback();
        } else {
            startPlayback();
        }
    };

    const startPlayback = () => {
        setIsPlaying(true);
        // Si Web Speech API est disponible et non muté, jouer la première phrase
        if ('speechSynthesis' in window && !isMuted) {
            window.speechSynthesis.cancel();
            const phrase = activeScenario.dialogue[1].text; // voix IA
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            // Sélectionner une voix française si disponible
            const voices = window.speechSynthesis.getVoices();
            const frVoice = voices.find(v => v.lang.startsWith('fr'));
            if (frVoice) utterance.voice = frVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopPlayback = () => {
        setIsPlaying(false);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <section id="demo" className="relative px-6 py-20 sm:py-28 text-white">
            {/* LUEUR RADIALE D'ARRIÈRE-PLAN SOUS LA DÉMO */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full blur-[160px] opacity-25"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                {/* 1. ENTÊTE DE SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-4 shadow-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Démonstration Audio Interactive</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                        Une voix naturelle. <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                            Zéro latence. Une vraie conversation.
                        </span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
                        Écoutez comment notre standard téléphonique IA répond en direct, pose les questions adaptées à votre métier et synchronise votre agenda en temps réel.
                    </p>

                    {/* 2. ONGLETS DES SCÉNARIOS */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        {scenarios.map((sc) => {
                            const isSelected = sc.id === activeScenarioId;
                            return (
                                <button
                                    key={sc.id}
                                    onClick={() => handleSelectScenario(sc.id)}
                                    className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'bg-white text-black font-semibold shadow-lg shadow-white/10 scale-[1.02]'
                                            : 'border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
                                    }`}
                                >
                                    {sc.tabTitle}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. LE LECTEUR / SIMULATEUR D'APPEL INTERACTIF */}
                <div className="rounded-3xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* COLONNE GAUCHE : LECTEUR ET CONTRÔLES (5 colonnes) */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                            {/* Entête de l'appel */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                                        <PhoneCall className="h-3.5 w-3.5" />
                                        Appel entrant à {activeScenario.time}
                                    </span>
                                    <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] font-mono text-white/70">
                                        Latence ~410ms
                                    </span>
                                </div>
                                <div className="text-base font-semibold text-white">
                                    {activeScenario.callerName}
                                </div>
                                <div className="text-xs font-mono text-white/50 mt-0.5">
                                    {activeScenario.callerPhone}
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                                    <span className="text-white/60">Motif détecté :</span>
                                    <span className="font-medium text-white/90 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                                        {activeScenario.badge}
                                    </span>
                                </div>
                            </div>

                            {/* Onde sonore animée */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
                                <div className="flex items-center justify-center gap-1 h-14 mb-4">
                                    {[...Array(28)].map((_, i) => {
                                        // Barres d'égaliseur animées quand la lecture est en cours
                                        const heights = [35, 60, 90, 45, 75, 100, 50, 80, 65, 40, 85, 95, 55, 70, 90, 60, 45, 80, 100, 65, 40, 75, 85, 50, 65, 90, 45, 30];
                                        const heightPercent = isPlaying ? heights[i % heights.length] : 20;
                                        return (
                                            <span
                                                key={i}
                                                style={{
                                                    height: `${heightPercent}%`,
                                                    transition: 'height 0.18s ease-in-out'
                                                }}
                                                className={`w-1 rounded-full ${
                                                    isPlaying
                                                        ? 'bg-gradient-to-t from-emerald-400 to-sky-400'
                                                        : 'bg-white/20'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Temps et Contrôles */}
                                <div className="flex items-center justify-between text-xs font-mono text-white/50 px-2 mb-4">
                                    <span>{formatTime(currentTime)}</span>
                                    <div className="flex-1 mx-3 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white transition-all duration-300"
                                            style={{ width: `${(currentTime / activeScenario.duration) * 100}%` }}
                                        />
                                    </div>
                                    <span>{formatTime(activeScenario.duration)}</span>
                                </div>

                                {/* Boutons Play / Pause et Mute */}
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={togglePlay}
                                        className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95 shadow-xl shadow-white/10 cursor-pointer"
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-6 w-6 fill-current" />
                                        ) : (
                                            <Play className="h-6 w-6 fill-current ml-0.5" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="rounded-full border border-white/10 bg-white/5 p-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                        aria-label={isMuted ? "Activer le son" : "Couper le son"}
                                        title={isMuted ? "Son coupé" : "Son activé"}
                                    >
                                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="mt-3 text-[11px] text-white/40">
                                    {isPlaying ? "Lecture de la conversation..." : "Cliquez sur Play pour écouter l'échange"}
                                </div>
                            </div>

                            {/* Résultat & Action automatique */}
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 text-xs">
                                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Action déclenchée automatiquement :</span>
                                </div>
                                <p className="text-white/80 pl-6">
                                    {activeScenario.actionTaken}
                                </p>
                            </div>
                        </div>

                        {/* COLONNE DROITE : TRANSCRIPTION EN DIRECT DE L'ÉCHANGE (7 colonnes) */}
                        <div className="lg:col-span-7 flex flex-col justify-between h-full bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-7">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-white/60" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                                        Transcription en temps réel
                                    </span>
                                </div>
                                <span className="text-[11px] text-white/40 font-mono">
                                    Synchronisé à la voix
                                </span>
                            </div>

                            {/* Bulles de dialogue interactives */}
                            <div className="space-y-4">
                                {activeScenario.dialogue.map((item, idx) => {
                                    const isCurrent = activeDialogueIndex === idx;
                                    const isAi = item.speaker === 'ai';

                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded-2xl p-4 transition-all duration-300 ${
                                                isAi
                                                    ? isCurrent
                                                        ? 'bg-white/[0.09] border border-white/20 shadow-lg'
                                                        : 'bg-white/[0.03] border border-white/5 opacity-80'
                                                    : isCurrent
                                                    ? 'bg-sky-500/10 border border-sky-400/20'
                                                    : 'bg-white/[0.02] border border-white/5 opacity-70'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    {isAi ? (
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                                            IA
                                                        </span>
                                                    ) : (
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                                                            PRO
                                                        </span>
                                                    )}
                                                    <span className={`font-semibold ${isAi ? 'text-white' : 'text-sky-200'}`}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] font-mono text-white/40">
                                                    {item.timestamp}
                                                </span>
                                            </div>

                                            <p className="text-xs sm:text-sm text-white/85 leading-relaxed pl-7">
                                                {item.text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Garanties en bas de la boîte */}
                            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/50">
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-white/70" />
                                    Prise en charge en 1 sonnerie
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-white/70" />
                                    Synchronisation Google & Outlook
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-white/70" />
                                    Données confidentielles RGPD
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 4. APPEL À L'ACTION SOUS LA DÉMO */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-white/70 mb-4">
                        Vous souhaitez tester la voix en direct sur votre propre téléphone ?
                    </p>
                    <a
                        href="/register"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:border-white hover:scale-105"
                    >
                        <span>Créer mon numéro test gratuit</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
