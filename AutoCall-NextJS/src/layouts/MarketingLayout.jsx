'use client';

import { route } from '@/lib/route';
import { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@/lib/page-router';
import { Menu, X, PhoneCall, Twitter, Linkedin, Github, Youtube, Mail, ArrowRight } from 'lucide-react';
import { MARKETING_STYLES } from '@/components/marketing/ui';
import ThemeToggle from '@/components/ThemeToggle';
import BrandMark, { BrandName } from '@/components/BrandMark';

const NAV = [
    ['Fonctionnalités', '/#features'],
    ['Fonctionnement', '/#how'],
    ['Cas d\'usage', '/#usecases'],
    ['Tarifs', '/#pricing'],
];

export default function MarketingLayout({ children, title, description, schema, canonical }) {
    const page = usePage().props;
    const user = page?.auth?.user;
    const brand = page?.branding?.system_title || page?.branding?.company_name || 'AutoCall';
    const desc = description || 'Agents vocaux IA qui appellent, mènent des conversations réelles, qualifient les prospects Chaud/Tiède/Froid et les synchronisent avec votre CRM — avec interface Super-Admin, facturation et API. Auto-hébergé et personnalisable.';

    const [scrolled, setScrolled] = useState(false);
    const [menu, setMenu] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 8);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);

    const footer = {
        Produit: [['Fonctionnalités', '/#features'], ['Fonctionnement', '/#how'], ['Intégrations', '/#integrations'], ['Tarifs', '/#pricing']],
        Solutions: [['Vente & SDR', '/#usecases'], ['Recrutement', '/#usecases'], ['Agences', '/#usecases'], ['Immobilier', '/#usecases']],
        Ressources: [['FAQ', route('frontend.faq')], ['Blog', route('frontend.blog')], ['Documentation', '/#'], ['Journal des versions', '/#']],
        Légal: [['Conditions Générales', route('frontend.terms')], ['Politique de Confidentialité', route('frontend.privacy')], ['Licence', '/#']],
    };
    const socials = [[Twitter, 'X / Twitter'], [Linkedin, 'LinkedIn'], [Github, 'GitHub'], [Youtube, 'YouTube']];

    return (
        <div className="mk-canvas min-h-screen font-sans text-neutral-700 dark:text-neutral-300 antialiased selection:bg-brand-500/30 selection:text-white">
            <Head title={title || `${brand} — Agents vocaux IA d'appels et qualification`}>
                <meta name="description" content={desc} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title || `${brand} — Plateforme d'appels vocaux par IA`} />
                <meta property="og:description" content={desc} />
                <meta name="twitter:card" content="summary_large_image" />
                {canonical && <link rel="canonical" href={canonical} />}
                {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
            </Head>
            <style>{MARKETING_STYLES}</style>

            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">Passer au contenu principal</a>

            {/* Top scrim */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 bg-gradient-to-b from-[#f6f6fb] via-[#f6f6fb]/70 to-transparent dark:from-ink-950 dark:via-ink-950/70" aria-hidden="true" />

            <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled ? 'border-b border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl' : 'border-b border-transparent'}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href={route('home')} className="flex items-center group py-1" aria-label={brand}>
                        <img
                            src="/images/autocall-logo-dark.png"
                            alt={brand}
                            className="h-4 sm:h-[18px] max-h-5 w-auto object-contain dark:hidden transition-transform duration-200 group-hover:scale-102"
                        />
                        <img
                            src="/images/autocall-logo.png"
                            alt={brand}
                            className="h-4 sm:h-[18px] max-h-5 w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-102"
                        />
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
                        {NAV.map(([label, href]) => <a key={href} href={href} className="rounded-lg px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white">{label}</a>)}
                        <Link href={route('frontend.faq')} className="rounded-lg px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white">FAQ</Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {user ? (
                            <Link href={route('client.dashboard')} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-ink-950 dark:hover:bg-neutral-200">Tableau de bord</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="hidden rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition hover:text-neutral-900 dark:hover:text-white sm:inline-flex">Connexion</Link>
                                <Link href={route('register')} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-neutral-800 dark:bg-white dark:text-ink-950 dark:hover:bg-neutral-200">Démarrer</Link>
                            </>
                        )}
                        <button onClick={() => setMenu((v) => !v)} className="rounded-lg p-2 text-neutral-700 dark:text-neutral-300 md:hidden" aria-label="Menu" aria-expanded={menu}>{menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
                    </div>
                </div>
                {menu && (
                    <div className="border-t border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-ink-950/95 px-4 py-3 md:hidden">
                        {[...NAV, ['FAQ', route('frontend.faq')]].map(([label, href]) => (
                            <a key={href} href={href} onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white">{label}</a>
                        ))}
                        <div className="mt-2 flex items-center justify-between border-t border-neutral-200 dark:border-white/10 px-3 pt-3 text-sm text-neutral-600 dark:text-neutral-400">
                            <span>Thème</span>
                            <ThemeToggle />
                        </div>
                    </div>
                )}
            </header>

            <main id="main">{children}</main>

            {/* Footer */}
            <footer className="border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-ink-950">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-[1.4fr_2.2fr_1.2fr]">
                        {/* brand + newsletter */}
                        <div>
                            <div className="flex items-center py-1">
                                <img
                                    src="/images/autocall-logo-dark.png"
                                    alt={brand}
                                    className="h-3.5 sm:h-4 max-h-[18px] w-auto object-contain dark:hidden"
                                />
                                <img
                                    src="/images/autocall-logo.png"
                                    alt={brand}
                                    className="h-3.5 sm:h-4 max-h-[18px] w-auto object-contain hidden dark:block"
                                />
                            </div>
                            <p className="mt-4 max-w-xs text-sm text-neutral-500">Agents vocaux IA qui appellent, qualifient et notent vos prospects — une plateforme d'appels complète, auto-hébergée et multi-tenant.</p>
                            <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="mt-6 max-w-xs">
                                <label htmlFor="nl" className="font-mono text-xs normal-case tracking-widest text-neutral-500 dark:text-neutral-600">Nouveautés & Mises à jour</label>
                                <div className="mt-2 flex gap-2">
                                    <input id="nl" type="email" required placeholder="vous@entreprise.com" className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-neutral-600 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25" />
                                    <button type="submit" className="shrink-0 rounded-lg bg-brand-600 px-3 py-2 text-white transition hover:bg-brand-500" aria-label="S'inscrire"><ArrowRight className="h-4 w-4" /></button>
                                </div>
                                {subscribed && <p className="mt-2 text-xs text-signal-400">Merci — vous êtes bien inscrit !</p>}
                            </form>
                        </div>

                        {/* link columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:grid-cols-4">
                            {Object.entries(footer).map(([title, links]) => (
                                <div key={title}>
                                    <p className="font-mono text-xs normal-case tracking-widest text-neutral-500 dark:text-neutral-600">{title}</p>
                                    <ul className="mt-4 space-y-2.5 text-sm">
                                        {links.map(([label, href]) => (
                                            <li key={label}>{href.startsWith('/#') || href === '#'
                                                ? <a href={href} className="text-neutral-600 dark:text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white">{label}</a>
                                                : <Link href={href} className="text-neutral-600 dark:text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white">{label}</Link>}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* contact + social */}
                        <div>
                            <p className="font-mono text-xs normal-case tracking-widest text-neutral-500 dark:text-neutral-600">Contact</p>
                            <a href="mailto:contact@autocall.co" className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white"><Mail className="h-4 w-4" /> contact@autocall.co</a>
                            <div className="mt-6 flex gap-2">
                                {socials.map(([Icon, label]) => (
                                    <a key={label} href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-400 transition hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-900 dark:hover:text-white"><Icon className="h-4 w-4" /></a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-neutral-200 dark:border-white/5 pt-6 text-sm text-neutral-500 dark:text-neutral-600 sm:flex-row">
                        <p>© {new Date().getFullYear()} {brand}. Tous droits réservés.</p>
                        <p className="inline-flex items-center gap-1.5 font-mono text-xs"><PhoneCall className="h-3.5 w-3.5 text-signal-500" /> Développé pour les équipes de prospection</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
