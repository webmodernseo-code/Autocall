'use client';

import { useState } from 'react';
import translationI18n from '@/i18n';
import { route } from '@/lib/route';
import { Head, router, useForm } from '@/lib/page-router';
import ClientLayout from '@/layouts/ClientLayout';
import { useTranslation, Trans } from 'react-i18next';
import PageOverview from '@/components/PageOverview';
import StatCards from '@/components/StatCards';
import { Pagination, DateTimePicker } from '@/components/ui';
import { CalendarClock, Search, Plus, Trash2, X, Check, Ban, Clock, User, Phone, Mail } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-2xs';

const STATUS_META = {
    scheduled: { label: 'Programmé', cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' },
    completed: { label: 'Terminé', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
    cancelled: { label: 'Annulé', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' },
    no_show: { label: 'Absence', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' },
};

function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function AddModal({ agents = [], contacts = [], onClose }) {
    const form = useForm({
        title: '',
        contact_id: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        scheduled_at: '',
        duration_minutes: 30,
        agent_id: '',
        notes: '',
    });

    const pickContact = (id) => {
        form.setData('contact_id', id);
        const c = contacts.find((x) => String(x.id) === String(id));
        if (c) {
            form.setData('contact_name', c.name || '');
            form.setData('contact_phone', c.phone || '');
            form.setData('contact_email', c.email || '');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        form.post(route('client.appointments.store'), { preserveScroll: true, onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
            <form onSubmit={submit} className="relative w-full max-w-2xl rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0E121B] p-6 sm:p-7 shadow-2xl space-y-4 my-8" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <CalendarClock className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-semibold text-neutral-900 dark:text-white">
                                Nouveau rendez-vous
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Planifier un créneau avec un contact et un agent IA
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Titre */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Objet ou Titre du rendez-vous <span className="text-rose-500">*</span>
                    </label>
                    <input
                        className={inputCls}
                        placeholder="Ex: Démonstration AutoCall, Suivi commercial..."
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        required
                    />
                    {form.errors.title && <p className="mt-1 text-xs text-rose-500 font-medium">{form.errors.title}</p>}
                </div>

                {/* Date & Heure (Priorité Pleine Largeur) + Durée */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            Date et heure <span className="text-rose-500">*</span>
                        </label>
                        <DateTimePicker
                            value={form.data.scheduled_at}
                            onChange={(val) => form.setData('scheduled_at', val)}
                            placeholder="Choisir la date et l'heure..."
                        />
                        {form.errors.scheduled_at && <p className="mt-1 text-xs text-rose-500 font-medium">{form.errors.scheduled_at}</p>}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            Durée estimée (min)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="5"
                                max="1440"
                                step="5"
                                className={inputCls}
                                value={form.data.duration_minutes}
                                onChange={(e) => form.setData('duration_minutes', e.target.value)}
                            />
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                                min
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact Selection */}
                {contacts.length > 0 && (
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            Associer un contact existant
                        </label>
                        <select
                            className={`${inputCls} cursor-pointer`}
                            value={form.data.contact_id}
                            onChange={(e) => pickContact(e.target.value)}
                        >
                            <option value="">Sélectionner un contact (ou saisir manuellement)</option>
                            {contacts.map((c) => <option key={c.id} value={c.id}>{c.name || c.phone} {c.email ? `(${c.email})` : ''}</option>)}
                        </select>
                    </div>
                )}

                {/* Nom & Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            Nom du contact
                        </label>
                        <div className="relative">
                            <User className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                            <input
                                className={`${inputCls} pl-9`}
                                placeholder="Jean Dupont"
                                value={form.data.contact_name}
                                onChange={(e) => form.setData('contact_name', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            Téléphone
                        </label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                            <input
                                className={`${inputCls} pl-9`}
                                placeholder="+33 6 12 34 56 78"
                                value={form.data.contact_phone}
                                onChange={(e) => form.setData('contact_phone', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Email du contact
                    </label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                        <input
                            className={`${inputCls} pl-9`}
                            placeholder="jean.dupont@entreprise.fr"
                            value={form.data.contact_email}
                            onChange={(e) => form.setData('contact_email', e.target.value)}
                        />
                    </div>
                </div>

                {/* Agent assigné */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Agent IA assigné
                    </label>
                    <select
                        className={`${inputCls} cursor-pointer`}
                        value={form.data.agent_id}
                        onChange={(e) => form.setData('agent_id', e.target.value)}
                    >
                        <option value="">Sélectionner un agent (optionnel)</option>
                        {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>

                {/* Notes */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Notes et contexte du rendez-vous
                    </label>
                    <textarea
                        className={inputCls}
                        rows="2"
                        placeholder="Points à aborder, instructions pour l'agent IA..."
                        value={form.data.notes}
                        onChange={(e) => form.setData('notes', e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100 dark:border-white/[0.06]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:shadow-sm disabled:opacity-50 transition cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Créer le rendez-vous</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function AppointmentsIndex({ appointments, filters = {}, stats = [], agents = [], contacts = [] }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [showModal, setShowModal] = useState(false);

    const apply = (e) => {
        e?.preventDefault();
        router.get(route('client.appointments.index'), { search, status }, { preserveState: true, replace: true });
    };
    const filterStatus = (val) => {
        setStatus(val);
        router.get(route('client.appointments.index'), { search, status: val }, { preserveState: true, replace: true });
    };
    const setRowStatus = (a, s) => router.put(route('client.appointments.update', a.id), { title: a.title, scheduled_at: a.scheduled_at, duration_minutes: a.duration_minutes, status: s }, { preserveScroll: true });
    const remove = (a) => { if (confirm('Delete this appointment?')) router.delete(route('client.appointments.destroy', a.id), { preserveScroll: true }); };

    return (
        <ClientLayout title={t('nav.appointments') !== 'nav.appointments' ? t('nav.appointments') : 'Appointments'}>
            <Head title={translationI18n.t('nav.appointments')} />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Rendez-vous
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Gérez et synchronisez vos créneaux d'appels et réservations clients
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:shadow-sm transition cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Nouveau rendez-vous</span>
                    </button>
                </div>

                <PageOverview feature="appointments" />

                <StatCards items={stats} />

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={apply} className="relative max-w-md flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par titre ou contact..."
                            className="w-full rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-2xs"
                        />
                    </form>
                    <select
                        value={status}
                        onChange={(e) => filterStatus(e.target.value)}
                        className="rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3.5 pr-9 py-2.5 text-sm text-neutral-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-2xs cursor-pointer"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="scheduled">Programmé</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                        <option value="no_show">Absence</option>
                    </select>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0E121B] shadow-2xs">
                    {appointments.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-neutral-100 dark:divide-white/[0.06] text-sm">
                                <thead className="bg-neutral-50/70 dark:bg-white/[0.02]">
                                    <tr>
                                        {['Titre', 'Contact', 'Agent IA', 'Date & Heure', 'Durée', 'Statut', ''].map((h) => (
                                            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 normal-case">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                                    {appointments.data.map((a) => {
                                        const meta = STATUS_META[a.status] ?? STATUS_META.scheduled;
                                        return (
                                            <tr key={a.id} className="hover:bg-neutral-50/60 dark:hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 py-3.5 font-semibold text-neutral-900 dark:text-white">
                                                    {a.title}
                                                </td>
                                                <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                                                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{a.contact_name || '—'}</div>
                                                    {a.contact_phone && <div className="font-mono text-xs text-neutral-400 mt-0.5">{a.contact_phone}</div>}
                                                </td>
                                                <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400">
                                                    {a.agent_name || '—'}
                                                </td>
                                                <td className="px-5 py-3.5 text-neutral-700 dark:text-neutral-200 font-medium">
                                                    {fmtDate(a.scheduled_at)}
                                                </td>
                                                <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400 tabular-nums">
                                                    {a.duration_minutes} min
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.cls}`}>
                                                        {meta.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {a.status !== 'completed' && (
                                                            <button
                                                                title="Marquer comme terminé"
                                                                onClick={() => setRowStatus(a, 'completed')}
                                                                className="rounded-lg p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition cursor-pointer"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        {a.status !== 'cancelled' && (
                                                            <button
                                                                title="Annuler le créneau"
                                                                onClick={() => setRowStatus(a, 'cancelled')}
                                                                className="rounded-lg p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition cursor-pointer"
                                                            >
                                                                <Ban className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        {a.status !== 'scheduled' && (
                                                            <button
                                                                title="Reprogrammer"
                                                                onClick={() => setRowStatus(a, 'scheduled')}
                                                                className="rounded-lg p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition cursor-pointer"
                                                            >
                                                                <Clock className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            title="Supprimer"
                                                            onClick={() => remove(a)}
                                                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                <CalendarClock className="h-6 w-6" />
                            </div>
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Aucun rendez-vous trouvé</h4>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                Aucun créneau planifié pour le moment. Cliquez sur "Nouveau rendez-vous" pour en ajouter un.
                            </p>
                        </div>
                    )}
                </div>

                <Pagination data={appointments} />
            </div>

            {showModal && <AddModal agents={agents} contacts={contacts} onClose={() => setShowModal(false)} />}
        </ClientLayout>
    );
}
