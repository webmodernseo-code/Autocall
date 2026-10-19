'use client';



import translationI18n from '@/i18n';
import { Trans } from 'react-i18next';
import { route } from '@/lib/route';
import { useState } from 'react';
import { Head, router } from '@/lib/page-router';
import AdminLayout from '@/layouts/AdminLayout';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import { Pagination } from '@/components/ui';
import { Contact as ContactIcon, Search } from 'lucide-react';

export default function AdminContactsIndex({ contacts, stats = [], filters = {}, total = 0 }) {
    const [search, setSearch] = useState(filters.search || '');
    const go = (e) => { e?.preventDefault(); router.get(route('admin.contacts.index'), { search }, { preserveState: true, replace: true }); };

    return (
        <AdminLayout title={translationI18n.t('nav.contacts')}>
            <Head title={translationI18n.t('nav.contacts')} />
            <div className="space-y-5">
                <div><h2 className="font-display text-xl font-semibold text-neutral-900 dark:text-white"><Trans i18nKey="hardcoded.views_admin_contacts_index_c25735011306" /></h2><p className="text-sm text-neutral-500">{total.toLocaleString()} <Trans i18nKey="hardcoded.views_admin_contacts_index_b4ca28000f5b" /></p></div>
                <PageOverview feature="admin-contacts" />
                <StatCards items={stats} />
                <form onSubmit={go} className="relative max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={translationI18n.t('hardcoded.views_admin_contacts_index_936026fba664')} className="w-full rounded-soft border border-neutral-200 dark:border-ink-700 bg-white dark:bg-ink-900 py-2 pl-9 pr-3 text-sm" /></form>
                <div className="overflow-hidden rounded-soft-lg border border-neutral-200 dark:border-ink-800 bg-white dark:bg-ink-900">
                    <table className="min-w-full divide-y divide-neutral-100 dark:divide-ink-800 text-sm">
                        <thead className="bg-neutral-50 dark:bg-ink-800/50"><tr>{['Customer', 'Name', 'Phone', 'Company', 'Source'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase text-neutral-500">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-ink-800">
                            {contacts.data.map((c) => (
                                <tr key={c.id}><td className="px-4 py-2.5 text-neutral-900 dark:text-white">{c.customer || '—'}</td><td className="px-4 py-2.5 text-neutral-700 dark:text-neutral-300">{c.name || '—'}</td><td className="px-4 py-2.5 font-mono text-neutral-500">{c.phone_masked}</td><td className="px-4 py-2.5 text-neutral-500">{c.company || '—'}</td><td className="px-4 py-2.5 text-neutral-400">{c.source}</td></tr>
                            ))}
                            {contacts.data.length === 0 && <tr><td colSpan="5" className="px-4 py-12 text-center text-neutral-500"><ContactIcon className="mx-auto mb-2 h-10 w-10 text-neutral-300" />No contacts.</td></tr>}
                        </tbody>
                    </table>
                </div>
                <Pagination data={contacts} />
            </div>
        </AdminLayout>
    );
}
