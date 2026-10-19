'use client';

import { route } from '@/lib/route';
import { Link, router, usePage } from '@/lib/page-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import ApplicationLogo from '@/components/ApplicationLogo';

// Client-side memory survives the page-level loading boundary. Without it,
// remounting the sidebar during a navigation briefly (or permanently for an
// unrecognised route) sent users back to the list of sections.
let rememberedDrilldownGroupKey = null;
let rememberedOptimisticHref = null;

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

function normalizePath(p) {
    if (!p || typeof p !== 'string') return '';
    return p.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
}

function checkItemActive(item, optimisticHref) {
    const href = item.href ?? (item.route ? route(item.route) : '#');
    if (optimisticHref) {
        if (normalizePath(optimisticHref) === normalizePath(href)) return true;
        return false;
    }
    return itemIsActive(item);
}

function NavItemLink({ item, onClose, onNavigate, optimisticHref, className, collapsed = false }) {
    const href = item.href ?? (item.route ? route(item.route) : '#');
    const isActive = checkItemActive(item, optimisticHref);

    const triggerOptimistic = () => {
        if (href && href !== '#') {
            onNavigate?.(href);
            router.prefetch(href);
        }
    };

    return (
        <Link
            href={href}
            prefetch={true}
            title={item.label}
            onMouseEnter={() => router.prefetch(href)}
            onFocus={() => router.prefetch(href)}
            onPointerDown={triggerOptimistic}
            onMouseDown={triggerOptimistic}
            onTouchStart={triggerOptimistic}
            onClick={(event) => {
                triggerOptimistic();
                onClose?.(event);
            }}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                'group relative flex items-center overflow-hidden rounded-2xl transition-all duration-75',
                collapsed ? 'h-10 w-10 mx-auto justify-center p-0' : 'gap-3 px-3.5 py-2.5 text-xs sm:text-sm',
                isActive ? ACTIVE : INACTIVE,
                className,
            )}
        >
            {isActive && (
                <span className={cn(
                    'absolute bg-blue-600 dark:bg-blue-400',
                    collapsed ? 'inset-x-2 bottom-0 h-[2.5px] rounded-full' : 'inset-y-0 left-0 w-[3.5px] rounded-l-2xl'
                )} />
            )}
            <NavIcon icon={item.icon} isActive={isActive} />
            {!collapsed && <span className="truncate">{item.label}</span>}
        </Link>
    );
}

