'use client';

import { route } from '@/lib/route';
import { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@/lib/page-router';
import { Menu, X, PhoneCall, Twitter, Linkedin, Github, Youtube, Mail, ArrowRight, ShieldCheck, Activity, CheckCircle2, Lock } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import BrandLogo from '@/components/marketing/BrandLogo';

const NAV = [
    ['Fonctionnalités', '/#features'],
    ['Simulateur Live', '/#simulator'],
    ['Calculateur ROI', '/#roi'],
    ['Cas d\'usage', '/#usecases'],
    ['Comparatif', '/#comparison'],
    ['Tarifs', '/#pricing'],
];

export default function MarketingLayout({ children, title, description, schema, canonical }) {
    const page = usePage().props;
    const user = page?.auth?.user;
    const brand = page?.branding?.system_title || page?.branding?.company_name || 'CallMindAI';
    const desc = description || 'Agents vocaux téléphoniques d’une fidélité humaine remarquable. Qualification en direct, prise de rendez-vous et synchronisation CRM instantanée.';

    const [scrolled, setScrolled] = useState(false);
    const [menu, setMenu] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 12);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);

    const footer = {
        Produit: [
            ['Fonctionnalités Clés', '/#features'],
            ['Console d\'appel HD', '/#simulator'],
            ['Calculateur de ROI', '/#roi'],
            ['Dialer Prédictif', '/#features'],
            ['Grille Tarifaire', '/#pricing']
        ],
        Solutions: [
            ['Immobilier & Promoteurs', '/#usecases'],
            ['Cabinets & Santé', '/#usecases'],
            ['SaaS & Entreprises B2B', '/#usecases'],
            ['Agences & Télémarketing', '/#usecases']
        ],
        Ressources: [
            ['Centre d\'aide & FAQ', route('frontend.faq')],
            ['Articles & Actualités', route('frontend.blog')],
            ['Documentation API', '/#'],
            ['Statut des Serveurs', '/#']
        ],
        Légal: [
            ['Conditions Générales', route('frontend.terms')],
            ['Politique de Confidentialité', route('frontend.privacy')],
            ['Conformité RGPD', route('frontend.privacy')],
            ['Sécurité & Chiffrement', '/#']
        ],
    };

    const socials = [
        [Twitter, 'X / Twitter'],
        [Linkedin, 'LinkedIn'],
        [Github, 'GitHub'],
        [Youtube, 'YouTube']
    ];

    return (
        <div className="min-h-screen font-sans bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 antialiased selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-100 flex flex-col justify-between">
            <Head title={title || `${brand} — Téléphonie Commerciale & Qualification par Agents Vocaux IA`}>
                <meta name="description" content={desc} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title || `${brand} — Téléphonie Commerciale par Agents Vocaux IA`} />
                <meta property="og:description" content={desc} />
                <meta name="twitter:card" content="summary_large_image" />
                {canonical && <link rel="canonical" href={canonical} />}
                {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
            </Head>

            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-white">
                Passer au contenu principal
            </a>

            {/* Top Navigation Bar */}
            <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-2xs'
                    : 'border-b border-transparent bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Brand Logo */}
                        <Link href={route('home')} className="focus:outline-none" aria-label={brand}>
                            <BrandLogo />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navigation principale">
                            {NAV.map(([label, href]) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
                                >
                                    {label}
                                </a>
                            ))}
                            <Link
                                href={route('frontend.faq')}
                                className="px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
                            >
                                FAQ
                            </Link>
                        </nav>

                        {/* Actions & Theme */}
                        <div className="flex items-center gap-2.5">
                            {/* Live status badge */}
                            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                <span className="relative flex h-2 w-2">
                                    <span className="pulse-dot-active absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>Réseau HD 99.98%</span>
                            </div>

                            <ThemeToggle />

                            {user ? (
                                <Link
                                    href={route('client.dashboard')}
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-semibold shadow-2xs transition-colors"
                                >
                                    Mon Tableau de bord
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-colors"
                                    >
                                        Essai Gratuit
                                    </Link>
                                </>
                            )}

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMenu((v) => !v)}
                                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                                aria-label="Menu mobile"
                                aria-expanded={menu}
                            >
                                {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {menu && (
                    <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-1">
                        {[...NAV, ['FAQ', route('frontend.faq')]].map(([label, href]) => (
                            <a
                                key={href}
                                href={href}
                                onClick={() => setMenu(false)}
                                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                        <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-3">
                            <span className="text-xs text-slate-500">Thème d'affichage</span>
                            <ThemeToggle />
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main id="main" className="pt-16 md:pt-20 flex-1">
                {children}
            </main>

            {/* Global Footer */}
            <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                        {/* Brand & Mission Column */}
                        <div className="lg:col-span-4 space-y-4">
                            <BrandLogo />
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                                La plateforme de téléphonie commerciale qui allie la précision de l'IA à la chaleur des interactions humaines. Développée pour les entreprises exigeantes.
                            </p>

                            {/* Newsletter Box */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setSubscribed(true);
                                }}
                                className="space-y-2 pt-2"
                            >
                                <label htmlFor="newsletter-email" className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                                    Recevez nos études de cas & guides télécom
                                </label>
                                <div className="flex gap-2 max-w-sm">
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        required
                                        placeholder="vous@entreprise.com"
                                        className="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                                    />
                                    <button
                                        type="submit"
                                        className="h-10 px-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-xs shrink-0 transition-colors shadow-2xs"
                                        aria-label="S'inscrire à l'infolettre"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                                {subscribed && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Inscription enregistrée avec succès.
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Navigation Columns */}
                        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {Object.entries(footer).map(([colTitle, links]) => (
                                <div key={colTitle} className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                        {colTitle}
                                    </h4>
                                    <ul className="space-y-2 text-xs">
                                        {links.map(([label, href]) => (
                                            <li key={label}>
                                                {href.startsWith('/#') || href === '#' ? (
                                                    <a
                                                        href={href}
                                                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                    >
                                                        {label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        href={href}
                                                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                    >
                                                        {label}
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Contact & Socials */}
                        <div className="lg:col-span-2 space-y-4">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Support Dédié
                            </h4>
                            <a
                                href="mailto:contact@callmindai.com"
                                className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                <span>contact@callmindai.com</span>
                            </a>
                            <div className="flex gap-2 pt-2">
                                {socials.map(([Icon, sName]) => (
                                    <a
                                        key={sName}
                                        href="#"
                                        aria-label={sName}
                                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 flex items-center justify-center transition-all shadow-2xs"
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Legal Copyright Bar */}
                    <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <p>© {new Date().getFullYear()} {brand}. Tous droits réservés.</p>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Chiffrement TLS 1.3 & RGPD
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="font-mono">Latence Télécom &lt; 320ms</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
