'use client';



import translationI18n from '@/i18n';
import { Trans } from 'react-i18next';
import { route } from '@/lib/route';
import AdminLayout from '@/layouts/AdminLayout';
import { Button, Card, Input } from '@/components/ui';
import { Head, Link, useForm } from '@/lib/page-router';

export default function AdminPlansEdit({ plan }) {
    const { data, setData, put, processing } = useForm(plan ? { ...plan, enabled: plan.enabled ?? true, export_enabled: plan.export_enabled ?? false, custom_domain_enabled: plan.custom_domain_enabled ?? false, white_label_enabled: plan.white_label_enabled ?? false } : {});

    return (
        <AdminLayout title={plan ? `Edit: ${plan.name}` : translationI18n.t('hardcoded.views_admin_plans_edit_75108a663fca')}>
            <Head title={`Edit plan · Admin`} />
            <div className="space-y-6">
                <Link href={route('admin.plans.index')} className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">← Plans</Link>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"><Trans i18nKey="hardcoded.views_admin_plans_edit_4b0a554e1575" /></h2>
                <form onSubmit={(e) => { e.preventDefault(); put(route('admin.plans.update', plan.id)); }}>
                    <Card>
                        <Card.Body className="space-y-4">
                            <Input label={translationI18n.t('common.name')} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <Input label={translationI18n.t('client.regions_ui.tbl_slug')} value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                            <Input type="number" label={translationI18n.t('plans.monthly_price_cents')} value={data.monthly_price_cents ?? ''} onChange={(e) => setData('monthly_price_cents', e.target.value ? parseInt(e.target.value, 10) : null)} />
                            <Input type="number" label={translationI18n.t('plans.yearly_price_cents')} value={data.yearly_price_cents ?? ''} onChange={(e) => setData('yearly_price_cents', e.target.value ? parseInt(e.target.value, 10) : null)} />
                            <Input label={translationI18n.t('plans.currency_code')} value={data.currency_code ?? ''} onChange={(e) => setData('currency_code', e.target.value)} />
                            <label className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                                <input type="checkbox" checked={data.enabled ?? false} onChange={(e) => setData('enabled', e.target.checked)} className="rounded border-neutral-300 dark:border-neutral-600 text-brand-500" />
                                <span className="text-sm"><Trans i18nKey="hardcoded.views_admin_plans_edit_06cadcebbfec" /></span>
                            </label>
                            <Input type="number" label={translationI18n.t('plans.sort_order')} value={data.sort_order ?? 0} onChange={(e) => setData('sort_order', parseInt(e.target.value, 10) || 0)} />
                            <Input type="number" label={translationI18n.t('plans.ai_credits')} value={data.ai_credits ?? ''} onChange={(e) => setData('ai_credits', e.target.value ? parseInt(e.target.value, 10) : null)} />
                            <label className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100"><input type="checkbox" checked={data.export_enabled ?? false} onChange={(e) => setData('export_enabled', e.target.checked)} className="rounded border-neutral-300 dark:border-neutral-600 text-brand-500" /><span className="text-sm"><Trans i18nKey="hardcoded.views_admin_plans_edit_62a921df69ca" /></span></label>
                            <label className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100"><input type="checkbox" checked={data.custom_domain_enabled ?? false} onChange={(e) => setData('custom_domain_enabled', e.target.checked)} className="rounded border-neutral-300 dark:border-neutral-600 text-brand-500" /><span className="text-sm"><Trans i18nKey="hardcoded.views_admin_plans_edit_9cc44ba65e76" /></span></label>
                            <label className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100"><input type="checkbox" checked={data.white_label_enabled ?? false} onChange={(e) => setData('white_label_enabled', e.target.checked)} className="rounded border-neutral-300 dark:border-neutral-600 text-brand-500" /><span className="text-sm"><Trans i18nKey="hardcoded.views_admin_plans_edit_9c31bf5f92f3" /></span></label>
                            <Button type="submit" variant="primary" disabled={processing}><Trans i18nKey="hardcoded.views_admin_plans_edit_969ef345a36d" /></Button>
                        </Card.Body>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
