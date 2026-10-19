'use client';

import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import { useState } from 'react';
import { Head, router, useForm } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import FileInput from '@/components/FileInput';
import PageOverview from '@/components/PageOverview';
import { Pagination, PageHeader, EmptyState } from '@/components/ui';
import { Contact as ContactIcon, Search, Plus, Upload, Trash2, X, Phone, Mail, Building2, FileSpreadsheet } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3.5 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none shadow-2xs';

function AddModal({ onClose }) {
    const form = useForm({ name: '', phone: '', email: '', company: '' });
    const submit = (e) => {
        e.preventDefault();
        form.post(route('client.contacts.store'), { preserveScroll: true, onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={onClose}>
            <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131622] p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                    <div>
                        <h3 className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white">
                            Ajouter un contact
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-[#8E95A5] mt-0.5">
                            Renseignez les coordonnées directes de votre prospect.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Nom complet
                    </label>
                    <input className={inputCls} placeholder="Ex: Thomas Martin" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Numéro de téléphone <span className="text-rose-500">*</span>
                    </label>
                    <input className={inputCls} placeholder="Ex: +33612345678" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                    {form.errors.phone && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{form.errors.phone}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Adresse e-mail
                    </label>
                    <input className={inputCls} type="email" placeholder="Ex: contact@entreprise.fr" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Entreprise ou organisation
                    </label>
                    <input className={inputCls} placeholder="Ex: Acme SAS" value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                    <button type="button" onClick={onClose} className="rounded-xl border border-slate-200/90 dark:border-white/10 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition">
                        Annuler
                    </button>
                    <button type="submit" disabled={form.processing} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold shadow-xs disabled:opacity-50 transition cursor-pointer">
                        {form.processing ? 'Enregistrement...' : 'Enregistrer le contact'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function ImportModal({ onClose }) {
    const form = useForm({ file: null });
    const submit = (e) => {
        e.preventDefault();
        form.post(route('client.contacts.import'), { preserveScroll: true, forceFormData: true, onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={onClose}>
            <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131622] p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                    <div>
                        <h3 className="font-hero-sans text-base font-bold text-neutral-900 dark:text-white">
                            Importer des contacts (CSV)
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-[#8E95A5] mt-0.5">
                            Chargez un fichier CSV pour ajouter vos contacts en masse.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-3 text-xs text-slate-600 dark:text-blue-300 leading-relaxed">
                    Le fichier CSV doit contenir au minimum la colonne <strong className="font-semibold text-blue-700 dark:text-blue-200">phone</strong>. Colonnes optionnelles : <code>name</code>, <code>email</code>, <code>company</code>. Les doublons sont fusionnés automatiquement.
                </div>

                <FileInput value={form.data.file} onChange={(f) => form.setData('file', f)} accept=".csv,.txt" hint="Fichier CSV (.csv ou .txt, max 10 Mo)" />
                {form.errors.file && <p className="text-xs text-rose-600 dark:text-rose-400">{form.errors.file}</p>}

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                    <button type="button" onClick={onClose} className="rounded-xl border border-slate-200/90 dark:border-white/10 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition">
                        Annuler
                    </button>
                    <button type="submit" disabled={form.processing || !form.data.file} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold shadow-xs disabled:opacity-50 transition cursor-pointer">
                        {form.processing ? 'Import en cours...' : 'Lancer l\'import'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function ContactsIndex({ contacts, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [modal, setModal] = useState(null);

    const apply = (e) => {
        e?.preventDefault();
        router.get(route('client.contacts.index'), { search }, { preserveState: true, replace: true });
    };
    const remove = (c) => {
        if (confirm(`Voulez-vous vraiment supprimer le contact "${c.name || c.phone_masked}" ?`)) {
            router.delete(route('client.contacts.destroy', c.id), { preserveScroll: true });
        }
    };

    const hasSearch = Boolean(filters.search);

    return (
        <ClientLayout title="Répertoire des contacts">
            <Head title="Contacts · AutoCall" />
            <div className="space-y-6">
                <PageHeader
                    title="Répertoire des contacts"
                    description={`${stats.total ?? 0}${stats.limit ? ` / ${stats.limit}` : ''} contacts enregistrés · Déduplication automatique par numéro de téléphone.`}
                    primaryAction={{
                        label: 'Nouveau contact',
                        onClick: () => setModal('add'),
                        icon: Plus,
                    }}
                    secondaryActions={[
                        {
                            label: 'Importer CSV',
                            onClick: () => setModal('import'),
                            icon: Upload,
                        },
                    ]}
                />

                <PageOverview feature="contacts" />

                <form onSubmit={apply} className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par nom, téléphone, e-mail ou entreprise..."
                        className="w-full rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131622] py-2 pl-9 pr-3 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 shadow-2xs focus:border-blue-500 focus:outline-none"
                    />
                </form>

                <div className="overflow-hidden rounded-[20px] border border-slate-200/90 dark:border-white/[0.07] bg-white dark:bg-[#131622] shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
                    {contacts?.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 dark:divide-white/[0.06] text-xs">
                                <thead className="bg-slate-50/80 dark:bg-white/[0.02]">
                                    <tr>
                                        {['Nom', 'Numéro de téléphone', 'Adresse e-mail', 'Entreprise', 'Campagnes associées', ''].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-300">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                                    {contacts.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition">
                                            <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                                                {c.name || '—'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                                                {c.phone_masked}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-[#8E95A5]">
                                                {c.email || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-[#8E95A5]">
                                                {c.company || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {c.campaigns_count > 0 ? (
                                                    <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                                                        {c.campaigns_count}
                                                    </span>
                                                ) : (
                                                    <span className="text-neutral-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(c)}
                                                    className="rounded-lg p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                                                    title="Supprimer ce contact"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-4 sm:p-6">
                            <EmptyState
                                variant={hasSearch ? 'search' : 'default'}
                                icon={ContactIcon}
                                title={hasSearch ? 'Aucun contact correspondant' : 'Aucun contact enregistré'}
                                description={
                                    hasSearch
                                        ? 'Aucun contact ne correspond à votre recherche. Essayez avec un autre nom ou numéro.'
                                        : 'Importez votre liste de contacts ou ajoutez vos prospects manuellement pour alimenter vos campagnes d\'appels.'
                                }
                                primaryAction={
                                    hasSearch
                                        ? {
                                              label: 'Effacer la recherche',
                                              onClick: () => {
                                                  setSearch('');
                                                  router.get(route('client.contacts.index'));
                                              },
                                          }
                                        : {
                                              label: 'Ajouter un contact',
                                              onClick: () => setModal('add'),
                                              icon: Plus,
                                          }
                                }
                                secondaryAction={
                                    hasSearch
                                        ? null
                                        : {
                                              label: 'Importer un fichier CSV',
                                              onClick: () => setModal('import'),
                                              icon: Upload,
                                          }
                                }
                            />
                        </div>
                    )}
                </div>

                <Pagination data={contacts} />
            </div>

            {modal === 'add' && <AddModal onClose={() => setModal(null)} />}
            {modal === 'import' && <ImportModal onClose={() => setModal(null)} />}
        </ClientLayout>
    );
}
