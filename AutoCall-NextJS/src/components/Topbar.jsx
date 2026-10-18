'use client';

import { route } from '@/lib/route';
import { Link, router, usePage } from '@/lib/page-router';
import { Bell, BadgeCheck, Sun, Moon, Layers, Globe, Coins, ChevronDown, Check, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import DemoBadge from '@/components/DemoBadge';
import { useTranslation } from 'react-i18next';
import ApplicationLogo from '@/components/ApplicationLogo';
import { Dropdown } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/hooks/useLocale';

/**
 * Topbar with language switcher, currency switcher, and account menu.
 * Locale/currency from shared page props; updates via PUT /locale and PUT /currency.
 */
// 100% Vector SVG Premium Currency Icons (Euro, Dollar, FCFA)
export function EuroSvg({ className = 'h-3.5 w-3.5' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="9.5" strokeWidth="1.25" className="opacity-25" />
            <path d="M15.5 8a5.2 5.2 0 0 0-7 4 5.2 5.2 0 0 0 7 4" />
            <path d="M6 10.5h6.5" />
            <path d="M6 13.5h6.5" />
        </svg>
    );
}

export function DollarSvg({ className = 'h-3.5 w-3.5' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="9.5" strokeWidth="1.25" className="opacity-25" />
            <line x1="12" y1="5.5" x2="12" y2="18.5" strokeWidth="1.75" />
            <path d="M15 9a2.8 2.8 0 0 0-3-2H10.5a2.4 2.4 0 0 0 0 4.8h3a2.4 2.4 0 0 1 0 4.8H9.5a2.8 2.8 0 0 1-3-2" />
        </svg>
    );
}

export function FcfaSvg({ className = 'h-3.5 w-3.5' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="9.5" strokeWidth="1.25" className="opacity-25" />
            {/* Monogramme vectoriel CFA de haute précision */}
            <path d="M7.5 8.5h4.5M7.5 8.5v7M7.5 12h3.5" strokeWidth="1.6" />
            <path d="M16.5 9.5a2.8 2.8 0 0 0-2.8-1.5 2.8 2.8 0 0 0-2.8 3v2a2.8 2.8 0 0 0 2.8 3 2.8 2.8 0 0 0 2.8-1.5" strokeWidth="1.6" />
        </svg>
    );
}

export function CurrencyIcon({ code, className = 'h-3.5 w-3.5' }) {
    const c = String(code || 'EUR').toUpperCase();
    if (c === 'USD') return <DollarSvg className={className} />;
    if (c === 'FCFA' || c === 'XOF') return <FcfaSvg className={className} />;
    return <EuroSvg className={className} />;
}

const SUPPORTED_CURRENCIES = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'Dollar US', symbol: '$' },
    { code: 'FCFA', name: 'Franc CFA', symbol: 'FCFA' },
];

// 100% Pure Vector SVG Premium Flags (Zero Emojis, crisp Retina rendering)
export function FlagFrSvg({ className = 'h-3.5 w-5' }) {
    return (
        <svg viewBox="0 0 24 16" className={`${className} rounded-[3px] overflow-hidden shadow-2xs border border-black/10 dark:border-white/15 shrink-0`} aria-label="Français">
            <rect width="8" height="16" fill="#002654" />
            <rect x="8" width="8" height="16" fill="#FFFFFF" />
            <rect x="16" width="8" height="16" fill="#ED2939" />
        </svg>
    );
}

export function FlagEnSvg({ className = 'h-3.5 w-5' }) {
    return (
        <svg viewBox="0 0 24 16" className={`${className} rounded-[3px] overflow-hidden shadow-2xs border border-black/10 dark:border-white/15 shrink-0`} aria-label="English">
            <rect width="24" height="16" fill="#012169" />
            <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.5" />
            <path d="M12 0 v16 M0 8 h24" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M12 0 v16 M0 8 h24" stroke="#C8102E" strokeWidth="3" />
        </svg>
    );
}

export function FlagEsSvg({ className = 'h-3.5 w-5' }) {
    return (
        <svg viewBox="0 0 24 16" className={`${className} rounded-[3px] overflow-hidden shadow-2xs border border-black/10 dark:border-white/15 shrink-0`} aria-label="Español">
            <rect width="24" height="4" fill="#AA151B" />
            <rect y="4" width="24" height="8" fill="#F1BF00" />
            <rect y="12" width="24" height="4" fill="#AA151B" />
        </svg>
    );
}

