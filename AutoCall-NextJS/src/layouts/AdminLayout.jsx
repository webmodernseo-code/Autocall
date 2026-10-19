'use client';

import { route } from '@/lib/route';
import { Link, usePage } from '@/lib/page-router';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import SidebarBrandLink from '@/components/SidebarBrandLink';
import Topbar from '@/components/Topbar';
import FlashToast from '@/components/FlashToast';
import {
    LayoutDashboard,
    Users,
    Package,
    CreditCard,
    Cpu,
    MonitorPlay,
    Globe,
    Banknote,
    Settings,
    FileText,
    ShieldCheck,
    UserCog,
    SlidersHorizontal,
    Receipt,
    Layers,
    Coins,
    AudioLines,
    ListChecks,
    MessageSquare,
    Mail,
    Landmark,
    Bell,
    Phone,
    FileCheck,
    Contact,
    Server,
    LogOut,
    ArrowLeft,
} from 'lucide-react';

const ic = 'h-4 w-4';
const gic = 'h-4 w-4 shrink-0';

/** Grouped admin nav with localized labels and fallbacks */
const ADMIN_GROUPS = [
    {
        key: 'overview',
        labelKey: 'admin.groups.overview',
        fallback: "Vue d'ensemble",
        alwaysActive: true,
        items: [
            { labelKey: 'admin.dashboard', fallback: 'Tableau de bord', route: 'admin.dashboard', icon: LayoutDashboard },
        ],
    },
    {
        key: 'customers',
        labelKey: 'admin.groups.customers',
        fallback: 'Clients',
        icon: Users,
        alwaysActive: true,
        items: [
            { labelKey: 'admin.client_management', fallback: 'Gestion des clients', route: 'admin.clients.index', icon: Users, permission: 'view_clients' },
            { labelKey: 'admin.contacts_nav', fallback: 'Contacts', route: 'admin.contacts.index', icon: Contact, permission: 'view_clients' },
            { labelKey: 'admin.kyc_nav', fallback: 'Vérification (KYC)', route: 'admin.kyc.index', icon: FileCheck, permission: 'view_clients' },
        ],
    },
    {
        key: 'calling',
        labelKey: 'admin.groups.calling',
        fallback: 'Téléphonie',
        icon: AudioLines,
        alwaysActive: true,
        items: [
            { labelKey: 'admin.engines_nav', fallback: 'Moteurs vocaux & IA', route: 'admin.engines.index', icon: Cpu, permission: 'view_settings' },
            { labelKey: 'admin.call_monitoring', fallback: 'Surveillance des appels', route: 'admin.call-monitoring.index', icon: MonitorPlay, permission: 'view_settings' },
            { labelKey: 'admin.batch_jobs', fallback: 'Travaux par lots', route: 'admin.batch-jobs.index', icon: Layers, permission: 'view_settings' },
            { labelKey: 'admin.call_queue', fallback: "File d'attente d'appels", route: 'admin.call-queue.index', icon: ListChecks, permission: 'view_settings' },
            { labelKey: 'admin.phone_pool', fallback: 'Pool téléphonique', route: 'admin.phone-pool.index', icon: Phone, permission: 'view_settings' },
        ],
    },
    {
        key: 'billing',
        labelKey: 'admin.groups.billing',
        fallback: 'Facturation',
        icon: CreditCard,
        alwaysActive: true,
        items: [
            { labelKey: 'admin.subscriptions_nav', fallback: 'Abonnements', route: 'admin.subscriptions.index', icon: CreditCard, permission: 'view_subscriptions' },
            { labelKey: 'admin.plans_nav', fallback: 'Forfaits', route: 'admin.plans.index', icon: Package, permission: 'view_plans' },
            { labelKey: 'admin.credit_packages', fallback: 'Forfaits de crédit', route: 'admin.credit-packages.index', icon: Coins, permission: 'view_plans' },
            { labelKey: 'admin.payment_gateways', fallback: 'Passerelles de paiement', route: 'admin.payment-gateways.index', icon: Landmark, permission: 'view_payment_gateways' },
            { labelKey: 'admin.payments_nav', fallback: 'Paiements', route: 'admin.payments.index', icon: Receipt, permission: 'view_payment_gateways' },
        ],
    },
    {
        key: 'communication',
        labelKey: 'admin.groups.communication',
        fallback: 'Messagerie & Email',
        icon: MessageSquare,
        items: [
            { labelKey: 'admin.messaging', fallback: 'Messagerie (WhatsApp)', route: 'admin.messaging.index', icon: MessageSquare, permission: 'view_settings' },
            { labelKey: 'admin.email', fallback: 'Système Email (SMTP)', route: 'admin.email-system.index', icon: Mail, permission: 'view_email_settings' },
        ],
    },
    {
        key: 'localization',
        labelKey: 'admin.groups.localization',
        fallback: 'Langues & Devises',
        icon: Globe,
        items: [
            { labelKey: 'admin.currencies', fallback: 'Devises', route: 'admin.currencies.index', icon: Banknote, permission: 'view_currencies' },
            { labelKey: 'admin.languages', fallback: 'Langues', route: 'admin.locales.index', icon: Globe, permission: 'view_languages' },
        ],
    },
    {
        key: 'access_control',
        labelKey: 'admin.groups.access_control',
        fallback: 'Rôles & Accès',
        icon: ShieldCheck,
        items: [
            { labelKey: 'admin.roles_permissions', fallback: 'Rôles et autorisations', route: 'admin.roles-permissions.index', icon: ShieldCheck, permission: 'view_admin_roles', permissionAlt: 'manage_admin_roles' },
            { labelKey: 'admin.admins', fallback: 'Administrateurs', route: 'admin.admins.index', icon: UserCog, permission: 'view_admins' },
        ],
    },
    {
        key: 'system',
        labelKey: 'admin.groups.system',
        fallback: 'Système & Paramètres',
        icon: Settings,
        items: [
            { labelKey: 'admin.system_health', fallback: 'Santé du système', route: 'admin.system.index', icon: Server, permission: 'view_settings' },
            { labelKey: 'admin.general_settings', fallback: 'Paramètres généraux', route: 'admin.general-settings.index', icon: SlidersHorizontal, permission: 'view_settings' },
            { labelKey: 'admin.settings', fallback: 'Paramètres avancés', route: 'admin.settings.index', icon: Settings, permission: 'view_settings' },
            { labelKey: 'admin.social_login', fallback: 'Connexion sociale', route: 'admin.social-login.index', icon: LogIn, permission: 'view_settings' },
            { labelKey: 'admin.notifications', fallback: 'Notifications', route: 'admin.notifications.index', icon: Bell, permission: 'view_settings' },
            { labelKey: 'admin.audit_log', fallback: "Journal d'audit", route: 'admin.audit-log.index', icon: FileText, permission: 'view_settings' },
        ],
    },
];

