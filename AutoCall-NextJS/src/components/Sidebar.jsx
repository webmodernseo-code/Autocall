'use client';

import { route } from '@/lib/route';
import { Link, router, usePage } from '@/lib/page-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Client-side memory survives the page-level loading boundary. Without it,
// remounting the sidebar during a navigation briefly (or permanently for an
// unrecognised route) sent users back to the list of sections.
let rememberedDrilldownGroupKey = null;

function itemIsActive(item) {
    if (typeof item.active === 'function') return item.active();
    if (item.route) return route().current(item.route);
    return false;
}

// Exact reference design: Soft azure capsule with vibrant cobalt text/icon and curved left blue stroke
const ACTIVE = 'bg-[#EFF6FF] text-blue-600 border border-blue-200/90 shadow-2xs dark:bg-blue-600/15 dark:border-blue-500/35 dark:text-blue-400 font-semibold';
const INACTIVE = 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-[#8E95A5] dark:hover:text-white dark:hover:bg-white/[0.04] border border-transparent font-medium';

function NavIcon({ icon, isActive }) {
    if (!icon) return null;
    return (
        <span
            className={[
                'flex h-5 w-5 shrink-0 items-center justify-center transition-colors [&>svg]:h-4.5 [&>svg]:w-4.5',
                isActive
                    ? 'text-blue-600 dark:text-blue-400 [&>svg]:stroke-[2.25]'
                    : 'text-neutral-500 group-hover:text-neutral-900 dark:text-[#9AA0AE] dark:group-hover:text-white [&>svg]:stroke-[1.9]'
            ].join(' ')}
        >
            {icon}
        </span>
    );
}

function NavItemLink({ item, onClose, className }) {
    const isActive = itemIsActive(item);
    const href = item.href ?? (item.route ? route(item.route) : '#');

    return (
        <Link
            href={href}
            prefetch={true}
            onMouseEnter={() => router.prefetch(href)}
            onFocus={() => router.prefetch(href)}
            onClick={onClose}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm transition duration-150',
                isActive ? ACTIVE : INACTIVE,
                className,
            )}
        >
            {isActive && (
                <span className="absolute inset-y-0 left-0 w-[3.5px] rounded-l-2xl bg-blue-600 dark:bg-blue-400" />
            )}
            <NavIcon icon={item.icon} isActive={isActive} />
            <span className="truncate">{item.label}</span>
        </Link>
    );
}

