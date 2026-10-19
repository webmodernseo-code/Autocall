'use client';

import translationI18n from '@/i18n';
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Eye,
    EyeOff,
    Check,
    ArrowLeft,
    Copy,
    Zap,
    Lock
} from 'lucide-react';
import FlashToast from '@/components/FlashToast';
import BrandMark from '@/components/BrandMark';
import ThemeToggle from '@/components/ThemeToggle';

export function GoogleIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="shrink-0"
        >
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
                fill="#EB4335"
            />
        </svg>
    );
}

export function AppleIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="shrink-0"
        >
            <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
        </svg>
    );
}

export function GoogleButton({ onClick, loading, label = 'Continuer avec Google' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="flex h-11 w-full min-w-0 items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:bg-white/[0.08] px-4 text-xs font-medium transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs"
        >
            <GoogleIcon />
            <span className="whitespace-nowrap">{loading ? 'Connexion…' : label}</span>
        </button>
    );
}

export function AppleButton({ onClick, label = 'Continuer avec Apple' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-11 w-full min-w-0 items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:bg-white/[0.08] px-4 text-xs font-medium transition-all active:scale-[0.99] cursor-pointer shadow-xs"
        >
            <AppleIcon />
            <span className="whitespace-nowrap">{label}</span>
        </button>
    );
}

export function OrDivider({ label = "ou avec votre adresse e-mail" }) {
    return (
        <div className="my-5 flex items-center gap-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">{label}</span>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
        </div>
    );
}

export function AuthField({
    id,
    label,
    type = 'text',
    secret = false,
    value,
    onChange,
    error,
    placeholder,
    helperText,
    icon: IconComponent,
    ...rest
}) {
    const [show, setShow] = useState(false);
    const inputType = secret ? (show ? 'text' : 'password') : type;

    return (
        <div className="space-y-1.5 text-left w-full group">
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-focus-within:text-neutral-950 dark:group-focus-within:text-white transition-colors">
                    {label}
                </label>
                {helperText && (
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{helperText}</span>
                )}
            </div>
            <div
                className={`relative flex h-11 items-center rounded-xl border px-3.5 transition-all duration-200 ${
                    error
                        ? 'border-red-500/50 bg-red-500/5 ring-2 ring-red-500/20'
                        : 'border-neutral-200 bg-neutral-50/70 hover:border-neutral-300 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/10 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:focus-within:border-white/40 dark:focus-within:ring-white/10'
                }`}
            >
                {IconComponent && (
                    <div className="mr-2.5 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-white transition-colors shrink-0">
                        <IconComponent className="h-4 w-4" />
                    </div>
                )}
                <input
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="auth-field w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500 border-0 p-0 focus:border-0 focus:ring-0 focus:outline-none ring-0 outline-none shadow-none font-sans"
                    {...rest}
                />
                {secret && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        tabIndex={-1}
                        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className="text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer shrink-0 ml-2.5 p-0.5"
                    >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
            {error && <p className="text-[11px] text-red-500 dark:text-red-400 mt-1">{error}</p>}
        </div>
    );
}

export function SubmitButton({ processing, children, loadingText = 'Chargement…' }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs sm:text-sm font-semibold transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs"
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
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-100/70 dark:bg-white/[0.02] px-3 py-1.5 text-xs">
            <div className="flex items-center gap-2">
                <span className="text-neutral-600 dark:text-neutral-400">{label} :</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 font-medium">{value}</span>
            </div>
            <button
                type="button"
                onClick={copy}
                aria-label={`Copier ${label}`}
                className="rounded p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
            >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
        </div>
    );
}

export function DemoLoginCard({ cred, onOneClick, loading, hint = "Comptes de démonstration préconfigurés" }) {
    if (!cred) return null;

    return (
        <div className="mb-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50/90 dark:bg-white/[0.03] p-4 text-xs">
            <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{hint}</span>
                <span className="rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:text-neutral-400 shadow-2xs">
                    Mode Démo
                </span>
            </div>

            <div className="space-y-1.5">
                <CopyRow label="E-mail" value={cred.email} />
                <CopyRow label="Mot de passe" value={cred.password} />
            </div>

            <button
                type="button"
                onClick={onOneClick}
                disabled={loading}
                className="mt-2.5 inline-flex w-full h-9 items-center justify-center gap-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 dark:bg-white/[0.06] dark:border-white/10 dark:text-neutral-200 dark:hover:bg-white/[0.1] px-3 text-xs font-semibold transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-none"
            >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>{loading ? 'Connexion en cours…' : 'Connexion en 1 clic'}</span>
            </button>
        </div>
    );
}

