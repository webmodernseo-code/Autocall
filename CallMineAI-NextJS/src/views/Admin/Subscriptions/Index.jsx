'use client';

import { route } from '@/lib/route';
import AdminLayout from '@/layouts/AdminLayout';
import { Button, Card, Pagination } from '@/components/ui';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import { Head, Link, router } from '@/lib/page-router';
import { useTranslation, Trans } from 'react-i18next';

export default function AdminSubscriptionsIndex({ subscriptions, filters = {}, stats = [] }) {
    const { t } = useTranslation();
    return (
        <AdminLayout title={t('admin.subscriptions')}>
            <Head title={`${t('admin.subscriptions')} · ${t('head.admin')}`} />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{t('admin.subscriptions')}</h2>
                    <Link
                        href={route('admin.payments.index')}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                        {t('admin.view_payments')}
                    </Link>
                </div>
                <PageOverview feature="admin-subscriptions" />
                <StatCards items={stats} />
                <form
                    className="flex flex-wrap gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const f = e.target;
                        router.get(route('admin.subscriptions.index'), { status: f.status?.value, gateway: f.gateway?.value }, { preserveState: true });
                    }}
                >
                    <select
                        name="status"
                        className="rounded-soft border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        defaultValue={filters.status}
                    >
                        <option value=""><Trans i18nKey="hardcoded.views_admin_subscriptions_index_d7d2f1ac19f1" /></option>
                        <option value="active"><Trans i18nKey="hardcoded.views_admin_subscriptions_index_12014baec0b4" /></option>
                        <option value="trialing">Trialing</option>
                        <option value="canceled">Canceled</option>
                        <option value="past_due">Past due</option>
                        <option value="ended">Ended</option>
                    </select>
                    <select
                        name="gateway"
                        className="rounded-soft border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        defaultValue={filters.gateway}
                    >
                        <option value=""><Trans i18nKey="hardcoded.views_admin_subscriptions_index_1bce07f7ebb2" /></option>
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="paddle">Paddle</option>
                    </select>
                    <Button type="submit" variant="outline" size="sm">Filter</Button>
                </form>
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-700 text-left text-neutral-500 dark:text-neutral-400">
                                    <th className="pb-2 pr-4 font-medium"><Trans i18nKey="hardcoded.views_admin_subscriptions_index_87dec8f7096b" /></th>
                                    <th className="pb-2 pr-4 font-medium">Plan</th>
                                    <th className="pb-2 pr-4 font-medium"><Trans i18nKey="hardcoded.views_admin_subscriptions_index_9ac8042c243d" /></th>
                                    <th className="pb-2 pr-4 font-medium">Gateway</th>
                                    <th className="pb-2 pr-4 font-medium">Starts</th>
                                    <th className="pb-2 pr-4 font-medium">Renews</th>
                                    <th className="pb-2 pr-4 font-medium"><Trans i18nKey="hardcoded.views_admin_subscriptions_index_9a0bc7f349e6" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.data?.map((s) => (
                                    <tr key={s.id} className="border-b border-neutral-100 dark:border-neutral-800">
                                        <td className="py-3 pr-4 text-neutral-900 dark:text-neutral-100">{s.user ? `${s.user.name} (${s.user.email})` : '—'}</td>
                                        <td className="py-3 pr-4 text-neutral-900 dark:text-neutral-100">{s.plan?.name ?? '—'}</td>
                                        <td className="py-3 pr-4 text-neutral-900 dark:text-neutral-100">{s.status}</td>
                                        <td className="py-3 pr-4 text-neutral-900 dark:text-neutral-100">{s.gateway}</td>
                                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400">{s.starts_at ? new Date(s.starts_at).toLocaleDateString() : '—'}</td>
                                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400">{s.renews_at ? new Date(s.renews_at).toLocaleDateString() : '—'}</td>
                                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400">{s.created_at ? new Date(s.created_at).toLocaleString() : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {subscriptions.data?.length === 0 && (
                        <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">No subscriptions.</div>
                    )}
                    <Pagination data={subscriptions} />
                </Card>
            </div>
        </AdminLayout>
    );
}