function useAdminNav() {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const permissions = auth?.permissions ?? [];

    const tr = (key, fallback) => {
        const val = t(key);
        return val && val !== key ? val : fallback;
    };

    return useMemo(() => {
        const has = (key) => permissions.includes(key);
        return ADMIN_GROUPS
            .map((g) => ({
                type: 'group',
                key: g.key,
                label: tr(g.labelKey, g.fallback),
                variant: g.alwaysActive ? undefined : 'accent',
                alwaysActive: g.alwaysActive === true,
                icon: g.icon ? <g.icon className={gic} /> : null,
                items: g.items
                    .filter((i) => !i.permission || has(i.permission) || (i.permissionAlt && has(i.permissionAlt)))
                    .map((i) => ({
                        key: i.route || i.labelKey,
                        label: tr(i.labelKey, i.fallback),
                        route: i.route,
                        href: route(i.route),
                        icon: <i.icon className={ic} />,
                        active: () => route().current(i.route),
                    })),
            }))
            .filter((g) => g.items.length > 0);
    }, [t, permissions]);
}

function AdminLayoutFooter() {
    const { t } = useTranslation();
    const adminUser = usePage().props.auth?.adminUser;
    return (
        <div className="space-y-1">
            <Link
                href={route('login')}
                className="flex items-center gap-2 rounded-soft px-3 py-2 text-sm text-neutral-600 dark:text-ink-300 hover:bg-black/5 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white transition duration-150"
            >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span>{t('admin.back_to_client', 'Espace Client')}</span>
            </Link>
            <Link
                href={route('admin.logout')}
                method="post"
                as="button"
                className="flex w-full items-center gap-2 rounded-soft px-3 py-2 text-left rtl:text-right text-sm text-neutral-600 dark:text-ink-300 hover:bg-black/5 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white transition duration-150"
            >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>{t('nav.logout', 'Déconnexion')}</span>
            </Link>
            {adminUser && (
                <div className="px-3 py-1">
                    <p className="truncate text-xs text-neutral-400 dark:text-ink-500" title={adminUser.email}>
                        {adminUser.email}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({ title = 'Admin', header, children }) {
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('autocall_sidebar_collapsed');
            if (saved !== null) setSidebarCollapsed(saved === 'true');
        } catch {}
    }, []);

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed((prev) => {
            const next = !prev;
            try { localStorage.setItem('autocall_sidebar_collapsed', String(next)); } catch {}
            return next;
        });
    };

    const adminNav = useAdminNav();

    return (
        <div className="min-h-screen bg-[#F1F4F9] dark:bg-[#08090C] text-slate-900 dark:text-neutral-100">
            <FlashToast />
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                title={t('nav.admin', 'Administration')}
                logo={<SidebarBrandLink href={route('admin.dashboard')} ariaLabel={t('nav.admin', 'Administration')} />}
                showCreateButton={false}
                collapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
                navigationMode="drilldown"
                navGroups={adminNav}
                footer={<AdminLayoutFooter />}
            />

            <div className={cn("transition-all duration-200", sidebarCollapsed ? "lg:pl-[68px] rtl:lg:pl-0 rtl:lg:pr-[68px]" : "lg:pl-64 rtl:lg:pl-0 rtl:lg:pr-64")}>
                <Topbar
                    showLogo={false}
                    title={title}
                    onToggleSidebarCollapse={toggleSidebarCollapse}
                    isSidebarCollapsed={sidebarCollapsed}
                    showWorkspace={false}
                    showCurrency={false}
                    userNavItems={[
                        { label: t('admin.back_to_client', 'Espace Client'), href: route('login'), as: 'link' },
                        { type: 'divider' },
                        { label: t('nav.logout', 'Déconnexion'), href: route('admin.logout'), method: 'post', as: 'link' },
                    ]}
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    {header && typeof header === 'object' && (
                        <div className="mb-6">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>

            <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-soft-lg bg-white dark:bg-neutral-900 border border-soft border-gray-200 dark:border-neutral-800 shadow-soft-lg text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:hidden rtl:right-auto rtl:left-4"
                aria-label={t('open_menu', 'Ouvrir le menu')}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
    );
}
