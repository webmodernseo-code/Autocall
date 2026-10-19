'use client';

import { route } from '@/lib/route';
import { usePage, router } from '@/lib/page-router';
import SidebarBrandLink from '@/components/SidebarBrandLink';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import Topbar from '@/components/Topbar'; // Will be updated during folder move
import Sidebar from '@/components/Sidebar';
import FlashToast from '@/components/FlashToast';
import { Link } from '@/lib/page-router';
import { PhoneCall, LogOut } from 'lucide-react';

function CreditChip({ credits }) {
    if (credits === null || credits === undefined) return null;
    return (
        <Link
            href={route('client.billing.index')}
            className="flex items-center gap-1.5 rounded-soft border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 px-2.5 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition"
            title="Calling credits"
        >
            <PhoneCall className="h-4 w-4" />
            <span className="font-mono tabular-nums">{Number(credits).toLocaleString()}</span>
        </Link>
    );
}
import {
    LayoutDashboard,
    CreditCard,
    Package,
    FileText,
    Users,
    Settings,
    User,
    ShoppingCart,
    ClipboardList,
    Zap,
    UserPlus,
    ShieldCheck,
    Smartphone,
    Server,
    Cpu,
    RefreshCw,
    Map,
    MapPin,
    Megaphone,
    Ticket,
    Gift,
    Headphones,
    LifeBuoy,
    Wallet,
    Tag,
    Landmark,
    BarChart3,
    TrendingUp,
    Bot,
    AudioLines,
    BookOpen,
    Contact,
    Phone,
    Cable,
    Mail,
    MessageCircle,
    Inbox,
    Code2,
    Network,
    FileCheck,
    Bell,
    Workflow,
    ListChecks,
    LayoutTemplate,
    Wrench,
    ClipboardList as ClipboardListIcon,
    CalendarClock,
    Globe as GlobeIcon,
    KanbanSquare,
    PhoneIncoming,
    Table as TableIcon,
    Layers,
    Building2,
} from 'lucide-react';

const iconClass = 'h-4 w-4';

