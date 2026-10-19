'use client';

import React, { useState, useEffect } from 'react';
import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import ClientLayout from '@/layouts/ClientLayout';
import { Head, Link, router } from '@/lib/page-router';
import { useTranslation, Trans } from 'react-i18next';
import {
    PhoneCall,
    TrendingUp,
    TrendingDown,
    Target,
    Clock,
    Bot,
    Phone,
    Users,
    Megaphone,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    Sparkles,
    Eye,
    Calendar,
    Download,
    MoreHorizontal,
    Mic,
    Send,
    ChevronDown,
    Flame,
    ShieldCheck,
    Plus,
    X,
    Star,
    PieChart,
    BarChart3,
    LineChart,
    Maximize2,
    Check
} from 'lucide-react';

const STATUS_CONFIG = {
    completed: {
        label: 'Complété',
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 rounded-[4px]'
    },
    failed: {
        label: 'Échoué',
        pill: 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 rounded-[4px]'
    },
    busy: {
        label: 'Occupé',
        pill: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 rounded-[4px]'
    },
    no_answer: {
        label: 'Sans réponse',
        pill: 'bg-[#F4F4F4] text-[#5C5E62] border-[#EEEEEE] dark:bg-white/5 dark:text-[#8E8E8E] dark:border-white/10 rounded-[4px]'
    }
};

const fmtDur = (s) => `${Math.floor((s || 0) / 60)}:${String((s || 0) % 60).padStart(2, '0')}`;
const initials = (s = '') => s.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