export function FlagDeSvg({ className = 'h-3.5 w-5' }) {
    return (
        <svg viewBox="0 0 24 16" className={`${className} rounded-[3px] overflow-hidden shadow-2xs border border-black/10 dark:border-white/15 shrink-0`} aria-label="Deutsch">
            <rect width="24" height="5.33" fill="#000000" />
            <rect y="5.33" width="24" height="5.33" fill="#DD0000" />
            <rect y="10.66" width="24" height="5.34" fill="#FFCC00" />
        </svg>
    );
}

export function FlagIcon({ code, className = 'h-3.5 w-5' }) {
    const c = String(code || 'fr').toLowerCase();
    if (c === 'fr') return <FlagFrSvg className={className} />;
    if (c === 'en' || c === 'au') return <FlagEnSvg className={className} />;
    if (c === 'es') return <FlagEsSvg className={className} />;
    if (c === 'de') return <FlagDeSvg className={className} />;
    return <FlagFrSvg className={className} />;
}

export default function Topbar({
    showLogo = true,
    logoHref = route('home'),
    userNavItems = [],
    title,
    showWorkspace = true,
    extra = null,
    onToggleSidebarCollapse = null,
    isSidebarCollapsed = false,
}) {
    const { t } = useTranslation();
    const page = usePage();
    const user = page.props.auth?.user;
    const kycVerified = page.props.auth?.customer?.kyc_verified === true;
    const isAdminArea = (() => { try { return route().current('admin.*'); } catch { return false; } })();
    const { theme, setTheme } = useTheme();

    const { locale: currentLocale, isRtl: currentIsRtl, locales: i18nLocales = [], setLocale: setLocaleCode } = useLocale();
    const defaultSupportedLocales = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' };
    const localeEntries = i18nLocales?.length
        ? i18nLocales.map((l) => [l.code, l.native_name || l.name])
        : Object.entries(page.props.supportedLocales ?? defaultSupportedLocales);

    const handleThemeToggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };

    const currencies = page.props.currencies?.length ? page.props.currencies : SUPPORTED_CURRENCIES;
    const currentCurrency = page.props.displayCurrency ?? 'EUR';

    const handleLocale = (code) => {
        setLocaleCode(code);
    };

    const handleCurrency = (code) => {
        router.put(route('currency.update'), { currency: code }, { preserveScroll: true });
    };

    const defaultUserItems = [
        ...(user
            ? [
                { label: t('nav.profile', 'Mon Profil'), href: route('client.profile.edit'), as: 'link' },
                { type: 'divider' },
                { label: t('nav.logout', 'Déconnexion'), href: route('logout'), method: 'post', as: 'link' },
            ]
            : [
                { label: t('nav.login', 'Connexion'), href: route('login'), as: 'link' },
                { label: t('nav.register', 'Inscription'), href: route('register'), as: 'link' },
            ]),
    ];

    const accountItems = userNavItems.length ? userNavItems : defaultUserItems;

    const currentTenant = page.props.currentTenant;
    const tenants = page.props.tenants ?? [];

    const handleTenantSwitch = (tenantId) => {
        router.post(route('client.tenants.switch'), { tenant_id: tenantId }, { preserveScroll: true });
    };

    return (
        <header className="topbar sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200/80 dark:border-white/10 bg-white/80 dark:bg-[#08090C]/80 backdrop-blur-xl px-4 sm:px-6 transition-colors duration-200">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                {showLogo && (
                    <Link href={logoHref} className="shrink-0">
                        <ApplicationLogo className="h-8 w-8" />
                    </Link>
                )}
                {onToggleSidebarCollapse && (
                    <button
                        type="button"
                        onClick={onToggleSidebarCollapse}
                        aria-label={isSidebarCollapsed ? 'Déplier le menu' : 'Replier le menu'}
                        title={isSidebarCollapsed ? 'Déplier le menu (Agrandir)' : 'Replier le menu (Réduire)'}
                        className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200/80 bg-white/70 text-neutral-600 shadow-2xs hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white transition cursor-pointer shrink-0"
                    >
                        {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                )}
                {title && (
                    <h1 className="truncate text-sm font-bold tracking-tight text-neutral-900 dark:text-white font-hero-sans">{title}</h1>
                )}
                <DemoBadge />
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                {extra}

                {user && !isAdminArea && page.props.notificationsUnread !== undefined && (
                    <Link
                        href={route('client.alerts.notifications')}
                        className="relative rounded-xl p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-white/70 dark:hover:bg-white/[0.06] dark:hover:text-white transition duration-150"
                        aria-label="Notifications"
                    >
                        <Bell className="h-4.5 w-4.5" />
                        {page.props.notificationsUnread > 0 && (
                            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 dark:bg-white px-1 text-[10px] font-bold text-white dark:text-black">
                                {page.props.notificationsUnread > 9 ? '9+' : page.props.notificationsUnread}
                            </span>
                        )}
                    </Link>
                )}

                {/* Theme toggle — Clean Apple/Stripe Vector SVG */}
                <button
                    type="button"
                    onClick={handleThemeToggle}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200/80 bg-white/70 text-neutral-700 shadow-2xs backdrop-blur-md transition-all duration-150 hover:border-neutral-300 hover:bg-neutral-100/80 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white cursor-pointer"
                    aria-label={t('topbar.switch_theme', 'Basculer le thème')}
                    title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                >
                    {theme === 'dark' ? (
                        <Sun className="h-4 w-4 text-neutral-100 dark:text-neutral-200 transition-transform duration-200 hover:rotate-45" />
                    ) : (
                        <Moon className="h-4 w-4 text-neutral-700 transition-transform duration-200 hover:-rotate-12" />
                    )}
                </button>

                {/* Workspace (tenant) switcher */}
                {showWorkspace && user && (
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl border border-transparent hover:border-neutral-200 dark:hover:border-white/10 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-white/80 dark:hover:bg-white/[0.05] transition duration-150 cursor-pointer"
                                aria-label={t('topbar.workspace')}
                            >
                                <Layers className="h-3.5 w-3.5 text-neutral-500 dark:text-white/60 shrink-0" />
                                <span className="hidden max-w-[130px] truncate sm:inline">
                                    {currentTenant?.name ?? t('topbar.no_workspace')}
                                </span>
                                <ChevronDown className="h-3.5 w-3.5 text-neutral-400 dark:text-white/40 shrink-0" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="56" className="bg-white dark:bg-[#0E1015] border border-neutral-200 dark:border-white/10 shadow-xl rounded-2xl p-1">
                            {tenants.length === 0 ? (
                                <Link
                                    href={route('client.tenants.index')}
                                    className="block px-3.5 py-2 text-xs font-medium text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl"
                                >
                                    {t('topbar.create_workspace')}
                                </Link>
                            ) : (
                                tenants.map((t) => (
                                    <Dropdown.Item
                                        key={t.id}
                                        as="button"
                                        onClick={() => handleTenantSwitch(t.id)}
                                        className={currentTenant?.id === t.id ? 'bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white font-semibold' : 'text-neutral-700 dark:text-white/70'}
                                    >
                                        {t.name}
                                    </Dropdown.Item>
                                ))
                            )}
                            <Dropdown.Divider />
                            <Link
                                href={route('client.tenants.index')}
                                className="block px-3.5 py-2 text-xs text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5 rounded-xl"
                            >
                                {t('topbar.manage_workspaces')}
                            </Link>
                        </Dropdown.Content>
                    </Dropdown>
                )}

                {/* Language switcher - Pure Vector SVG Flags (Zero Emojis) */}
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="group flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs backdrop-blur-md transition-all duration-150 hover:border-neutral-300 hover:bg-neutral-100/80 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:hover:border-white/20 dark:hover:bg-white/[0.08] cursor-pointer"
                            aria-label={t('topbar.language', 'Langue')}
                            title={t('topbar.language', 'Changer la langue')}
                        >
                            <FlagIcon code={currentLocale} className="h-3.5 w-5 shadow-xs" />
                            <span className="font-semibold text-neutral-800 dark:text-white/90 text-xs tracking-wider">
                                {currentLocale ? currentLocale.toUpperCase() : 'FR'}
                            </span>
                            <ChevronDown className="h-3 w-3 text-neutral-400 transition-transform duration-150 group-hover:text-neutral-600 dark:text-white/40 dark:group-hover:text-white/70 shrink-0" />
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content align="right" width="56" className="bg-white/95 dark:bg-[#0E1015]/95 backdrop-blur-xl border border-neutral-200/90 dark:border-white/10 shadow-2xl rounded-2xl p-1.5 min-w-[210px]">
                        <div className="px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
                            {t('topbar.language', 'Langue du système')}
                        </div>
                        {localeEntries.map(([code, label]) => {
                            const isSelected = currentLocale === code;
                            return (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => handleLocale(code)}
                                    className={`w-full flex items-center justify-between gap-3 px-2.5 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                                        isSelected
                                            ? 'bg-blue-50/90 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 font-semibold'
                                            : 'text-neutral-700 hover:bg-neutral-100/80 dark:text-neutral-300 dark:hover:bg-white/[0.06]'
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5 min-w-0">
                                        <FlagIcon code={code} className="h-3.5 w-5 shrink-0 shadow-xs" />
                                        <span className="truncate">{label}</span>
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                            isSelected
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200 font-bold'
                                                : 'bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400'
                                        }`}>
                                            {code.toUpperCase()}
                                        </span>
                                        {isSelected && (
                                            <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </Dropdown.Content>
                </Dropdown>

                {/* Currency switcher - Strictly EUR, USD, FCFA with premium SVG vectors */}
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="flex items-center gap-1.5 rounded-xl border border-transparent hover:border-neutral-200 dark:hover:border-white/10 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-white/80 dark:hover:bg-white/[0.05] transition duration-150 cursor-pointer"
                            aria-label={t('topbar.currency')}
                        >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-white/[0.08] dark:text-blue-300">
                                <CurrencyIcon code={currentCurrency} className="h-3.5 w-3.5" />
                            </span>
                            <span className="font-semibold">{currentCurrency === 'XOF' ? 'FCFA' : currentCurrency}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-neutral-400 dark:text-white/40 shrink-0" />
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content align="right" width="48" className="bg-white dark:bg-[#0E1015] border border-neutral-200 dark:border-white/10 shadow-xl rounded-2xl p-1.5 min-w-[200px]">
                        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-white/40 select-none">
                            {t('topbar.currency', 'Devise')}
                        </div>
                        {SUPPORTED_CURRENCIES.map((c) => {
                            const isSelected = (currentCurrency === c.code) || (currentCurrency === 'XOF' && c.code === 'FCFA');
                            return (
                                <Dropdown.Item
                                    key={c.code}
                                    as="button"
                                    onClick={() => handleCurrency(c.code)}
                                    className={[
                                        'flex items-center justify-between w-full px-2.5 py-2 rounded-xl transition-colors cursor-pointer text-xs',
                                        isSelected
                                            ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold'
                                            : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.06]'
                                    ].join(' ')}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <span className={[
                                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors',
                                            isSelected
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                                : 'bg-neutral-100 dark:bg-white/[0.06] border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-300'
                                        ].join(' ')}>
                                            <CurrencyIcon code={c.code} className="h-3.5 w-3.5" />
                                        </span>
                                        <span className="flex flex-col text-left">
                                            <span className="font-medium text-neutral-900 dark:text-white">{c.name}</span>
                                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{c.code} ({c.symbol})</span>
                                        </span>
                                    </span>
                                    {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                                </Dropdown.Item>
                            );
                        })}
                    </Dropdown.Content>
                </Dropdown>

                {/* Account menu */}
                {user && (
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl border border-transparent hover:border-neutral-200 dark:hover:border-white/10 px-2.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition duration-150 cursor-pointer"
                                aria-label={t('topbar.account')}
                            >
                                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold shadow-xs">
                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                    {kycVerified && (
                                        <BadgeCheck className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-white text-emerald-500 dark:bg-black dark:text-emerald-400" strokeWidth={2.5} aria-label="Verified" />
                                    )}
                                </span>
                                <span className="hidden max-w-[120px] truncate md:inline font-semibold">{user.name || user.email}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-neutral-400 dark:text-white/40 shrink-0" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="56" className="bg-white dark:bg-[#0E1015] border border-neutral-200 dark:border-white/10 shadow-xl rounded-2xl p-1.5">
                            <div className="px-3 py-2 border-b border-neutral-100 dark:border-white/10 mb-1">
                                <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{user.name}</p>
                                <p className="text-[11px] text-neutral-500 dark:text-white/50 truncate mt-0.5">{user.email}</p>
                            </div>
                            {accountItems.map((item, i) =>
                                item.type === 'divider' ? (
                                    <Dropdown.Divider key={i} />
                                ) : item.as === 'link' ? (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        method={item.method || 'get'}
                                        as="button"
                                        className="block w-full px-3 py-2 text-left text-xs text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition duration-150"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <Dropdown.Item key={i} as="button" onClick={item.onClick}>
                                        {item.label}
                                    </Dropdown.Item>
                                )
                            )}
                        </Dropdown.Content>
                    </Dropdown>
                )}
            </div>
        </header>
    );
}
