'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';

export default function HeroSection({ avatarList = [] }) {
    return (
        <section className="relative px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 text-center">
            {/* Google Fonts: Playfair Display pour le rendu éditorial italien élégant */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

                html {
                    scroll-behavior: smooth;
                }

                .font-hero-serif {
                    font-family: 'Playfair Display', Georgia, Cambria, serif;
                }
                .font-hero-sans {
                    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                }
            `}} />

            <div className="mx-auto max-w-5xl">
                {/* 1. Badge supérieur élégant & discret */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs sm:text-sm font-medium text-white/80 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ne perdez plus aucun appel</span>
                </div>

                {/* 2. Titre Principal équilibré en 2 lignes nettes */}
                <h1 className="font-hero-sans text-4xl font-bold tracking-[-0.035em] text-white sm:text-6xl lg:text-[66px] leading-[1.1]">
                    Transformez chaque sonnerie <br />
                    <span className="font-hero-sans font-normal text-white">en </span>
                    <span className="font-hero-serif italic font-normal tracking-[-0.01em] text-white/95">
                        client qualifié.
                    </span>
                </h1>

                {/* 2. Sous-titre */}
                <p className="mx-auto mt-7 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-300 font-normal">
                    Votre standard téléphonique IA répond 24h/24, filtre les demandes urgentes et réserve vos rendez-vous directement dans votre agenda.
                </p>

                {/* 3. Badges des secteurs clés à fort volume */}
                <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
                    {["Immobilier", "Cabinets d'avocats", "Habitat & Devis", "Santé & Cliniques"].map((sector, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:border-white/30 hover:text-white"
                        >
                            {sector}
                        </span>
                    ))}
                </div>

                {/* 4. Groupe CTA : Bouton + Avatars superposés + Étoiles */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                    {/* Bouton blanc Commencer maintenant avec pastille flèche noire */}
                    <Link
                        href="/register"
                        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-6 text-sm font-semibold text-black transition-all hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5 cursor-pointer"
                    >
                        <span>Commencer maintenant</span>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-[11px]">
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </Link>

                    {/* Groupe de réassurance : Avatars + Note 5 étoiles */}
                    <div className="flex items-center gap-3">
                        {/* 4 Avatars superposés */}
                        {avatarList && avatarList.length > 0 && (
                            <div className="flex -space-x-2.5 overflow-hidden">
                                {avatarList.map((avatar, idx) => (
                                    <img
                                        key={idx}
                                        src={avatar.image}
                                        alt="Client avatar"
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-[#08090C] object-cover bg-neutral-800"
                                    />
                                ))}
                            </div>
                        )}

                        {/* 5 Étoiles blanches officielles du design + label */}
                        <div className="flex flex-col items-start text-left">
                            <div className="flex items-center gap-1 text-[#F59E0B]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                                ))}
                            </div>
                            <span className="text-xs font-medium text-neutral-400 mt-1">
                                +1 000 professionnels conquis
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
