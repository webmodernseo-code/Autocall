'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function PublicFormClient({ form, clientName }) {
    const fields = Array.isArray(form?.fields) ? form.fields : [];
    const [formData, setFormData] = useState(() => {
        const initial = {};
        for (const f of fields) {
            initial[f.key] = '';
        }
        return initial;
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState(null);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);

        // Client-side quick check
        const newErrors = {};
        for (const f of fields) {
            const val = formData[f.key];
            if (f.required && (!val || String(val).trim() === '')) {
                newErrors[f.key] = 'Ce champ est requis.';
            } else if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                newErrors[f.key] = 'Veuillez saisir une adresse email valide.';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/f/${form.public_token}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setServerError(data.error || 'Une erreur est survenue lors de l\'envoi.');
                }
                return;
            }

            setSubmitted(true);
        } catch (err) {
            setServerError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 flex flex-col justify-center items-center p-4 sm:p-6">
                <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-10 shadow-xs text-center space-y-6">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Demande envoyée avec succès
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Nous avons bien reçu vos informations. Notre équipe ou notre assistant vous recontactera dans les plus brefs délais.
                        </p>
                    </div>
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                            type="button"
                            onClick={() => {
                                setSubmitted(false);
                                setFormData(() => {
                                    const init = {};
                                    for (const f of fields) init[f.key] = '';
                                    return init;
                                });
                            }}
                            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition"
                        >
                            Envoyer une nouvelle réponse
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/70 dark:bg-neutral-950 flex flex-col justify-center items-center py-8 px-4 sm:px-6">
            <div className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    {clientName && (
                        <p className="text-xs font-semibold tracking-wider normal-case text-neutral-400 dark:text-neutral-500 mb-1">
                            {clientName}
                        </p>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {form.name}
                    </h1>
                    {form.description && (
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {form.description}
                        </p>
                    )}
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                    {serverError && (
                        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {fields.length === 0 ? (
                        <p className="text-sm text-neutral-400 text-center py-6">
                            Aucun champ configuré pour ce formulaire.
                        </p>
                    ) : (
                        fields.map((field) => {
                            const error = errors[field.key];
                            return (
                                <div key={field.key} className="space-y-1.5">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        {field.label || field.key}
                                        {field.required && (
                                            <span className="text-rose-500 ml-1 font-normal">*</span>
                                        )}
                                    </label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            rows={4}
                                            value={formData[field.key] ?? ''}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            placeholder={`Votre réponse...`}
                                            className={`w-full rounded-xl border bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/20 ${
                                                error
                                                    ? 'border-rose-300 dark:border-rose-800 focus:border-rose-400'
                                                    : 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-400'
                                            }`}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            value={formData[field.key] ?? ''}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            className={`w-full h-11 rounded-xl border bg-white dark:bg-neutral-900 px-3.5 text-sm text-neutral-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/20 ${
                                                error
                                                    ? 'border-rose-300 dark:border-rose-800 focus:border-rose-400'
                                                    : 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-400'
                                            }`}
                                        >
                                            <option value="">Sélectionnez une option</option>
                                            {(field.options || []).map((opt, idx) => (
                                                <option key={idx} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                                            value={formData[field.key] ?? ''}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            placeholder={
                                                field.type === 'email'
                                                    ? 'exemple@domaine.fr'
                                                    : field.type === 'phone'
                                                    ? '+33 6 12 34 56 78'
                                                    : 'Votre réponse...'
                                            }
                                            className={`w-full h-11 rounded-xl border bg-white dark:bg-neutral-900 px-3.5 text-sm text-neutral-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/20 ${
                                                error
                                                    ? 'border-rose-300 dark:border-rose-800 focus:border-rose-400'
                                                    : 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-400'
                                            }`}
                                        />
                                    )}

                                    {error && (
                                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}

                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={submitting || fields.length === 0}
                            className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-xs"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Transmission en cours...</span>
                                </>
                            ) : (
                                <>
                                    <span>Envoyer le formulaire</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Discreet reassurance */}
                    <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                        <span>Transmission chiffrée SSL 256-bit certifiée conforme RGPD</span>
                    </div>
                </form>
            </div>
        </div>
    );
}
