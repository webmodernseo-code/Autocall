'use client';

import translationI18n from '@/i18n';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ShieldCheck,
    ArrowLeft,
    Lock,
    Scale,
    FileText,
    Cookie,
    Building2,
    AlertTriangle,
    ChevronRight,
    ExternalLink,
    Calendar
} from 'lucide-react';
import BrandMark from '@/components/BrandMark';
import ThemeToggle from '@/components/ThemeToggle';

const LEGAL_NAV = [
    { href: '/terms', label: 'Conditions Générales (CGVU)', icon: Scale },
    { href: '/privacy', label: 'Confidentialité & RGPD', icon: ShieldCheck },
    { href: '/mentions-legales', label: 'Mentions Légales', icon: Building2 },
    { href: '/cookies', label: 'Politique Cookies', icon: Cookie },
];

export default function LegalLayout({
    eyebrow = "Cadre Juridique & Conformité",
    badgeNumber,
    title,
    titleSerif,
    subtitle,
    lastUpdated = "1er Mars 2026",
    effectiveDate = "Applicable immédiatement",
    penalNotice,
    tableOfContents = [],
    accentColor = 'neutral', // 'blue' | 'teal' | 'neutral'
    children
}) {
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState(tableOfContents[0]?.id || '');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 180;
            for (let i = tableOfContents.length - 1; i >= 0; i--) {
                const el = document.getElementById(tableOfContents[i].id);
                if (el && el.offsetTop <= scrollPos) {
                    setActiveSection(tableOfContents[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tableOfContents]);

    // Palettes d'accentuation pour tester Bleu vs #1B4654
    const isBlue = accentColor === 'blue';
    const isTeal = accentColor === 'teal';

    const eyebrowStyle = isBlue
        ? 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300'
        : isTeal
        ? 'border-[#1B4654]/40 bg-[#1B4654]/10 text-[#1B4654] dark:text-[#5EC2D7]'
        : 'border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/[0.04] text-neutral-800 dark:text-white/80';

    const eyebrowDotStyle = isBlue
        ? 'bg-blue-600 dark:bg-blue-400'
        : isTeal
        ? 'bg-[#1B4654] dark:bg-[#5EC2D7]'
        : 'bg-neutral-800 dark:bg-white/80';

    const penalStyle = isBlue
        ? 'border-blue-500/30 bg-blue-50/70 dark:bg-blue-500/10'
        : isTeal
        ? 'border-[#1B4654]/40 bg-[#1B4654]/5 dark:bg-[#1B4654]/15'
        : 'border-neutral-200/90 dark:border-white/15 bg-neutral-50 dark:bg-white/[0.03]';

    const penalIconStyle = isBlue
        ? 'text-blue-600 dark:text-blue-400'
        : isTeal
        ? 'text-[#1B4654] dark:text-[#5EC2D7]'
        : 'text-neutral-700 dark:text-white/70';

    const tocActiveStyle = isBlue
        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30 font-semibold'
        : isTeal
        ? 'bg-[#1B4654]/10 text-[#1B4654] border-[#1B4654]/30 dark:bg-[#1B4654]/30 dark:text-[#5EC2D7] dark:border-[#1B4654]/50 font-semibold'
        : 'bg-neutral-100 text-neutral-900 border-neutral-200 dark:bg-white/10 dark:text-white dark:border-white/15 font-semibold';

    const haloGradient = isBlue
        ? 'radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, rgba(29, 78, 216, 0.12) 50%, transparent 70%)'
        : isTeal
        ? 'radial-gradient(circle, rgba(27, 70, 84, 0.45) 0%, rgba(18, 48, 58, 0.18) 50%, transparent 70%)'
        : 'radial-gradient(circle, rgba(22, 65, 125, 0.35) 0%, rgba(12, 35, 75, 0.12) 50%, transparent 70%)';

    return (
        <div className="relative min-h-screen bg-[#F8F9FA] text-neutral-900 dark:bg-[#08090C] dark:text-white selection:bg-blue-600 selection:text-white antialiased font-sans transition-colors duration-200">
            {/* Google Fonts: Playfair Display + Plus Jakarta Sans */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .font-hero-serif {
                    font-family: 'Playfair Display', Georgia, Cambria, serif;
                }
                .font-hero-sans {
                    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                }
            `}} />

            {/* Halos d'ambiance cinématiques dynamiques */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
                <div
                    className="absolute -left-48 top-1/6 h-[700px] w-[700px] rounded-full blur-[160px] opacity-35 dark:opacity-40"
                    style={{ background: haloGradient }}
                />
                <div
                    className="absolute -right-48 top-1/4 h-[700px] w-[700px] rounded-full blur-[160px] opacity-15 dark:opacity-25"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* HEADER SUPÉRIEUR ÉLÉGANT */}
            <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/85 dark:border-white/[0.07] dark:bg-[#08090C]/85 backdrop-blur-xl transition-colors duration-200">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="inline-flex items-center gap-2 group transition-opacity hover:opacity-85 py-1">
                            <img src="/images/autocall-logo-dark.png" alt={translationI18n.t('app.name')} className="h-4 sm:h-[18px] max-h-5 w-auto object-contain dark:hidden" />
                            <img src="/images/autocall-logo.png" alt={translationI18n.t('app.name')} className="h-4 sm:h-[18px] max-h-5 w-auto object-contain hidden dark:block" />
                        </Link>

                        {/* Navigation entre documents légaux */}
                        <nav className="hidden lg:flex items-center gap-1.5">
                            {LEGAL_NAV.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                            isActive
                                                ? isBlue
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30'
                                                    : isTeal
                                                    ? 'bg-[#1B4654]/10 text-[#1B4654] border border-[#1B4654]/30 shadow-2xs dark:bg-[#1B4654]/25 dark:text-[#5EC2D7] dark:border-[#1B4654]/50'
                                                    : 'bg-neutral-100 text-neutral-900 border border-neutral-200 shadow-2xs dark:bg-white/10 dark:text-white dark:border-white/20'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />

                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/80 hover:bg-neutral-50 px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70 dark:hover:text-white dark:hover:bg-white/[0.08] transition-all shadow-2xs"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Retour au site</span>
                        </Link>

                        <Link
                            href="/login"
                            className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all shadow-2xs ${
                                isBlue
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                                    : isTeal
                                    ? 'bg-[#1B4654] text-white hover:bg-[#235869] shadow-[#1B4654]/20'
                                    : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
                            }`}
                        >
                            Espace Client
                        </Link>
                    </div>
                </div>

                {/* Barre mobile */}
                <div className="flex lg:hidden overflow-x-auto border-t border-neutral-200/60 dark:border-white/[0.05] px-4 py-2 gap-2 scrollbar-none">
                    {LEGAL_NAV.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                    isActive
                                        ? isBlue
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30'
                                            : isTeal
                                            ? 'bg-[#1B4654]/10 text-[#1B4654] border border-[#1B4654]/30 dark:bg-[#1B4654]/25 dark:text-[#5EC2D7] dark:border-[#1B4654]/50'
                                            : 'bg-neutral-100 text-neutral-900 border border-neutral-200 dark:bg-white/10 dark:text-white dark:border-white/20'
                                        : 'text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white bg-neutral-100/60 dark:bg-white/[0.02]'
                                }`}
                            >
                                <Icon className="h-3 w-3 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </header>

            {/* HERO DU DOCUMENT */}
            <section className="relative z-10 border-b border-neutral-200/80 dark:border-white/[0.06] bg-gradient-to-b from-neutral-100/60 to-transparent dark:from-white/[0.02] px-4 pt-12 pb-14 sm:px-6 sm:pt-16 sm:pb-18 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-md ${eyebrowStyle}`}>
                            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${eyebrowDotStyle}`} />
                            <span>{eyebrow}</span>
                        </span>
                        {badgeNumber && (
                            <span className="font-mono text-xs text-neutral-400 dark:text-white/40">
                                {badgeNumber}
                            </span>
                        )}
                    </div>

                    <h1 className="font-hero-sans text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.035em] text-neutral-900 dark:text-white leading-[1.1]">
                        {title}{' '}
                        {titleSerif && (
                            <span className={`font-hero-serif italic font-normal tracking-[-0.01em] ${
                                isBlue
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : isTeal
                                    ? 'text-[#1B4654] dark:text-[#5EC2D7]'
                                    : 'text-neutral-700 dark:text-white/95'
                            }`}>
                                {titleSerif}
                            </span>
                        )}
                    </h1>

                    {subtitle && (
                        <p className="font-hero-sans mt-5 max-w-3xl text-sm sm:text-base text-neutral-600 dark:text-white/60 leading-relaxed">
                            {subtitle}
                        </p>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-500 dark:text-white/40 border-t border-neutral-200 dark:border-white/[0.06] pt-4">
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-neutral-400 dark:text-white/50" />
                            <span>Dernière mise à jour : <strong className="text-neutral-800 dark:text-white/80 font-medium">{lastUpdated}</strong></span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-neutral-400 dark:text-white/50" />
                            <span>{effectiveDate}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-neutral-400 dark:text-white/50" />
                            <span>Juridiction : Droit Français &amp; Réglementation UE</span>
                        </span>
                    </div>

                    {/* ENCARD DE MISE EN GARDE PÉNALE & RÉGLEMENTAIRE */}
                    {penalNotice && (
                        <div className={`mt-7 rounded-2xl border p-5 sm:p-6 backdrop-blur-md shadow-2xs ${penalStyle}`}>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${penalIconStyle}`} />
                                <div className="space-y-1.5 text-xs sm:text-sm">
                                    <h2 className={`font-semibold tracking-tight ${
                                        isBlue
                                            ? 'text-blue-950 dark:text-blue-200'
                                            : isTeal
                                            ? 'text-[#1B4654] dark:text-[#5EC2D7]'
                                            : 'text-neutral-900 dark:text-white'
                                    }`}>
                                        {penalNotice.title || "Avertissement Légal & Sanctions Pénales Applicables"}
                                    </h2>
                                    <p className="text-neutral-700 dark:text-white/75 leading-relaxed font-hero-sans">
                                        {penalNotice.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CONTENU PRINCIPAL + SOMMAIRE FLOTTANT */}
            <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
                    {/* Sommaire sticky à gauche */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-28 space-y-6">
                            <div className="rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] bg-white/95 dark:bg-[#0E1015]/90 p-5 backdrop-blur-xl shadow-xs dark:shadow-xl">
                                <h3 className="text-xs font-semibold normal-case tracking-wider text-neutral-400 dark:text-white/40 font-mono mb-4">
                                    Table des Matières
                                </h3>
                                <nav className="space-y-1 text-xs">
                                    {tableOfContents.map((item, idx) => {
                                        const isActive = activeSection === item.id;
                                        return (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`group flex items-center justify-between rounded-xl px-2.5 py-2 transition-all ${
                                                    isActive
                                                        ? tocActiveStyle
                                                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.03]'
                                                }`}
                                            >
                                                <span className="truncate pr-2">
                                                    <span className={`font-mono text-xs mr-2 ${
                                                        isActive
                                                            ? isBlue
                                                                ? 'text-blue-600 dark:text-blue-400 font-bold'
                                                                : isTeal
                                                                ? 'text-[#1B4654] dark:text-[#5EC2D7] font-bold'
                                                                : 'text-neutral-900 dark:text-white font-bold'
                                                            : 'text-neutral-400 dark:text-white/40'
                                                    }`}>
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </span>
                                                    {item.title}
                                                </span>
                                                <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${
                                                    isActive
                                                        ? isBlue
                                                            ? 'text-blue-600 dark:text-blue-400 translate-x-0.5'
                                                            : isTeal
                                                            ? 'text-[#1B4654] dark:text-[#5EC2D7] translate-x-0.5'
                                                            : 'text-neutral-900 dark:text-white translate-x-0.5'
                                                        : 'text-neutral-300 dark:text-white/20'
                                                }`} />
                                            </a>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Boîte d'aide juridique et DPO */}
                            <div className="rounded-2xl border border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/80 dark:bg-white/[0.02] p-4 text-xs space-y-2">
                                <div className="flex items-center gap-2 font-medium text-neutral-800 dark:text-white/80">
                                    <Scale className={`h-4 w-4 ${isBlue ? 'text-blue-600' : isTeal ? 'text-[#1B4654] dark:text-[#5EC2D7]' : 'text-neutral-700 dark:text-white/70'}`} />
                                    <span>Département Juridique &amp; DPO</span>
                                </div>
                                <p className="text-neutral-500 dark:text-white/50 text-xs leading-relaxed">
                                    Une question sur la conformité de vos campagnes vocales ou vos droits RGPD ?
                                </p>
                                <a
                                    href="mailto:legal@autocall.co"
                                    className={`inline-flex items-center gap-1 font-semibold text-xs underline ${
                                        isBlue
                                            ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400'
                                            : isTeal
                                            ? 'text-[#1B4654] hover:text-[#235869] dark:text-[#5EC2D7]'
                                            : 'text-neutral-900 dark:text-white'
                                    }`}
                                >
                                    <span>legal@autocall.co</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Contenu textuel rédigé */}
                    <div className="min-w-0 space-y-12">
                        {children}

                        {/* Signature et certification de conformité en bas de page */}
                        <div className="rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-6 text-xs text-neutral-600 dark:text-white/70 space-y-3 shadow-2xs">
                            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold">
                                <ShieldCheck className={`h-4 w-4 ${isBlue ? 'text-blue-600' : isTeal ? 'text-[#1B4654] dark:text-[#5EC2D7]' : 'text-neutral-700 dark:text-white/80'}`} />
                                <span>Engagement de Conformité Opérationnelle AutoCall</span>
                            </div>
                            <p className="leading-relaxed text-neutral-600 dark:text-white/60">
                                La présente documentation a été établie pour garantir la conformité intégrale des services d’intelligence artificielle vocale avec le droit pénal français, le Code de la consommation, la loi Naegelen encadrant le démarchage téléphonique, les règles de numérotation ARCEP et le Règlement Général sur la Protection des Données (RGPD 2016/679).
                            </p>
                            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-400 dark:text-white/40 border-t border-neutral-200 dark:border-white/[0.06]">
                                <span>Fait à Paris, France</span>
                                <span>•</span>
                                <span>Société AutoCall SAS</span>
                                <span>•</span>
                                <span>Version 3.2 — Production</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER LÉGAL DÉDIÉ */}
            <footer className="relative z-10 border-t border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#08090C] px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-200">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-white/[0.06]">
                        <Link href="/" className="inline-flex items-center group py-1">
                            <img src="/images/autocall-logo-dark.png" alt={translationI18n.t('app.name')} className="h-3.5 sm:h-4 max-h-[18px] w-auto object-contain dark:hidden" />
                            <img src="/images/autocall-logo.png" alt={translationI18n.t('app.name')} className="h-3.5 sm:h-4 max-h-[18px] w-auto object-contain hidden dark:block" />
                        </Link>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-600 dark:text-white/60">
                            <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Conditions Générales (CGVU)</Link>
                            <span>•</span>
                            <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Politique de Confidentialité</Link>
                            <span>•</span>
                            <Link href="/mentions-legales" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Mentions Légales</Link>
                            <span>•</span>
                            <Link href="/cookies" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Gestion des Cookies</Link>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-white/40">
                        <p>© {new Date().getFullYear()} AutoCall. Tous droits réservés.</p>
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-white/50">
                            <Lock className="h-3 w-3 text-neutral-500 dark:text-white/60" />
                            <span>Infrastructure VoIP &amp; Données chiffrées SSL 256-bit certifiée PCI-DSS</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export function LegalArticle({ id, number, title, accentColor = 'neutral', children }) {
    const isBlue = accentColor === 'blue';
    const isTeal = accentColor === 'teal';

    const numberStyle = isBlue
        ? 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/15 dark:border-blue-500/30'
        : isTeal
        ? 'text-[#1B4654] bg-[#1B4654]/10 border-[#1B4654]/30 dark:text-[#5EC2D7] dark:bg-[#1B4654]/25 dark:border-[#1B4654]/40'
        : 'text-neutral-800 bg-neutral-100 border-neutral-200 dark:text-white/80 dark:bg-white/[0.06] dark:border-white/15';

    return (
        <article id={id} className="scroll-mt-28 space-y-4 border-b border-neutral-200/80 dark:border-white/[0.06] pb-10 last:border-b-0">
            <div className="flex items-baseline gap-3">
                <span className={`font-mono text-xs font-semibold px-2.5 py-0.5 rounded-md shrink-0 border ${numberStyle}`}>
                    {number}
                </span>
                <h2 className="font-hero-sans text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {title}
                </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-white/70 pl-0 sm:pl-9 font-hero-sans">
                {children}
            </div>
        </article>
    );
}

export function LegalBox({ type = "warning", title, accentColor = 'neutral', children }) {
    const isDanger = type === "danger";
    const isBlue = accentColor === 'blue';
    const isTeal = accentColor === 'teal';

    const borderColor = isDanger
        ? "border-red-500/30 bg-red-500/[0.04] text-red-950 dark:text-white/90"
        : isBlue
        ? "border-blue-500/30 bg-blue-50/70 dark:bg-blue-500/[0.08] text-neutral-900 dark:text-white/90"
        : isTeal
        ? "border-[#1B4654]/30 bg-[#1B4654]/5 dark:bg-[#1B4654]/15 text-neutral-900 dark:text-white/90"
        : "border-neutral-200 dark:border-white/15 bg-neutral-50 dark:bg-white/[0.03] text-neutral-900 dark:text-white/90";

    const titleColor = isDanger
        ? "text-red-600 dark:text-red-300"
        : isBlue
        ? "text-blue-700 dark:text-blue-300 font-semibold"
        : isTeal
        ? "text-[#1B4654] dark:text-[#5EC2D7] font-semibold"
        : "text-neutral-900 dark:text-white font-semibold";

    const Icon = isDanger ? AlertTriangle : Scale;

    return (
        <div className={`rounded-2xl border p-4 sm:p-5 my-4 ${borderColor} backdrop-blur-sm space-y-2 shadow-2xs`}>
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
                <Icon className={`h-4 w-4 shrink-0 ${isDanger ? 'text-red-500' : isBlue ? 'text-blue-600' : isTeal ? 'text-[#1B4654] dark:text-[#5EC2D7]' : 'text-neutral-700 dark:text-white/80'}`} />
                <span className={titleColor}>{title}</span>
            </div>
            <div className="text-xs sm:text-sm text-neutral-700 dark:text-white/75 leading-relaxed space-y-2">
                {children}
            </div>
        </div>
    );
}
