'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';

/**
 * Logo vectoriel shadcnspace. avec le cercle blanc et le découpage bicolore exact :
 * - Le cercle blanc coupe la lettre "a" en son milieu
 * - "sh" et la partie gauche de "a" sont noirs dans le cercle
 * - La partie droite de "a" et "dcnspace." sont blancs sur le fond sombre
 */
export function ShadcnSpaceLogo() {
    return (
        <svg
            width="180"
            height="38"
            viewBox="0 0 180 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
        >
            <defs>
                <clipPath id="shadcnLogoCircle">
                    <circle cx="20" cy="19" r="18" />
                </clipPath>
            </defs>

            {/* 1. Cercle blanc solide */}
            <circle cx="20" cy="19" r="18" fill="#FFFFFF" />

            {/* 2. Texte blanc sur fond sombre */}
            <text
                x="15"
                y="26"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', sans-serif"
                fontSize="20.5"
                fontWeight="800"
                letterSpacing="-0.045em"
                fill="#FFFFFF"
            >
                shadcnspace.
            </text>

            {/* 3. Texte noir découpé au millimètre dans le cercle blanc */}
            <g clipPath="url(#shadcnLogoCircle)">
                <text
                    x="15"
                    y="26"
                    fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', sans-serif"
                    fontSize="20.5"
                    fontWeight="800"
                    letterSpacing="-0.045em"
                    fill="#08090D"
                >
                    shadcnspace.
                </text>
            </g>
        </svg>
    );
}

export default function Header({ navigationData = [] }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="relative z-30 w-full px-6 py-6 lg:px-16">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* 1. Logo shadcnspace. */}
                <Link href="/" className="flex items-center group">
                    <ShadcnSpaceLogo />
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

                {/* 3. Bouton Let's Collaborate */}
                <div className="hidden md:flex items-center">
                    <a
                        href="/login"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-black transition-all hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-white/5"
                    >
                        <span>Let's Collaborate</span>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-[11px]">
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </a>
                </div>

                {/* Mobile Burger */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-white"
                        aria-label="Menu"
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
                        <a
                            href="/login"
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-xs font-semibold text-black"
                        >
                            <span>Let's Collaborate</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
