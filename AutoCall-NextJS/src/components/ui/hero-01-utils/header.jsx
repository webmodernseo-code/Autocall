'use client';

import translationI18n from '@/i18n';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function ShadcnSpaceLogo() {
    return (
        <img
            src="/images/autocall-logo-dark.png"
            alt={translationI18n.t('app.name')}
            className="h-5 sm:h-[22px] w-auto object-contain flex-shrink-0"
        />
    );
}

export default function Header({ navigationData = [] }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-200 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 py-3 shadow-2xs'
                    : 'bg-white/80 backdrop-blur-md border-b border-neutral-200/60 py-3.5'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo AutoCall sombre sur fond clair */}
                <Link href="/" className="flex items-center group py-1 cursor-pointer">
                    <img
                        src="/images/autocall-logo-dark.png"
                        alt={translationI18n.t('app.name')}
                        className="h-[20px] sm:h-[22px] w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
                    />
                </Link>

                {/* Navigation centrale épurée */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navigationData.map((item, idx) => {
                        const isExternalRoute = item.href?.startsWith('/');
                        const classes = `rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                            item.isActive
                                ? 'text-neutral-950 font-semibold'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70'
                        }`;

                        return isExternalRoute ? (
                            <Link key={idx} href={item.href} className={classes}>
                                {item.title}
                            </Link>
                        ) : (
                            <a key={idx} href={item.href || '#'} className={classes}>
                                {item.title}
                            </a>
                        );
                    })}
                </nav>

                {/* Actions droite : Connexion + Essai gratuit */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950 cursor-pointer"
                    >
                        Connexion
                    </Link>

                    <Link
                        href="/register"
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] shadow-xs cursor-pointer"
                    >
                        Essai gratuit
                    </Link>
                </div>

                {/* Bouton menu mobile */}
                <div className="flex lg:hidden items-center gap-2">
                    <Link
                        href="/login"
                        className="hidden sm:inline-flex md:hidden h-9 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700"
                    >
                        Connexion
                    </Link>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                        aria-label={translationI18n.t('sidebar.menu')}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Tiroir mobile */}
            {mobileOpen && (
                <div className="mx-4 mt-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl lg:hidden">
                    <nav className="flex flex-col gap-1">
                        {navigationData.map((item, idx) => {
                            const isExternalRoute = item.href?.startsWith('/');
                            const classes =
                                'rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors';
                            return isExternalRoute ? (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={classes}
                                >
                                    {item.title}
                                </Link>
                            ) : (
                                <a
                                    key={idx}
                                    href={item.href || '#'}
                                    onClick={() => setMobileOpen(false)}
                                    className={classes}
                                >
                                    {item.title}
                                </a>
                            );
                        })}

                        <div className="my-3 h-px bg-neutral-200" />

                        <div className="flex flex-col gap-2.5">
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
                            >
                                Essai gratuit — 10 min offertes
                            </Link>
                            <Link
                                href="/forgot-password"
                                onClick={() => setMobileOpen(false)}
                                className="text-center text-xs text-neutral-500 hover:text-neutral-800 py-1 transition-colors"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
