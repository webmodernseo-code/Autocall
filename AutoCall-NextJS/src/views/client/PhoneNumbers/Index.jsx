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
import { Phone, Plus, Trash2, Search, X, PhoneCall } from 'lucide-react';
import CallForwardingGuide from '@/components/CallForwardingGuide';

const inputCls = 'w-full rounded-soft border border-neutral-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div className="w-full max-w-lg rounded-soft-lg bg-white dark:bg-ink-900 p-5 shadow-soft-xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-white">Obtenir un numéro de téléphone</h3>
                    <button onClick={onClose}><X className="h-4 w-4 text-neutral-400" /></button>
                </div>
                <div className="mb-4 flex gap-1.5">
                    <button onClick={() => setTab('search')} disabled={!twilioConfigured} className={`flex-1 rounded-soft px-3 py-1.5 text-sm ${tab === 'search' ? 'bg-brand-600 text-white font-medium' : 'border border-neutral-200 dark:border-ink-700 text-neutral-600 dark:text-neutral-300 disabled:opacity-40'}`}>Rechercher un numéro</button>
                    <button onClick={() => setTab('manual')} className={`flex-1 rounded-soft px-3 py-1.5 text-sm ${tab === 'manual' ? 'bg-brand-600 text-white font-medium' : 'border border-neutral-200 dark:border-ink-700 text-neutral-600 dark:text-neutral-300'}`}>Utiliser mon numéro</button>
                </div>
                <p className="mb-3 text-xs text-neutral-500">Coût par numéro : <span className="font-mono font-semibold">{cost}</span> crédits / mois.</p>

                {tab === 'search' ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                            <input className={inputCls} placeholder="Pays (FR)" maxLength={2} value={q.country} onChange={(e) => setQ({ ...q, country: e.target.value.toUpperCase() })} />
                            <input className={inputCls} placeholder="Indicatif" value={q.area_code} onChange={(e) => setQ({ ...q, area_code: e.target.value })} />
                            <select className={inputCls} value={q.type} onChange={(e) => setQ({ ...q, type: e.target.value })}><option value="local">Local</option><option value="toll_free">Numéro vert</option><option value="mobile">Mobile</option></select>
                        </div>
                        <button onClick={search} disabled={loading} className="inline-flex items-center gap-2 rounded-soft bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-50"><Search className="h-4 w-4" /> {loading ? 'Recherche en cours…' : 'Rechercher'}</button>
                        <div className="max-h-60 space-y-1.5 overflow-auto">
                            {results.map((n) => (
                                <div key={n.e164} className="flex items-center justify-between rounded-soft border border-neutral-200 dark:border-ink-700 px-3 py-2">
                                    <div><p className="font-mono text-sm text-neutral-900 dark:text-white">{n.e164}</p><p className="text-xs text-neutral-500">{[n.locality, n.region].filter(Boolean).join(', ')}</p></div>
                                    <button onClick={() => buy({ phone: n.e164, type: q.type, country: n.country })} className="rounded-soft bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-500">Activer</button>
                                </div>
                            ))}
                            {results.length === 0 && !loading && <p className="py-4 text-center text-xs text-neutral-400">Aucun numéro disponible pour ces critères.</p>}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="rounded-soft bg-neutral-50 dark:bg-ink-800 px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
                            Configurez un numéro dont vous disposez déjà pour le renvoi d&apos;appel vers vos scénarios vocaux.
                        </p>
                        <input className={inputCls} placeholder="Numéro (+33189000000)" value={manual.phone} onChange={(e) => setManual({ ...manual, phone: e.target.value })} />
                        <input className={inputCls} placeholder="Nom du numéro (ex: Standard Paris)" value={manual.friendly_name} onChange={(e) => setManual({ ...manual, friendly_name: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                            <select className={inputCls} value={manual.type} onChange={(e) => setManual({ ...manual, type: e.target.value })}><option value="local">Local</option><option value="toll_free">Numéro vert</option><option value="mobile">Mobile</option></select>
                            <input className={inputCls} placeholder="Pays (FR)" maxLength={2} value={manual.country} onChange={(e) => setManual({ ...manual, country: e.target.value.toUpperCase() })} />
                        </div>
                        <button onClick={() => buy({ ...manual, owned: true })} disabled={!manual.phone} className="inline-flex w-full items-center justify-center gap-2 rounded-soft bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-50"><Plus className="h-4 w-4" /> Enregistrer ce numéro</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PhoneNumbersIndex({ numbers = [], stats = [], twilioConfigured, numberCostCredits = 50, creditBalance = 0, limit = {} }) {
    const { t } = useTranslation();
    const [buying, setBuying] = useState(false);
    const atLimit = limit.limit !== null && limit.usage >= limit.limit;
    const release = (n) => { if (confirm(`Libérer le numéro ${n.e164_number} ?`)) router.delete(route('client.phone-numbers.release', n.id), { preserveScroll: true }); };

    const firstPhoneNumber = numbers[0]?.e164_number || '';

    return (
        <ClientLayout title={t('nav.phone_numbers') !== 'nav.phone_numbers' ? t('nav.phone_numbers') : 'Numéros de téléphone'}>
            <Head title="Numéros de téléphone · AutoCall" />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Numéros de téléphone</h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{limit.usage ?? 0}{limit.limit ? ` / ${limit.limit}` : ''} ligne(s) active(s) · <span className="font-mono">{creditBalance.toLocaleString()}</span> crédits</p>
                    </div>
                    <button onClick={() => setBuying(true)} disabled={atLimit} title={atLimit ? 'Limite du forfait atteinte' : ''} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 shadow-xs transition cursor-pointer disabled:opacity-50"><Plus className="h-4 w-4" /> Obtenir un numéro</button>
                </div>

                {/* Guide de renvoi d'appel (Option 2 - Conserver son numéro habituel) */}
                <CallForwardingGuide targetNumber={firstPhoneNumber} />

                <PageOverview feature="phone-numbers" />

                <KycGate action="buy phone numbers" />

                <StatCards items={stats} />

                {!twilioConfigured && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                        La passerelle de téléphonie Twilio n&apos;est pas encore active sur la plateforme. Vous pouvez néanmoins renseigner un numéro manuel.
                    </div>
                )}

                {numbers.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {numbers.map((n) => (
                            <div key={n.id} className="rounded-xl border border-neutral-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-2xs">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"><PhoneCall className="h-4 w-4" /></span>
                                        <div><p className="font-mono font-semibold text-neutral-900 dark:text-white">{n.e164_number}</p><p className="text-xs capitalize text-neutral-500">{n.type?.replace('_', ' ')}{n.country ? ` · ${n.country}` : ''}</p></div>
                                    </div>
                                    <button onClick={() => release(n)} title="Supprimer la ligne" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg p-1.5 transition cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                                </div>
                                <p className="mt-3 text-xs text-neutral-400">{n.monthly_cost_credits} crédits / mois{n.twilio_sid ? ' · Twilio' : ' · Manuel'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-neutral-300 dark:border-ink-700 px-6 py-12 text-center">
                        <Phone className="mx-auto mb-3 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Aucun numéro attribué pour le moment</p>
                        <p className="text-xs text-neutral-400 mt-1">Obtenez un numéro AutoCall pour l&apos;utiliser comme passerelle de renvoi d&apos;appel.</p>
                    </div>
                )}
            </div>

            {buying && <BuyModal twilioConfigured={twilioConfigured} cost={numberCostCredits} onClose={() => setBuying(false)} />}
        </ClientLayout>
    );
}
