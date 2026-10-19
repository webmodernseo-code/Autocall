'use client';

import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import { Link } from '@/lib/page-router';
import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@/lib/page-router';
import { useTranslation, Trans } from 'react-i18next';
import { Building2, Users, Banknote, PhoneCall, Target, TrendingUp, ListChecks, CheckCircle2, XCircle, ArrowRight, ArrowUpRight, Activity } from 'lucide-react';
import { useMoney } from '@/lib/money';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Stat({ icon: Icon, label, value }) {
    return (
        <div className="relative overflow-hidden rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] p-5 transition-colors duration-300 hover:border-[#D0D1D2] dark:hover:border-white/20">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#5C5E62] dark:text-[#8E8E8E]">{label}</p>
                <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-[#171A20] dark:text-white">
                    <Icon className="h-4 w-4" />
                </span>
            </div>
            <p className="mt-3 text-2xl font-medium leading-none tabular-nums text-[#171A20] dark:text-white tracking-normal">{value}</p>
        </div>
    );
}

function ChartTip({ active, payload, label, unit = '' }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] px-3 py-2 text-xs">
            <p className="font-normal text-[#8E8E8E]">{label}</p>
            <p className="mt-0.5 text-sm font-medium tabular-nums text-[#171A20] dark:text-white">{payload[0].value}{unit}</p>
        </div>
    );
}

function SectionCard({ title, action, children, className = '', pad = true }) {
    return (
        <div className={`overflow-hidden rounded-[12px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-[#171A20] ${className}`}>
            <div className="flex items-center justify-between border-b border-[#EEEEEE] dark:border-white/10 px-6 py-4">
                <h3 className="text-sm font-medium text-[#171A20] dark:text-white flex items-center gap-2">
                    <span className="h-3 w-0.5 rounded-[1px] bg-[#3E6AE1]" />
                    {title}
                </h3>
                {action}
            </div>
            <div className={pad ? 'p-6' : ''}>{children}</div>
        </div>
    );
}

