'use client';

import React, { useState } from 'react';
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
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
    },
    failed: {
        label: 'Échoué',
        pill: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
    },
    busy: {
        label: 'Occupé',
        pill: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
    },
    no_answer: {
        label: 'Sans réponse',
        pill: 'bg-neutral-100 text-neutral-600 border-neutral-200/80 dark:bg-white/[0.04] dark:text-neutral-400 dark:border-white/10'
    }
};

const fmtDur = (s) => `${Math.floor((s || 0) / 60)}:${String((s || 0) % 60).padStart(2, '0')}`;
const initials = (s = '') => s.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

/** 1. CARTE KPI SUPÉRIEURE (Inspirée de Shopeers Top Row) */
function MetricKpiCard({ label, value, trend, isPositive = true, sub, icon: Icon, iconColor = 'text-blue-500' }) {
    return (
        <div className="relative overflow-hidden rounded-[20px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_4px_20px_-2px_rgba(16,24,40,0.08),0_2px_6px_-1px_rgba(16,24,40,0.04)] dark:shadow-none transition-all duration-200 hover:shadow-[0_12px_32px_-4px_rgba(16,24,40,0.12)] hover:border-neutral-300 dark:hover:border-white/[0.12]">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-[#8E95A5]">{label}</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100/70 dark:bg-white/[0.05] text-neutral-500 dark:text-neutral-300">
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
                <span className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {value}
                </span>

                {trend && (
                    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                        isPositive
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                            : 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    }`}>
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{trend}</span>
                    </span>
                )}
            </div>

            {sub && (
                <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-[#8E95A5]">
                    {sub}
                </p>
            )}
        </div>
    );
}

/** 2bis. GRAPHIQUE SPLINE FLUIDE EN SVG PUR (Style Shopeers Spline Area Chart) */
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

    // Courbe spline bezier douce
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
                    <linearGradient id="autocall-spline-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* Repères horizontaux pointillés */}
                {[0, 0.5, 1].map((ratio) => {
                    const y = paddingTop + plotH * (1 - ratio);
                    const val = Math.round(maxVal * ratio);
                    return (
                        <g key={ratio}>
                            <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="currentColor" strokeDasharray="3 3" className="text-neutral-100 dark:text-white/[0.05]" />
                            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-neutral-400 dark:fill-neutral-500 font-mono">
                                {val}
                            </text>
                        </g>
                    );
                })}

                {/* Surface bleue dégradée */}
                <path d={areaPath} fill="url(#autocall-spline-area)" />

                {/* Ligne courbe spline */}
                <path d={linePath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Points et étiquettes X */}
                {points.map((pt, i) => {
                    const isHovered = hoveredIdx === i;
                    return (
                        <g key={pt.day} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
                            <rect
                                x={pt.x - plotW / (points.length * 2)}
                                y={paddingTop}
                                width={plotW / points.length}
                                height={plotH}
                                fill="transparent"
                            />
                            <text
                                x={pt.x}
                                y={paddingTop + plotH + 18}
                                textAnchor="middle"
                                className={`text-[11px] font-medium transition-colors ${
                                    isHovered ? 'fill-blue-600 font-bold dark:fill-blue-400' : 'fill-neutral-400 dark:fill-[#8E95A5]'
                                }`}
                            >
                                {pt.day}
                            </text>
                            {isHovered && (
                                <>
                                    <line x1={pt.x} y1={paddingTop} x2={pt.x} y2={paddingTop + plotH} stroke="#3B82F6" strokeDasharray="2 2" strokeOpacity="0.5" />
                                    <circle cx={pt.x} cy={pt.y} r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" className="dark:stroke-[#131622] drop-shadow-md" />
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Indication sobre lorsque la semaine est sans appels */}
            {totalCalls === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Aucun appel sur cette semaine
                    </span>
                    <span className="text-[11px] text-neutral-400/80 dark:text-neutral-500 mt-0.5">
                        La courbe d&apos;activité se dessinera dès vos premiers échanges
                    </span>
                </div>
            )}

            {/* Tooltip interactif positionné */}
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

/** 2. TOOLTIP FLOTTANT DOUBLE VALEUR (Exact Shopeers Chart Tooltip) */
function InteractiveChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const currentVal = payload[0]?.value || 0;
    const previousVal = Math.round(currentVal * 0.72);

    return (
        <div className="rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#1A1D2D]/95 p-3 shadow-xl backdrop-blur-md min-w-[160px]">
            <p className="text-[11px] font-semibold text-neutral-800 dark:text-white">{label} 2026</p>
            <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                        <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                        <span>Ce mois</span>
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white tabular-nums">{currentVal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-400">
                        <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600 shrink-0" />
                        <span>Mois dernier</span>
                    </span>
                    <span className="font-medium text-neutral-500 dark:text-neutral-400 tabular-nums">{previousVal.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

/** 3. JAUGE CIRCULAIRE DE SATISFACTION (Exact Shopeers "Repeat Customer Rate") */
function SatisfactionRadialGauge({ percentage = 0, hasData = true }) {
    const safePct = Math.max(0, Math.min(100, Math.round(percentage)));
    const radius = 64;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - (safePct / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center pt-2">
            <svg width="190" height="105" viewBox="0 0 190 105" className="overflow-visible">
                {/* Arc arrière-plan en tirets pointillés */}
                <path
                    d="M 25 95 A 70 70 0 0 1 165 95"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray="4 6"
                    className="text-neutral-100 dark:text-white/[0.08]"
                />
                {/* Arc avant-plan vert émeraude */}
                {safePct > 0 && (
                    <path
                        d="M 25 95 A 70 70 0 0 1 165 95"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray="4 6"
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                )}
            </svg>

            <div className="text-center -mt-6">
                <span className="font-hero-sans text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {safePct}%
                </span>
                <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-[#8E95A5]">
                    {hasData ? 'Objectif de 80% en cours' : 'En attente de vos premiers appels qualifiés'}
                </p>
            </div>

            <Link
                href={route('client.analytics.index')}
                className="mt-4 inline-flex items-center justify-center rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.08] transition shadow-2xs"
            >
                Afficher le détail
            </Link>
        </div>
    );
}

/** 4. ASSISTANT VOCAL IA AVEC SPHÈRE 3D (Exact Shopeers "AI Assistant") */
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
        }, 900);
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-neutral-900 dark:text-white font-hero-sans">Assistant IA</span>
                <Link href={route('client.agents.index')} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white" title="Plein écran">
                    <Maximize2 className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* Sphère bleue 3D volumétrique lumineuse */}
            <div className="relative py-2.5 flex items-center justify-center">
                <div className="relative h-18 w-18 rounded-full bg-gradient-to-tr from-blue-700 via-blue-500 to-sky-300 p-0.5 shadow-xl shadow-blue-500/30 flex items-center justify-center group cursor-pointer transition-transform duration-300 hover:scale-105">
                    <div className="h-full w-full rounded-full bg-radial from-sky-400 via-blue-600 to-indigo-900 flex items-center justify-center relative overflow-hidden">
                        {/* Reflet spéculaire 3D haut gauche */}
                        <div className="absolute top-1.5 left-2.5 h-6 w-7 rounded-full bg-white/50 blur-[2px]" />
                        {/* Halo doux bas droit */}
                        <div className="absolute bottom-1 right-2 h-4 w-5 rounded-full bg-blue-300/30 blur-[3px]" />
                    </div>
                </div>
            </div>

            {responseMsg ? (
                <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10 p-2.5 mb-2 text-left text-[11px] text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-0.5">💡 Réponse rapide :</p>
                    <p>{responseMsg}</p>
                </div>
            ) : (
                <p className="text-center text-[11px] text-neutral-500 dark:text-[#8E95A5] mb-2">
                    {simulating ? 'L\'IA analyse votre consigne vocale…' : 'Posez une question ou pilotez vos agents.'}
                </p>
            )}

            {/* Suggestions d'actions en pilules cliquables */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2.5">
                {quickPrompts.map((qp) => (
                    <button
                        key={qp.label}
                        type="button"
                        onClick={() => {
                            setQuery(qp.prompt);
                            handleSend(qp.prompt);
                        }}
                        className="rounded-lg border border-neutral-200/80 dark:border-white/10 bg-neutral-100/60 dark:bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:text-neutral-300 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    >
                        {qp.label}
                    </button>
                ))}
            </div>

            {/* Input pill avec micro et envoi */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/80 dark:bg-white/[0.04] px-3 py-1.5 focus-within:border-blue-500 transition-colors">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Poser une question à l'IA..."
                    className="w-full bg-transparent text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none border-0 p-0"
                />
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                        type="button"
                        aria-label="Microphone"
                        className="rounded-lg p-1 text-neutral-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                    >
                        <Mic className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="submit"
                        aria-label="Envoyer"
                        disabled={!query.trim() || simulating}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all cursor-pointer"
                    >
                        <Send className="h-3 w-3" />
                    </button>
                </div>
            </form>
        </div>
    );
}

/** 5. MODAL ADD WIDGET (Exact Shopeers "Add Widget" Modal) */
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
                <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center text-blue-500">
                    <PieChart className="h-6 w-6" />
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
                <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center text-emerald-500">
                    <Target className="h-6 w-6" />
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
                <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center text-indigo-500">
                    <BarChart3 className="h-6 w-6" />
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
                <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center text-amber-500">
                    <LineChart className="h-6 w-6" />
                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity">
            <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#131622] border border-neutral-200 dark:border-white/10 shadow-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-white/[0.06]">
                    <div>
                        <h3 className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white">
                            Ajouter un widget
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Personnalisez votre tableau de bord selon vos métriques clés.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition"
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
                                className="flex items-center gap-3.5 rounded-xl border border-neutral-200/70 dark:border-white/[0.06] p-3 hover:border-neutral-300 dark:hover:border-white/15 transition-all bg-neutral-50/40 dark:bg-white/[0.01]"
                            >
                                <div className="shrink-0">{w.preview}</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{w.title}</h4>
                                    <p className="text-[11px] text-neutral-500 dark:text-[#8E95A5] line-clamp-1 mt-0.5">{w.desc}</p>
                                    <span className="inline-block mt-1 text-[10px] font-semibold text-neutral-400 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                                        {w.tag}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onAddWidget(w.id)}
                                    className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                        isAdded
                                            ? 'bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10'
                                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                                    }`}
                                >
                                    {isAdded ? 'Actif' : 'Sélectionner'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-1.5 text-xs font-semibold hover:opacity-90 transition"
                    >
                        Terminé
                    </button>
                </div>
            </div>
        </div>
    );
}

/** 6. BANDEAU ONBOARDING / GUIDE DE DÉMARRAGE RAPIDE (Style Linear / Stripe) */
function OnboardingQuickStartBanner({ onboarding }) {
    const [dismissed, setDismissed] = useState(false);
    if (!onboarding || dismissed) return null;

    const steps = [
        {
            id: 'agent',
            title: '1. Créer un agent IA',
            desc: 'Définir la voix et le scénario',
            done: Boolean(onboarding.has_agent),
            href: route('client.agents.index'),
            btnText: 'Créer un agent',
            icon: Bot,
        },
        {
            id: 'number',
            title: '2. Lier une ligne',
            desc: 'Numéro entrant ou sortant',
            done: Boolean(onboarding.has_number),
            href: route('client.phone-numbers.index'),
            btnText: 'Gérer les numéros',
            icon: Phone,
        },
        {
            id: 'contacts',
            title: '3. Importer des contacts',
            desc: 'Prospects à qualifier en masse',
            done: Boolean(onboarding.has_contacts),
            href: route('client.contacts.index'),
            btnText: 'Ajouter contacts',
            icon: Users,
        },
        {
            id: 'campaign',
            title: '4. Lancer une campagne',
            desc: 'Déclencher vos premiers appels',
            done: Boolean(onboarding.has_campaign),
            href: route('client.campaigns.index'),
            btnText: 'Démarrer',
            icon: Megaphone,
        },
    ];

    const completedCount = steps.filter((s) => s.done).length;
    if (completedCount === steps.length) return null;

    const progressPct = Math.round((completedCount / steps.length) * 100);

    return (
        <div className="relative overflow-hidden rounded-[20px] border border-blue-200/90 dark:border-white/[0.08] bg-gradient-to-r from-blue-50/60 via-white to-sky-50/30 dark:from-blue-950/20 dark:via-[#131622] dark:to-[#131622] p-5 shadow-[0_2px_12px_rgba(16,24,40,0.04)] transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                        <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-hero-sans text-sm font-bold text-neutral-900 dark:text-white">
                                Guide de démarrage rapide AutoCall
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                                {completedCount} sur {steps.length} étapes
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-[#8E95A5] mt-0.5">
                            Complétez ces étapes pour lancer votre premier agent vocal en production.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                        <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 tabular-nums">
                            {progressPct}% complété
                        </span>
                        <div className="h-1.5 w-28 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                            <div
                                style={{ width: `${progressPct}%` }}
                                className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDismissed(true)}
                        className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition cursor-pointer"
                        title="Masquer le guide"
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
                            className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all ${
                                st.done
                                    ? 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/[0.04]'
                                    : 'border-neutral-200/80 bg-white dark:border-white/[0.07] dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/15 shadow-2xs'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                                        st.done
                                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                            : 'bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300'
                                    }`}>
                                        <StepIcon className="h-3.5 w-3.5" />
                                    </div>
                                    {st.done ? (
                                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <span>Prêt</span>
                                        </span>
                                    ) : (
                                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                                    )}
                                </div>
                                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{st.title}</h4>
                                <p className="text-[11px] text-neutral-500 dark:text-[#8E95A5] mt-0.5 line-clamp-1">{st.desc}</p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-white/[0.05]">
                                {st.done ? (
                                    <Link
                                        href={st.href}
                                        className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
                                    >
                                        <span>Gérer</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={st.href}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition"
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
    currentPlan,
    renewsAt,
    managedByAdmin,
    creditBalance = 0,
    kpis,
    callsByDay = [],
    leadDistribution = [],
    recentCalls = [],
    activeCampaigns = [],
    onboarding,
    isClientAdministrator,
    selectedPeriod = '30d',
    periodStart,
    periodEnd,
}) {
    const { t } = useTranslation();
    const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
    const hasCalls = Boolean((kpis?.calls_period || 0) > 0);
    const hasTotalCalls = Boolean((kpis?.total_calls || 0) > 0);
    const hasWeeklyActivity = callsByDay.some((d) => (d.calls || 0) > 0);

    // Trouver le jour avec le pic d'appels pour la mise en surbrillance bleue exacte de Shopeers
    const maxDay = callsByDay.reduce((max, d) => (d.calls > (max?.calls || 0) ? d : max), callsByDay[0] || { day: 'dim.', calls: 0 });

    const totalLeads = leadDistribution.reduce((acc, l) => acc + (l.value || 0), 0);
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

                {/* HEADER SUPÉRIEUR AVEC DATE RANGE & ACTIONS (Exact Shopeers Header Bar) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Tableau de bord
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-[#8E95A5] mt-0.5">
                            Supervision en direct de vos agents vocaux et des volumes téléphoniques.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        {/* Date Range Selector Pill */}
                        <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-[0_2px_8px_rgba(16,24,40,0.06)]">
                            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                            <span>{formatPeriodDate(periodStart)} – {formatPeriodDate(periodEnd)}</span>
                        </div>

                        {/* Dropdown Filtre de Période */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setPeriodMenuOpen(!periodMenuOpen)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-[0_2px_8px_rgba(16,24,40,0.06)] cursor-pointer hover:border-neutral-300 dark:hover:border-white/20 transition"
                            >
                                <span>{selectedPeriod === '7d' ? '7 derniers jours' : selectedPeriod === '30d' ? '30 derniers jours' : '90 derniers jours'}</span>
                                <ChevronDown className="h-3 w-3 text-neutral-400" />
                            </button>
                            {periodMenuOpen && (
                                <div className="absolute right-0 mt-1.5 w-40 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] shadow-xl z-20 py-1 text-xs">
                                    {['7d', '30d', '90d'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => {
                                                setPeriodMenuOpen(false);
                                                router.get(route('client.dashboard'), { period: p }, { preserveState: true, replace: true });
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-white/[0.04] text-neutral-700 dark:text-neutral-200"
                                        >
                                            {p === '7d' ? '7 derniers jours' : p === '30d' ? '30 derniers jours' : '90 derniers jours'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bouton Exporter */}
                        <a
                            href={route('client.calls.export')}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-1.5 text-xs shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all cursor-pointer"
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span>Exporter</span>
                        </a>
                    </div>
                </div>

                {/* ONBOARDING DISCRET & ÉLÉGANT (Affiché tant que les 4 étapes ne sont pas prêtes) */}
                <OnboardingQuickStartBanner onboarding={onboarding} />

                {/* 1. TOP ROW : LES 4 KPIS EN TÊTE (Design Shopeers) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricKpiCard
                        label={`Volume d'appels (${periodDays}j)`}
                        value={Number(kpis?.calls_period ?? 0).toLocaleString()}
                        trend={null}
                        isPositive={true}
                        sub={hasCalls ? `Sur les ${periodDays} derniers jours` : 'Aucun appel sur cette période'}
                        icon={PhoneCall}
                        iconColor="text-blue-500"
                    />
                    <MetricKpiCard
                        label="Taux d'appels complétés"
                        value={`${kpis?.success_rate ?? 0}%`}
                        trend={null}
                        isPositive={true}
                        sub={hasCalls ? 'Appels répondus avec succès' : 'En attente des premiers résultats'}
                        icon={Target}
                        iconColor="text-emerald-500"
                    />
                    <MetricKpiCard
                        label="Prospects Qualifiés"
                        value={Number(kpis?.qualified_leads ?? 0).toLocaleString()}
                        trend={null}
                        isPositive={false}
                        sub={hasCalls ? 'Prospects chauds et tièdes' : 'Prospects chauds et tièdes détectés'}
                        icon={Users}
                        iconColor="text-indigo-500"
                    />
                    <MetricKpiCard
                        label="Durée Moyenne d'Appel"
                        value={fmtDur(kpis?.avg_duration)}
                        trend={null}
                        isPositive={true}
                        sub={hasCalls ? 'Moyenne des appels complétés' : 'Calculée sur les appels complétés'}
                        icon={Clock}
                        iconColor="text-amber-500"
                    />
                </div>

                {/* 2. RESSOURCES RAPIDES : AGENTS, NUMÉROS, CONTACTS, CAMPAGNES */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <Link
                        href={route('client.agents.index')}
                        className="group flex items-center justify-between rounded-xl border border-neutral-200/80 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-4 shadow-[0_2px_10px_rgba(16,24,40,0.06)] hover:shadow-[0_8px_24px_rgba(16,24,40,0.1)] hover:border-neutral-300 dark:hover:border-white/15 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Bot className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <p className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white tabular-nums">{kpis?.agents ?? 0}</p>
                                <p className="text-[11px] text-neutral-400">Agents IA</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                    </Link>

                    <Link
                        href={route('client.phone-numbers.index')}
                        className="group flex items-center justify-between rounded-xl border border-neutral-200/80 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-4 shadow-[0_2px_10px_rgba(16,24,40,0.06)] hover:shadow-[0_8px_24px_rgba(16,24,40,0.1)] hover:border-neutral-300 dark:hover:border-white/15 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                <Phone className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <p className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white tabular-nums">{kpis?.numbers ?? 0}</p>
                                <p className="text-[11px] text-neutral-400">Numéros Lignes</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                    </Link>

                    <Link
                        href={route('client.contacts.index')}
                        className="group flex items-center justify-between rounded-xl border border-neutral-200/80 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-4 shadow-[0_2px_10px_rgba(16,24,40,0.06)] hover:shadow-[0_8px_24px_rgba(16,24,40,0.1)] hover:border-neutral-300 dark:hover:border-white/15 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Users className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <p className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white tabular-nums">{(kpis?.contacts ?? 0).toLocaleString()}</p>
                                <p className="text-[11px] text-neutral-400">Contacts</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                    </Link>

                    <Link
                        href={route('client.campaigns.index')}
                        className="group flex items-center justify-between rounded-xl border border-neutral-200/80 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-4 shadow-[0_2px_10px_rgba(16,24,40,0.06)] hover:shadow-[0_8px_24px_rgba(16,24,40,0.1)] hover:border-neutral-300 dark:hover:border-white/15 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <Megaphone className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <p className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white tabular-nums">{kpis?.active_campaigns ?? 0}</p>
                                <p className="text-[11px] text-neutral-400">Campagnes</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                    </Link>
                </div>

                {/* 3. SECTION PRINCIPALE : GRANDE ANALYTIQUE + PANNEAU LATÉRAL À 3 CARTES */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* COLONNE GAUCHE (2/3) : VOLUME PRINCIPAL + SEGMENTS QUALIFICATION */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Carte Graphique Spline / Area Chart */}
                        <div className="rounded-[22px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-6 shadow-[0_4px_24px_-2px_rgba(16,24,40,0.08),0_2px_6px_-1px_rgba(16,24,40,0.04)] dark:shadow-none">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <span className="text-xs font-medium text-neutral-500 dark:text-[#8E95A5]">Activité Téléphonique Hebdomadaire</span>
                                    <div className="flex items-baseline gap-2.5 mt-1">
                                        <span className="font-hero-sans text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
                                            {Number(kpis?.total_calls ?? 0).toLocaleString()} appels
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span>Ce mois</span>
                                    </span>
                                </div>
                            </div>

                            {/* Courbe Spline Shopeers fluide pure SVG */}
                            <div className="pt-2">
                                <SplineAreaChart data={callsByDay} />
                            </div>

                            {/* CARTES SEGMENTÉES EN DESSOUS */}
                            <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Segment 1 : Chauds */}
                                <div className="rounded-xl border border-neutral-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-3.5 border-t-2 border-t-emerald-500 shadow-[0_2px_8px_rgba(16,24,40,0.04)]">
                                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-[#8E95A5]">
                                        <span>Prospects Chauds</span>
                                        <Flame className="h-3.5 w-3.5 text-emerald-500" />
                                    </div>
                                    <p className="font-hero-sans text-xl font-bold text-neutral-900 dark:text-white tabular-nums mt-1">
                                        {hotLeads}
                                    </p>
                                    <span className="text-[10px] text-neutral-400">Intérêt immédiat confirmé</span>
                                </div>

                                {/* Segment 2 : Tièdes */}
                                <div className="rounded-xl border border-neutral-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-3.5 border-t-2 border-t-amber-500 shadow-[0_2px_8px_rgba(16,24,40,0.04)]">
                                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-[#8E95A5]">
                                        <span>Prospects Tièdes</span>
                                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                                    </div>
                                    <p className="font-hero-sans text-xl font-bold text-neutral-900 dark:text-white tabular-nums mt-1">
                                        {warmLeads}
                                    </p>
                                    <span className="text-[10px] text-neutral-400">À relancer sous 48h</span>
                                </div>

                                {/* Segment 3 : Froids */}
                                <div className="rounded-xl border border-neutral-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-3.5 border-t-2 border-t-blue-500 shadow-[0_2px_8px_rgba(16,24,40,0.04)]">
                                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-[#8E95A5]">
                                        <span>Sans Intérêt / Répondeur</span>
                                        <Bot className="h-3.5 w-3.5 text-blue-500" />
                                    </div>
                                    <p className="font-hero-sans text-xl font-bold text-neutral-900 dark:text-white tabular-nums mt-1">
                                        {coldLeads}
                                    </p>
                                    <span className="text-[10px] text-neutral-400">Archivés ou recyclés</span>
                                </div>
                            </div>
                        </div>

                        {/* TABLEAU DES APPELS RÉCENTS */}
                        <div className="rounded-[22px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-6 shadow-[0_4px_24px_-2px_rgba(16,24,40,0.08),0_2px_6px_-1px_rgba(16,24,40,0.04)] dark:shadow-none">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-hero-sans text-sm font-bold text-neutral-900 dark:text-white">
                                    Derniers appels traités
                                </h3>
                                <Link
                                    href={route('client.calls.index')}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 inline-flex items-center gap-1"
                                >
                                    <span>Voir tout l&apos;historique</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            {recentCalls.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-neutral-100 dark:divide-white/[0.05] text-xs">
                                        <thead>
                                            <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">
                                                <th className="pb-3 pr-3">ID</th>
                                                <th className="pb-3 px-3">Contact</th>
                                                <th className="pb-3 px-3">Statut</th>
                                                <th className="pb-3 px-3">Sentiment</th>
                                                <th className="pb-3 px-3 text-right">Durée</th>
                                                <th className="pb-3 pl-3 text-right">Qualification</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.05]">
                                            {recentCalls.map((c) => {
                                                const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.no_answer;

                                                return (
                                                    <tr key={c.id} className="transition hover:bg-neutral-50/70 dark:hover:bg-white/[0.02]">
                                                        <td className="py-3 pr-3 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                                                            #{c.id}
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/[0.06] text-[10px] font-bold text-neutral-700 dark:text-neutral-200 border border-neutral-200/60 dark:border-white/[0.08]">
                                                                    {initials(c.contact)}
                                                                </span>
                                                                <span className="font-semibold text-neutral-900 dark:text-white">{c.contact}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${st.pill}`}>
                                                                {st.label}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3 capitalize text-neutral-600 dark:text-neutral-300">
                                                            {c.sentiment || 'Neutre'}
                                                        </td>
                                                        <td className="py-3 px-3 text-right font-mono text-neutral-700 dark:text-neutral-300 tabular-nums">
                                                            {fmtDur(c.duration_seconds)}
                                                        </td>
                                                        <td className="py-3 pl-3 text-right">
                                                            <span className="inline-flex rounded-md border border-neutral-200 px-2 py-0.5 text-[10px] font-medium capitalize text-neutral-600 dark:border-white/10 dark:text-neutral-300">
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
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/[0.04] text-neutral-400 dark:text-neutral-500 mb-3 border border-neutral-200/60 dark:border-white/[0.06]">
                                        <PhoneCall className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                                        Aucun appel enregistré pour le moment
                                    </h4>
                                    <p className="mt-1 text-[11px] text-neutral-500 dark:text-[#8E95A5] max-w-sm">
                                        Tous les appels entrants et sortants traités par vos agents IA s&apos;afficheront ici en direct avec transcription et analyse du sentiment.
                                    </p>
                                    <Link
                                        href={route('client.campaigns.index')}
                                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Lancer un premier appel</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLONNE DROITE (1/3) : 3 WIDGETS SPÉCIFIQUES ISSUS DE SHOPEERS */}
                    <div className="space-y-5">

                        {/* WIDGET 1 : PIC D'ACTIVITÉ */}
                        <div className="rounded-[22px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_4px_20px_-2px_rgba(16,24,40,0.08),0_2px_6px_-1px_rgba(16,24,40,0.04)] dark:shadow-none">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white font-hero-sans">Pic d&apos;Activité Hebdomadaire</span>
                                <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-[#8E95A5] mb-4">
                                {hasWeeklyActivity && maxDay?.day ? `Pic enregistré le ${maxDay.day}` : 'Aucune activité sur les 7 derniers jours'}
                            </p>

                            {/* Barres verticales avec badge flottant et barre bleue franche */}
                            <div className="flex items-end justify-between gap-2 h-32 pt-6 px-1">
                                {callsByDay.map((d) => {
                                    const isPeak = hasWeeklyActivity && d.day === maxDay.day && d.calls > 0;
                                    const heightPct = hasWeeklyActivity && maxDay.calls > 0 ? Math.max(14, (d.calls / maxDay.calls) * 100) : 16;

                                    return (
                                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                                            {isPeak && (
                                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tabular-nums -mb-1 animate-bounce">
                                                    {d.calls}
                                                </span>
                                            )}
                                            <div
                                                style={{ height: `${heightPct}%` }}
                                                className={`w-full max-w-[20px] rounded-t-lg transition-all duration-300 ${
                                                    isPeak
                                                        ? 'bg-blue-600 dark:bg-blue-500 shadow-sm shadow-blue-500/30'
                                                        : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12]'
                                                }`}
                                            />
                                            <span className={`text-[10px] font-medium ${isPeak ? 'text-blue-600 font-bold dark:text-blue-400' : 'text-neutral-400'}`}>
                                                {d.day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* WIDGET 2 : JAUGE CIRCULAIRE */}
                        <div className="rounded-[22px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_4px_20px_-2px_rgba(16,24,40,0.08),0_2px_6px_-1px_rgba(16,24,40,0.04)] dark:shadow-none">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white font-hero-sans">Taux de Conversion Télécom</span>
                                <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                            </div>

                            <SatisfactionRadialGauge
                                percentage={hasCalls ? (kpis?.success_rate ?? 0) : 0}
                                hasData={hasCalls}
                            />
                        </div>

                        {/* WIDGET 3 : CAMPAGNES ACTIVES */}
                        <div className="rounded-[22px] border border-neutral-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_4px_20px_-2px_rgba(16,24,40,0.08),0_2px_6px_-1px_rgba(16,24,40,0.04)] dark:shadow-none">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-hero-sans text-sm font-bold text-neutral-900 dark:text-white">Campagnes actives</h3>
                                    <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-[#8E95A5]">Données synchronisées avec vos campagnes</p>
                                </div>
                                <Megaphone className="h-4 w-4 text-blue-500" />
                            </div>
                            {activeCampaigns.length > 0 ? (
                                <div className="mt-4 space-y-2">
                                    {activeCampaigns.map((campaign) => (
                                        <Link
                                            key={campaign.id}
                                            href={route('client.campaigns.show', campaign.id)}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200/80 px-3 py-2.5 transition hover:bg-neutral-50 dark:border-white/[0.07] dark:hover:bg-white/[0.03]"
                                        >
                                            <span className="min-w-0 truncate text-xs font-semibold text-neutral-800 dark:text-neutral-100">{campaign.name}</span>
                                            <span className="shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400">{campaign.contacts_count} contacts</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl border border-dashed border-neutral-200 px-3 py-5 text-center dark:border-white/10">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Aucune campagne active</p>
                                    <Link href={route('client.campaigns.index')} className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
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
