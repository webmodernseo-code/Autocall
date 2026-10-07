'use client';

import React, { useState } from 'react';
import { route } from '@/lib/route';
import { Link } from '@/lib/page-router';
import { Eye, EyeOff, Bot, Check, ArrowLeft, ShieldCheck, Copy, Zap, Lock } from 'lucide-react';
import BrandMark, { BrandName } from '@/components/BrandMark';
import FlashToast from '@/components/FlashToast';

const STYLE = `
@keyframes authwave {
    0%, 100% { transform: scaleY(0.25); }
    50% { transform: scaleY(1); }
}
.authbar {
    width: 3px;
    border-radius: 9px;
    transform-origin: bottom;
    background: linear-gradient(to top, rgba(255,255,255,0.2), #10B981);
    animation: authwave 1s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
    .authbar { animation: none !important; }
}
`;

export function GoogleIcon({ className = "h-4.5 w-4.5" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
        </svg>
    );
}

export function GoogleButton({ onClick, loading, label = 'Continuer avec Google' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="inline-flex w-full h-11 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
            <GoogleIcon className="h-4 w-4" />
            <span>{loading ? 'Connexion en cours…' : label}</span>
        </button>
    );
}

export function OrDivider({ label = "ou avec votre adresse e-mail" }) {
    return (
        <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] text-white/40">{label}</span>
            <span className="h-px flex-1 bg-white/10" />
        </div>
    );
}

