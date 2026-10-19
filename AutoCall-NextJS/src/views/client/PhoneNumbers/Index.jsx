'use client';


import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import { useState } from 'react';
import { Head, router } from '@/lib/page-router';
import axios from 'axios';
import ClientLayout from '@/layouts/ClientLayout';
import { useTranslation, Trans } from 'react-i18next';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import KycGate from '@/components/KycGate';
import { PageHeader, EmptyState } from '@/components/ui';
import { Phone, Plus, Trash2, Search, X, PhoneCall, AlertCircle } from 'lucide-react';
import CallForwardingGuide from '@/components/CallForwardingGuide';

const inputCls = 'w-full rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3.5 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none shadow-2xs';

function BuyModal({ twilioConfigured, cost, onClose }) {
    const [tab, setTab] = useState(twilioConfigured ? 'search' : 'manual');
    const [q, setQ] = useState({ country: 'FR', area_code: '', type: 'local' });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [manual, setManual] = useState({ phone: '', friendly_name: '', type: 'local', country: 'FR' });

    const search = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(route('client.phone-numbers.search'), q);
            setResults(data.numbers || []);
            if (data.error) alert(data.error);
        } finally { setLoading(false); }
    };
    const buy = (payload) => router.post(route('client.phone-numbers.buy'), payload, { preserveScroll: true, onSuccess: onClose });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131622] p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                    <div>
                        <h3 className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white">
                            Obtenir un numéro de téléphone
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-[#8E95A5] mt-0.5">
                            Coût d&apos;abonnement : <span className="font-mono font-semibold text-neutral-900 dark:text-white">{cost}</span> crédits / mois.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setTab('search')}
                        disabled={!twilioConfigured}
                        className={`flex-1 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                            tab === 'search'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'border border-slate-200/90 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] disabled:opacity-40'
                        }`}
                    >
                        Rechercher un numéro
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('manual')}
                        className={`flex-1 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                            tab === 'manual'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'border border-slate-200/90 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04]'
                        }`}
                    >
                        Utiliser mon propre numéro
                    </button>
                </div>

                {tab === 'search' ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input className={inputCls} placeholder="Pays (FR)" maxLength={2} value={q.country} onChange={(e) => setQ({ ...q, country: e.target.value.toUpperCase() })} />
                            <input className={inputCls} placeholder="Indicatif" value={q.area_code} onChange={(e) => setQ({ ...q, area_code: e.target.value })} />
                            <select className={inputCls} value={q.type} onChange={(e) => setQ({ ...q, type: e.target.value })}>
                                <option value="local">Local</option>
                                <option value="toll_free">Numéro vert</option>
                                <option value="mobile">Mobile</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={search}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold shadow-xs disabled:opacity-50 transition cursor-pointer"
                        >
                            <Search className="h-4 w-4" />
                            <span>{loading ? 'Recherche en cours…' : 'Rechercher les numéros disponibles'}</span>
                        </button>
                        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                            {results.map((n) => (
                                <div key={n.e164} className="flex items-center justify-between rounded-xl border border-slate-200/90 dark:border-white/10 px-3.5 py-2.5 bg-neutral-50/50 dark:bg-white/[0.02]">
                                    <div>
                                        <p className="font-mono text-xs font-semibold text-neutral-900 dark:text-white">{n.e164}</p>
                                        <p className="text-xs text-slate-500 dark:text-[#8E95A5]">{[n.locality, n.region].filter(Boolean).join(', ')}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => buy({ phone: n.e164, type: q.type, country: n.country })}
                                        className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition"
                                    >
                                        Activer
                                    </button>
                                </div>
                            ))}
                            {results.length === 0 && !loading && (
                                <p className="py-4 text-center text-xs text-slate-500 dark:text-[#8E95A5]">
                                    Lancez une recherche pour voir les numéros disponibles à l&apos;activation.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-3 text-xs text-slate-600 dark:text-blue-300 leading-relaxed">
                            Configurez un numéro dont vous disposez déjà pour le renvoi d&apos;appel vers vos agents IA vocaux.
                        </div>
                        <input className={inputCls} placeholder="Numéro complet (ex: +33189000000)" value={manual.phone} onChange={(e) => setManual({ ...manual, phone: e.target.value })} />
                        <input className={inputCls} placeholder="Nom du numéro (ex: Standard Siège Paris)" value={manual.friendly_name} onChange={(e) => setManual({ ...manual, friendly_name: e.target.value })} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <select className={inputCls} value={manual.type} onChange={(e) => setManual({ ...manual, type: e.target.value })}>
                                <option value="local">Local</option>
                                <option value="toll_free">Numéro vert</option>
                                <option value="mobile">Mobile</option>
                            </select>
                            <input className={inputCls} placeholder="Pays (FR)" maxLength={2} value={manual.country} onChange={(e) => setManual({ ...manual, country: e.target.value.toUpperCase() })} />
                        </div>
                        <button
                            type="button"
                            onClick={() => buy({ ...manual, owned: true })}
                            disabled={!manual.phone}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-xs font-semibold shadow-xs disabled:opacity-50 transition cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Enregistrer ce numéro</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PhoneNumbersIndex({ numbers = [], stats = [], twilioConfigured, numberCostCredits = 50, creditBalance = 0, limit = {} }) {
    const [buying, setBuying] = useState(false);
    const atLimit = limit.limit !== null && limit.usage >= limit.limit;
    const release = (n) => {
        if (confirm(`Voulez-vous vraiment libérer la ligne ${n.e164_number} ? Cette action est immédiate.`)) {
            router.delete(route('client.phone-numbers.release', n.id), { preserveScroll: true });
        }
    };

    const firstPhoneNumber = numbers[0]?.e164_number || '';

    return (
        <ClientLayout title="Numéros de téléphone">
            <Head title="Numéros de téléphone · AutoCall" />
            <div className="space-y-6">
                <PageHeader
                    title="Numéros de téléphone"
                    description={`${limit.usage ?? 0}${limit.limit ? ` / ${limit.limit}` : ''} ligne(s) active(s) · Solde disponible : ${creditBalance.toLocaleString()} crédits.`}
                    primaryAction={{
                        label: 'Obtenir un numéro',
                        onClick: () => setBuying(true),
                        icon: Plus,
                        disabled: atLimit,
                    }}
                />

                {/* Guide de renvoi d'appel (Option 2 - Conserver son numéro habituel) */}
                <CallForwardingGuide targetNumber={firstPhoneNumber} />

                <PageOverview feature="phone-numbers" />
                <KycGate action="buy phone numbers" />
                <StatCards items={stats} />

                {!twilioConfigured && (
                    <div className="flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300">
                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>La passerelle de téléphonie automatique n&apos;est pas encore connectée. Vous pouvez néanmoins renseigner vos numéros en mode renvoi manuel.</span>
                    </div>
                )}

                {numbers.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {numbers.map((n) => (
                            <div key={n.id} className="flex flex-col justify-between rounded-[20px] border border-slate-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] p-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)] hover:border-neutral-300 dark:hover:border-white/20 transition-all">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <PhoneCall className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-hero-sans font-bold text-sm font-mono text-neutral-900 dark:text-white truncate">
                                                {n.e164_number}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-[#8E95A5] capitalize mt-0.5">
                                                {n.type?.replace('_', ' ')}{n.country ? ` · ${n.country}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => release(n)}
                                        title="Libérer cette ligne"
                                        className="rounded-lg p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-[#8E95A5]">
                                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                        {n.monthly_cost_credits} crédits / mois
                                    </span>
                                    <span className="rounded-md border border-slate-200/80 dark:border-white/10 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                                        {n.twilio_sid ? 'Téléphonie directe' : 'Renvoi manuel'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        variant="default"
                        icon={Phone}
                        title="Aucun numéro attribué pour le moment"
                        description="Activez un numéro dédié AutoCall ou configurez le renvoi d'appel depuis votre ligne actuelle pour connecter vos agents vocaux."
                        primaryAction={{
                            label: 'Obtenir un numéro',
                            onClick: () => setBuying(true),
                            icon: Plus,
                        }}
                        tips={[
                            'Possibilité de conserver votre numéro habituel via un simple code de transfert',
                            'Numéros français locaux (+33 1, +33 4, etc.) et nationaux disponibles',
                            'Décrochage instantané sans temps d\'attente pour vos clients'
                        ]}
                    />
                )}
            </div>

            {buying && <BuyModal twilioConfigured={twilioConfigured} cost={numberCostCredits} onClose={() => setBuying(false)} />}
        </ClientLayout>
    );
}