/** 1. CARTE KPI SUPÉRIEURE (Inspirée du design Tesla : 12px radius, 0 shadow, typographie sobre) */
function MetricKpiCard({ label, value, trend, isPositive = true, sub, icon: Icon }) {
    return (
        <div className="relative overflow-hidden rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-5 transition-colors duration-300 hover:border-[#D0D1D2] dark:hover:border-white/20">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#5C5E62] dark:text-[#8E8E8E]">{label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-[#171A20] dark:text-white">
                    <Icon className="h-4 w-4" />
                </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-medium tracking-normal text-[#171A20] dark:text-white tabular-nums">
                    {value}
                </span>

                {trend && (
                    <span className={`inline-flex items-center gap-0.5 rounded-[4px] px-1.5 py-0.5 text-xs font-medium ${
                        isPositive
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}>
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{trend}</span>
                    </span>
                )}
            </div>

            {sub && (
                <p className="mt-1.5 text-xs text-[#8E8E8E]">
                    {sub}
                </p>
            )}
        </div>
    );
}

/** 2bis. GRAPHIQUE SPLINE FLUIDE EN SVG PUR (Style Tesla : Electric Blue, bordures fines) */
function SplineAreaChart({ data = [] }) {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    if (!data.length) return null;

    const width = 600;
    const height = 210;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const maxVal = Math.max(...data.map(d => d.calls || 0), 10);
    const plotW = width - paddingLeft - paddingRight;
    const plotH = height - paddingTop - paddingBottom;

    const points = data.map((d, i) => {
        const x = paddingLeft + (i / Math.max(data.length - 1, 1)) * plotW;
        const y = paddingTop + plotH - ((d.calls || 0) / maxVal) * plotH;
        return { x, y, ...d };
    });

    const buildPath = (pts) => {
        if (pts.length < 2) return '';
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = i > 0 ? pts[i - 1] : pts[i];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    };

    const linePath = buildPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + plotH} L ${points[0].x} ${paddingTop + plotH} Z`;
    const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

    const totalCalls = data.reduce((acc, d) => acc + (d.calls || 0), 0);

    return (
        <div className="relative w-full h-[220px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="tesla-spline-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3E6AE1" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#3E6AE1" stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {[0, 0.5, 1].map((ratio) => {
                    const y = paddingTop + plotH * (1 - ratio);
                    const val = Math.round(maxVal * ratio);
                    return (
                        <g key={ratio}>
                            <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#EEEEEE" strokeDasharray="3 3" className="dark:stroke-white/10" />
                            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-xs fill-[#8E8E8E] font-mono">
                                {val}
                            </text>
                        </g>
                    );
                })}

                <path d={areaPath} fill="url(#tesla-spline-area)" />
                <path d={linePath} fill="none" stroke="#3E6AE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {points.map((pt, i) => {
                    const isHovered = hoveredIdx === i;
                    const showAxisLabel = data.length <= 7 || i === 0 || i === points.length - 1 || i % 2 === 0;
                    const shortLabel = String(pt.day).split(/[–-]/)[0].trim();
                    return (
                        <g key={pt.day} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
                            <rect
                                x={pt.x - plotW / (points.length * 2)}
                                y={paddingTop}
                                width={plotW / points.length}
                                height={plotH}
                                fill="transparent"
                            />
                            {showAxisLabel && (
                                <text
                                    x={pt.x}
                                    y={paddingTop + plotH + 18}
                                    textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
                                    className={`text-xs font-normal transition-colors ${
                                        isHovered ? 'fill-[#3E6AE1] font-medium' : 'fill-[#8E8E8E]'
                                    }`}
                                >
                                    {shortLabel}
                                </text>
                            )}
                            {isHovered && (
                                <>
                                    <line x1={pt.x} y1={paddingTop} x2={pt.x} y2={paddingTop + plotH} stroke="#3E6AE1" strokeDasharray="2 2" strokeOpacity="0.4" />
                                    <circle cx={pt.x} cy={pt.y} r="4" fill="#3E6AE1" stroke="#FFFFFF" strokeWidth="2" className="dark:stroke-[#171A20]" />
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>

            {totalCalls === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                    <span className="text-xs font-medium text-[#5C5E62] dark:text-[#8E8E8E]">
                        Aucun appel sur cette semaine
                    </span>
                    <span className="text-xs text-[#8E8E8E] mt-0.5">
                        La courbe d&apos;activité se dessinera dès vos premiers échanges
                    </span>
                </div>
            )}

            {activePoint && (
                <div
                    style={{
                        left: `${(activePoint.x / width) * 100}%`,
                        top: `${Math.max(10, (activePoint.y / height) * 100 - 30)}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150 z-20"
                >
                    <InteractiveChartTooltip
                        active={true}
                        payload={[{ value: activePoint.calls }]}
                        label={activePoint.day}
                    />
                </div>
            )}
        </div>
    );
}

/** 2. TOOLTIP FLOTTANT (Style Tesla : épuré, bordure 1px, 4px radius) */
function InteractiveChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const currentVal = payload[0]?.value || 0;

    return (
        <div className="rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-2.5 min-w-[140px]">
            <p className="text-xs font-normal text-[#8E8E8E]">{label}</p>
            <div className="mt-1 flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-[#5C5E62] dark:text-[#8E8E8E]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3E6AE1] shrink-0" />
                    <span>Appels</span>
                </span>
                <span className="font-medium tabular-nums text-[#171A20] dark:text-white">{currentVal.toLocaleString()}</span>
            </div>
        </div>
    );
}

/** 3. JAUGE CIRCULAIRE DE CONVERSION (Style Tesla : minimaliste, Electric Blue) */
function SatisfactionRadialGauge({ percentage = 0, hasData = true }) {
    const safePct = Math.max(0, Math.min(100, Math.round(percentage)));
    const radius = 64;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - (safePct / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center pt-2">
            <svg width="190" height="105" viewBox="0 0 190 105" className="overflow-visible">
                <path
                    d="M 25 95 A 70 70 0 0 1 165 95"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="text-[#EEEEEE] dark:text-white/10"
                />
                {safePct > 0 && (
                    <path
                        d="M 25 95 A 70 70 0 0 1 165 95"
                        fill="none"
                        stroke="#3E6AE1"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700 ease-out"
                    />
                )}
            </svg>

            <div className="text-center -mt-6">
                <span className="text-3xl font-medium tracking-normal text-[#171A20] dark:text-white tabular-nums">
                    {safePct}%
                </span>
                <p className="mt-1 text-xs text-[#8E8E8E]">
                    {hasData ? 'Part des appels terminés avec succès' : 'En attente de vos premiers appels'}
                </p>
            </div>

            <Link
                href={route('client.analytics.index')}
                className="mt-4 inline-flex items-center justify-center rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-xs font-medium text-[#393C41] dark:text-neutral-200 hover:bg-[#F4F4F4] dark:hover:bg-white/10 transition-colors duration-300"
            >
                Afficher le détail
            </Link>
        </div>
    );
}

/** 4. ASSISTANT VOCAL IA (Style Tesla : sobre, inspiré du chatbot persistant) */
function VoiceAiAssistantWidget() {
    const [query, setQuery] = useState('');
    const [simulating, setSimulating] = useState(false);
    const [responseMsg, setResponseMsg] = useState(null);

    const quickPrompts = [
        { label: 'Créer un agent', prompt: 'Comment créer un agent vocal ?', reply: 'Rendez-vous dans "Agents IA" pour choisir une voix et personnaliser votre prompt.' },
        { label: 'Importer contacts', prompt: 'Comment importer mes contacts ?', reply: 'Dans "Contacts", cliquez sur "Importer CSV" pour charger votre fichier de prospection.' },
        { label: 'Lancer un test', prompt: 'Comment tester un premier appel ?', reply: 'Liez un numéro actif dans "Numéros", puis lancez une campagne d\'essai vers votre mobile.' },
    ];

    const handleSend = (text) => {
        const q = text || query;
        if (!q.trim()) return;
        setSimulating(true);
        setResponseMsg(null);
        setTimeout(() => {
            setSimulating(false);
            const matched = quickPrompts.find((p) => p.prompt.toLowerCase() === q.toLowerCase());
            setResponseMsg(matched ? matched.reply : 'Consigne enregistrée ! Vos agents sont prêts à appliquer ces paramètres.');
            setQuery('');
        }, 700);
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-medium text-[#171A20] dark:text-white">Assistant IA</span>
                <Link href={route('client.agents.index')} className="text-[#8E8E8E] hover:text-[#171A20] dark:hover:text-white transition-colors" title="Plein écran">
                    <Maximize2 className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* Indicateur d'état vocal sobre style Tesla */}
            <div className="py-4 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-[#3E6AE1]">
                    <span className="h-3 w-1 rounded-full bg-[#3E6AE1] animate-pulse" />
                    <span className="h-5 w-1 rounded-full bg-[#3E6AE1] animate-pulse delay-75" />
                    <span className="h-7 w-1 rounded-full bg-[#3E6AE1] animate-pulse delay-150" />
                    <span className="h-4 w-1 rounded-full bg-[#3E6AE1] animate-pulse delay-100" />
                    <span className="h-2 w-1 rounded-full bg-[#3E6AE1] animate-pulse" />
                </div>
                <span className="mt-2 text-xs font-normal text-[#8E8E8E]">
                    {simulating ? 'Traitement en cours…' : 'À l\'écoute de vos consignes'}
                </span>
            </div>

            {responseMsg ? (
                <div className="rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-[#F4F4F4] dark:bg-white/5 p-3 mb-2 text-left text-xs text-[#171A20] dark:text-neutral-200">
                    <p className="font-medium mb-0.5 text-[#3E6AE1]">Réponse :</p>
                    <p>{responseMsg}</p>
                </div>
            ) : null}

            {/* Suggestions d'actions en pilules cliquables */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                {quickPrompts.map((qp) => (
                    <button
                        key={qp.label}
                        type="button"
                        onClick={() => {
                            setQuery(qp.prompt);
                            handleSend(qp.prompt);
                        }}
                        className="rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-[#F4F4F4] dark:bg-white/5 px-2.5 py-1 text-xs font-normal text-[#5C5E62] dark:text-[#8E8E8E] hover:border-[#3E6AE1] hover:text-[#3E6AE1] dark:hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                        {qp.label}
                    </button>
                ))}
            </div>

            {/* Input avec micro et envoi */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 focus-within:border-[#3E6AE1] transition-colors">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Poser une question à l'IA..."
                    className="w-full bg-transparent text-xs text-[#171A20] dark:text-white placeholder:text-[#8E8E8E] focus:outline-none border-0 p-0"
                />
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                        type="button"
                        aria-label="Microphone"
                        className="rounded-[4px] p-1 text-[#8E8E8E] hover:text-[#3E6AE1] dark:hover:text-white transition-colors"
                    >
                        <Mic className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="submit"
                        aria-label="Envoyer"
                        disabled={!query.trim() || simulating}
                        className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#3E6AE1] hover:bg-[#345bc7] text-white disabled:opacity-40 transition-colors duration-300 cursor-pointer"
                    >
                        <Send className="h-3 w-3" />
                    </button>
                </div>
            </form>
        </div>
    );
}

/** 5. MODAL ADD WIDGET (Style Tesla : épuré, boutons 4px radius) */
function AddWidgetModal({ isOpen, onClose, onAddWidget, activeWidgets }) {
    if (!isOpen) return null;

    const availableWidgets = [
        {
            id: 'channel_split',
            title: 'Répartition par Canal Vocal',
            desc: 'Mesurez le trafic entrant vs. campagnes sortantes et mobiles.',
            tag: '#Téléphonie & Canaux',
            icon: PieChart,
            preview: (
                <div className="h-10 w-10 rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 flex items-center justify-center text-[#3E6AE1]">
                    <PieChart className="h-5 w-5" />
                </div>
            )
        },
        {
            id: 'overview_card',
            title: 'Synthèse des Objectifs Journaliers',
            desc: 'Suivez le quota d’appels et l’avancement des conversions en direct.',
            tag: '#Performance',
            icon: Target,
            preview: (
                <div className="h-10 w-10 rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 flex items-center justify-center text-emerald-600">
                    <Target className="h-5 w-5" />
                </div>
            )
        },
        {
            id: 'orders_perf',
            title: 'Performance des Réponses IA',
            desc: 'Taux de décroché en temps réel, volume d’objections résolues.',
            tag: '#Opérations',
            icon: BarChart3,
            preview: (
                <div className="h-10 w-10 rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 flex items-center justify-center text-[#3E6AE1]">
                    <BarChart3 className="h-5 w-5" />
                </div>
            )
        },
        {
            id: 'trend_analysis',
            title: 'Tendances & Évolution Mensuelle',
            desc: 'Cartographie temporelle des pics d’appels par tranche horaire.',
            tag: '#Stratégie',
            icon: LineChart,
            preview: (
                <div className="h-10 w-10 rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 flex items-center justify-center text-amber-500">
                    <LineChart className="h-5 w-5" />
                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity">
            <div className="relative w-full max-w-lg rounded-[12px] bg-white dark:bg-[#171A20] border border-[#EEEEEE] dark:border-white/10 p-6 overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE] dark:border-white/10">
                    <div>
                        <h3 className="text-base font-medium text-[#171A20] dark:text-white">
                            Ajouter un widget
                        </h3>
                        <p className="text-xs text-[#8E8E8E] mt-0.5">Personnalisez votre tableau de bord selon vos métriques clés.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[4px] p-1.5 text-[#8E8E8E] hover:text-[#171A20] dark:hover:text-white hover:bg-[#F4F4F4] dark:hover:bg-white/5 transition-colors duration-300"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {availableWidgets.map((w) => {
                        const isAdded = activeWidgets.includes(w.id);
                        return (
                            <div
                                key={w.id}
                                className="flex items-center gap-3.5 rounded-[4px] border border-[#EEEEEE] dark:border-white/10 p-3 hover:border-[#D0D1D2] dark:hover:border-white/20 transition-colors duration-300 bg-white dark:bg-white/5"
                            >
                                <div className="shrink-0">{w.preview}</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-medium text-[#171A20] dark:text-white truncate">{w.title}</h4>
                                    <p className="text-xs text-[#8E8E8E] line-clamp-1 mt-0.5">{w.desc}</p>
                                    <span className="inline-block mt-1 text-xs font-normal text-[#5C5E62] dark:text-[#8E8E8E] bg-[#F4F4F4] dark:bg-white/5 px-1.5 py-0.5 rounded-[2px]">
                                        {w.tag}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onAddWidget(w.id)}
                                    className={`shrink-0 rounded-[4px] px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 cursor-pointer ${
                                        isAdded
                                            ? 'bg-[#F4F4F4] dark:bg-white/10 text-[#5C5E62] dark:text-neutral-300 border border-[#EEEEEE] dark:border-white/10'
                                            : 'bg-[#3E6AE1] hover:bg-[#345bc7] text-white'
                                    }`}
                                >
                                    {isAdded ? 'Actif' : 'Sélectionner'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 pt-3 border-t border-[#EEEEEE] dark:border-white/10 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[4px] bg-[#171A20] dark:bg-white text-white dark:text-[#171A20] px-4 py-2 text-xs font-medium hover:opacity-90 transition-opacity duration-300"
                    >
                        Terminé
                    </button>
                </div>
            </div>
        </div>
    );
}

const ONBOARDING_STEP_NAMES = [
    'Objectif et cas d\'usage',
    'Voix et tonalité',
    'Instructions et scénario',
    'Numéro et ligne d\'appel',
    'Appel de test en direct'
];

/** 6. CARTE DE REPRISE ONBOARDING & GUIDE DE DÉMARRAGE RAPIDE (Style Tesla : radical subtraction) */
function OnboardingQuickStartBanner({ onboarding, onboardingState }) {
    const isServerDismissed = onboardingState?.status === 'dismissed' || onboardingState?.status === 'completed';
    const [dismissed, setDismissed] = useState(isServerDismissed);
    const [dismissing, setDismissing] = useState(false);

    useEffect(() => {
        if (isServerDismissed) {
            setDismissed(true);
            return;
        }
        try {
            const stored = localStorage.getItem('autocall_dashboard_guide_dismissed');
            if (stored === 'true') {
                setDismissed(true);
            }
        } catch {}
    }, [isServerDismissed]);

    const handleDismiss = async () => {
        setDismissed(true);
        try {
            localStorage.setItem('autocall_dashboard_guide_dismissed', 'true');
            setDismissing(true);
            await fetch('/api/app/onboarding/dismiss', { credentials: 'same-origin', method: 'POST' });
        } catch {
            // tolérance erreur réseau
        } finally {
            setDismissing(false);
        }
    };

    if (dismissed || isServerDismissed) return null;

    const completedStepIndices = onboardingState?.completedSteps || [];
    const totalStepsCount = 5;
    const completedCount = completedStepIndices.length;
    const progressPct = Math.round((completedCount / totalStepsCount) * 100);
    const nextStepIdx = onboardingState?.currentStep || 0;
    const nextStepName = ONBOARDING_STEP_NAMES[nextStepIdx] || ONBOARDING_STEP_NAMES[0];

    const steps = [
        {
            id: 'agent',
            title: 'Agent IA vocal',
            desc: 'Créez votre premier agent vocal.',
            icon: Bot,
            done: completedStepIndices.includes(0),
            href: '/app/onboarding?step=0',
            btnText: 'Configurer l\'agent',
        },
        {
            id: 'voice',
            title: 'Voix & Tonalité',
            desc: 'Sélectionnez le timbre et le style.',
            icon: Mic,
            done: completedStepIndices.includes(1),
            href: '/app/onboarding?step=1',
            btnText: 'Choisir la voix',
        },
        {
            id: 'number',
            title: 'Ligne téléphonique',
            desc: 'Attribuez un numéro pour vos appels.',
            icon: Phone,
            done: completedStepIndices.includes(3),
            href: '/app/onboarding?step=3',
            btnText: 'Associer un numéro',
        },
        {
            id: 'test',
            title: 'Appel de test',
            desc: 'Vérifiez la fluidité en direct.',
            icon: PhoneCall,
            done: completedStepIndices.includes(4),
            href: '/app/onboarding?step=4',
            btnText: 'Lancer le test',
        },
    ];

    return (
        <div className="relative overflow-hidden rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-[#F4F4F4] dark:bg-[#171A20] p-6 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEE] dark:border-white/10">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#3E6AE1] text-white">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-[#171A20] dark:text-white">
                                Votre configuration est presque prête
                            </h3>
                            <span className="inline-flex items-center rounded-[4px] bg-white dark:bg-white/10 px-2 py-0.5 text-xs font-normal text-[#5C5E62] dark:text-neutral-300 border border-[#EEEEEE] dark:border-white/10">
                                {completedCount}/{totalStepsCount} étapes · Prochaine : {nextStepName}
                            </span>
                        </div>
                        <p className="text-xs text-[#8E8E8E] mt-0.5">
                            Complétez votre premier agent vocal pour lancer vos appels de test dans des conditions réelles.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-[#171A20] dark:text-neutral-300 tabular-nums">
                            {progressPct}% complété
                        </span>
                        <div className="h-1.5 w-28 rounded-[2px] bg-[#EEEEEE] dark:bg-white/10 overflow-hidden">
                            <div
                                style={{ width: `${progressPct}%` }}
                                className="h-full rounded-[2px] bg-[#3E6AE1] transition-all duration-300"
                            />
                        </div>
                    </div>
                    <Link
                        href="/app/onboarding"
                        className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#3E6AE1] hover:bg-[#345bc7] text-white px-4 py-2 text-xs font-medium h-9 transition-colors duration-300"
                    >
                        <span>Continuer la configuration</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                        type="button"
                        onClick={handleDismiss}
                        disabled={dismissing}
                        className="rounded-[4px] p-1.5 text-[#8E8E8E] hover:text-[#171A20] dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-colors duration-300 cursor-pointer"
                        title="Masquer définitivement"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {steps.map((st) => {
                    const StepIcon = st.icon;
                    return (
                        <div
                            key={st.id}
                            className={`flex flex-col justify-between rounded-[4px] border p-4 transition-colors duration-300 ${
                                st.done
                                    ? 'border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-500/20 dark:bg-emerald-500/5'
                                    : 'border-[#EEEEEE] bg-white dark:border-white/10 dark:bg-white/5 hover:border-[#D0D1D2] dark:hover:border-white/20'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-[4px] ${
                                        st.done
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                            : 'bg-[#F4F4F4] dark:bg-white/5 text-[#171A20] dark:text-white'
                                    }`}>
                                        <StepIcon className="h-3.5 w-3.5" />
                                    </div>
                                    {st.done ? (
                                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <span>Prêt</span>
                                        </span>
                                    ) : (
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    )}
                                </div>
                                <h4 className="text-xs font-medium text-[#171A20] dark:text-white">{st.title}</h4>
                                <p className="text-xs text-[#8E8E8E] mt-0.5 line-clamp-1">{st.desc}</p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-[#EEEEEE] dark:border-white/10">
                                {st.done ? (
                                    <Link
                                        href={st.href}
                                        className="inline-flex items-center gap-1 text-xs font-normal text-[#5C5E62] dark:text-[#8E8E8E] hover:text-[#171A20] dark:hover:text-white transition-colors duration-300"
                                    >
                                        <span>Gérer</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={st.href}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-[#3E6AE1] hover:underline transition-colors duration-300"
                                    >
                                        <span>{st.btnText}</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Dashboard({
    kpis,
    callsByDay = [],
    leadDistribution = [],
    recentCalls = [],
    activeCampaigns = [],
    onboarding,
    onboardingState,
    selectedPeriod = '30d',
    periodStart,
    periodEnd,
}) {
    const { t } = useTranslation();
    const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
    const hasCalls = Boolean((kpis?.calls_period || 0) > 0);
    const hasWeeklyActivity = callsByDay.some((d) => (d.calls || 0) > 0);

    const maxDay = callsByDay.reduce((max, d) => (d.calls > (max?.calls || 0) ? d : max), callsByDay[0] || { day: 'dim.', calls: 0 });

    const activityTotal = callsByDay.reduce((acc, item) => acc + Number(item.calls || 0), 0);
    const hotLeads = leadDistribution.find((l) => l.name === 'Hot')?.value || 0;
    const warmLeads = leadDistribution.find((l) => l.name === 'Warm')?.value || 0;
    const coldLeads = leadDistribution.find((l) => l.name === 'Cold')?.value || 0;
    const periodDays = selectedPeriod === '7d' ? 7 : selectedPeriod === '90d' ? 90 : 30;
    const formatPeriodDate = (value) => value
        ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';

    return (
        <ClientLayout title={t('client.dashboard') || 'Tableau de bord'}>
            <Head title={t('client.dashboard') || 'Tableau de bord · AutoCall'} />
            <div className="space-y-6">

                {/* HEADER SUPÉRIEUR AVEC DATE RANGE & ACTIONS (Design Tesla : épuré, Electric Blue CTA) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-medium tracking-normal text-[#171A20] dark:text-white">
                            Tableau de bord
                        </h1>
                        <p className="text-xs text-[#8E8E8E] mt-1">
                            Supervision en direct de vos agents vocaux et des volumes téléphoniques.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        {/* Date Range Selector Pill */}
                        <div className="inline-flex items-center gap-2 rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] px-3.5 py-2 text-xs font-medium text-[#393C41] dark:text-neutral-300">
                            <Calendar className="h-3.5 w-3.5 text-[#8E8E8E]" />
                            <span>{formatPeriodDate(periodStart)} – {formatPeriodDate(periodEnd)}</span>
                        </div>

                        {/* Dropdown Filtre de Période */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setPeriodMenuOpen(!periodMenuOpen)}
                                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] px-3.5 py-2 text-xs font-medium text-[#393C41] dark:text-neutral-300 cursor-pointer hover:border-[#D0D1D2] dark:hover:border-white/20 transition-colors duration-300"
                            >
                                <span>{selectedPeriod === '7d' ? '7 derniers jours' : selectedPeriod === '30d' ? '30 derniers jours' : '90 derniers jours'}</span>
                                <ChevronDown className="h-3 w-3 text-[#8E8E8E]" />
                            </button>
                            {periodMenuOpen && (
                                <div className="absolute right-0 mt-1.5 w-44 rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] z-20 py-1 text-xs shadow-none">
                                    {['7d', '30d', '90d'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => {
                                                setPeriodMenuOpen(false);
                                                router.get(route('client.dashboard'), { period: p }, { preserveState: true, replace: true });
                                            }}
                                            className="w-full text-left px-3.5 py-2 hover:bg-[#F4F4F4] dark:hover:bg-white/5 text-[#393C41] dark:text-neutral-200 transition-colors duration-300"
                                        >
                                            {p === '7d' ? '7 derniers jours' : p === '30d' ? '30 derniers jours' : '90 derniers jours'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bouton Exporter CTA Tesla Electric Blue */}
                        <a
                            href={route('client.calls.export')}
                            className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#3E6AE1] hover:bg-[#345bc7] text-white font-medium px-5 py-2 text-xs h-9 transition-colors duration-300 cursor-pointer"
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span>Exporter</span>
                        </a>
                    </div>
                </div>

                {/* GUIDE DE DÉMARRAGE RAPIDE / REPRISE ONBOARDING */}
                <OnboardingQuickStartBanner onboarding={onboarding} onboardingState={onboardingState} />

                {/* 1. TOP ROW : LES 4 KPIS EN TÊTE (Design Tesla : 12px radius, hairline borders) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricKpiCard
                        label={`Volume d'appels (${periodDays}j)`}
                        value={Number(kpis?.calls_period ?? 0).toLocaleString()}
                        trend={null}
                        isPositive={true}
                        sub={hasCalls ? `Sur les ${periodDays} derniers jours` : 'Aucun appel sur cette période'}
                        icon={PhoneCall}
                    />
                    <MetricKpiCard
                        label="Taux d'appels complétés"
                        value={`${kpis?.success_rate ?? 0}%`}
                        trend={null}
                        isPositive={true}
                        sub={hasCalls ? 'Appels répondus avec succès' : 'En attente des premiers résultats'}
                        icon={Target}
                    />
                    <MetricKpiCard
                        label="Prospects Qualifiés"
                        value={Number(kpis?.qualified_leads ?? 0).toLocaleString()}
                        trend={null}
                        isPositive={false}
                        sub={hasCalls ? 'Prospects chauds et tièdes' : 'Prospects chauds et tièdes détectés'}
                        icon={Users}
                    />
                    <MetricKpiCard
                        label="Durée Moyenne d'Appel"
                        value={fmtDur(kpis?.avg_duration)}
                        trend={null}
                        isPositive={true}
                        sub={hasCalls ? 'Moyenne des appels complétés' : 'Calculée sur les appels complétés'}
                        icon={Clock}
                    />
                </div>

                {/* 2. RESSOURCES RAPIDES : AGENTS, NUMÉROS, CONTACTS, CAMPAGNES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link
                        href={route('client.agents.index')}
                        className="group flex items-center justify-between rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-4.5 hover:border-[#D0D1D2] dark:hover:border-white/20 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-[#171A20] dark:text-white">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xl font-medium text-[#171A20] dark:text-white tabular-nums">{kpis?.agents ?? 0}</p>
                                <p className="text-xs text-[#8E8E8E]">Agents IA</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#8E8E8E] group-hover:text-[#171A20] dark:group-hover:text-white transition-colors duration-300" />
                    </Link>

                    <Link
                        href={route('client.phone-numbers.index')}
                        className="group flex items-center justify-between rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-4.5 hover:border-[#D0D1D2] dark:hover:border-white/20 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-[#171A20] dark:text-white">
                                <Phone className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xl font-medium text-[#171A20] dark:text-white tabular-nums">{kpis?.numbers ?? 0}</p>
                                <p className="text-xs text-[#8E8E8E]">Numéros Lignes</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#8E8E8E] group-hover:text-[#171A20] dark:group-hover:text-white transition-colors duration-300" />
                    </Link>

                    <Link
                        href={route('client.contacts.index')}
                        className="group flex items-center justify-between rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-4.5 hover:border-[#D0D1D2] dark:hover:border-white/20 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-[#171A20] dark:text-white">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xl font-medium text-[#171A20] dark:text-white tabular-nums">{(kpis?.contacts ?? 0).toLocaleString()}</p>
                                <p className="text-xs text-[#8E8E8E]"><Trans i18nKey="nav.contacts" /></p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#8E8E8E] group-hover:text-[#171A20] dark:group-hover:text-white transition-colors duration-300" />
                    </Link>

                    <Link
                        href={route('client.campaigns.index')}
                        className="group flex items-center justify-between rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-4.5 hover:border-[#D0D1D2] dark:hover:border-white/20 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-[#171A20] dark:text-white">
                                <Megaphone className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xl font-medium text-[#171A20] dark:text-white tabular-nums">{kpis?.active_campaigns ?? 0}</p>
                                <p className="text-xs text-[#8E8E8E]">Campagnes</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#8E8E8E] group-hover:text-[#171A20] dark:group-hover:text-white transition-colors duration-300" />
                    </Link>
                </div>

                {/* 3. SECTION PRINCIPALE : GRANDE ANALYTIQUE + PANNEAU LATÉRAL À 3 CARTES */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLONNE GAUCHE (2/3) : VOLUME PRINCIPAL + SEGMENTS QUALIFICATION */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Carte Graphique Spline / Area Chart */}
                        <div className="rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <span className="text-xs font-normal text-[#8E8E8E]">Activité Téléphonique Hebdomadaire</span>
                                    <div className="flex items-baseline gap-2.5 mt-1">
                                        <span className="text-2xl sm:text-3xl font-medium tracking-normal text-[#171A20] dark:text-white tabular-nums">
                                            {activityTotal.toLocaleString()} appels
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 text-xs font-normal text-[#5C5E62] dark:text-[#8E8E8E]">
                                        <span className="h-2 w-2 rounded-full bg-[#3E6AE1]" />
                                        <span>{periodDays} derniers jours</span>
                                    </span>
                                </div>
                            </div>

                            {/* Courbe Spline Tesla pure SVG */}
                            <div className="pt-2">
                                <SplineAreaChart data={callsByDay} />
                            </div>

                            {/* CARTES SEGMENTÉES EN DESSOUS */}
                            <div className="mt-6 pt-5 border-t border-[#EEEEEE] dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Segment 1 : Chauds */}
                                <div className="rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-white/5 p-4">
                                    <div className="flex items-center justify-between text-xs text-[#5C5E62] dark:text-[#8E8E8E]">
                                        <span>Prospects Chauds</span>
                                        <Flame className="h-3.5 w-3.5 text-emerald-600" />
                                    </div>
                                    <p className="text-xl font-medium text-[#171A20] dark:text-white tabular-nums mt-1">
                                        {hotLeads}
                                    </p>
                                    <span className="text-xs text-[#8E8E8E]">Intérêt immédiat confirmé</span>
                                </div>

                                {/* Segment 2 : Tièdes */}
                                <div className="rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-white/5 p-4">
                                    <div className="flex items-center justify-between text-xs text-[#5C5E62] dark:text-[#8E8E8E]">
                                        <span>Prospects Tièdes</span>
                                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                                    </div>
                                    <p className="text-xl font-medium text-[#171A20] dark:text-white tabular-nums mt-1">
                                        {warmLeads}
                                    </p>
                                    <span className="text-xs text-[#8E8E8E]">À relancer sous 48h</span>
                                </div>

                                {/* Segment 3 : Froids */}
                                <div className="rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-white/5 p-4">
                                    <div className="flex items-center justify-between text-xs text-[#5C5E62] dark:text-[#8E8E8E]">
                                        <span>Sans Intérêt / Répondeur</span>
                                        <Bot className="h-3.5 w-3.5 text-[#3E6AE1]" />
                                    </div>
                                    <p className="text-xl font-medium text-[#171A20] dark:text-white tabular-nums mt-1">
                                        {coldLeads}
                                    </p>
                                    <span className="text-xs text-[#8E8E8E]">Archivés ou recyclés</span>
                                </div>
                            </div>
                        </div>

                        {/* TABLEAU DES APPELS RÉCENTS */}
                        <div className="rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-[#171A20] dark:text-white">
                                    Derniers appels traités
                                </h3>
                                <Link
                                    href={route('client.calls.index')}
                                    className="text-xs font-medium text-[#3E6AE1] hover:underline inline-flex items-center gap-1 transition-colors duration-300"
                                >
                                    <span>Voir tout l&apos;historique</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            {recentCalls.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-[#EEEEEE] dark:divide-white/10 text-xs">
                                        <thead>
                                            <tr className="text-left text-xs font-medium normal-case tracking-normal text-[#8E8E8E]">
                                                <th className="pb-3 pr-3">ID</th>
                                                <th className="pb-3 px-3">Contact</th>
                                                <th className="pb-3 px-3">Statut</th>
                                                <th className="pb-3 px-3">Sentiment</th>
                                                <th className="pb-3 px-3 text-right">Durée</th>
                                                <th className="pb-3 pl-3 text-right">Qualification</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#EEEEEE] dark:divide-white/10">
                                            {recentCalls.map((c) => {
                                                const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.no_answer;

                                                return (
                                                    <tr key={c.id} className="transition-colors duration-300 hover:bg-[#F4F4F4] dark:hover:bg-white/5">
                                                        <td className="py-3 pr-3 font-mono text-xs text-[#8E8E8E]">
                                                            #{c.id}
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-xs font-medium text-[#171A20] dark:text-neutral-200 border border-[#EEEEEE] dark:border-white/10">
                                                                    {initials(c.contact)}
                                                                </span>
                                                                <span className="font-medium text-[#171A20] dark:text-white">{c.contact}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <span className={`inline-flex items-center rounded-[4px] border px-2 py-0.5 text-xs font-medium ${st.pill}`}>
                                                                {st.label}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3 capitalize text-[#5C5E62] dark:text-neutral-300">
                                                            {c.sentiment || 'Neutre'}
                                                        </td>
                                                        <td className="py-3 px-3 text-right font-mono text-[#5C5E62] dark:text-neutral-300 tabular-nums">
                                                            {fmtDur(c.duration_seconds)}
                                                        </td>
                                                        <td className="py-3 pl-3 text-right">
                                                            <span className="inline-flex rounded-[4px] border border-[#EEEEEE] px-2 py-0.5 text-xs font-normal capitalize text-[#5C5E62] dark:border-white/10 dark:text-neutral-300">
                                                                {c.qualification || 'Non qualifié'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-[#3E6AE1] mb-3 border border-[#EEEEEE] dark:border-white/10">
                                        <PhoneCall className="h-4 w-4" />
                                    </div>
                                    <h4 className="text-xs font-medium text-[#171A20] dark:text-white">
                                        Aucun appel enregistré pour le moment
                                    </h4>
                                    <p className="mt-1 text-xs text-[#8E8E8E] max-w-sm">
                                        Tous les appels entrants et sortants traités par vos agents IA s&apos;afficheront ici en direct avec transcription et analyse du sentiment.
                                    </p>
                                    <Link
                                        href={route('client.campaigns.index')}
                                        className="mt-4 inline-flex items-center gap-1.5 rounded-[4px] bg-[#3E6AE1] hover:bg-[#345bc7] text-white px-4 py-2 text-xs font-medium transition-colors duration-300"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Lancer un premier appel</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLONNE DROITE (1/3) : 3 WIDGETS SPÉCIFIQUES (Style Tesla) */}
                    <div className="space-y-6">

                        {/* WIDGET 1 : PIC D'ACTIVITÉ */}
                        <div className="rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-[#171A20] dark:text-white">Pic d&apos;Activité Hebdomadaire</span>
                                <MoreHorizontal className="h-4 w-4 text-[#8E8E8E]" />
                            </div>
                            <p className="text-xs text-[#8E8E8E] mb-4">
                                {hasWeeklyActivity && maxDay?.day ? `Pic enregistré sur ${maxDay.day}` : `Aucune activité sur les ${periodDays} derniers jours`}
                            </p>

                            {/* Barres verticales sobres Tesla */}
                            <div className="flex items-end justify-between gap-2 h-32 pt-6 px-1">
                                {callsByDay.map((d, index) => {
                                    const isPeak = hasWeeklyActivity && d.day === maxDay.day && d.calls > 0;
                                    const heightPct = hasWeeklyActivity && maxDay.calls > 0 ? Math.max(14, (d.calls / maxDay.calls) * 100) : 16;
                                    const showLabel = callsByDay.length <= 7 || index === 0 || index === callsByDay.length - 1 || index % 2 === 0;
                                    const shortLabel = String(d.day).split(/[–-]/)[0].trim();

                                    return (
                                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                                            {isPeak && (
                                                <span className="text-xs font-medium text-[#3E6AE1] tabular-nums -mb-1">
                                                    {d.calls}
                                                </span>
                                            )}
                                            <div
                                                style={{ height: `${heightPct}%` }}
                                                className={`w-full max-w-[18px] rounded-[2px] transition-colors duration-300 ${
                                                    isPeak
                                                        ? 'bg-[#3E6AE1]'
                                                        : 'bg-[#EEEEEE] hover:bg-[#D0D1D2] dark:bg-white/10 dark:hover:bg-white/20'
                                                }`}
                                            />
                                            <span
                                                className={`h-4 whitespace-nowrap text-xs ${isPeak ? 'text-[#3E6AE1] font-medium' : 'text-[#8E8E8E]'}`}
                                                title={d.day}
                                            >
                                                {showLabel ? shortLabel : ''}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* WIDGET 2 : JAUGE CIRCULAIRE */}
                        <div className="rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-[#171A20] dark:text-white">Taux de Conversion Télécom</span>
                                <MoreHorizontal className="h-4 w-4 text-[#8E8E8E]" />
                            </div>

                            <SatisfactionRadialGauge
                                percentage={hasCalls ? (kpis?.success_rate ?? 0) : 0}
                                hasData={hasCalls}
                            />
                        </div>

                        {/* WIDGET 3 : CAMPAGNES ACTIVES */}
                        <div className="rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-sm font-medium text-[#171A20] dark:text-white">Campagnes actives</h3>
                                    <p className="mt-0.5 text-xs text-[#8E8E8E]">Données synchronisées avec vos campagnes</p>
                                </div>
                                <Megaphone className="h-4 w-4 text-[#3E6AE1]" />
                            </div>
                            {activeCampaigns.length > 0 ? (
                                <div className="mt-4 space-y-2">
                                    {activeCampaigns.map((campaign) => (
                                        <Link
                                            key={campaign.id}
                                            href={route('client.campaigns.show', campaign.id)}
                                            className="flex items-center justify-between gap-3 rounded-[4px] border border-[#EEEEEE] px-3.5 py-2.5 transition-colors duration-300 hover:bg-[#F4F4F4] dark:border-white/10 dark:hover:bg-white/5"
                                        >
                                            <span className="min-w-0 truncate text-xs font-medium text-[#171A20] dark:text-neutral-100">{campaign.name}</span>
                                            <span className="shrink-0 text-xs font-mono tabular-nums text-[#8E8E8E]">{campaign.contacts_count} contacts</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 rounded-[4px] border border-dashed border-[#EEEEEE] px-3 py-5 text-center dark:border-white/10">
                                    <p className="text-xs text-[#8E8E8E]">Aucune campagne active</p>
                                    <Link href={route('client.campaigns.index')} className="mt-2 inline-flex text-xs font-medium text-[#3E6AE1] hover:underline">
                                        Gérer les campagnes
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </ClientLayout>
    );
}
