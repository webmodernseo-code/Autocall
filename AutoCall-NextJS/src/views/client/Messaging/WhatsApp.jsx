'use client';

import { useTranslation } from 'react-i18next';
import { route } from '@/lib/route';
import { useState, useEffect } from 'react';
import { Head, router, useForm } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import {
    MessageCircle,
    Plus,
    Trash2,
    X,
    BadgeCheck,
    ShieldCheck,
    ExternalLink,
    FileText,
    ChevronDown,
    Sliders,
    Sparkles,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const inputCls = 'w-full h-11 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition';

function FacebookSvg({ className = 'h-5 w-5' }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function AccountModal({ providers = [], metaSettings = {}, onClose }) {
    const { t } = useTranslation();
    const [mode, setMode] = useState('one_click'); // 'one_click' | 'manual'
    const [selectedProvider, setSelectedProvider] = useState(providers[0]?.key || 'meta');
    const [isConnectingFb, setIsConnectingFb] = useState(false);
    const [fbError, setFbError] = useState(null);

    const isMeta = selectedProvider === 'meta';
    const canUseEmbedded = Boolean(metaSettings?.embeddedSignupEnabled && metaSettings?.appId && metaSettings?.configId);

    const form = useForm({
        provider: selectedProvider,
        label: '',
        display_number: '',
        phone_number_id: '',
        waba_id: '',
        access_token: '',
        code: '',
        api_key: '',
        base_url: '',
    });

    // Load Meta Facebook JavaScript SDK if embedded signup is active
    useEffect(() => {
        if (!metaSettings?.appId) return;

        window.fbAsyncInit = function () {
            window.FB?.init({
                appId: metaSettings.appId,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v21.0',
            });
        };

        if (!document.getElementById('facebook-jssdk')) {
            const js = document.createElement('script');
            js.id = 'facebook-jssdk';
            js.src = 'https://connect.facebook.net/fr_FR/sdk.js';
            js.async = true;
            js.defer = true;
            document.body.appendChild(js);
        }
    }, [metaSettings?.appId]);

    // Handle Meta Embedded Signup popup
    const launchFacebookSignup = () => {
        setFbError(null);
        if (!canUseEmbedded) {
            setMode('manual');
            return;
        }

        if (typeof window === 'undefined' || !window.FB) {
            setFbError('Le module Facebook n’a pas pu se charger. Veuillez désactiver vos bloqueurs de publicité ou utiliser la saisie manuelle.');
            return;
        }

        setIsConnectingFb(true);

        // Listen for Embedded Signup window event
        const handleMessage = (event) => {
            if (event.origin !== 'https://www.facebook.com' && event.origin !== 'https://web.facebook.com') return;
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'WA_EMBEDDED_SIGNUP') {
                    if (data.data?.phone_number_id) form.setData('phone_number_id', data.data.phone_number_id);
                    if (data.data?.waba_id) form.setData('waba_id', data.data.waba_id);
                }
            } catch {}
        };
        window.addEventListener('message', handleMessage);

        window.FB.login(
            (response) => {
                window.removeEventListener('message', handleMessage);
                setIsConnectingFb(false);

                if (response.authResponse?.code) {
                    // Send auth code to server to exchange and store account
                    form.post(
                        route('client.messaging.whatsapp.accounts.store'),
                        {
                            data: {
                                provider: 'meta',
                                code: response.authResponse.code,
                                phone_number_id: form.data.phone_number_id,
                                waba_id: form.data.waba_id,
                            },
                            preserveScroll: true,
                            onSuccess: onClose,
                        }
                    );
                } else if (response.authResponse?.accessToken) {
                    form.post(
                        route('client.messaging.whatsapp.accounts.store'),
                        {
                            data: {
                                provider: 'meta',
                                access_token: response.authResponse.accessToken,
                                phone_number_id: form.data.phone_number_id,
                                waba_id: form.data.waba_id,
                            },
                            preserveScroll: true,
                            onSuccess: onClose,
                        }
                    );
                } else {
                    setFbError('La connexion Facebook a été annulée ou n’a pas abouti.');
                }
            },
            {
                config_id: metaSettings.configId,
                response_type: 'code',
                override_default_response_type: true,
                extras: {
                    setup: {},
                    sessionInfoVersion: '2',
                },
            }
        );
    };

    const submitManual = (e) => {
        e.preventDefault();
        form.setData('provider', selectedProvider);
        form.post(route('client.messaging.whatsapp.accounts.store'), {
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150" onClick={onClose}>
            <div
                className="w-full max-w-lg space-y-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0E1015] p-6 shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-100 dark:border-white/5 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <MessageCircle className="h-4.5 w-4.5" />
                            </span>
                            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                                {t('client.whatsapp.connect_whatsapp', 'Connecter une ligne WhatsApp')}
                            </h3>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Reliez votre numéro professionnel pour envoyer des confirmations et relances post-appel.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('client.whatsapp.close', 'Fermer')}
                        className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/5 dark:hover:text-white transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* MODE 1 : Connexion 1-Clic Recommandée (Embedded Signup) */}
                {mode === 'one_click' ? (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 dark:border-blue-500/20 dark:bg-blue-500/10 p-5 text-center space-y-3">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
                                <FacebookSvg className="h-6 w-6" />
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 mb-1.5">
                                    <Sparkles className="h-3 w-3" />
                                    <span>Connexion en 1 clic (Sans configuration technique)</span>
                                </div>
                                <h4 className="font-bold text-neutral-900 dark:text-white text-base">
                                    Continuer avec Facebook pour WhatsApp
                                </h4>
                                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto leading-relaxed">
                                    Connectez-vous avec votre compte Facebook pour choisir directement votre numéro WhatsApp dans la fenêtre officielle de Meta. Aucun identifiant technique à copier.
                                </p>
                            </div>

                            {fbError && (
                                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{fbError}</p>
                            )}

                            {canUseEmbedded ? (
                                <button
                                    type="button"
                                    onClick={launchFacebookSignup}
                                    disabled={isConnectingFb}
                                    className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] px-4 py-3 text-sm font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50"
                                >
                                    {isConnectingFb ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Connexion à Meta en cours…</span>
                                        </>
                                    ) : (
                                        <>
                                            <FacebookSvg className="h-4.5 w-4.5" />
                                            <span>Se connecter avec Facebook</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300">
                                    <p className="font-semibold">La connexion 1-clic n’est pas encore finalisée par l’administrateur.</p>
                                    <p className="mt-0.5 text-[11px] opacity-90">
                                        Renseignez le <strong>Meta Config ID</strong> dans l’onglet <em>Administration &gt; Messagerie</em> pour l’activer, ou utilisez la configuration manuelle ci-dessous.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Switch to manual */}
                        <div className="pt-2 text-center">
                            <button
                                type="button"
                                onClick={() => setMode('manual')}
                                className="text-xs font-semibold text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 underline decoration-neutral-300 dark:decoration-neutral-600 transition cursor-pointer"
                            >
                                Vous préférez renseigner vos clés API manuellement ? (Mode Développeur)
                            </button>
                        </div>
                    </div>
                ) : (
                    /* MODE 2 : Saisie Manuelle Avancée */
                    <form onSubmit={submitManual} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                                Saisie manuelle des identifiants
                            </span>
                            <button
                                type="button"
                                onClick={() => setMode('one_click')}
                                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                            >
                                ← Revenir à la connexion 1-clic
                            </button>
                        </div>

                        {/* Switcher Provider si plusieurs */}
                        {providers.length > 1 && (
                            <div className="flex rounded-xl bg-neutral-100 dark:bg-white/[0.05] p-1 text-xs font-semibold">
                                {providers.map((p) => (
                                    <button
                                        key={p.key}
                                        type="button"
                                        onClick={() => {
                                            setSelectedProvider(p.key);
                                            form.setData('provider', p.key);
                                        }}
                                        className={cn(
                                            'flex-1 py-1.5 rounded-lg transition-all',
                                            selectedProvider === p.key
                                                ? 'bg-white dark:bg-white/10 text-neutral-900 dark:text-white font-bold shadow-2xs'
                                                : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                                        )}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isMeta && (
                            <div className="rounded-xl border border-blue-200/70 bg-blue-50/60 dark:border-blue-500/20 dark:bg-blue-500/10 p-3 text-xs text-blue-900 dark:text-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Où trouver ces 3 clés ?</span>
                                    <a
                                        href="https://developers.facebook.com/apps"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Meta for Developers <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                                <p className="mt-1 text-[11px] text-blue-800/80 dark:text-blue-300/80">
                                    Dans votre console Meta for Developers ➔ votre app ➔ <strong>WhatsApp ➔ Configuration de l’API</strong>.
                                </p>
                            </div>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                    {t('client.whatsapp.label', 'Nom de la ligne')}
                                </label>
                                <input
                                    className={inputCls}
                                    placeholder="ex. : Support Commercial"
                                    value={form.data.label}
                                    onChange={(e) => form.setData('label', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                    {t('client.whatsapp.display_number', 'Numéro de téléphone')}
                                </label>
                                <input
                                    className={inputCls}
                                    placeholder="+33 6 12 34 56 78"
                                    value={form.data.display_number}
                                    onChange={(e) => form.setData('display_number', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {isMeta ? (
                            <>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        ID du numéro de téléphone (Phone number ID)
                                    </label>
                                    <input
                                        className={inputCls}
                                        placeholder="ex. : 108392019482910"
                                        value={form.data.phone_number_id}
                                        onChange={(e) => form.setData('phone_number_id', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                            ID de compte WhatsApp (WABA ID)
                                        </label>
                                        <input
                                            className={inputCls}
                                            placeholder="ex. : 193840291048291"
                                            value={form.data.waba_id}
                                            onChange={(e) => form.setData('waba_id', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                            Jeton d’accès (Access token)
                                        </label>
                                        <input
                                            type="password"
                                            className={inputCls}
                                            placeholder="EAAG..."
                                            value={form.data.access_token}
                                            onChange={(e) => form.setData('access_token', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        URL de base WhatsWay
                                    </label>
                                    <input
                                        className={inputCls}
                                        placeholder="https://api.whatsway.net"
                                        value={form.data.base_url}
                                        onChange={(e) => form.setData('base_url', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        Clé API WhatsWay
                                    </label>
                                    <input
                                        type="password"
                                        className={inputCls}
                                        placeholder="Clé secrète API"
                                        value={form.data.api_key}
                                        onChange={(e) => form.setData('api_key', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-white/5">
                            <button
                                type="button"
                                onClick={() => setMode('one_click')}
                                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-500 disabled:opacity-50 transition"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Connecter manuellement</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* Micro-réassurance discrète */}
                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Chiffrement SSL 256-bit certifié WhatsApp Cloud API & PCI-DSS.</span>
                </div>
            </div>
        </div>
    );
}

function TemplateModal({ accounts = [], onClose }) {
    const { t } = useTranslation();
    const form = useForm({
        whatsapp_account_id: accounts[0]?.id || '',
        name: '',
        language: 'fr_FR',
        category: 'UTILITY',
        body: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('client.messaging.whatsapp.templates.store'), {
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150" onClick={onClose}>
            <div
                className="w-full max-w-md space-y-4 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0E1015] p-6 shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <FileText className="h-4 w-4" />
                        </span>
                        <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">
                            {t('client.whatsapp.new_template', 'Nouveau modèle WhatsApp')}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('client.whatsapp.close', 'Fermer')}
                        className="rounded-xl p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            {t('client.whatsapp.template_name', 'Nom du modèle (minuscules & underscores)')}
                        </label>
                        <input
                            className={inputCls}
                            placeholder="ex. : confirmation_appel_client"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                {t('client.whatsapp.language', 'Langue')}
                            </label>
                            <input
                                className={inputCls}
                                placeholder="fr_FR"
                                value={form.data.language}
                                onChange={(e) => form.setData('language', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Catégorie
                            </label>
                            <select
                                className={inputCls}
                                value={form.data.category}
                                onChange={(e) => form.setData('category', e.target.value)}
                            >
                                <option value="UTILITY">Utilitaire (Confirmations)</option>
                                <option value="MARKETING">Marketing (Offres)</option>
                                <option value="AUTHENTICATION">Authentification (OTP)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            <span>Corps du message</span>
                            <span className="text-[10px] text-neutral-400">Paramètres dynamiques : {'{{1}}'}, {'{{2}}'}</span>
                        </label>
                        <textarea
                            rows="4"
                            className="w-full rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-white/[0.04] p-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                            placeholder="Bonjour {{1}}, merci pour notre échange téléphonique. Voici votre récapitulatif : {{2}}"
                            value={form.data.body}
                            onChange={(e) => form.setData('body', e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 border-t border-neutral-100 dark:border-white/5 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
                        >
                            {t('client.whatsapp.cancel', 'Annuler')}
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition"
                        >
                            {t('client.whatsapp.save', 'Enregistrer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function WhatsApp({ accounts = [], templates = [], enabledProviders = [], metaSettings = {} }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState(null);

    const removeAccount = (a) => {
        if (confirm(t('client.whatsapp.remove_account_confirm', 'Êtes-vous sûr de vouloir supprimer cette ligne WhatsApp ?'))) {
            router.delete(route('client.messaging.whatsapp.accounts.destroy', a.id), { preserveScroll: true });
        }
    };

    const removeTemplate = (template) => {
        if (confirm(t('client.whatsapp.delete_template_confirm', 'Êtes-vous sûr de vouloir supprimer ce modèle ?'))) {
            router.delete(route('client.messaging.whatsapp.templates.destroy', template.id), { preserveScroll: true });
        }
    };

    return (
        <ClientLayout title="WhatsApp">
            <Head title={`WhatsApp · ${t('head.app', 'AutoCall')}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <MessageCircle className="h-5 w-5" />
                            </span>
                            <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                WhatsApp
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {t('client.whatsapp.description', 'Connectez vos lignes WhatsApp et gérez vos modèles de messages certifiés.')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setModal('template')}
                            disabled={accounts.length === 0}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/[0.08] dark:hover:text-white disabled:opacity-40 transition"
                        >
                            <Plus className="h-4 w-4" />
                            <span>{t('client.whatsapp.template', 'Nouveau modèle')}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setModal('account')}
                            disabled={enabledProviders.length === 0}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 disabled:opacity-40 transition cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            <span>{t('client.whatsapp.connect_account', 'Connecter un numéro')}</span>
                        </button>
                    </div>
                </div>

                {/* Platform alert if no provider enabled */}
                {enabledProviders.length === 0 && (
                    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
                        {t('client.whatsapp.disabled', 'WhatsApp est désactivé sur toute la plateforme. Demandez à votre administrateur d’activer un fournisseur.')}
                    </div>
                )}

                {/* Accounts Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            {t('client.whatsapp.accounts', 'Lignes et comptes connectés')}
                        </h2>
                        <span className="text-xs text-neutral-400">
                            {accounts.length} {accounts.length > 1 ? 'lignes' : 'ligne'}
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {accounts.map((a) => (
                            <div
                                key={a.id}
                                className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0E1015] p-4 shadow-2xs transition hover:border-neutral-300 dark:hover:border-white/20"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                <MessageCircle className="h-3.5 w-3.5" />
                                            </span>
                                            <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                                                {a.label || a.display_number || a.provider}
                                            </p>
                                            {a.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                                        </div>
                                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            {a.display_number && <span className="font-mono">{a.display_number} · </span>}
                                            <span className="capitalize">{a.provider}</span>
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                                                {a.status || 'Actif'}
                                            </span>
                                            {a.quality_rating && (
                                                <span className="text-[10px] text-neutral-400">
                                                    Qualité : {a.quality_rating}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAccount(a)}
                                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition"
                                        title="Déconnecter cette ligne"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {accounts.length === 0 && (
                            <div className="col-span-full rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] p-8 text-center">
                                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-400 mb-2">
                                    <MessageCircle className="h-5 w-5" />
                                </span>
                                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {t('client.whatsapp.no_accounts', 'Aucun compte connecté pour le moment.')}
                                </p>
                                <p className="mt-1 text-xs text-neutral-400">
                                    Cliquez sur « Connecter un numéro » pour ajouter votre première ligne.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Templates Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            {t('client.whatsapp.templates', 'Modèles de messages (Templates)')}
                        </h2>
                        <span className="text-xs text-neutral-400">
                            {templates.length} {templates.length > 1 ? 'modèles' : 'modèle'}
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0E1015] shadow-2xs">
                        {templates.length > 0 ? (
                            <table className="min-w-full divide-y divide-neutral-100 dark:divide-white/5 text-xs sm:text-sm">
                                <thead className="bg-neutral-50/70 dark:bg-white/[0.02] text-[11px] font-bold uppercase text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Nom du modèle</th>
                                        <th className="px-4 py-3 text-left">Langue & Catégorie</th>
                                        <th className="px-4 py-3 text-left">Statut</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                    {templates.map((t) => (
                                        <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition">
                                            <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                                                {t.name}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                                                {t.language} · <span className="font-mono text-xs">{t.category}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                                                    {t.status || 'Approuvé'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeTemplate(t)}
                                                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition"
                                                    title="Supprimer ce modèle"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center">
                                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-400 mb-2">
                                    <FileText className="h-5 w-5" />
                                </span>
                                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {t('client.whatsapp.no_templates', 'Aucun modèle de message pour le moment.')}
                                </p>
                                <p className="mt-1 text-xs text-neutral-400">
                                    Les modèles permettent à l’IA d’envoyer des messages proactifs certifiés après un appel.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {modal === 'account' && (
                <AccountModal
                    providers={enabledProviders}
                    metaSettings={metaSettings}
                    onClose={() => setModal(null)}
                />
            )}
            {modal === 'template' && (
                <TemplateModal
                    accounts={accounts}
                    onClose={() => setModal(null)}
                />
            )}
        </ClientLayout>
    );
}