function NavGroup({ label, items, onClose, icon, variant = 'default', alwaysActive = false, suppressHeader = false, groupKey, manualOpenKey, setManualOpenKey, onNavigate, optimisticHref, collapsed = false, onExpand = null }) {
    const hasActiveChild = items.some((item) => checkItemActive(item, optimisticHref));
    const open = alwaysActive || hasActiveChild || manualOpenKey === groupKey;

    if (collapsed) {
        return (
            <div className="mb-2 space-y-1.5" title={label}>
                {items.map((item, index) => (
                    <NavItemLink
                        key={item.key ?? item.route ?? item.href ?? index}
                        item={item}
                        onClose={onClose}
                        onNavigate={onNavigate}
                        optimisticHref={optimisticHref}
                        collapsed={true}
                    />
                ))}
            </div>
        );
    }

    const headerClassName = 'flex w-full items-center justify-between gap-2 px-3.5 py-2 text-xs font-bold normal-case tracking-wider transition-colors duration-150 select-none text-neutral-400 hover:text-neutral-700 dark:text-white/40 dark:hover:text-white/70';

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
                    onClick={() => {
                        const next = open ? null : groupKey;
                        setManualOpenKey(next);
                    }}
                    className={cn(headerClassName, 'cursor-pointer rounded-xl hover:bg-neutral-100/50 dark:hover:bg-white/[0.02]')}
                    aria-expanded={open}
                >
                    {headerInner}
                </button>
            ))}

            {open && (
                <div className="mt-1 space-y-1 pl-1">
                    {items.map((item, index) => (
                        <NavItemLink
                            key={item.key ?? item.route ?? item.href ?? index}
                            item={item}
                            onClose={onClose}
                            onNavigate={onNavigate}
                            optimisticHref={optimisticHref}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Sidebar({
    open,
    onClose,
    title: menuTitle = 'Menu',
    logo = null,
    showCreateButton = true,
    createButtonHref = route('client.calls.index'),
    createButtonLabel,
    footer = null,
    navGroups = [],
    navItems = [],
    navigationMode = 'default',
    collapsed = false,
    onToggleCollapse = null,
}) {
    const { t } = useTranslation();
    const { url } = usePage();
    const [manualOpenKey, setManualOpenKey] = useState(null);
    const [selectedGroupKey, setSelectedGroupKey] = useState(rememberedDrilldownGroupKey);
    const [optimisticHref, setOptimisticHref] = useState(rememberedOptimisticHref);

    useEffect(() => {
        rememberedOptimisticHref = null;
        setOptimisticHref(null);
    }, [url]);

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
    const markNavigationActive = (href) => {
        rememberedOptimisticHref = href;
        setOptimisticHref(href);
    };

    useEffect(() => {
        if (!isDrilldown) return;
        if (activeDrilldownGroupKey) {
            rememberedDrilldownGroupKey = activeDrilldownGroupKey;
            setSelectedGroupKey(activeDrilldownGroupKey);
            return;
        }

        if (route().current('client.dashboard') || route().current('admin.dashboard')) {
            rememberedDrilldownGroupKey = null;
            setSelectedGroupKey(null);
        }
    }, [url, isDrilldown, activeDrilldownGroupKey]);

    const content = (
        <aside className={cn(
            'sidebar flex h-full flex-col bg-[#F8F9FC] dark:bg-[#0E1017] border-r border-slate-200/90 dark:border-white/[0.07] shadow-[1px_0_8px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-200',
            collapsed ? 'w-[68px]' : 'w-64'
        )}>
            {/* Brand Header */}
            <div className={cn(
                'flex h-16 shrink-0 items-center border-b border-slate-200/80 dark:border-white/[0.07] bg-white/70 dark:bg-transparent backdrop-blur-md transition-all',
                collapsed ? 'justify-center px-2' : 'justify-between px-4'
            )}>
                {!collapsed ? (
                    <>
                        <div className="min-w-0 flex-1 truncate">
                            {logo || <span className="font-hero-sans font-bold text-sm tracking-tight text-neutral-900 dark:text-white">{menuTitle}</span>}
                        </div>
                        {onToggleCollapse && (
                            <button
                                type="button"
                                onClick={onToggleCollapse}
                                title="Replier le menu (Réduire)"
                                aria-label="Replier le menu"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.08] dark:hover:text-white transition cursor-pointer"
                            >
                                <PanelLeftClose className="h-4 w-4" />
                            </button>
                        )}
                    </>
                ) : (
                    onToggleCollapse ? (
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            title="Déplier le menu (Agrandir)"
                            aria-label="Déplier le menu"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition cursor-pointer shadow-2xs"
                        >
                            <PanelLeftOpen className="h-4.5 w-4.5" />
                        </button>
                    ) : (
                        <ApplicationLogo className="h-7 w-7" />
                    )
                )}
            </div>

            {/* Navigation scrollable */}
            <nav className={cn(
                'sidebar-scroll sidebar-fade flex-1 overflow-y-auto space-y-1',
                collapsed ? 'px-2 py-3' : 'px-3 py-3'
            )}>
                {/* 1. Mode Replié Compact : Affiche les icônes centrées avec infobulles */}
                {collapsed ? (
                    <div className="space-y-3">
                        {/* Pinned (Tableau de bord) */}
                        <div className="space-y-1">
                            {(pinnedGroup?.items ?? []).map((item, index) => (
                                <NavItemLink
                                    key={item.key ?? item.route ?? item.href ?? index}
                                    item={item}
                                    onClose={onClose}
                                    onNavigate={markNavigationActive}
                                    optimisticHref={optimisticHref}
                                    collapsed={true}
                                />
                            ))}
                        </div>

                        <div className="border-t border-slate-200/80 pt-2 dark:border-white/[0.07] space-y-1.5">
                            {drilldownGroups.map((group, index) => {
                                const groupKey = `drilldown-g-${index}`;
                                const isGroupActive = group.items?.some((i) => checkItemActive(i, optimisticHref));
                                return (
                                    <button
                                        key={groupKey}
                                        type="button"
                                        title={group.label}
                                        aria-label={group.label}
                                        onClick={() => {
                                            if (onToggleCollapse) onToggleCollapse();
                                            setSelectedGroupKey(groupKey);
                                        }}
                                        className={cn(
                                            'flex h-10 w-10 mx-auto items-center justify-center rounded-2xl transition cursor-pointer',
                                            isGroupActive
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'text-neutral-500 hover:bg-white hover:text-blue-600 dark:text-[#A4AABA] dark:hover:bg-white/[0.05] dark:hover:text-white'
                                        )}
                                    >
                                        {group.icon}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* 2. Mode Déplié Standard (Largeur 256px) */
                    isDrilldown ? (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                {(pinnedGroup?.items ?? []).map((item, index) => (
                                    <NavItemLink
                                        key={item.key ?? item.route ?? item.href ?? index}
                                        item={item}
                                        onClose={onClose}
                                        onNavigate={markNavigationActive}
                                        optimisticHref={optimisticHref}
                                    />
                                ))}
                            </div>

                            <div className="border-t border-slate-200/80 pt-3 dark:border-white/[0.07]">
                                {selectedGroup ? (
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                rememberedDrilldownGroupKey = null;
                                                setSelectedGroupKey(null);
                                            }}
                                            className="group flex min-h-11 w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white dark:hover:bg-white/[0.05] cursor-pointer"
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
                                                    onNavigate={markNavigationActive}
                                                    optimisticHref={optimisticHref}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1" aria-label={t('sidebar.sections', 'Rubriques')}>
                                        <p className="px-3.5 pb-1 text-xs font-semibold tracking-wide text-neutral-400 dark:text-white/40">
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
                                                    className="group flex min-h-11 w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-2.5 text-left text-sm font-medium text-neutral-600 transition hover:border-slate-200/80 hover:bg-white hover:text-neutral-900 hover:shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-[#A4AABA] dark:hover:border-white/[0.08] dark:hover:bg-white/[0.04] dark:hover:text-white cursor-pointer"
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
                    ) : (
                        navGroups.length > 0 && navGroups.map((group, gi) => {
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
                                    onNavigate={markNavigationActive}
                                    optimisticHref={optimisticHref}
                                    icon={group.icon}
                                    variant={group.variant ?? 'default'}
                                    alwaysActive={group.alwaysActive === true}
                                    suppressHeader={group.suppressHeader === true}
                                />
                            );
                        })
                    )
                )}
            </nav>

            {/* Footer */}
            {footer && (
                <div className={cn(
                    'shrink-0 border-t border-slate-200/80 dark:border-white/[0.07] bg-neutral-100/50 dark:bg-white/[0.01] transition-all',
                    collapsed ? 'p-2 flex flex-col items-center justify-center' : 'p-3'
                )}>
                    {collapsed ? (
                        <Link
                            href={(() => { try { if (route().current('admin.*')) return route('admin.logout'); } catch {} return route('logout'); })()}
                            method="post"
                            as="button"
                            title={t('nav.logout', 'Déconnexion')}
                            aria-label={t('nav.logout', 'Déconnexion')}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-rose-50 hover:text-rose-600 dark:text-neutral-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition cursor-pointer"
                        >
                            <LogOut className="h-4.5 w-4.5" />
                        </Link>
                    ) : (
                        footer
                    )}
                </div>
            )}
        </aside>
    );

    return (
        <>
            <div className={cn(
                'hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-200',
                collapsed ? 'lg:w-[68px]' : 'lg:w-64'
            )}>
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
