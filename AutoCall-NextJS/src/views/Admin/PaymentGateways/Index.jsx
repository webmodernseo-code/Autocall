'use client';



import translationI18n from '@/i18n';
import { Trans } from 'react-i18next';
import { route } from '@/lib/route';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import PaymentGatewayEditModal from '@/components/PaymentGatewayEditModal';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import { Button, Card } from '@/components/ui';
import { Head, router, usePage } from '@/lib/page-router';
import axios from 'axios';

export default function AdminPaymentGatewaysIndex({ gateways = [], stats = [], flash = {} }) {
    const { props } = usePage();
    const validationErrors = props.errors ?? {};
    const [editGateway, setEditGateway] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const openEdit = async (gatewayKey) => {
        setEditGateway(gatewayKey);
        setFetchError(null);
        setFormData(null);
        setLoading(true);
        try {
            const { data } = await axios.get(route('admin.payment-gateways.show', gatewayKey));
            setFormData(data);
        } catch (e) {
            setFetchError(e?.response?.data?.message || 'Failed to load gateway config');
        } finally {
            setLoading(false);
        }
    };

    const closeEdit = () => {
        setEditGateway(null);
        setFormData(null);
        setFetchError(null);
    };

    return (
        <AdminLayout title={translationI18n.t('hardcoded.views_admin_paymentgateways_index_5b290a5132ff')}>
            <Head title={translationI18n.t('hardcoded.views_admin_paymentgateways_index_0a7d2f563bbe')} />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"><Trans i18nKey="hardcoded.views_admin_paymentgateways_index_5b290a5132ff" /></h2>
                    <a
                        href={route('admin.payments.index')}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                        <Trans i18nKey="hardcoded.views_admin_paymentgateways_index_290fef565619" />
                    </a>
                </div>
                <PageOverview feature="admin-payment-gateways" />
                <StatCards items={stats} />
                {flash?.success && (
                    <div className="rounded-soft-lg bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 text-sm">
                        {flash.success}
                    </div>
                )}
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    <Trans i18nKey="hardcoded.views_admin_paymentgateways_index_3e51ce09de59" />
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gateways.map((g) => (
                        <Card key={g.gateway}>
                            <Card.Body className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{g.name}</h3>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            g.configured
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                                        }`}
                                    >
                                        {g.configured ? 'Configured' : 'Not configured'}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                    {g.enabled ? translationI18n.t('hardcoded.views_admin_paymentgateways_index_69bad694075c') : translationI18n.t('hardcoded.views_admin_paymentgateways_index_f726cb3b77ce')} · {g.test_mode ? translationI18n.t('hardcoded.views_admin_paymentgateways_index_fc9a4bc4cd18') : 'Live mode'} ·{' '}
                                    {g.recurring ? 'Recurring' : 'One-time'}
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => openEdit(g.gateway)}
                                >
                                    <Trans i18nKey="hardcoded.views_admin_paymentgateways_index_674395573511" />
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                <PaymentGatewayEditModal
                    show={!!editGateway}
                    gatewayKey={editGateway}
                    initialData={formData}
                    loading={loading}
                    error={fetchError}
                    validationErrors={validationErrors}
                    onClose={closeEdit}
                    onSaved={() => {
                        closeEdit();
                        router.reload();
                    }}
                    buildShowUrl={(key) => route('admin.payment-gateways.show', key)}
                    buildUpdateUrl={(key) => route('admin.payment-gateways.update', key)}
                />
            </div>
        </AdminLayout>
    );
}