function NavGroup({ label, items, onClose, icon, variant = 'default', alwaysActive = false, suppressHeader = false, groupKey, manualOpenKey, setManualOpenKey }) {
    const isAccent = variant === 'accent';
    const hasActiveChild = items.some(itemIsActive);
    const open = alwaysActive || hasActiveChild || manualOpenKey === groupKey;

    const headerClassName = 'flex w-full items-center justify-between gap-2 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-150 select-none text-neutral-400 hover:text-neutral-700 dark:text-white/40 dark:hover:text-white/70';

    const headerInner = (
        <>
            <span className="flex min-w-0 flex-1 items-center gap-2">
                {icon && <span className="shrink-0 text-neutral-400 dark:text-white/40">{icon}</span>}
                <span className="truncate">{label}</span>
            </span>
            {!alwaysActive && (
                <ChevronDown className={['h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-neutral-400 dark:text-white/40', open ? 'rotate-0' : '-rotate-90'].join(' ')} />
            )}
        </>
    );

    return (
        <div className="mb-2">
            {!suppressHeader && (alwaysActive ? (
                <div className={headerClassName}>{headerInner}</div>
            ) : (
                <button
                    type="button"
                    onClick={() => { if (hasActiveChild) return; setManualOpenKey((c) => (c === groupKey ? null : groupKey)); }}
                    className={[headerClassName, 'w-full text-left cursor-pointer'].join(' ')}
                    aria-expanded={open}
                    aria-label={label}
                >
                    {headerInner}
                </button>
            ))}

            {open && (
                <div className={[suppressHeader ? 'space-y-1' : 'mt-0.5 space-y-1', isAccent ? 'ml-2 border-l border-neutral-200/80 dark:border-white/[0.08] pl-2.5' : ''].join(' ')}>
                    {items.map((item, i) => {
                        const isActive = itemIsActive(item);
                        return (
                            <Link
                                key={item.key ?? item.route ?? item.href ?? i}
                                href={item.href ?? (item.route ? route(item.route) : '#')}
                                onClick={onClose}
                                className={[
                                    'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm transition duration-150',
                                    isActive ? ACTIVE : INACTIVE
                                ].join(' ')}
                            >
                                {isActive && (
                                    <span className="absolute left-0 inset-y-0 w-[3.5px] rounded-l-2xl bg-blue-600 dark:bg-blue-400" />
                                )}
                                <NavIcon icon={item.icon} isActive={isActive} />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function Sidebar({ navItems = [], navGroups = [], open = false, onClose, footer, title, logo, navigationMode = 'accordion' }) {
    const { t } = useTranslation();
    const { url } = usePage();
    const [manualOpenKey, setManualOpenKey] = useState(null);
    const [selectedGroupKey, setSelectedGroupKey] = useState(() => rememberedDrilldownGroupKey);
    const menuTitle = title ?? t('sidebar.menu');

    useEffect(() => { setManualOpenKey(null); }, [url]);

    const isDrilldown = navigationMode === 'drilldown' && navGroups.length > 0;
    const pinnedGroup = isDrilldown ? navGroups[0] : null;
    const drilldownGroups = isDrilldown ? navGroups.slice(1) : [];
    const activeDrilldownGroupIndex = drilldownGroups.findIndex((group) => group.items?.some(itemIsActive));
    const activeDrilldownGroupKey = activeDrilldownGroupIndex >= 0 ? `drilldown-g-${activeDrilldownGroupIndex}` : null;
    const visibleGroupKey = selectedGroupKey;
    const selectedGroupIndex = visibleGroupKey?.startsWith('drilldown-g-')
        ? Number(visibleGroupKey.replace('drilldown-g-', ''))
        : -1;
    const selectedGroup = selectedGroupIndex >= 0 ? drilldownGroups[selectedGroupIndex] : null;
    const prefetchGroup = (group) => {
        for (const item of group?.items ?? []) {
            const href = item.href ?? (item.route ? route(item.route) : null);
            if (href) router.prefetch(href);
        }
    };

    useEffect(() => {
        if (!isDrilldown) return;
        if (activeDrilldownGroupKey) {
            rememberedDrilldownGroupKey = activeDrilldownGroupKey;
            setSelectedGroupKey(activeDrilldownGroupKey);
            return;
        }

        // Only the explicit dashboard destination returns to the section list.
        // A transient/unknown route must not discard the user's current group.
        if (route().current('client.dashboard')) {
            rememberedDrilldownGroupKey = null;
            setSelectedGroupKey(null);
        }
    }, [url, isDrilldown, activeDrilldownGroupKey]);

    const content = (
        <aside className="sidebar flex h-full w-64 flex-col bg-[#F8F9FC] dark:bg-[#0E1017] border-r border-neutral-200/90 dark:border-white/[0.07] shadow-[1px_0_8px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors duration-200">
            {/* Brand Header */}
            <div className="flex h-16 shrink-0 items-center border-b border-neutral-200/80 dark:border-white/[0.07] px-4 bg-white/70 dark:bg-transparent backdrop-blur-md">
                {logo || <span className="font-hero-sans font-bold text-sm tracking-tight text-neutral-900 dark:text-white">{menuTitle}</span>}
            </div>

            {/* Navigation scrollable */}
            <nav className="sidebar-scroll sidebar-fade flex-1 overflow-y-auto px-3 py-3 space-y-1">
                {isDrilldown && (
                    <div className="space-y-3">
                        <div className="space-y-1">
                            {(pinnedGroup?.items ?? []).map((item, index) => (
                                <NavItemLink
                                    key={item.key ?? item.route ?? item.href ?? index}
                                    item={item}
                                    onClose={onClose}
                                />
                            ))}
                        </div>

                        <div className="border-t border-neutral-200/80 pt-3 dark:border-white/[0.07]">
                            {selectedGroup ? (
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            rememberedDrilldownGroupKey = null;
                                            setSelectedGroupKey(null);
                                        }}
                                        className="group flex min-h-11 w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white dark:hover:bg-white/[0.05]"
                                        aria-label={t('sidebar.back_to_sections', 'Retour aux rubriques')}
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 shadow-2xs transition group-hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:group-hover:text-white">
                                            <ArrowLeft className="h-4 w-4" />
                                        </span>
                                        <span className="min-w-0 truncate">{selectedGroup.label}</span>
                                    </button>

                                    <div className="space-y-1" aria-label={selectedGroup.label}>
                                        {(selectedGroup.items ?? []).map((item, index) => (
                                            <NavItemLink
                                                key={item.key ?? item.route ?? item.href ?? index}
                                                item={item}
                                                onClose={onClose}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1" aria-label={t('sidebar.sections', 'Rubriques')}>
                                    <p className="px-3.5 pb-1 text-[11px] font-semibold tracking-wide text-neutral-400 dark:text-white/40">
                                        {t('sidebar.sections', 'Rubriques')}
                                    </p>
                                    {drilldownGroups.map((group, index) => {
                                        const groupKey = `drilldown-g-${index}`;
                                        return (
                                            <button
                                                key={groupKey}
                                                type="button"
                                                onMouseEnter={() => prefetchGroup(group)}
                                                onFocus={() => prefetchGroup(group)}
                                                onClick={() => {
                                                    prefetchGroup(group);
                                                    rememberedDrilldownGroupKey = groupKey;
                                                    setSelectedGroupKey(groupKey);
                                                }}
                                                className="group flex min-h-11 w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-2.5 text-left text-sm font-medium text-neutral-600 transition hover:border-neutral-200/80 hover:bg-white hover:text-neutral-900 hover:shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-[#A4AABA] dark:hover:border-white/[0.08] dark:hover:bg-white/[0.04] dark:hover:text-white"
                                                aria-label={`${group.label}, ${(group.items ?? []).length} options`}
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-white/[0.05] dark:text-neutral-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
                                                    {group.icon}
                                                </span>
                                                <span className="min-w-0 flex-1 truncate">{group.label}</span>
                                                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-500 dark:text-white/20 dark:group-hover:text-white/50" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!isDrilldown && navGroups.length > 0 && navGroups.map((group, gi) => {
                    const groupKey = `nav-g-${gi}`;
                    return (
                        <NavGroup
                            key={groupKey}
                            groupKey={groupKey}
                            manualOpenKey={manualOpenKey}
                            setManualOpenKey={setManualOpenKey}
                            label={group.label}
                            items={group.items ?? []}
                            onClose={onClose}
                            icon={group.icon}
                            variant={group.variant ?? 'default'}
                            alwaysActive={group.alwaysActive === true}
                            suppressHeader={group.suppressHeader === true}
                        />
                    );
                })}

                {navGroups.length === 0 && navItems.map((item, i) => {
                    if (item.type === 'divider') return <hr key={`div-${i}`} className="my-2 border-neutral-200/70 dark:border-white/[0.07]" />;
                    const isActive = typeof item.active === 'function' ? item.active() : item.active ?? (item.route && route().current(item.route));
                    return (
                    <Link
                        key={item.key ?? item.route ?? item.href ?? i}
                            href={item.href ?? (item.route ? route(item.route) : '#')}
                        onClick={onClose}
                        aria-current={isActive ? 'page' : undefined}
                            className={[
                                'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm transition duration-150 mb-0.5',
                                isActive ? ACTIVE : INACTIVE
                            ].join(' ')}
                        >
                            {isActive && (
                                <span className="absolute left-0 inset-y-0 w-[3.5px] rounded-l-2xl bg-blue-600 dark:bg-blue-400" />
                            )}
                            <NavIcon icon={item.icon} isActive={isActive} />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {footer && (
                <div className="shrink-0 border-t border-neutral-200/80 dark:border-white/[0.07] p-3 bg-neutral-100/50 dark:bg-white/[0.01]">
                    {footer}
                </div>
            )}
        </aside>
    );

    return (
        <>
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
                {content}
            </div>

            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
                    <div className="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl">
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}