function useClientNav() {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const user = auth?.user;
    const isClientAdmin = user?.client_role === 'administrator';
    const perms = auth?.clientPermissions ?? ['*'];
    const can = (k) => perms.includes('*') || perms.includes(k);
    const tr = (key, fallback) => (t(key) !== key ? t(key) : fallback);
    const gi = 'h-4 w-4 shrink-0';

    const groups = [
        {
            key: 'overview',
            label: tr('nav.overview', 'Accueil'),
            alwaysActive: true,
            icon: <LayoutDashboard className={gi} />,
            items: [
                { label: tr('nav.dashboard', 'Tableau de bord'), href: route('client.dashboard'), icon: <LayoutDashboard className={iconClass} />, route: 'client.dashboard' },
            ],
        },
        {
            key: 'calling',
            label: tr('nav.calling', 'Appels'),
            icon: <PhoneCall className={gi} />,
            items: [
                { label: tr('nav.campaigns', 'Campagnes'), href: route('client.campaigns.index'), icon: <Megaphone className={iconClass} />, route: 'client.campaigns.*' },
                { label: tr('nav.calls', 'Historique des appels'), href: route('client.calls.index'), icon: <PhoneCall className={iconClass} />, route: 'client.calls.*' },
                { label: tr('nav.appointments', 'Rendez-vous'), href: route('client.appointments.index'), icon: <CalendarClock className={iconClass} />, route: 'client.appointments.*' },
                { label: tr('nav.phone_numbers', 'Numéros de téléphone'), href: route('client.phone-numbers.index'), icon: <Phone className={iconClass} />, route: 'client.phone-numbers.*' },
            ],
        },
        {
            key: 'agents',
            label: tr('nav.agents_section', 'Agents IA'),
            icon: <Bot className={gi} />,
            items: [
                { label: tr('nav.agents', 'Agents'), href: route('client.agents.index'), icon: <Bot className={iconClass} />, route: 'client.agents.*' },
                { label: tr('nav.voices', 'Voix'), href: route('client.voices.index'), icon: <AudioLines className={iconClass} />, route: 'client.voices.*' },
                { label: tr('nav.prompt_templates', 'Modèles d’instructions'), href: route('client.prompt-templates.index'), icon: <BookOpen className={iconClass} />, route: 'client.prompt-templates.*' },
            ],
        },
        {
            key: 'contacts',
            label: tr('nav.contacts_section', 'Contacts'),
            icon: <Contact className={gi} />,
            items: [
                { label: tr('nav.contacts', 'Contacts'), href: route('client.contacts.index'), icon: <Contact className={iconClass} />, route: 'client.contacts.*' },
                { label: tr('nav.quick_crm', 'Pipeline commercial'), href: route('client.crm.board'), icon: <KanbanSquare className={iconClass} />, route: 'client.crm.*' },
                { label: tr('nav.forms', 'Formulaires'), href: route('client.forms.index'), icon: <ClipboardListIcon className={iconClass} />, route: 'client.forms.*' },
            ],
        },
        {
            key: 'messaging',
            label: tr('nav.messaging', 'Messages'),
            icon: <MessageCircle className={gi} />,
            items: [
                { label: tr('nav.conversations', 'Conversations'), href: route('client.conversations.index'), icon: <Inbox className={iconClass} />, route: 'client.conversations.*' },
                { label: 'WhatsApp', href: route('client.messaging.whatsapp.index'), icon: <MessageCircle className={iconClass} />, route: 'client.messaging.whatsapp.*' },
                { label: tr('nav.email_templates', 'Modèles d\'e-mails'), href: route('client.messaging.email-templates.index'), icon: <Mail className={iconClass} />, route: 'client.messaging.email-templates.*' },
            ],
        },
        {
            key: 'automation',
            label: tr('nav.automation', 'Automatisation'),
            icon: <Workflow className={gi} />,
            items: [
                { label: tr('nav.flows', 'Automatisations'), href: route('client.flows.index'), icon: <Workflow className={iconClass} />, route: 'client.flows.index' },
                { label: tr('nav.flow_templates', 'Modèles de flux'), href: route('client.flows.templates'), icon: <LayoutTemplate className={iconClass} />, route: 'client.flows.templates' },
                { label: tr('nav.flow_executions', 'Historique des automatisations'), href: route('client.flows.executions.index'), icon: <ListChecks className={iconClass} />, route: 'client.flows.executions.*' },
                { label: tr('nav.integrations', 'Intégrations'), href: route('client.integrations.index'), icon: <Zap className={iconClass} />, route: 'client.integrations.*' },
            ],
        },
        {
            key: 'analytics',
            label: tr('nav.analytics_section', 'Analyses'),
            icon: <BarChart3 className={gi} />,
            items: [
                { label: tr('nav.analytics', 'Vue d’ensemble'), href: route('client.analytics.index'), icon: <BarChart3 className={iconClass} />, route: 'client.analytics.*' },
                { label: tr('nav.analytics_reports', 'Rapports détaillés'), href: route('client.reporting.analytics'), icon: <TrendingUp className={iconClass} />, route: 'client.reporting.analytics' },
            ],
        },
        {
            key: 'settings',
            label: tr('nav.settings_section', 'Paramètres'),
            icon: <Settings className={gi} />,
            items: [
                { label: tr('nav.profile', 'Profil & Organisation'), href: route('client.profile.edit'), icon: <User className={iconClass} />, route: 'client.profile.edit' },
                ...(isClientAdmin ? [
                    { label: tr('nav.team', 'Équipe'), href: route('client.team.index'), icon: <Users className={iconClass} />, route: 'client.team.*' },
                ] : []),
                { label: tr('nav.billing', 'Facturation & Crédits'), href: route('client.billing.index'), icon: <Wallet className={iconClass} />, route: 'client.billing.index', permission: 'billing.read' },
                { label: tr('nav.plans', 'Forfaits'), href: route('client.pricing'), icon: <Package className={iconClass} />, route: 'client.pricing' },
                { label: tr('nav.subscription', 'Abonnement'), href: route('client.subscription.show'), icon: <CreditCard className={iconClass} />, route: 'client.subscription.show' },
                { label: tr('nav.notifications', 'Notifications'), href: route('client.alerts.notifications'), icon: <Bell className={iconClass} />, route: 'client.alerts.notifications' },
                { label: tr('nav.settings', 'Préférences'), href: route('client.settings.index'), icon: <Settings className={iconClass} />, route: 'client.settings.index' },
                { label: tr('nav.verification', 'Vérification (KYC)'), href: route('client.kyc.index'), icon: <FileCheck className={iconClass} />, route: 'client.kyc.*' },
                { label: tr('nav.support', 'Assistance & Support'), href: route('client.support-system.support'), icon: <LifeBuoy className={iconClass} />, route: 'client.support-system.support' },
            ],
        },
        {
            key: 'advanced',
            label: tr('nav.advanced', 'Avancé'),
            icon: <Code2 className={gi} />,
            items: [
                { label: tr('nav.api_keys', 'Clés API'), href: route('client.api-keys.index'), icon: <Code2 className={iconClass} />, route: 'client.api-keys.*' },
                { label: tr('nav.sip', 'Connexion SIP'), href: route('client.sip.index'), icon: <Cable className={iconClass} />, route: 'client.sip.*' },
                { label: tr('nav.incoming_connections', 'Appels entrants'), href: route('client.incoming-connections.index'), icon: <PhoneIncoming className={iconClass} />, route: 'client.incoming-connections.*' },
                { label: tr('nav.google_sheets', 'Google Sheets'), href: route('client.google-sheets.index'), icon: <TableIcon className={iconClass} />, route: 'client.google-sheets.*' },
                { label: tr('nav.knowledge_base', 'Base de connaissances'), href: route('client.knowledge-base.index'), icon: <BookOpen className={iconClass} />, route: 'client.knowledge-base.*' },
                ...(isClientAdmin ? [
                    { label: tr('nav.audit_log', 'Journal d\'audit'), href: route('client.audit-log.index'), icon: <FileText className={iconClass} />, route: 'client.audit-log.index' },
                ] : []),
                { label: tr('nav.website_widget', 'Widget Web'), href: route('client.website-widget.index'), icon: <GlobeIcon className={iconClass} />, route: 'client.website-widget.*' },
                { label: tr('nav.tenants', 'Multi-espaces'), href: route('client.tenants.index'), icon: <Layers className={iconClass} />, route: 'client.tenants.*' },
            ],
        },
    ];

    return groups
        .filter((g) => !g.adminOnly || isClientAdmin)
        .map((g) => ({ type: 'group', ...g, items: g.items.filter((i) => !i.permission || can(i.permission)) }))
        .filter((g) => g.items.length > 0);
}

