'use client';



import translationI18n from '@/i18n';
import { Trans } from 'react-i18next';
import { route } from '@/lib/route';
import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import PageOverview from '@/components/PageOverview';
import SetupGuide from '@/components/SetupGuide';
import { Button, Card, Modal, Tabs } from '@/components/ui';
import { apiUrl, Head, router, useForm } from '@/lib/page-router';
import axios from 'axios';
import { Send, Settings, Pencil, Trash2 } from 'lucide-react';

const ENCRYPTION_OPTIONS = [
    { value: 'tls', label: 'TLS' },
    { value: 'ssl', label: 'SSL' },
    { value: 'none', label: 'None' },
];

export default function AdminEmailSystemIndex({ smtpConfigurations = [], emailTemplates = [], flash = {} }) {
    const [addSmtpOpen, setAddSmtpOpen] = useState(false);
    const [editSmtp, setEditSmtp] = useState(null);
    const [editTemplate, setEditTemplate] = useState(null);
    const [testEmailOpen, setTestEmailOpen] = useState(false);
    const [testSending, setTestSending] = useState(false);
    const [testError, setTestError] = useState(null);
    const [testSuccess, setTestSuccess] = useState(false);

    return (
        <AdminLayout title={translationI18n.t('hardcoded.views_admin_emailsystem_index_5c3d8489750a')}>
            <Head title={translationI18n.t('hardcoded.views_admin_emailsystem_index_5bcf449d4713')} />
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_5c3d8489750a" /></h2>
                    <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                        <Trans i18nKey="hardcoded.views_admin_emailsystem_index_7b5cc6421176" />
                    </p>
                </div>
                <PageOverview feature="admin-email-system" />

                <SetupGuide guide="smtp" />
                {flash?.success && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 text-sm">
                        {flash.success}
                    </div>
                )}
                <Tabs
                    tabs={[
                        {
                            label: 'SMTP Configuration',
                            content: (
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setTestEmailOpen(true);
                                                setTestError(null);
                                                setTestSuccess(false);
                                            }}
                                        >
                                            <Send className="h-4 w-4 mr-1" />
                                            <Trans i18nKey="hardcoded.views_admin_emailsystem_index_507799cc2d9e" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                setEditSmtp(null);
                                                setAddSmtpOpen(true);
                                            }}
                                        >
                                            <Settings className="h-4 w-4 mr-1" />
                                            <Trans i18nKey="hardcoded.views_admin_emailsystem_index_08a8e03af4df" />
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {smtpConfigurations.length === 0 && (
                                            <Card>
                                                <Card.Body className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                                                    <Trans i18nKey="hardcoded.views_admin_emailsystem_index_0913721e14d0" />
                                                </Card.Body>
                                            </Card>
                                        )}
                                        {smtpConfigurations.map((c) => (
                                            <Card key={c.id}>
                                                <Card.Body className="flex flex-row flex-wrap items-start justify-between gap-4">
                                                    <div className="space-y-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span
                                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                    c.is_active
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                                                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                                                                }`}
                                                            >
                                                                {c.is_active ? translationI18n.t('hardcoded.views_admin_emailsystem_index_13d89de7b75f') : translationI18n.t('hardcoded.views_admin_emailsystem_index_cf73dbe6fe6d')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{c.summary}</p>
                                                        <dl className="text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5">
                                                            <div><span className="font-medium">Host:</span> {c.host}</div>
                                                            <div><span className="font-medium">Port:</span> {c.port}</div>
                                                            <div><span className="font-medium"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_e8b7827bb36e" /></span> {c.username}</div>
                                                            <div><span className="font-medium">Encryption:</span> {c.encryption}</div>
                                                            <div><span className="font-medium"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_e9301285f476" /></span> {c.from_email}</div>
                                                            <div><span className="font-medium"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_3ada87d0012c" /></span> {c.from_name}</div>
                                                        </dl>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditSmtp(c);
                                                                setAddSmtpOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                                                            onClick={() => {
                                                                if (confirm('Delete this SMTP configuration?')) {
                                                                    router.delete(route('admin.smtp-configurations.destroy', c.id));
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        {!c.is_active && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => router.post(route('admin.smtp-configurations.activate', c.id))}
                                                            >
                                                                Activate
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            label: 'Email Templates',
                            content: (
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_f60437d5ef6c" /></h3>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setEditTemplate({ id: null, name: '', slug: '', subject: '', content: '', enabled: true })}
                                        >
                                            <Trans i18nKey="hardcoded.views_admin_emailsystem_index_8f74070210f9" />
                                        </Button>
                                    </div>
                                    <Card>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-neutral-200 dark:border-neutral-700 text-left text-neutral-500 dark:text-neutral-400">
                                                        <th className="pb-2 pr-4 font-medium"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_c5d5f3e2f3be" /></th>
                                                        <th className="pb-2 pr-4 font-medium">Key</th>
                                                        <th className="pb-2 pr-4 font-medium">Subject</th>
                                                        <th className="pb-2 pr-4 font-medium"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_fb05eada8ef0" /></th>
                                                        <th className="pb-2"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {emailTemplates.map((t) => (
                                                        <tr key={t.id} className="border-b border-neutral-100 dark:border-neutral-800">
                                                            <td className="py-3 pr-4 font-medium text-neutral-900 dark:text-neutral-100">{t.name}</td>
                                                            <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-400 font-mono text-xs">{t.slug}</td>
                                                            <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-400">{t.subject || '—'}</td>
                                                            <td className="py-3 pr-4">
                                                                <span
                                                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                        t.enabled
                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                                                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                                                                    }`}
                                                                >
                                                                    {t.enabled ? translationI18n.t('hardcoded.views_admin_emailsystem_index_13d89de7b75f') : translationI18n.t('hardcoded.views_admin_emailsystem_index_cf73dbe6fe6d')}
                                                                </span>
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="flex justify-end gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setEditTemplate(t)}
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            if (confirm(`Delete template "${t.name}"?`)) {
                                                                                router.delete(route('admin.email-system.templates.destroy', t.id), { preserveScroll: true });
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {emailTemplates.length === 0 && (
                                                <div className="py-8 text-center text-neutral-500 dark:text-neutral-400"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_9df289df5c38" /></div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            ),
                        },
                    ]}
                    defaultIndex={0}
                />
                <AddOrEditSmtpModal
                    show={addSmtpOpen}
                    edit={editSmtp}
                    encryptionOptions={ENCRYPTION_OPTIONS}
                    onClose={() => {
                        setAddSmtpOpen(false);
                        setEditSmtp(null);
                    }}
                    onSaved={() => {
                        setAddSmtpOpen(false);
                        setEditSmtp(null);
                        router.reload();
                    }}
                />
                <TestEmailModal
                    show={testEmailOpen}
                    sending={testSending}
                    error={testError}
                    success={testSuccess}
                    onClose={() => {
                        setTestEmailOpen(false);
                        setTestError(null);
                        setTestSuccess(false);
                    }}
                    onSend={async (email) => {
                        setTestSending(true);
                        setTestError(null);
                        setTestSuccess(false);
                        try {
                            await axios.post(apiUrl(route('admin.smtp-configurations.test')), { email });
                            setTestSuccess(true);
                        } catch (e) {
                            setTestError(e?.response?.data?.message || e?.message || 'Failed to send test email.');
                        } finally {
                            setTestSending(false);
                        }
                    }}
                />
                <EditTemplateModal
                    show={!!editTemplate}
                    template={editTemplate}
                    onClose={() => setEditTemplate(null)}
                    onSaved={() => {
                        setEditTemplate(null);
                        router.reload();
                    }}
                />
            </div>
        </AdminLayout>
    );
}