export function PasswordStrengthMeter({ password = '' }) {
    if (!password) return null;

    const hasLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const score = [hasLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;
    const labels = ['Très faible', 'Faible', 'Moyen', 'Sécurisé', 'Excellent'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-400'];

    return (
        <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500 dark:text-neutral-400">Force du mot de passe :</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{labels[score]}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((step) => (
                    <div
                        key={step}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            score > step ? colors[score] : 'bg-neutral-200 dark:bg-white/10'
                        }`}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                <span className={`inline-flex items-center gap-1 ${hasLength ? 'text-neutral-800 dark:text-neutral-200 font-medium' : ''}`}>
                    <Check className="h-3 w-3" /> 8+ caractères
                </span>
                <span className={`inline-flex items-center gap-1 ${hasNumber ? 'text-neutral-800 dark:text-neutral-200 font-medium' : ''}`}>
                    <Check className="h-3 w-3" /> Chiffre
                </span>
                <span className={`inline-flex items-center gap-1 ${hasUpper ? 'text-neutral-800 dark:text-neutral-200 font-medium' : ''}`}>
                    <Check className="h-3 w-3" /> Majuscule
                </span>
            </div>
        </div>
    );
}

export default function AuthShell({
    eyebrow,
    title,
    subtitle,
    footer,
    children
}) {
    return (
        <section className="relative min-h-screen bg-[#FBFBFD] dark:bg-[#0A0D12] px-4 py-8 sm:py-12 text-neutral-900 dark:text-neutral-100 antialiased flex flex-col justify-between items-center overflow-x-hidden selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 transition-colors duration-200">
            <FlashToast />

            {/* Ambient subtle glow background */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-neutral-200/60 via-neutral-100/30 to-transparent dark:from-white/5 dark:via-white/[0.02] blur-3xl rounded-full" />

            {/* Header supérieur avec logo, theme toggle et retour */}
            <header className="relative z-20 w-full max-w-lg flex items-center justify-between pb-6">
                <Link href="/" className="inline-flex items-center group transition-opacity hover:opacity-85 py-1">
                    <img src="/images/autocall-logo-dark.png" alt={translationI18n.t('app.name')} className="h-4 sm:h-[18px] max-h-5 w-auto object-contain dark:hidden" />
                    <img src="/images/autocall-logo.png" alt={translationI18n.t('app.name')} className="h-4 sm:h-[18px] max-h-5 w-auto object-contain hidden dark:block" />
                </Link>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold dark:text-neutral-200 dark:hover:text-white dark:hover:border-white/20 transition-all shadow-2xs"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Retour au site</span>
                    </Link>
                </div>
            </header>

            {/* Carte centrale ultra-premium avec transition fluide */}
            <main className="relative z-10 w-full max-w-lg my-auto">
                <div className="rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#11141A] p-7 sm:p-9 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.06)] dark:shadow-2xl transition-colors duration-200">
                    {eyebrow && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100/80 dark:border-white/10 dark:bg-white/[0.04] px-3.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            <span>{eyebrow}</span>
                        </div>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {subtitle}
                        </p>
                    )}

                    <div className="mt-6">
                        {children}
                    </div>

                    {/* Pied sous formulaire & Micro-réassurance */}
                    <div className="mt-8 pt-5 border-t border-neutral-200/80 dark:border-white/10 space-y-3">
                        {footer && (
                            <div className="text-center text-xs text-neutral-600 dark:text-neutral-400">
                                {footer}
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                            <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Transaction chiffrée SSL 256-bit certifiée PCI-DSS</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Micro-footer légal discret */}
            <footer className="relative z-20 w-full max-w-lg pt-6 text-center text-[11px] text-neutral-500 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p>© {new Date().getFullYear()} AutoCall. Tous droits réservés.</p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-medium">
                    <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">CGVU</Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">Confidentialité</Link>
                    <span>•</span>
                    <Link href="/mentions-legales" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">Mentions Légales</Link>
                    <span>•</span>
                    <Link href="/cookies" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">Cookies</Link>
                </div>
            </footer>
        </section>
    );
}
