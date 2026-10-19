'use client';



import translationI18n from '@/i18n';
import { Trans } from 'react-i18next';
import { route } from '@/lib/route';
import ClientLayout from '@/layouts/ClientLayout';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import { Button, Card, Input } from '@/components/ui';
import { Head, router, usePage } from '@/lib/page-router';
import { useState } from 'react';

export default function TenantsIndex({ tenants = [], stats = [] }) {
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);
    const currentTenant = usePage().props.currentTenant;

    const handleSwitch = (tenantId) => {
        router.post(route('client.tenants.switch'), { tenant_id: tenantId }, { preserveScroll: true });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setCreating(true);
        router.post(route('client.tenants.store'), { name: name.trim() }, {
            preserveScroll: true,
            onFinish: () => {
                setCreating(false);
                setName('');
            },
        });
    };

    return (
        <ClientLayout title={translationI18n.t('nav.workspaces')}>
            <Head title={translationI18n.t('nav.workspaces')} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-900"><Trans i18nKey="nav.workspaces" /></h2>
                        <p className="text-sm text-neutral-500 mt-1">
                            <Trans i18nKey="hardcoded.views_client_tenants_index_32efc8c625b6" />
                        </p>
                    </div>
                </div>

                <PageOverview feature="tenants" />

                <StatCards items={stats} />

                <Card>
                    <Card.Body>
                        <h3 className="text-sm font-semibold text-neutral-800 mb-3"><Trans i18nKey="hardcoded.views_client_tenants_index_7b2ef8628a11" /></h3>
                        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <Input
                                label={translationI18n.t('common.name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My workspace"
                                className="sm:max-w-xs"
                            />
                            <Button type="submit" variant="primary" disabled={creating || !name.trim()}>
                                {creating ? 'Creating…' : translationI18n.t('hardcoded.views_client_tenants_index_064078c659e1')}
                            </Button>
                        </form>
                    </Card.Body>
                </Card>

                <div>
                    <h3 className="text-sm font-semibold text-neutral-800 mb-2"><Trans i18nKey="hardcoded.views_client_tenants_index_1562f5432d32" /></h3>
                    {tenants.length === 0 ? (
                        <Card>
                            <Card.Body>
                                <p className="text-neutral-500"><Trans i18nKey="hardcoded.views_client_tenants_index_70825a5ddc69" /></p>
                            </Card.Body>
                        </Card>
                    ) : (
                        <ul className="space-y-2">
                            {tenants.map((t) => (
                                <li key={t.id}>
                                    <Card>
                                        <Card.Body className="flex flex-row items-center justify-between py-3">
                                            <span className="font-medium text-neutral-900">{t.name}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSwitch(t.id)}
                                                disabled={currentTenant?.id === t.id}
                                            >
                                                {currentTenant?.id === t.id ? translationI18n.t('hardcoded.views_client_tenants_index_c24fb530466f') : 'Switch'}
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}