function AddOrEditSmtpModal({ show, edit, encryptionOptions, onClose, onSaved }) {
    const isEdit = !!edit?.id;
    const { data, setData, post, put, processing } = useForm({
        host: edit?.host ?? 'smtp.gmail.com',
        port: edit?.port ?? 587,
        username: edit?.username ?? '',
        password: '',
        encryption: edit?.encryption ?? 'tls',
        from_email: edit?.from_email ?? 'noreply@example.com',
        from_name: edit?.from_name ?? '',
        activate: edit?.is_active ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.smtp-configurations.update', edit.id), { onSuccess: () => onSaved(), preserveScroll: true });
        } else {
            post(route('admin.smtp-configurations.store'), { onSuccess: () => onSaved(), preserveScroll: true });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <Modal.Header title={isEdit ? translationI18n.t('hardcoded.views_admin_emailsystem_index_1aded161c056') : translationI18n.t('hardcoded.views_admin_emailsystem_index_b73dc38437fe')} onClose={onClose} />
            <form onSubmit={submit}>
                <Modal.Body className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">SMTP Host *</label>
                        <input
                            type="text"
                            value={data.host}
                            onChange={(e) => setData('host', e.target.value)}
                            required
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">SMTP Port *</label>
                        <input
                            type="number"
                            value={data.port}
                            onChange={(e) => setData('port', parseInt(e.target.value, 10) || 587)}
                            required
                            min={1}
                            max={65535}
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_44a50239bd5b" /></label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_f797ec9f30e0" /></label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={isEdit ? translationI18n.t('hardcoded.views_admin_emailsystem_index_146350e865eb') : ''}
                            required={!isEdit}
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Encryption *</label>
                        <select
                            value={data.encryption}
                            onChange={(e) => setData('encryption', e.target.value)}
                            required
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                            {encryptionOptions.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_9ae1afa692d6" /></label>
                        <input
                            type="email"
                            value={data.from_email}
                            onChange={(e) => setData('from_email', e.target.value)}
                            required
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_c335283f5aa0" /></label>
                        <input
                            type="text"
                            value={data.from_name}
                            onChange={(e) => setData('from_name', e.target.value)}
                            required
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.activate}
                            onChange={(e) => setData('activate', e.target.checked)}
                            className="rounded border-neutral-300 dark:border-neutral-600 text-brand-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_32f278bfdc3d" /></span>
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="outline" onClick={onClose}><Trans i18nKey="hardcoded.views_admin_emailsystem_index_1760c044cada" /></Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        {isEdit ? translationI18n.t('hardcoded.views_admin_emailsystem_index_f9439dca7e5f') : translationI18n.t('hardcoded.views_admin_emailsystem_index_58d783f40266')}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function TestEmailModal({ show, sending, error, success, onClose, onSend }) {
    const [email, setEmail] = useState('test@example.com');

    const handleSend = (e) => {
        e.preventDefault();
        onSend(email);
    };

    return (
        <Modal show={show} onClose={onClose}>
            <Modal.Header title={translationI18n.t('hardcoded.views_admin_emailsystem_index_2f5c78633bb9')} onClose={onClose} />
            <form onSubmit={handleSend}>
                <Modal.Body className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_a2eec4741882" /></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="test@example.com"
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-2 text-sm text-red-800 dark:text-red-200">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-2 text-sm text-green-800 dark:text-green-200">
                            <Trans i18nKey="hardcoded.views_admin_emailsystem_index_ab49d2c1b089" />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="outline" onClick={onClose}><Trans i18nKey="hardcoded.views_admin_emailsystem_index_1760c044cada" /></Button>
                    <Button type="submit" variant="primary" disabled={sending}>
                        {sending ? 'Sending…' : translationI18n.t('hardcoded.views_admin_emailsystem_index_2f5c78633bb9')}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function EditTemplateModal({ show, template, onClose, onSaved }) {
    const isCreate = !template?.id;
    const { data, setData, post, put, processing } = useForm({
        name: '',
        slug: '',
        subject: '',
        content: '',
        type: 'email',
        enabled: true,
    });

    useEffect(() => {
        if (template) {
            setData({
                name: template.name ?? '',
                slug: template.slug ?? '',
                subject: template.subject ?? '',
                content: template.content ?? '',
                type: 'email',
                enabled: template.enabled ?? true,
            });
        }
    }, [template?.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: () => onSaved() };
        if (isCreate) {
            post(route('admin.email-system.templates.store'), opts);
        } else {
            put(route('admin.email-system.templates.update', template.id), opts);
        }
    };

    if (!template) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="3xl">
            <Modal.Header title={isCreate ? translationI18n.t('hardcoded.views_admin_emailsystem_index_1653de66b249') : `Edit Template: ${template.name}`} onClose={onClose} />
            <form onSubmit={handleSubmit}>
                <Modal.Body className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_57f97f2853e8" /></label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder={translationI18n.t('hardcoded.views_admin_emailsystem_index_2d66016491fe')}
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Template Key</label>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            readOnly={!isCreate}
                            placeholder={isCreate ? translationI18n.t('hardcoded.views_admin_emailsystem_index_52d916c3a8d2') : ''}
                            className={`mt-1 w-full rounded border px-3 py-2 text-sm font-mono ${isCreate ? 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20' : 'border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Subject *</label>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            required
                            placeholder={translationI18n.t('hardcoded.views_admin_emailsystem_index_08dd03e78b30')}
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">HTML Body *</label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            required
                            rows={14}
                            className="mt-1 w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                            placeholder="<!DOCTYPE html>..."
                        />
                        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Use variables like <code className="rounded bg-neutral-100 dark:bg-neutral-700 px-1">{'{{app_name}}'}</code>,{' '}
                            <code className="rounded bg-neutral-100 dark:bg-neutral-700 px-1">{'{{user_name}}'}</code>,{' '}
                            <code className="rounded bg-neutral-100 dark:bg-neutral-700 px-1">{'{{tenant_name}}'}</code>, etc.
                        </p>
                    </div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.enabled}
                            onChange={(e) => setData('enabled', e.target.checked)}
                            className="rounded border-neutral-300 dark:border-neutral-600 text-brand-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300"><Trans i18nKey="hardcoded.views_admin_emailsystem_index_13d89de7b75f" /></span>
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="outline" onClick={onClose}>
                        <Trans i18nKey="hardcoded.views_admin_emailsystem_index_1760c044cada" />
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        <Trans i18nKey="hardcoded.views_admin_emailsystem_index_6de90bfec6b9" />
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
