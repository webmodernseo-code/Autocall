'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, Volume2, VolumeX, Phone, Check,
    Scale, Building2, Wrench, Stethoscope, ArrowRight
} from 'lucide-react';

export default function VoiceDemoSection({ isDark = true }) {
    const scenarios = [
        {
            id: 'avocat',
            title: "Avocat",
            icon: Scale,
            proLabel: "Maître Vincent Mercier · Droit pénal (Paris 8e)",
            callMeta: "Appel entrant à 21h45",
            callerName: "M. Thomas Laurent",
            duration: 26,
            actionResult: "Alerte SMS transmise à l'avocat & RDV d'urgence réservé demain à 08h15.",
            dialogue: [
                {
                    isAi: false,
                    author: "M. Laurent",
                    text: "Bonjour, je cherche à joindre Maître Mercier en urgence concernant une convocation demain matin..."
                },
                {
                    isAi: true,
                    author: "Assistant IA",
                    text: "Bonjour Monsieur. Maître Mercier est actuellement indisponible, mais je prends votre demande. S'agit-il d'une garde à vue ou d'une convocation ?"
                },
                {
                    isAi: false,
                    author: "M. Laurent",
                    text: "C'est une audition libre à 9h au commissariat du 8ème arrondissement."
                },
                {
                    isAi: true,
                    author: "Assistant IA",
                    text: "C'est bien noté. J'envoie immédiatement une alerte SMS à l'avocat et je vous bloque un créneau téléphonique d'urgence à 8h15 sur son agenda."
                }
            ]
        },
        {
            id: 'sante',
            title: "Médecin",
            icon: Stethoscope,
            proLabel: "Dr. Claire Simon · Médecine générale (Bordeaux)",
            callMeta: "Appel entrant à 12h15",
            callerName: "Marc Vasseur",
            duration: 20,
            actionResult: "Créneau libéré pour une urgence & consultation reprogrammée le 18 à 16h20.",
            dialogue: [
                {
                    isAi: false,
                    author: "M. Vasseur",
                    text: "Bonjour, je suis bloqué au travail, je ne pourrai pas venir à mon rendez-vous de 15h avec le Dr Simon..."
                },
                {
                    isAi: true,
                    author: "Assistant IA",
                    text: "Bonjour Monsieur Vasseur. Je libère immédiatement votre créneau pour un autre patient. Souhaitez-vous reprogrammer votre consultation ?"
                },
                {
                    isAi: false,
                    author: "M. Vasseur",
                    text: "Oui s'il vous plaît, en fin d'après-midi la semaine prochaine."
                },
                {
                    isAi: true,
                    author: "Assistant IA",
                    text: "C'est parfait. Je vous réserve le vendredi 18 à 16h20. Vous recevrez la confirmation par SMS."
                }
            ]
        },
        {
            id: 'artisan',
            title: "Technicien / Artisan",
            icon: Wrench,
            proLabel: "SOS Plomberie Express · Dépannage 24/7 (Île-de-France)",
            callMeta: "Appel entrant à 07h40",
            callerName: "M. Garnier (Syndic)",
            duration: 22,
            actionResult: "Intervention du technicien planifiée ce matin entre 09h30 et 10h30.",
            dialogue: [
                {
                    isAi: false,
                    author: "M. Garnier",
                    text: "Bonjour, nous avons une fuite d'eau continue sous un chauffe-eau au 2ème étage, c'est très urgent !"
                },
                {
                    isAi: true,
                    author: "Assistant IA",
                    text: "Bonjour. Avez-vous pu fermer la vanne d'arrivée générale pour limiter les dégâts d'ici l'arrivée du technicien ?"
                },
                {
                    isAi: false,
                    author: "M. Garnier",
                    text: "Oui la vanne est coupée, nous sommes au 14 rue Victor Hugo à Boulogne."
                },
                {
                    isAi: true,
                    author: "Assistant IA",
                    text: "Bien noté. Notre technicien d'astreinte est prévenu et se rend sur place entre 9h30 et 10h30 ce matin."
                }
            ]
        },
        {
            id: 'immobilier',
            title: "Immobilier",
            icon: Building2,
            proLabel: "Century Haussmann · Transactions résidentielles (Lyon 6e)",
            callMeta: "Appel entrant à 13h10",
            callerName: "Claire Dumont",
            duration: 24,
            actionResult: "Visite programmée Jeudi à 14h00 & fiche acheteur créée dans le CRM.",
            dialogue: [
                {
                    isAi: false,
                    author: "Mme Dumont",
                    text: "Bonjour, j'appelle pour le T3 avec terrasse avenue Foch vu sur SeLoger, est-il toujours disponible ?"
                },
                {
                    isAi: true,
                    author: "Assistant IA",
                    text: "Bonjour Madame. Oui, le bien est disponible au prix de 450 000€. Votre plan de financement est-il déjà validé ?"
                },
                {
                    isAi: false,
                    author: "Mme Dumont",
                    text: "Oui tout à fait, nous avons notre accord de principe bancaire."
                },
                {
                    isAi: true,
                    author: "Assistant IA",
                    text: "Parfait. Je vous propose un créneau de visite ce jeudi à 14h00 ou vendredi à 10h30 avec notre négociateur ?"
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

    const handleSelectScenario = (id) => {
        if (isPlaying) stopPlayback();
        setActiveScenarioId(id);
        setCurrentTime(0);
        setActiveDialogueIndex(0);
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= activeScenario.duration) {
                        stopPlayback();
                        return 0;
                    }
                    const next = prev + 1;
                    if (next < 6) setActiveDialogueIndex(0);
                    else if (next < 14) setActiveDialogueIndex(1);
                    else if (next < 20) setActiveDialogueIndex(2);
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

    const togglePlay = () => {
        if (isPlaying) {
            stopPlayback();
        } else {
            startPlayback();
        }
    };

    const startPlayback = () => {
        setIsPlaying(true);
        if ('speechSynthesis' in window && !isMuted) {
            window.speechSynthesis.cancel();
            const phrase = activeScenario.dialogue[1].text;
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.05;
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

    // Style épuré, sobre, monochrome, zéro vert criard, style Apple / Stripe
    return (
        <section
            id="produit"
            className={`w-full py-20 sm:py-24 transition-colors duration-200 ${
                isDark
                    ? 'bg-[#08090C] text-white border-t border-white/10'
                    : 'bg-[#FBFBFD] text-neutral-900 border-t border-neutral-200'
            }`}
        >
            <div className="mx-auto max-w-5xl px-6">
                
                {/* 1. Entête minimaliste */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <p className={`text-xs font-medium uppercase tracking-wider mb-2.5 ${
                        isDark ? 'text-white/50' : 'text-neutral-500'
                    }`}>
                        Démonstration interactive
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Écoutez l'IA en situation réelle
                    </h2>

                    <p className={`mt-3 text-sm leading-relaxed ${
                        isDark ? 'text-white/60' : 'text-neutral-600'
                    }`}>
                        Choisissez un métier pour voir comment l'agent vocal accueille le client, filtre la demande et prend le rendez-vous.
                    </p>

                    {/* 2. Sélecteur de métiers sobre (Pilules discrètes) */}
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                        {scenarios.map((sc) => {
                            const isSelected = sc.id === activeScenarioId;
                            const Icon = sc.icon;
                            return (
                                <button
                                    key={sc.id}
                                    onClick={() => handleSelectScenario(sc.id)}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                                        isSelected
                                            ? isDark
                                                ? 'bg-white text-black font-semibold shadow-xs'
                                                : 'bg-neutral-900 text-white font-semibold shadow-xs'
                                            : isDark
                                            ? 'border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                                            : 'border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span>{sc.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Carte du simulateur (Épurée, aérée, sans surcharge) */}
                <div className={`rounded-2xl border transition-all ${
                    isDark
                        ? 'border-white/10 bg-[#0F1117] shadow-xl'
                        : 'border-neutral-200 bg-white shadow-sm'
                }`}>
                    
                    {/* Barre de contexte métier (1 ligne claire) */}
                    <div className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
                        isDark
                            ? 'border-white/10 text-white/70 bg-white/[0.02]'
                            : 'border-neutral-100 text-neutral-600 bg-neutral-50/60'
                    }`}>
                        <div className="flex items-center gap-2 font-medium">
                            <span className={`h-2 w-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                            <span className={isDark ? 'text-white' : 'text-neutral-900 font-semibold'}>
                                {activeScenario.proLabel}
                            </span>
                        </div>
                        <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-neutral-400'}`}>
                            {activeScenario.callMeta}
                        </span>
                    </div>

                    {/* Contenu principal : 2 colonnes simples */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Colonne Gauche : Lecteur audio & résultat (5 colonnes) */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            
                            {/* Égaliseur et boutons */}
                            <div className={`rounded-xl border p-5 text-center ${
                                isDark
                                    ? 'border-white/10 bg-white/[0.02]'
                                    : 'border-neutral-200/80 bg-neutral-50/50'
                            }`}>
                                {/* Barres d'onde neutres */}
                                <div className="flex items-center justify-center gap-1 h-12 mb-4">
                                    {[...Array(24)].map((_, i) => {
                                        const heights = [30, 55, 80, 40, 70, 95, 45, 75, 60, 35, 85, 90, 50, 65, 85, 55, 40, 75, 95, 60, 35, 70, 80, 45];
                                        const h = isPlaying ? heights[i % heights.length] : 20;
                                        return (
                                            <span
                                                key={i}
                                                style={{ height: `${h}%`, transition: 'height 0.15s ease' }}
                                                className={`w-1 rounded-full ${
                                                    isPlaying
                                                        ? isDark ? 'bg-white' : 'bg-neutral-900'
                                                        : isDark ? 'bg-white/20' : 'bg-neutral-300'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Timer & Track */}
                                <div className={`flex items-center justify-between text-xs font-mono mb-4 px-1 ${
                                    isDark ? 'text-white/50' : 'text-neutral-500'
                                }`}>
                                    <span>{formatTime(currentTime)}</span>
                                    <div className={`flex-1 mx-3 h-1 rounded-full overflow-hidden ${
                                        isDark ? 'bg-white/10' : 'bg-neutral-200'
                                    }`}>
                                        <div
                                            className={`h-full transition-all duration-200 ${
                                                isDark ? 'bg-white' : 'bg-neutral-900'
                                            }`}
                                            style={{ width: `${(currentTime / activeScenario.duration) * 100}%` }}
                                        />
                                    </div>
                                    <span>{formatTime(activeScenario.duration)}</span>
                                </div>

                                {/* Contrôles Play / Mute */}
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={togglePlay}
                                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                                            isDark
                                                ? 'bg-white text-black hover:bg-neutral-200'
                                                : 'bg-neutral-900 text-white hover:bg-neutral-800'
                                        }`}
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-5 w-5 fill-current" />
                                        ) : (
                                            <Play className="h-5 w-5 fill-current ml-0.5" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                                            isDark
                                                ? 'border-white/10 bg-white/5 text-white/70 hover:text-white'
                                                : 'border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900'
                                        }`}
                                        title={isMuted ? "Son coupé" : "Son actif"}
                                    >
                                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Résultat concret (Simple, sans surcharge) */}
                            <div className={`rounded-xl border p-4 text-xs ${
                                isDark
                                    ? 'border-white/10 bg-white/[0.02]'
                                    : 'border-neutral-200/80 bg-neutral-50/50'
                            }`}>
                                <div className="flex items-center gap-1.5 font-semibold mb-1">
                                    <Check className={`h-4 w-4 ${isDark ? 'text-white' : 'text-neutral-900'}`} />
                                    <span className={isDark ? 'text-white' : 'text-neutral-900'}>
                                        Action exécutée :
                                    </span>
                                </div>
                                <p className={`pl-5 leading-relaxed ${
                                    isDark ? 'text-white/70' : 'text-neutral-600'
                                }`}>
                                    {activeScenario.actionResult}
                                </p>
                            </div>
                        </div>

                        {/* Colonne Droite : Dialogue clair et bien distingué (7 colonnes) */}
                        <div className="lg:col-span-7 flex flex-col space-y-3.5">
                            <div className={`text-xs font-medium pb-2 border-b ${
                                isDark ? 'border-white/10 text-white/50' : 'border-neutral-100 text-neutral-500'
                            }`}>
                                Dialogue de l'appel
                            </div>

                            {/* Les messages (Style iMessage sobre, très distincts) */}
                            {activeScenario.dialogue.map((item, idx) => {
                                const isCurrent = activeDialogueIndex === idx;

                                return (
                                    <div
                                        key={idx}
                                        className={`rounded-xl p-3.5 transition-all text-xs sm:text-sm ${
                                            item.isAi
                                                ? isDark
                                                    ? isCurrent
                                                        ? 'bg-neutral-800 text-white border border-white/20'
                                                        : 'bg-neutral-900/80 text-white/90 border border-white/5'
                                                    : isCurrent
                                                    ? 'bg-neutral-900 text-white shadow-xs'
                                                    : 'bg-neutral-800 text-white'
                                                : isDark
                                                ? isCurrent
                                                    ? 'bg-white/10 text-white border border-white/15'
                                                    : 'bg-white/5 text-white/80 border border-transparent'
                                                : isCurrent
                                                ? 'bg-neutral-100 text-neutral-900 border border-neutral-300'
                                                : 'bg-neutral-100/70 text-neutral-700 border border-neutral-200/60'
                                        }`}
                                    >
                                        {/* Auteur du message */}
                                        <div className={`text-[11px] font-semibold mb-1 ${
                                            item.isAi
                                                ? 'text-white/70'
                                                : isDark ? 'text-white/50' : 'text-neutral-500'
                                        }`}>
                                            {item.author}
                                        </div>

                                        {/* Texte */}
                                        <p className="leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>

                {/* 4. Bouton d'action minimaliste */}
                <div className="mt-10 text-center">
                    <a
                        href="/register"
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer ${
                            isDark
                                ? 'bg-white text-black hover:bg-neutral-200'
                                : 'bg-neutral-900 text-white hover:bg-neutral-800'
                        }`}
                    >
                        <span>Tester gratuitement sur mon numéro</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>

            </div>
        </section>
    );
}