export function AuthField({ id, label, type = 'text', secret = false, value, onChange, error, placeholder, ...rest }) {
    const [show, setShow] = useState(false);
    const inputType = secret ? (show ? 'text' : 'password') : type;

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-xs font-medium text-white/80">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full h-11 rounded-xl border bg-white/[0.03] px-3.5 text-xs text-white placeholder:text-white/30 transition-all outline-none focus:bg-white/[0.06] focus:ring-2 focus:ring-white/20 ${
                        error ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-white/30'
                    } ${secret ? 'pr-10' : ''}`}
                    {...rest}
                />
                {secret && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        tabIndex={-1}
                        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
            {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
        </div>
    );
}

export function SubmitButton({ processing, children, loadingText = 'Chargement…' }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="inline-flex w-full h-11 items-center justify-center rounded-xl bg-white px-5 text-xs font-semibold text-black transition-all hover:bg-neutral-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-white/5 cursor-pointer"
        >
            {processing ? loadingText : children}
        </button>
    );
}

export function CopyRow({ label, value }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    };

    return (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs">
            <div className="flex items-center gap-2">
                <span className="text-white/40">{label} :</span>
                <span className="font-mono text-white/90">{value}</span>
            </div>
            <button
                type="button"
                onClick={copy}
                aria-label={`Copier ${label}`}
                className="rounded p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
        </div>
    );
}

export function DemoLoginCard({ cred, onOneClick, loading, hint = "Tester avec le compte de démonstration" }) {
    if (!cred) return null;

    return (
        <div className="mb-5 rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-500/[0.04] p-4">
            <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Mode Démo Actif
                </span>
                <span className="text-[11px] text-white/50">{hint}</span>
            </div>

            <div className="space-y-1.5">
                <CopyRow label="E-mail" value={cred.email} />
                <CopyRow label="Mot de passe" value={cred.password} />
            </div>

            <button
                type="button"
                onClick={onOneClick}
                disabled={loading}
                className="mt-3 inline-flex w-full h-9 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 text-xs font-semibold text-black transition-all hover:bg-emerald-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
                <Zap className="h-3.5 w-3.5" />
                <span>{loading ? 'Connexion en cours…' : 'Connexion en 1 clic'}</span>
            </button>
        </div>
    );
}

function ConsolePanel() {
    return (
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-[#0A0C11] p-10 border-l border-white/10">
            {/* Halos d'ambiance */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-[100px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-sky-500/15 blur-[100px]" aria-hidden="true" />

            <div className="relative z-10">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Standard Téléphonique IA
                </span>

                <h2 className="mt-4 text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
                    Ne perdez plus aucun appel.{' '}
                    <span className="font-hero-serif italic text-white/95">
                        Transformez chaque sonnerie en client.
                    </span>
                </h2>

                <p className="mt-3 text-xs lg:text-sm text-white/60 leading-relaxed">
                    Pilotez vos agents vocaux, consultez les enregistrements audio et recevez vos rendez-vous directement dans votre calendrier.
                </p>
            </div>

            {/* Widget appel en direct simulé */}
            <div className="relative z-10 my-8 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                            <Bot className="h-4 w-4" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold text-white">Assistant Vocal CallMind</p>
                            <p className="text-[11px] text-white/40 font-mono">FR-FR · Prise d&apos;appel en direct</p>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> 00:42
                    </span>
                </div>

                {/* Égaliseur audio */}
                <div className="mt-3.5 flex items-end justify-between gap-[2px] h-8" aria-hidden="true">
                    {Array.from({ length: 32 }).map((_, i) => (
                        <span
                            key={i}
                            className="authbar"
                            style={{
                                height: `${Math.max(20, (Math.sin(i * 0.4) * 0.5 + 0.5) * 100)}%`,
                                animationDelay: `${(i % 10) * 80}ms`,
                                animationDuration: `${750 + (i % 4) * 150}ms`,
                                opacity: 0.4 + (i % 6) / 10
                            }}
                        />
                    ))}
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-white/50">Action automatique :</span>
                    <span className="text-emerald-400 font-medium">Rendez-vous synchronisé dans l&apos;agenda</span>
                </div>
            </div>

            {/* 3 Garanties */}
            <ul className="relative z-10 space-y-2 text-xs text-white/70">
                <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Décroché instantané en 1 sonnerie 24h/24 et 7j/7</span>
                </li>
                <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Synchronisation directe Google Calendar, Outlook & Doctolib</span>
                </li>
                <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Données hébergées en Europe & conformes RGPD</span>
                </li>
            </ul>
        </div>
    );
}

export default function AuthShell({ brand = 'CallMind AI', logoUrl, eyebrow, title, subtitle, footer, children }) {
    return (
        <div className="relative min-h-screen bg-[#08090C] text-white flex items-center justify-center p-4 sm:p-6 overflow-x-hidden selection:bg-white selection:text-black">
            <style>{STYLE}</style>
            <FlashToast />

            {/* Halos lumineux en fond */}
            <div className="pointer-events-none absolute -left-40 top-1/4 h-[650px] w-[650px] rounded-full blur-[160px] opacity-40 bg-sky-600/20" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-40 top-1/3 h-[650px] w-[650px] rounded-full blur-[160px] opacity-35 bg-amber-600/15" aria-hidden="true" />

            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0E1015]/90 shadow-2xl backdrop-blur-2xl grid md:grid-cols-2">
                {/* Colonne formulaire */}
                <div className="flex flex-col justify-between p-7 sm:p-10">
                    <div>
                        {/* Logo header */}
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:opacity-85 transition-opacity">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black font-bold text-xs">
                                    C
                                </span>
                                <span>{brand}</span>
                            </Link>

                            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Retour au site</span>
                            </Link>
                        </div>

                        {eyebrow && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                {eyebrow}
                            </span>
                        )}

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                            {title}
                        </h1>

                        {subtitle && (
                            <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed">
                                {subtitle}
                            </p>
                        )}

                        <div className="mt-6">
                            {children}
                        </div>
                    </div>

                    {/* Footer de formulaire & Micro-réassurance */}
                    <div className="mt-8 pt-5 border-t border-white/10 space-y-3">
                        {footer && (
                            <div className="text-center text-xs text-white/60">
                                {footer}
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/40">
                            <Lock className="h-3 w-3 text-emerald-400" />
                            <span>Connexion sécurisée SSL 256-bit certifiée</span>
                        </div>
                    </div>
                </div>

                {/* Colonne visuelle console droite */}
                <ConsolePanel />
            </div>
        </div>
    );
}
