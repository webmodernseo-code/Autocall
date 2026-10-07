'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, Volume2, VolumeX, PhoneCall, CheckCircle2, MessageSquare,
    ArrowRight, Clock, ShieldCheck, Scale, Building2, Wrench, Stethoscope,
    MapPin, Sparkles, User, BadgeCheck, PhoneIncoming
} from 'lucide-react';

export default function VoiceDemoSection({ isDark = true }) {
    // 4 Scénarios métiers ultra-réalistes et richement contextualisés
    const scenarios = [
        {
            id: 'avocat',
            tabTitle: "Cabinet d'avocats",
            icon: Scale,
            professionCategory: "Profession Juridique",
            proName: "Maître Vincent Mercier",
            proCabinet: "Mercier & Associés — Barreau de Paris",
            proLocation: "Paris 8ème",
            proSpecialty: "Droit pénal & Garde à vue",
            proIntegration: "Alerte SMS d'urgence & Google Calendar",
            time: "21h45",
            callerName: "M. Thomas Laurent",
            callerPhone: "+33 6 14 ** ** 89",
            duration: 28,
            qualification: "Audition libre urgente",
            actionTaken: "Alerte SMS transmise à l'avocat & RDV calé à 08h15",
            dialogue: [
                {
                    speaker: 'client',
                    name: 'M. Laurent (Client)',
                    roleTag: 'APPELANT',
                    text: "Bonjour, je cherche à joindre Maître Mercier en urgence concernant une convocation demain matin...",
                    timestamp: '00:03'
                },
                {
                    speaker: 'ai',
                    name: 'Standard IA — Cabinet Mercier',
                    roleTag: 'STANDARD IA',
                    text: "Bonjour Monsieur. Maître Mercier n'est plus joignable à cette heure, mais je prends en charge votre demande immédiatement. S'agit-il d'une garde à vue ou d'une convocation ?",
                    timestamp: '00:10'
                },
                {
                    speaker: 'client',
                    name: 'M. Laurent (Client)',
                    roleTag: 'APPELANT',
                    text: "C'est une audition libre à 9h au commissariat du 8ème arrondissement.",
                    timestamp: '00:18'
                },
                {
                    speaker: 'ai',
                    name: 'Standard IA — Cabinet Mercier',
                    roleTag: 'STANDARD IA',
                    text: "Parfaitement noté. J'envoie une alerte SMS prioritaire à l'avocat et je réserve un point téléphonique d'urgence à 8h15 sur son agenda.",
                    timestamp: '00:25'
                }
            ]
        },
        {
            id: 'immobilier',
            tabTitle: "Agence Immobilière",
            icon: Building2,
            professionCategory: "Immobilier & Transactions",
            proName: "Century Prestige Haussmann",
            proCabinet: "Agence Immobilière Transaction & Gestion",
            proLocation: "Lyon 6ème",
            proSpecialty: "Ventes résidentielles & Visites",
            proIntegration: "Synchronisation Calendly & CRM Négociateur",
            time: "13h10",
            callerName: "Claire Dumont",
            callerPhone: "+33 6 88 ** ** 12",
            duration: 24,
            qualification: "Achat T3 450 000€ financé",
            actionTaken: "Visite programmée Jeudi 14h00 dans l'agenda",
            dialogue: [
                {
                    speaker: 'client',
                    name: 'Mme Dumont (Acquéreur)',
                    roleTag: 'APPELANT',
                    text: "Bonjour, j'appelle au sujet du T3 avec terrasse avenue Foch vu sur SeLoger, est-il toujours disponible ?",
                    timestamp: '00:03'
                },
                {
                    speaker: 'ai',
                    name: 'Standard IA — Century Prestige',
                    roleTag: 'STANDARD IA',
                    text: "Bonjour Madame. Oui, le bien est toujours en vente au prix de 450 000€. Avez-vous déjà validé votre plan de financement ?",
                    timestamp: '00:09'
                },
                {
                    speaker: 'client',
                    name: 'Mme Dumont (Acquéreur)',
                    roleTag: 'APPELANT',
                    text: "Oui tout à fait, nous avons notre accord de principe bancaire.",
                    timestamp: '00:16'
                },
                {
                    speaker: 'ai',
                    name: 'Standard IA — Century Prestige',
                    roleTag: 'STANDARD IA',
                    text: "Excellent. Je vous propose un créneau de visite ce jeudi à 14h00 ou vendredi à 10h30 avec notre négociateur ?",
                    timestamp: '00:22'
                }
            ]
        },
        {
            id: 'artisan',
            tabTitle: "Artisan & Dépannage",
            icon: Wrench,
            professionCategory: "Bâtiment & Urgences",
            proName: "SOS Plomberie Sanitaire 24/7",
            proCabinet: "Artisan Dépanneur Agréé Assurances",
            proLocation: "Île-de-France",
            proSpecialty: "Fuites, Chauffage & Dégâts des eaux",
            proIntegration: "Fiche d'intervention SMS & Géolocalisation",
            time: "07h40",
            callerName: "Syndic / M. Garnier",
            callerPhone: "+33 7 49 ** ** 33",
            duration: 22,
            qualification: "Fuite d'eau continue sous évier",
            actionTaken: "Intervention technicien validée entre 09h30 et 10h30",
            dialogue: [
                {
                    speaker: 'client',
                    name: 'M. Garnier (Syndic)',
                    roleTag: 'APPELANT',
                    text: "Bonjour, nous avons une fuite d'eau continue sous un chauffe-eau au 2ème étage, c'est très urgent !",
                    timestamp: '00:03'
                },
                {
                    speaker: 'ai',
                    name: 'Standard IA — Dépannage 24/7',
                    roleTag: 'STANDARD IA',
                    text: "Bonjour. Avez-vous pu couper l'arrivée générale pour limiter les dégâts d'ici l'arrivée du technicien ?",
                    timestamp: '00:08'
                },
                {
                    speaker: 'client',
                    name: 'M. Garnier (Syndic)',
                    roleTag: 'APPELANT',
                    text: "Oui la vanne est fermée, nous sommes au 14 rue Victor Hugo à Boulogne.",
                    timestamp: '00:15'
                },
                {
                    speaker: 'ai',
                    name: 'Standard IA — Dépannage 24/7',
                    roleTag: 'STANDARD IA',
                    text: "C'est noté. Notre dépanneur d'astreinte est prévenu et intervient chez vous entre 9h30 et 10h30 ce matin.",
                    timestamp: '00:21'
                }
            ]
        },
        {
            id: 'sante',
            tabTitle: "Cabinet Médical",
            icon: Stethoscope,
            professionCategory: "Santé & Praticiens",
            proName: "Dr. Claire Simon",
            proCabinet: "Cabinet Médical — Secteur 1 Conventionné",
            proLocation: "Bordeaux Centre",
            proSpecialty: "Médecine générale & Consultations",
            proIntegration: "Télésecrétariat Doctolib & Rappel SMS",
            time: "12h15",
            callerName: "Marc Vasseur",
            callerPhone: "+33 6 22 ** ** 70",
            duration: 20,
            qualification: "Report de consultation",
            actionTaken: "Créneau décalé au 18 octobre à 16h20 & SMS envoyé",
            dialogue: [
                {
                    speaker: 'client',
                    name: 'M. Vasseur (Patient)',
                    roleTag: 'APPELANT',
                    text: "Bonjour, je suis bloqué au travail, je ne pourrai pas venir à mon rendez-vous de 15h avec le Dr Simon...",
                    timestamp: '00:03'
                },
                {
                    speaker: 'ai',
                    name: 'Secrétariat IA — Dr. Simon',
                    roleTag: 'STANDARD IA',
                    text: "Bonjour Monsieur Vasseur. Je libère votre créneau de cet après-midi pour un autre patient. Souhaitez-vous reprogrammer votre consultation ?",
                    timestamp: '00:09'
                },
                {
                    speaker: 'client',
                    name: 'M. Vasseur (Patient)',
                    roleTag: 'APPELANT',
                    text: "Oui svp, en fin d'après-midi la semaine prochaine.",
                    timestamp: '00:14'
                },
                {
                    speaker: 'ai',
                    name: 'Secrétariat IA — Dr. Simon',
                    roleTag: 'STANDARD IA',
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
    const ActiveIcon = activeScenario.icon;
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
            utterance.pitch = 1.0;
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

    // Tokens de styles adaptatifs (Zéro bords arrondis sur les côtés de la section en mode clair)
    const s = isDark ? {
        sectionBg: 'text-white border-t border-white/10 transition-colors duration-300',
        glow: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(59, 130, 246, 0.12) 50%, transparent 70%)',
        badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
        title: 'text-white',
        titleGradient: 'from-white via-white/90 to-white/60',
        subtitle: 'text-white/60',
        tabActive: 'bg-white text-black font-semibold shadow-lg shadow-white/10 scale-[1.02]',
        tabInactive: 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white',
        card: 'border-white/10 bg-[#0F1117]/85 backdrop-blur-2xl shadow-2xl',
        proBanner: 'border-white/10 bg-white/[0.03] text-white',
        proRole: 'text-white/60',
        proTag: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        box: 'border-white/10 bg-white/[0.02]',
        boxHeader: 'text-white/50 border-white/5',
        callerName: 'text-white',
        callerPhone: 'text-white/50',
        tag: 'bg-white/5 border-white/10 text-white/90',
        waveInactive: 'bg-white/20',
        trackBg: 'bg-white/10',
        trackBar: 'bg-white',
        timeText: 'text-white/50',
        playBtn: 'bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/10',
        muteBtn: 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10',
        actionBox: 'border-emerald-500/20 bg-emerald-500/[0.04]',
        actionTitle: 'text-emerald-400',
        actionText: 'text-white/80',
        transcriptBox: 'bg-black/50 border-white/10',
        transcriptHeader: 'border-white/10 text-white/70',
        // BULLES DE DIALOGUE VISUELLEMENT TRÈS DISTINCTES
        bubbleClient: 'bg-zinc-900/90 border-zinc-700/60 text-zinc-100',
        bubbleClientActive: 'ring-2 ring-sky-500/50 border-sky-400/50 bg-zinc-900',
        clientTag: 'bg-sky-500/20 border-sky-400/30 text-sky-300',
        bubbleAi: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100',
        bubbleAiActive: 'ring-2 ring-emerald-400/70 border-emerald-400 bg-emerald-950/60 shadow-lg shadow-emerald-500/10',
        aiTag: 'bg-emerald-500 text-black font-bold',
        footerBorder: 'border-white/10 text-white/50',
        ctaTitle: 'text-white/70',
        ctaBtn: 'border-white/20 bg-white/5 text-white hover:bg-white hover:text-black hover:border-white'
    } : {
        // EN MODE CLAIR : Pleine largeur, bords nets (pas d'arrondi sur les côtés de section), contrastes vifs
        sectionBg: 'text-neutral-900 bg-[#F8F9FA] border-t border-b border-neutral-200 transition-colors duration-300',
        glow: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%)',
        badge: 'border-emerald-500/30 bg-emerald-50 text-emerald-800 shadow-xs',
        title: 'text-neutral-900',
        titleGradient: 'from-neutral-900 via-neutral-800 to-neutral-700',
        subtitle: 'text-neutral-600',
        tabActive: 'bg-neutral-900 text-white font-semibold shadow-md scale-[1.02]',
        tabInactive: 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-black shadow-xs',
        card: 'border-neutral-200 bg-white backdrop-blur-2xl shadow-xl shadow-neutral-200/50',
        proBanner: 'border-neutral-200 bg-neutral-50/90 text-neutral-900',
        proRole: 'text-neutral-600',
        proTag: 'bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold',
        box: 'border-neutral-200 bg-neutral-50/70',
        boxHeader: 'text-neutral-500 border-neutral-200',
        callerName: 'text-neutral-900',
        callerPhone: 'text-neutral-500',
        tag: 'bg-white border-neutral-200 text-neutral-800 shadow-2xs',
        waveInactive: 'bg-neutral-200',
        trackBg: 'bg-neutral-200',
        trackBar: 'bg-neutral-900',
        timeText: 'text-neutral-500',
        playBtn: 'bg-neutral-900 text-white hover:bg-black shadow-lg shadow-neutral-900/10',
        muteBtn: 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100',
        actionBox: 'border-emerald-500/30 bg-emerald-50/80',
        actionTitle: 'text-emerald-800',
        actionText: 'text-neutral-700',
        transcriptBox: 'bg-neutral-50/70 border-neutral-200',
        transcriptHeader: 'border-neutral-200 text-neutral-700',
        // BULLES DE DIALOGUE VISUELLEMENT TRÈS DISTINCTES EN MODE CLAIR
        bubbleClient: 'bg-slate-100 border-slate-300/80 text-slate-800 shadow-xs',
        bubbleClientActive: 'ring-2 ring-sky-500 border-sky-400 bg-sky-50 text-slate-900 shadow-md',
        clientTag: 'bg-slate-200 border-slate-300 text-slate-700',
        bubbleAi: 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs',
        bubbleAiActive: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-100/90 text-emerald-950 shadow-md',
        aiTag: 'bg-emerald-600 text-white font-bold',
        footerBorder: 'border-neutral-200 text-neutral-600',
        ctaTitle: 'text-neutral-600',
        ctaBtn: 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white shadow-xs'
    };

    return (
        <section id="produit" className={`w-full relative px-6 py-20 sm:py-28 scroll-mt-20 ${s.sectionBg}`}>
            {/* Lueur d'ambiance */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full blur-[160px] opacity-25"
                style={{ background: s.glow }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                {/* 1. ENTÊTE DE SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-md mb-4 ${s.badge}`}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Démonstration Audio Interactive</span>
                    </div>

                    <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] ${s.title}`}>
                        Une voix naturelle. <br className="hidden sm:inline" />
                        <span className={`bg-gradient-to-r ${s.titleGradient} bg-clip-text text-transparent`}>
                            Zéro latence. Une vraie conversation.
                        </span>
                    </h2>

                    <p className={`mt-4 text-sm sm:text-base leading-relaxed ${s.subtitle}`}>
                        Sélectionnez un métier ci-dessous pour écouter comment le standard IA dialogue avec le client, qualifie la demande et synchronise l'agenda professionnel.
                    </p>

                    {/* 2. SÉLECTEUR DE MÉTIERS AVEC ICÔNES VECTORIELLES PURS */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                        {scenarios.map((sc) => {
                            const isSelected = sc.id === activeScenarioId;
                            const TabIcon = sc.icon;
                            return (
                                <button
                                    key={sc.id}
                                    onClick={() => handleSelectScenario(sc.id)}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        isSelected ? s.tabActive : s.tabInactive
                                    }`}
                                >
                                    <TabIcon className="h-4 w-4 flex-shrink-0" />
                                    <span>{sc.tabTitle}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. FICHE D'IDENTITÉ PROFESSIONNELLE DU MÉTIER SÉLECTIONNÉ */}
                <div className={`mb-6 rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${s.proBanner}`}>
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                            <ActiveIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs uppercase font-bold tracking-wider text-emerald-500">
                                    {activeScenario.professionCategory}
                                </span>
                                <span className="text-xs text-neutral-400">•</span>
                                <span className={`text-xs flex items-center gap-1 ${s.proRole}`}>
                                    <MapPin className="h-3 w-3" />
                                    {activeScenario.proLocation}
                                </span>
                            </div>
                            <div className="text-base sm:text-lg font-bold">
                                {activeScenario.proName}
                            </div>
                            <div className={`text-xs ${s.proRole}`}>
                                {activeScenario.proCabinet} — <span className="font-medium text-emerald-600 dark:text-emerald-400">{activeScenario.proSpecialty}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${s.proTag}`}>
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {activeScenario.proIntegration}
                        </span>
                    </div>
                </div>

                {/* 4. LE LECTEUR / SIMULATEUR D'APPEL */}
                <div className={`rounded-3xl border p-6 sm:p-10 ${s.card}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* COLONNE GAUCHE : LECTEUR ET CONTRÔLES (5 colonnes) */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                            {/* Entête de l'appel entrant */}
                            <div className={`rounded-2xl border p-5 ${s.box}`}>
                                <div className={`flex items-center justify-between text-xs mb-3 ${s.boxHeader}`}>
                                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-500">
                                        <PhoneCall className="h-3.5 w-3.5" />
                                        Appel entrant à {activeScenario.time}
                                    </span>
                                    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-mono ${s.tag}`}>
                                        Latence ~410ms
                                    </span>
                                </div>
                                <div className={`text-base font-semibold ${s.callerName}`}>
                                    {activeScenario.callerName}
                                </div>
                                <div className={`text-xs font-mono mt-0.5 ${s.callerPhone}`}>
                                    {activeScenario.callerPhone}
                                </div>
                                <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${s.boxHeader}`}>
                                    <span>Motif qualifié :</span>
                                    <span className={`font-medium px-2.5 py-0.5 rounded-full border ${s.tag}`}>
                                        {activeScenario.qualification}
                                    </span>
                                </div>
                            </div>

                            {/* Onde sonore animée */}
                            <div className={`rounded-2xl border p-6 text-center ${s.box}`}>
                                <div className="flex items-center justify-center gap-1 h-14 mb-4">
                                    {[...Array(28)].map((_, i) => {
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
                                                        ? 'bg-gradient-to-t from-emerald-500 to-sky-500'
                                                        : s.waveInactive
                                                }`}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Temps et Contrôles */}
                                <div className={`flex items-center justify-between text-xs font-mono px-2 mb-4 ${s.timeText}`}>
                                    <span>{formatTime(currentTime)}</span>
                                    <div className={`flex-1 mx-3 h-1 rounded-full overflow-hidden ${s.trackBg}`}>
                                        <div
                                            className={`h-full transition-all duration-300 ${s.trackBar}`}
                                            style={{ width: `${(currentTime / activeScenario.duration) * 100}%` }}
                                        />
                                    </div>
                                    <span>{formatTime(activeScenario.duration)}</span>
                                </div>

                                {/* Boutons Play / Pause et Mute */}
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={togglePlay}
                                        className={`flex h-14 w-14 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer ${s.playBtn}`}
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
                                        className={`rounded-full border p-3 transition-colors cursor-pointer ${s.muteBtn}`}
                                        aria-label={isMuted ? "Activer le son" : "Couper le son"}
                                        title={isMuted ? "Son coupé" : "Son activé"}
                                    >
                                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className={`mt-3 text-[11px] ${s.timeText}`}>
                                    {isPlaying ? "Conversation en cours de lecture..." : "Cliquez sur Play pour écouter l'échange"}
                                </div>
                            </div>

                            {/* Résultat & Action déclenchée */}
                            <div className={`rounded-2xl border p-4 text-xs ${s.actionBox}`}>
                                <div className={`flex items-center gap-2 font-semibold mb-1 ${s.actionTitle}`}>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Action déclenchée automatiquement :</span>
                                </div>
                                <p className={`pl-6 ${s.actionText}`}>
                                    {activeScenario.actionTaken}
                                </p>
                            </div>
                        </div>

                        {/* COLONNE DROITE : TRANSCRIPTION (BULLES CLIENT VS IA TRÈS BIEN DISTINGUÉES) */}
                        <div className={`lg:col-span-7 flex flex-col justify-between h-full border rounded-2xl p-6 sm:p-7 ${s.transcriptBox}`}>
                            <div className={`flex items-center justify-between pb-4 border-b mb-6 ${s.transcriptHeader}`}>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 opacity-70" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        Transcription instantanée
                                    </span>
                                </div>
                                <span className="text-[11px] font-mono opacity-60">
                                    Synchronisé à la voix
                                </span>
                            </div>

                            {/* Bulles de dialogue distinctes */}
                            <div className="space-y-4">
                                {activeScenario.dialogue.map((item, idx) => {
                                    const isCurrent = activeDialogueIndex === idx;
                                    const isAi = item.speaker === 'ai';

                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded-2xl p-4.5 transition-all duration-300 border ${
                                                isAi
                                                    ? `${s.bubbleAi} ${isCurrent ? s.bubbleAiActive : ''} ml-2 sm:ml-4`
                                                    : `${s.bubbleClient} ${isCurrent ? s.bubbleClientActive : ''} mr-2 sm:mr-4`
                                            }`}
                                        >
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <div className="flex items-center gap-2">
                                                    {isAi ? (
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] tracking-wider uppercase ${s.aiTag}`}>
                                                            <Sparkles className="h-2.5 w-2.5" />
                                                            {item.roleTag}
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${s.clientTag}`}>
                                                            <User className="h-2.5 w-2.5" />
                                                            {item.roleTag}
                                                        </span>
                                                    )}
                                                    <span className="font-bold text-xs">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] font-mono opacity-60">
                                                    {item.timestamp}
                                                </span>
                                            </div>

                                            <p className="text-xs sm:text-sm leading-relaxed pl-1 sm:pl-2">
                                                {item.text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Garanties en bas de la boîte */}
                            <div className={`mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-[11px] ${s.footerBorder}`}>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 opacity-80" />
                                    Prise en charge en 1 sonnerie
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <ActiveIcon className="h-3.5 w-3.5 opacity-80" />
                                    Scénario calibré {activeScenario.tabTitle}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 opacity-80" />
                                    Conforme RGPD & Secret pro
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 5. APPEL À L'ACTION SOUS LA DÉMO */}
                <div className="mt-12 text-center">
                    <p className={`text-sm mb-4 ${s.ctaTitle}`}>
                        Vous souhaitez tester la voix en direct sur votre propre téléphone ?
                    </p>
                    <a
                        href="/register"
                        className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 ${s.ctaBtn}`}
                    >
                        <span>Créer mon numéro test gratuit</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
