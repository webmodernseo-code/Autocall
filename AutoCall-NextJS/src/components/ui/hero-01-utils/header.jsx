'use client';

import translationI18n from '@/i18n';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

/**
 * Logo vectoriel shadcnspace. avec le cercle blanc et le découpage bicolore exact :
 * - Le cercle blanc coupe la lettre "a" en son milieu
 * - "sh" et la partie gauche de "a" sont noirs dans le cercle
 * - La partie droite de "a" et "dcnspace." sont blancs sur le fond sombre
 */
export function ShadcnSpaceLogo() {
    return (
        <img
            src="/images/autocall-logo.png"
            alt={translationI18n.t('app.name')}
            className="h-4 sm:h-[18px] max-h-5 w-auto object-contain flex-shrink-0"
        />
    );
}

export default function Header({ navigationData = [], isDark = true, onToggleTheme }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full px-6 py-3.5 lg:px-16 transition-all duration-200 backdrop-blur-xl bg-[#08090C]/80 border-b border-white/[0.06]">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* 1. Logo officiel AutoCall */}
                <Link href="/" className="flex items-center group py-1">
                    <img
                        src="/images/autocall-logo.png"
                        alt={translationI18n.t('app.name')}
                        className="h-[18px] sm:h-5 md:h-[21px] w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                    />
                </Link>

                {/* 2. Menu en capsule sombre flottante */}
                <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-[#16181F]/70 p-1.5 backdrop-blur-xl shadow-2xl">
                    {navigationData.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href || '#'}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-150 ${
                                item.isActive
                                    ? 'bg-white text-black shadow-xs font-semibold'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {item.title}
                        </a>
                    ))}
                </nav>

                {/* 3. Groupe d'action : Toggle Thème + Connexion + Bouton CTA */}
                <div className="hidden md:flex items-center gap-4">
                    {onToggleTheme && (
                        <button
                            onClick={onToggleTheme}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                            aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
                            title={isDark ? "Mode clair" : "Mode sombre"}
                        >
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    )}
                    <Link
                        href="/login"
                        className="text-xs font-semibold text-white/70 transition-colors hover:text-white"
                    >
                        Connexion
                    </Link>
                    <Link
                        href="/register"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-black transition-all hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-white/5 cursor-pointer"
                    >
                        <span>Essai gratuit</span>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-[11px]">
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </Link>
                </div>

                {/* Mobile Burger */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-white"
                        aria-label={translationI18n.t('sidebar.menu')}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#0E1015]/95 p-6 backdrop-blur-2xl md:hidden">
                    <nav className="flex flex-col gap-3">
                        {navigationData.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.href || '#'}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm font-medium text-white/80 hover:text-white py-1"
                            >
                                {item.title}
                            </a>
                        ))}
                        <div className="my-2 h-px bg-white/10" />
                        <div className="flex flex-col gap-2.5">
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-10 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white hover:bg-white/10"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white text-xs font-semibold text-black hover:bg-neutral-200"
                            >
                                <span>Essai gratuit — 100 minutes</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                                href="/forgot-password"
                                onClick={() => setMobileOpen(false)}
                                className="text-center text-[11px] text-white/50 hover:text-white/80 py-1"
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
