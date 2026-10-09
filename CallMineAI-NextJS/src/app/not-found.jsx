'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Home, PhoneCall, Sparkles } from 'lucide-react';
import BrandMark from '@/components/BrandMark';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#08090C] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Halos d'ambiance bleutés profonds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full blur-[180px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(30, 58, 138, 0.2) 50%, transparent 70%)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full blur-[100px] opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* En-tête simple */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Accueil AutoCall"
        >
          <BrandMark variant="dark" className="h-7 w-7 shrink-0 text-white" />
          <span className="font-semibold text-sm tracking-tight text-white">
            AutoCall
          </span>
        </Link>

        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-all"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-blue-400" />
          <span>Dashboard</span>
        </Link>
      </header>

      {/* Contenu central */}
      <main className="relative z-10 my-auto w-full max-w-xl mx-auto px-6 py-12 text-center">
        {/* Badge Erreur 404 */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 mb-6 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
          <span>ERREUR 404</span>
        </div>

        {/* Grand affichage 404 imposant et visible */}
        <div className="font-hero-sans text-8xl sm:text-9xl md:text-[140px] font-black tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white/85 to-white/20 drop-shadow-2xl mb-4">
          404
        </div>

        {/* Titre net */}
        <h1 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Page introuvable
        </h1>

        {/* Sous-titre clair */}
        <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-9 max-w-md mx-auto">
          L&apos;adresse demandée n&apos;existe pas ou a été déplacée. Retrouvez vos services ou retournez sur votre tableau de bord.
        </p>

        {/* Boutons d'action clairs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/app/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 text-xs sm:text-sm font-semibold text-white transition-all shadow-md shadow-blue-600/30 active:scale-[0.98] cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Accéder au Dashboard</span>
          </Link>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-xs sm:text-sm font-semibold text-white/90 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4 text-neutral-400" />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>
      </main>

      {/* Pied de page discret */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 text-center text-xs text-white/30 border-t border-white/5">
        <p>© {new Date().getFullYear()} AutoCall. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
