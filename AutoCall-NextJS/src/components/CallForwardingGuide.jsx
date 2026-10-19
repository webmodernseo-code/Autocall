'use client';

import { useState } from 'react';
import { Link } from '@/lib/page-router';
import {
    PhoneForwarded,
    Copy,
    Check,
    PhoneCall,
    ShieldCheck,
    Info,
    ChevronDown,
    ChevronUp,
    Smartphone,
    Building2,
    Calendar,
    Sparkles,
    Clock,
} from 'lucide-react';

export default function CallForwardingGuide({ targetNumber = '', className = '' }) {
    const [activeTab, setActiveTab] = useState('no_answer');
    const [copied, setCopied] = useState(false);
    const [showOperators, setShowOperators] = useState(false);

    // Numéro de destination nettoyé
    const cleanNumber = String(targetNumber || '').trim();
    const displayTarget = cleanNumber || '+33189XXXXXX';

    const rules = {
        no_answer: {
            title: 'Si non-réponse (Recommandé)',
            desc: 'Laissez sonner sur votre téléphone habituel. Si vous ne décrochez pas après 3 ou 4 sonneries, votre IA AutoCall prend le relais immédiatement.',
            gsmCode: `**61*${displayTarget}#`,
            disableCode: '##61#',
            badge: 'Idéal au quotidien',
        },
        busy: {
            title: 'Si occupé / Déjà en ligne',
            desc: 'Ne perdez plus aucun prospect quand vous êtes déjà en communication : le deuxième appelant bascule automatiquement vers votre IA.',
            gsmCode: `**67*${displayTarget}#`,
            disableCode: '##67#',
            badge: 'Zéro appel manqué',
        },
        period: {
            title: 'Indisponibilité sur une période',
            desc: 'Congés annuels, déplacements professionnels ou fermeture temporaire : basculez 100% de vos appels vers votre IA dès le départ, et reprenez la main dès votre retour.',
            gsmCode: `**21*${displayTarget}#`,
            disableCode: '##21#',
            badge: 'Congés & Déplacements',
            isPeriodMode: true,
        },
        always: {
            title: 'Renvoi total permanent (24h/24)',
            desc: 'Basculez 100% de vos appels entrants directement vers votre IA sans jamais faire sonner votre combiné. Idéal pour déléguer intégralement l’accueil téléphonique.',
            gsmCode: `**21*${displayTarget}#`,
            disableCode: '##21#',
            badge: 'Standard 100% IA',
        },
    };

    const current = rules[activeTab];

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`overflow-hidden rounded-2xl border border-blue-200/90 dark:border-white/[0.08] bg-gradient-to-r from-blue-50/50 via-white to-sky-50/20 dark:from-blue-950/20 dark:via-[#131622] dark:to-[#131622] p-5 shadow-[0_2px_12px_rgba(16,24,40,0.04)] ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100 dark:border-white/[0.06]">
                <div className="flex items-start sm:items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                        <PhoneForwarded className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-hero-sans text-sm font-bold text-neutral-900 dark:text-white">
                                Guide d&apos;activation : Conserver mon numéro existant
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                                <ShieldCheck className="h-3 w-3" />
                                100% Compatible tous opérateurs
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-[#8E95A5] mt-0.5">
                            Transférez les appels de votre ligne habituelle (Orange, SFR, Bouygues, Free ou fixe) vers votre passerelle IA AutoCall.
                        </p>
                    </div>
                </div>

                {cleanNumber ? (
                    <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 text-xs">
                        <span className="text-neutral-500 dark:text-neutral-400">Votre passerelle IA :</span>
                        <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{cleanNumber}</span>
                    </div>
                ) : (
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                        Attribuez un numéro AutoCall ci-dessous pour personnaliser les codes.
                    </span>
                )}
            </div>

            {/* Onglets des 4 modes de renvoi */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {Object.entries(rules).map(([key, item]) => {
                    const isSelected = activeTab === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveTab(key)}
                            className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                    ? 'border-blue-600 bg-white dark:bg-white/[0.06] shadow-xs ring-1 ring-blue-600/20'
                                    : 'border-slate-200/90 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/10'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-1 mb-1">
                                <span className={`text-xs font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                    {item.title}
                                </span>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-[#8E95A5] line-clamp-1">
                                {item.badge}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Box d'action avec code GSM pré-rempli */}
            <div className="mt-4 rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#11141d] p-4">
                <p className="text-xs text-slate-600 dark:text-[#8E95A5] leading-relaxed mb-3">
                    {current.desc}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] p-3">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
                            {current.isPeriodMode ? 'Code à composer avant de partir en congés / déplacement :' : 'Code à composer sur votre clavier téléphonique :'}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-base font-bold text-neutral-900 dark:text-white tracking-wider">
                                {current.gsmCode}
                            </span>
                            <span className="text-xs text-neutral-400">puis touche appel</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => copyToClipboard(current.gsmCode)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                            copied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Code copié !</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copier le code</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Bloc spécifique : Conseils pour indisponibilité temporaire / congés */}
                {current.isPeriodMode && (
                    <div className="mt-3.5 rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/[0.04] p-3 space-y-2">
                        <div className="flex items-start gap-2 text-xs">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-neutral-900 dark:text-white">Retour au bureau :</span>
                                <span className="text-slate-600 dark:text-[#8E95A5] ml-1">
                                    Dès votre retour, composez simplement <code className="font-mono font-bold text-blue-700 dark:text-blue-300">##21#</code> puis touche appel pour reprendre immédiatement vos appels en direct.
                                </span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-neutral-900 dark:text-white">Informer vos clients avec l&apos;IA :</span>
                                <span className="text-slate-600 dark:text-[#8E95A5] ml-1">
                                    Dans la rubrique <strong>Agents IA</strong>, vous pouvez ajouter une consigne temporaire : <em>« L’entreprise est fermée jusqu’au 25 août. Note les coordonnées des appelants et propose-leur un rendez-vous pour la semaine de réouverture. »</em>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-xs pt-1 border-t border-blue-100/70 dark:border-white/[0.04]">
                            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-neutral-900 dark:text-white">Option Zéro Code GSM :</span>
                                <span className="text-slate-600 dark:text-[#8E95A5] ml-1">
                                    Vous pouvez aussi activer le renvoi une seule fois et gérer automatiquement vos ouvertures, votre coupure déjeuner (12h-14h) et vos congés par calendrier dans{' '}
                                    <Link href="/app/incoming-connections" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                        Connexions entrantes →
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.04] text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span>Pour désactiver ce renvoi à tout moment : composez <code className="font-mono font-bold text-neutral-700 dark:text-neutral-300">{current.disableCode}</code> ou <code className="font-mono font-bold text-neutral-700 dark:text-neutral-300">##002#</code> (tout annuler).</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowOperators(!showOperators)}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                    >
                        <span>{showOperators ? 'Masquer les opérateurs' : 'Détails par opérateur & Calendrier'}</span>
                        {showOperators ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                </div>

                {/* Volet déroulant opérateurs */}
                {showOperators && (
                    <div className="mt-3.5 pt-3.5 border-t border-slate-200/80 dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] p-2.5 border border-neutral-200/60 dark:border-white/[0.04]">
                            <p className="font-bold text-neutral-900 dark:text-white">Orange / Sosh</p>
                            <p className="text-xs text-neutral-500 mt-1">
                                Codes GSM instantanés ou programmation d&apos;un calendrier de renvoi d&apos;appel depuis l&apos;application Orange &amp; Moi.
                            </p>
                        </div>
                        <div className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] p-2.5 border border-neutral-200/60 dark:border-white/[0.04]">
                            <p className="font-bold text-neutral-900 dark:text-white">SFR / RED</p>
                            <p className="text-xs text-neutral-500 mt-1">
                                Composez directement le code GSM ou définissez les dates de renvoi depuis votre Espace Client SFR / RED.
                            </p>
                        </div>
                        <div className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] p-2.5 border border-neutral-200/60 dark:border-white/[0.04]">
                            <p className="font-bold text-neutral-900 dark:text-white">Bouygues Télécom</p>
                            <p className="text-xs text-neutral-500 mt-1">
                                Compatible codes GSM ou activation programmée dans Paramètres &gt; Renvoi d&apos;appel de l&apos;application B&amp;You.
                            </p>
                        </div>
                        <div className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] p-2.5 border border-neutral-200/60 dark:border-white/[0.04]">
                            <p className="font-bold text-neutral-900 dark:text-white">Free / Lignes Fixes Box</p>
                            <p className="text-xs text-neutral-500 mt-1">
                                Activez l&apos;option de renvoi dans l&apos;Espace Abonné Freebox / Free Mobile ou composez le code avant le départ.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