function Health({ ok, label }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-3 rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#171A20] px-3.5 py-2.5">
            <span className={`flex h-6 w-6 items-center justify-center rounded-[4px] ${ok ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-[#F4F4F4] dark:bg-white/5 text-[#8E8E8E]'}`}>
                {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            </span>
            <span className="text-xs font-medium text-[#171A20] dark:text-neutral-200">{label}</span>
            <span className={`ml-auto inline-flex items-center gap-1.5 text-xs font-normal ${ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8E8E8E]'}`}>
                {ok && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                {ok ? t('admin.service_connected', 'Connecté') : t('admin.service_not_set', 'Non configuré')}
            </span>
        </div>
    );
}

export default function AdminDashboard({ kpis = {}, callsByDay = [], serviceHealth = {}, recentCustomers = [], topCustomers = [] }) {
    const { t } = useTranslation();
    const fmtMoney = useMoney();
    // KPI money values arrive as major USD units; convert to cents for the shared formatter.
    const money = (dollars) => fmtMoney(Math.round(Number(dollars || 0) * 100), 'USD');

    return (
        <AdminLayout title={t('admin.dashboard', 'Tableau de bord')}>
            <Head title={`${t('admin.dashboard', 'Tableau de bord')} · ${t('head.admin', 'AutoCall')}`} />
            <div className="space-y-6">
                {/* Hero section inspired by Tesla showroom banner: Carbon Dark, radical subtraction, clear hierarchy */}
                <div className="relative overflow-hidden rounded-[12px] bg-[#171A20] p-6 text-white sm:p-8">
                    <div className="relative flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/90">
                                <Activity className="h-3 w-3 text-[#3E6AE1]" />
                                <Trans i18nKey="hardcoded.views_admin_dashboard_7878502c61ba" />
                            </span>
                            <h2 className="mt-3 text-2xl sm:text-3xl font-medium tracking-normal text-white">
                                <Trans i18nKey="hardcoded.views_admin_dashboard_2ee048e9b65e" />
                            </h2>
                            <p className="mt-1 max-w-lg text-xs sm:text-sm font-normal text-[#8E8E8E]">
                                <Trans i18nKey="hardcoded.views_admin_dashboard_fae3a7f95d3d" />
                            </p>
                        </div>
                        <div className="rounded-[4px] border border-white/15 bg-white/5 px-5 py-3 text-right">
                            <p className="text-xs font-normal text-[#8E8E8E]">{t('admin.monthly_recurring', 'Revenu récurrent mensuel')}</p>
                            <p className="mt-0.5 text-2xl font-medium tabular-nums text-white">{money(kpis.mrr)}</p>
                        </div>
                    </div>
                </div>

                {/* 6 Top Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <Stat icon={Building2} label={t('nav.customers', 'Clients')} value={kpis.customers ?? 0} />
                    <Stat icon={Users} label={t('admin.active_subs', 'Abonnements actifs')} value={kpis.subscriptions_active ?? 0} />
                    <Stat icon={Banknote} label={t('admin.mrr', 'MRR')} value={money(kpis.mrr)} />
                    <Stat icon={PhoneCall} label={t('admin.total_calls', 'Total des appels')} value={(kpis.total_calls ?? 0).toLocaleString()} />
                    <Stat icon={Target} label={t('admin.qualified_leads', 'Leads qualifiés')} value={(kpis.qualified_leads ?? 0).toLocaleString()} />
                    <Stat icon={TrendingUp} label={t('admin.success_rate', 'Taux de succès')} value={`${kpis.success_rate ?? 0}%`} />
                </div>

                {/* Main Activity Chart & Service Health */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <SectionCard title={translationI18n.t('hardcoded.views_admin_dashboard_58294010fabc')} className="lg:col-span-2">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={callsByDay} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" vertical={false} />
                                <XAxis dataKey="day" interval="preserveStartEnd" minTickGap={24} tick={{ fontSize: 12, fill: '#8E8E8E' }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#8E8E8E' }} axisLine={false} tickLine={false} width={28} />
                                <Tooltip cursor={{ fill: 'rgba(62, 106, 225, 0.05)' }} content={<ChartTip />} />
                                <Bar dataKey="calls" fill="#3E6AE1" radius={[2, 2, 0, 0]} maxBarSize={44} />
                            </BarChart>
                        </ResponsiveContainer>
                    </SectionCard>
                    <div className="space-y-6">
                        <SectionCard title={t('admin.service_health', 'Santé des services')}>
                            <div className="space-y-2">
                                <Health ok={serviceHealth.twilio} label="Twilio" />
                                <Health ok={serviceHealth.elevenlabs} label="ElevenLabs" />
                                <Health ok={serviceHealth.openai} label="OpenAI" />
                            </div>
                        </SectionCard>

                        {/* Queue card with Electric Blue CTA */}
                        <div className="relative overflow-hidden rounded-[12px] bg-[#171A20] p-6 text-white border border-[#171A20] dark:border-white/10">
                            <div className="flex items-center gap-2 text-[#8E8E8E]">
                                <ListChecks className="h-4 w-4 text-[#3E6AE1]" />
                                <span className="text-xs font-normal">{t('admin.queue_pending', 'File en attente')}</span>
                            </div>
                            <p className="mt-2 text-3xl font-medium tabular-nums text-white">{kpis.queue_pending ?? 0}</p>
                            <Link
                                href={route('admin.call-queue.index')}
                                className="mt-4 inline-flex items-center gap-1.5 rounded-[4px] bg-[#3E6AE1] hover:bg-[#345bc7] px-4 py-2 text-xs font-medium text-white transition-colors duration-300"
                            >
                                <Trans i18nKey="hardcoded.views_admin_dashboard_ad95ddf5f43b" />
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Customers & Quick Links */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <SectionCard
                        title={translationI18n.t('hardcoded.views_admin_dashboard_0658c3120add')}
                        pad={false}
                        action={
                            <Link href={route('admin.clients.index')} className="inline-flex items-center gap-1 text-xs font-medium text-[#3E6AE1] hover:underline">
                                <Trans i18nKey="hardcoded.views_admin_dashboard_1b2222a82319" />
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        }
                    >
                        <table className="min-w-full divide-y divide-[#EEEEEE] text-xs dark:divide-white/10">
                            <tbody className="divide-y divide-[#EEEEEE] dark:divide-white/10">
                                {recentCustomers.map((v) => (
                                    <tr key={v.id} className="transition-colors duration-300 hover:bg-[#F4F4F4] dark:hover:bg-white/5">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-[#F4F4F4] dark:bg-white/5 text-[#171A20] dark:text-white">
                                                    <Building2 className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="font-medium text-[#171A20] dark:text-white">{v.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-xs font-medium ${v.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-[#F4F4F4] text-[#8E8E8E] dark:bg-white/5'}`}>
                                                {v.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono tabular-nums text-[#5C5E62] dark:text-[#8E8E8E]">{v.credits.toLocaleString()} cr</td>
                                    </tr>
                                ))}
                                {recentCustomers.length === 0 && (
                                    <tr>
                                        <td className="px-6 py-8 text-center text-[#8E8E8E]">
                                            <Trans i18nKey="client.latest_customers_empty" />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </SectionCard>

                    <SectionCard title={t('admin.top_customers_by_calls', 'Top clients par appels')}>
                        {topCustomers.length > 0 ? (
                            <div className="space-y-4">
                                {topCustomers.map((v, i) => {
                                    const max = topCustomers[0].calls || 1;
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="flex items-center gap-2 text-[#171A20] dark:text-neutral-200">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#F4F4F4] text-xs font-normal text-[#5C5E62] dark:bg-white/5 dark:text-[#8E8E8E]">{i + 1}</span>
                                                    {v.name}
                                                </span>
                                                <span className="font-mono tabular-nums text-[#5C5E62] dark:text-[#8E8E8E]">{v.calls}</span>
                                            </div>
                                            <div className="mt-2 h-1.5 overflow-hidden rounded-[2px] bg-[#EEEEEE] dark:bg-white/10">
                                                <div className="h-full rounded-[2px] bg-[#3E6AE1] transition-all duration-300" style={{ width: `${(v.calls / max) * 100}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="py-8 text-center text-xs text-[#8E8E8E]">
                                <Trans i18nKey="hardcoded.views_admin_dashboard_e002d5492a56" />
                            </p>
                        )}
                        <div className="mt-6 flex flex-wrap gap-2.5 border-t border-[#EEEEEE] pt-4 dark:border-white/10">
                            <Link href={route('admin.plans.index')} className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-[#393C41] dark:text-neutral-300 transition-colors duration-300 hover:bg-[#F4F4F4] dark:hover:bg-white/10">
                                {t('admin.plans')} <ArrowUpRight className="h-3 w-3" />
                            </Link>
                            <Link href={route('admin.engines.index')} className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-[#393C41] dark:text-neutral-300 transition-colors duration-300 hover:bg-[#F4F4F4] dark:hover:bg-white/10">
                                <Trans i18nKey="admin.engines_nav" /> <ArrowUpRight className="h-3 w-3" />
                            </Link>
                            <Link href={route('admin.payments.index')} className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EEEEEE] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-[#393C41] dark:text-neutral-300 transition-colors duration-300 hover:bg-[#F4F4F4] dark:hover:bg-white/10">
                                <Trans i18nKey="hardcoded.views_admin_dashboard_86ab5af7c26c" /> <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </AdminLayout>
    );
}