export default function ClientLayout({ title = 'Dashboard', header, children }) {
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
    const { auth, impersonation, credits } = usePage().props;
    const user = auth?.user;
    const clientNavGroups = useClientNav();

    const returnToAdmin = () => {
        router.post(impersonation?.returnUrl ?? route('admin.impersonation.stop'));
    };


    return (
        <div className="min-h-screen bg-[#F1F4F9] dark:bg-[#08090C] text-slate-900 dark:text-neutral-100">
            <FlashToast />
            {impersonation?.active && (
                <div className="flex items-center justify-between gap-4 bg-amber-500/90 text-white px-4 py-2 text-sm font-medium">
                    <span>{t('impersonation.impersonating', { name: impersonation.clientName })}</span>
                    <button
                        type="button"
                        onClick={returnToAdmin}
                        className="rounded-soft bg-white/20 px-3 py-1.5 font-medium hover:bg-white/30 transition"
                    >
                        {t('impersonation.return_to_admin')}
                    </button>
                </div>
            )}
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                title={t('client.panel')}
                logo={<SidebarBrandLink href={route('client.dashboard')} ariaLabel={t('client.panel')} />}
                showCreateButton={false}
                collapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
                navigationMode="default"
                navGroups={clientNavGroups.map(group => ({
                    ...group,
                    items: group.items.map(item => ({
                        ...item,
                        key: item.route || item.label,
                        active: () => item.route ? route().current(item.route) : false,
                    }))
                }))}
                footer={
                    <div className="space-y-1">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-2 rounded-soft px-3 py-2 text-left rtl:text-right text-sm text-ink-300 hover:bg-white/[0.06] hover:text-white transition duration-150"
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            {t('nav.logout')}
                        </Link>
                        {user && (
                            <div className="px-3 py-1">
                                {user.name && <p className="truncate text-sm font-medium text-white" title={user.name}>{user.name}</p>}
                                <p className="truncate text-xs text-ink-500" title={user.email}>{user.email}</p>
                            </div>
                        )}
                    </div>
                }
            />

            <div className={cn("transition-all duration-200", sidebarCollapsed ? "lg:pl-[68px] rtl:lg:pl-0 rtl:lg:pr-[68px]" : "lg:pl-64 rtl:lg:pl-0 rtl:lg:pr-64")}>
                <Topbar
                    showLogo={false}
                    title={title}
                    onToggleSidebarCollapse={toggleSidebarCollapse}
                    isSidebarCollapsed={sidebarCollapsed}
                    extra={<CreditChip credits={credits} />}
                    userNavItems={[
                        { label: t('nav.profile'), href: route('client.profile.edit'), as: 'link' },
                        { type: 'divider' },
                        { label: t('nav.logout'), href: route('logout'), method: 'post', as: 'link' },
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

            {/* Mobile menu button */}
            <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-soft-lg bg-white dark:bg-neutral-900 border border-soft border-gray-200 dark:border-neutral-800 shadow-soft-lg text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:hidden rtl:right-auto rtl:left-4"
                aria-label={t('open_menu')}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
    );
}
