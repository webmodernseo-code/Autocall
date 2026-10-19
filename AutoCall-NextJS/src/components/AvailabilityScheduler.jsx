'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Clock,
    Calendar,
    Coffee,
    Sun,
    Moon,
    Plus,
    Trash2,
    Check,
    Save,
    AlertCircle,
    CalendarDays,
    ShieldCheck,
    EyeOff,
    Volume2,
    Sparkles,
} from 'lucide-react';

const WEEKDAYS = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' },
];

export default function AvailabilityScheduler({ className = '' }) {
    const [tab, setTab] = useState('weekly'); // 'weekly' | 'absences'
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Configuration permanente
    const [enabled, setEnabled] = useState(true);
    const [weekly, setWeekly] = useState({
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        morning_start: '09:00',
        morning_end: '12:00',
        lunch_break_enabled: true,
        lunch_start: '12:00',
        lunch_end: '14:00',
        afternoon_start: '14:00',
        afternoon_end: '18:00',
        lunch_greeting: "Bonjour ! Notre équipe est actuellement indisponible jusqu'à 14h00. Je prends votre message pour que vous soyez rappelé dès cet après-midi.",
        closed_greeting: "Bonjour ! Nos bureaux sont actuellement fermés. Je prends votre message afin que notre équipe vous recontacte dès la prochaine ouverture.",
    });

    // Absences temporaires
    const [absences, setAbsences] = useState([]);
    const [showAddAbsence, setShowAddAbsence] = useState(false);
    const [absenceMode, setAbsenceMode] = useState('discreet'); // 'discreet' | 'explicit'
    const [newAbsence, setNewAbsence] = useState({
        title: '',
        start_date: '',
        end_date: '',
        return_date: '',
        message: '',
    });

    // Charger les horaires enregistrés
    useEffect(() => {
        let isMounted = true;
        axios
            .get('/api/app/availability')
            .then((res) => {
                if (isMounted && res.data?.availability) {
                    const av = res.data.availability;
                    setEnabled(av.enabled !== false);
                    if (av.weekly) setWeekly((prev) => ({ ...prev, ...av.weekly }));
                    if (Array.isArray(av.absences)) setAbsences(av.absences);
                }
            })
            .catch((e) => {
                if (isMounted) setError(e?.response?.data?.message || null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const toggleDay = (dayKey) => {
        setWeekly((prev) => {
            const days = prev.days.includes(dayKey)
                ? prev.days.filter((d) => d !== dayKey)
                : [...prev.days, dayKey];
            return { ...prev, days };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSavedSuccess(false);
        try {
            const payload = {
                availability: {
                    enabled,
                    weekly,
                    absences,
                },
            };
            await axios.post('/api/app/availability', payload);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        } catch (e) {
            setError(e?.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    // Préréglage rapide pour la pause de midi (au choix : discret sans motif OU pause déjeuner)
    const setLunchPreset = (type) => {
        const time = weekly.lunch_end || '14h00';
        if (type === 'discreet') {
            setWeekly((prev) => ({
                ...prev,
                lunch_greeting: `Bonjour ! Notre équipe est actuellement indisponible jusqu'à ${time}. Je prends votre message pour que vous soyez rappelé dès cet après-midi.`,
            }));
        } else if (type === 'lunch') {
            setWeekly((prev) => ({
                ...prev,
                lunch_greeting: `Bonjour ! Nos bureaux sont actuellement en pause déjeuner jusqu'à ${time}. Je prends votre message pour que vous soyez rappelé dès cet après-midi.`,
            }));
        }
    };

    const formatReadableDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
            });
        } catch {
            return dateStr;
        }
    };

    // Mise à jour automatique de la suggestion de message lors de la saisie d'une absence
    const updateAbsenceMessageSuggestion = (mode, title, returnDate, endDate) => {
        const targetDate = returnDate || endDate;
        const readable = targetDate ? formatReadableDate(targetDate) : '[date de reprise]';
        if (mode === 'explicit' && title && title.trim()) {
            return `Bonjour ! Notre entreprise est actuellement fermée pour ${title.trim()} jusqu'au ${readable}. Je prends votre message pour que notre équipe vous recontacte dès notre réouverture.`;
        }
        return `Bonjour ! Notre entreprise est actuellement fermée jusqu'au ${readable}. Je prends votre message pour que notre équipe vous recontacte dès notre réouverture.`;
    };

    const handleSwitchAbsenceMode = (mode) => {
        setAbsenceMode(mode);
        const suggested = updateAbsenceMessageSuggestion(
            mode,
            newAbsence.title,
            newAbsence.return_date,
            newAbsence.end_date
        );
        setNewAbsence((prev) => ({ ...prev, message: suggested }));
    };

    const handleAddAbsence = (e) => {
        e.preventDefault();
        if (!newAbsence.start_date || !newAbsence.end_date) return;

        const effectiveReturn = newAbsence.return_date || newAbsence.end_date;
        const fallbackMsg = updateAbsenceMessageSuggestion(
            absenceMode,
            newAbsence.title,
            effectiveReturn,
            newAbsence.end_date
        );

        const item = {
            id: Date.now().toString(),
            title: newAbsence.title?.trim() || (absenceMode === 'discreet' ? 'Indisponibilité' : 'Fermeture'),
            is_discreet: absenceMode === 'discreet',
            start_date: newAbsence.start_date,
            end_date: newAbsence.end_date,
            return_date: effectiveReturn,
            message: newAbsence.message?.trim() || fallbackMsg,
        };

        setAbsences([item, ...absences]);
        setNewAbsence({ title: '', start_date: '', end_date: '', return_date: '', message: '' });
        setShowAddAbsence(false);
    };

    const removeAbsence = (id) => {
        setAbsences(absences.filter((a) => a.id !== id));
    };

    const todayStr = new Date().toISOString().split('T')[0];

    const isLunchDiscreet = !weekly.lunch_greeting?.toLowerCase().includes('déjeuner') && !weekly.lunch_greeting?.toLowerCase().includes('dejeuner') && !weekly.lunch_greeting?.toLowerCase().includes('repas');

    return (
        <div className={`overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#131622] p-5 shadow-[0_2px_12px_rgba(16,24,40,0.04)] ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-hero-sans text-sm font-bold text-neutral-900 dark:text-white">
                                Gestion des horaires &amp; Périodes d&apos;indisponibilité
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                Mode Intelligent
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-[#8E95A5] mt-0.5">
                            Définissez vos ouvertures, coupures et congés. Vous choisissez librement si l&apos;IA divulgue le motif (pause déjeuner, congés) ou reste totalement neutre et discrète.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || loading}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-60 ${
                            savedSuccess
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                    >
                        {savedSuccess ? (
                            <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Enregistré !</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-3.5 w-3.5" />
                                <span>{saving ? 'Enregistrement…' : 'Enregistrer les horaires'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="mt-4 flex gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-2 text-xs">
                <button
                    type="button"
                    onClick={() => setTab('weekly')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                        tab === 'weekly'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04]'
                    }`}
                >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Planning permanent &amp; Coupure de midi</span>
                </button>
                <button
                    type="button"
                    onClick={() => setTab('absences')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                        tab === 'absences'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04]'
                    }`}
                >
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Congés &amp; Absences temporaires ({absences.length})</span>
                </button>
            </div>

            {/* TAB 1 : PLANNING PERMANENT AVEC PAUSE DU MIDI */}
            {tab === 'weekly' && (
                <div className="mt-4 space-y-4">
                    {/* Jours travaillés */}
                    <div>
                        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                            Jours d&apos;ouverture hebdomadaires :
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {WEEKDAYS.map((w) => {
                                const isSelected = weekly.days.includes(w.key);
                                return (
                                    <button
                                        key={w.key}
                                        type="button"
                                        onClick={() => toggleDay(w.key)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition cursor-pointer ${
                                            isSelected
                                                ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-500/20 dark:border-blue-500 dark:text-blue-300 font-semibold'
                                                : 'bg-neutral-50 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.06] text-neutral-500 dark:text-neutral-400 hover:border-slate-300'
                                        }`}
                                    >
                                        {w.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grille des créneaux de la journée */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* 1. Créneau Matin */}
                        <div className="rounded-xl border border-slate-200/90 dark:border-white/[0.06] p-3.5 bg-neutral-50/50 dark:bg-white/[0.02] space-y-2">
                            <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4 text-amber-500" />
                                <span className="text-xs font-bold text-neutral-900 dark:text-white">Créneau Matinée</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-neutral-500 block mb-1">Ouverture matin</label>
                                    <input
                                        type="time"
                                        value={weekly.morning_start}
                                        onChange={(e) => setWeekly({ ...weekly, morning_start: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1.5 text-xs font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-500 block mb-1">Fin de matinée</label>
                                    <input
                                        type="time"
                                        value={weekly.morning_end}
                                        onChange={(e) => setWeekly({ ...weekly, morning_end: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1.5 text-xs font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Créneau Après-midi */}
                        <div className="rounded-xl border border-slate-200/90 dark:border-white/[0.06] p-3.5 bg-neutral-50/50 dark:bg-white/[0.02] space-y-2">
                            <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4 text-orange-500" />
                                <span className="text-xs font-bold text-neutral-900 dark:text-white">Créneau Après-midi</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-neutral-500 block mb-1">Reprise après-midi</label>
                                    <input
                                        type="time"
                                        value={weekly.afternoon_start}
                                        onChange={(e) => setWeekly({ ...weekly, afternoon_start: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1.5 text-xs font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-500 block mb-1">Fermeture journée</label>
                                    <input
                                        type="time"
                                        value={weekly.afternoon_end}
                                        onChange={(e) => setWeekly({ ...weekly, afternoon_end: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1.5 text-xs font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOCUS COUPURE DU MIDI (CHOIX DU MOTIF OU DISCRET) */}
                    <div className="rounded-xl border border-amber-200/90 dark:border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/[0.03] p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                    <Coffee className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                                        Coupure de mi-journée (Pause déjeuner ou indisponibilité)
                                    </span>
                                    <span className="text-xs text-slate-600 dark:text-[#8E95A5]">
                                        L&apos;IA prend automatiquement les appels pendant cette coupure et les qualifie.
                                    </span>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={weekly.lunch_break_enabled}
                                    onChange={(e) => setWeekly({ ...weekly, lunch_break_enabled: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        {weekly.lunch_break_enabled && (
                            <div className="pt-2 border-t border-amber-100 dark:border-white/[0.06] space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xs">
                                    <div>
                                        <label className="text-xs text-neutral-500 block mb-1">Début de coupure</label>
                                        <input
                                            type="time"
                                            value={weekly.lunch_start}
                                            onChange={(e) => setWeekly({ ...weekly, lunch_start: e.target.value })}
                                            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1 text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-500 block mb-1">Heure de reprise</label>
                                        <input
                                            type="time"
                                            value={weekly.lunch_end}
                                            onChange={(e) => setWeekly({ ...weekly, lunch_end: e.target.value })}
                                            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1 text-xs font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Choix de la formulation de l'IA (Discret vs Explicite) */}
                                <div className="rounded-lg bg-white/70 dark:bg-white/[0.03] p-3 border border-amber-200/60 dark:border-white/[0.05] space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                                            <Volume2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                            Ce que l&apos;IA doit dire à l&apos;appelant :
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setLunchPreset('discreet')}
                                                className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition cursor-pointer flex items-center gap-1 ${
                                                    isLunchDiscreet
                                                        ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-500/20 dark:border-blue-500 dark:text-blue-300 font-semibold'
                                                        : 'border-slate-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04]'
                                                }`}
                                            >
                                                <EyeOff className="h-3 w-3" />
                                                <span>Discret (Sans mention de repas)</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setLunchPreset('lunch')}
                                                className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition cursor-pointer flex items-center gap-1 ${
                                                    !isLunchDiscreet
                                                        ? 'bg-amber-50 border-amber-600 text-amber-800 dark:bg-amber-500/20 dark:border-amber-500 dark:text-amber-200 font-semibold'
                                                        : 'border-slate-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04]'
                                                }`}
                                            >
                                                <Coffee className="h-3 w-3" />
                                                <span>Pause Déjeuner</span>
                                            </button>
                                        </div>
                                    </div>

                                    <textarea
                                        rows={2}
                                        value={weekly.lunch_greeting}
                                        onChange={(e) => setWeekly({ ...weekly, lunch_greeting: e.target.value })}
                                        placeholder="Ex: Bonjour ! Notre équipe est actuellement indisponible jusqu'à 14h00..."
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] p-2 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed outline-none focus:border-blue-500"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-[#8E95A5]">
                                        Libre à vous de mentionner la pause déjeuner ou de rester sobre. L&apos;IA prononcera exactement cette phrase d&apos;accueil.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Message pour Soirée & Week-end */}
                    <div className="rounded-xl border border-slate-200/90 dark:border-white/[0.06] p-3.5 bg-neutral-50/50 dark:bg-white/[0.02] space-y-2">
                        <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-indigo-500" />
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                                Message pour Soirée &amp; Week-end (En dehors des créneaux d&apos;ouverture)
                            </span>
                        </div>
                        <textarea
                            rows={2}
                            value={weekly.closed_greeting}
                            onChange={(e) => setWeekly({ ...weekly, closed_greeting: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] p-2.5 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* TAB 2 : CONGÉS & ABSENCES TEMPORAIRES (AVEC OU SANS MOTIF AU CHOIX) */}
            {tab === 'absences' && (
                <div className="mt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                                Calendrier des indisponibilités &amp; congés
                            </span>
                            <span className="text-xs text-slate-500 dark:text-[#8E95A5]">
                                Programmez vos périodes d&apos;absence : choisissez si l&apos;IA mentionne la raison (congés, déplacement) ou reste neutre.
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setShowAddAbsence(!showAddAbsence);
                                if (!showAddAbsence && !newAbsence.message) {
                                    setNewAbsence((prev) => ({
                                        ...prev,
                                        message: updateAbsenceMessageSuggestion(absenceMode, prev.title, prev.return_date, prev.end_date),
                                    }));
                                }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-center"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Ajouter une absence</span>
                        </button>
                    </div>

                    {/* Formulaire d'ajout d'absence */}
                    {showAddAbsence && (
                        <form onSubmit={handleAddAbsence} className="rounded-xl border border-blue-200/90 dark:border-white/10 bg-blue-50/20 dark:bg-white/[0.02] p-4 space-y-3.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block">
                                    Nouvelle période d&apos;indisponibilité
                                </span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Dates obligatoires, motif au choix
                                </span>
                            </div>

                            {/* Choix : Annonce Discrète ou Motif Spécifié */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                                    Divulgation du motif à l&apos;appelant :
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSwitchAbsenceMode('discreet')}
                                        className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition cursor-pointer flex items-center gap-1.5 ${
                                            absenceMode === 'discreet'
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-xs font-semibold'
                                                : 'bg-white dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-slate-300'
                                        }`}
                                    >
                                        <EyeOff className="h-3.5 w-3.5" />
                                        <span>Discret / Neutre (Aucun motif divulgué)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSwitchAbsenceMode('explicit')}
                                        className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition cursor-pointer flex items-center gap-1.5 ${
                                            absenceMode === 'explicit'
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-xs font-semibold'
                                                : 'bg-white dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-slate-300'
                                        }`}
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span>Explicite (Indiquer le motif public)</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <div>
                                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">
                                        {absenceMode === 'explicit' ? 'Motif public (annoncé par l\'IA)' : 'Note interne (optionnelle)'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={absenceMode === 'explicit' ? 'ex: Congés d\'été, Formation...' : 'ex: Absence interne (non dit aux clients)'}
                                        value={newAbsence.title}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setNewAbsence((prev) => ({
                                                ...prev,
                                                title: val,
                                                message: updateAbsenceMessageSuggestion(absenceMode, val, prev.return_date, prev.end_date),
                                            }));
                                        }}
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1.5 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">
                                        Date de début <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={newAbsence.start_date}
                                        onChange={(e) => setNewAbsence({ ...newAbsence, start_date: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1.5 text-xs font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">
                                        Date de fin (inclus) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={newAbsence.end_date}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setNewAbsence((prev) => ({
                                                ...prev,
                                                end_date: val,
                                                return_date: prev.return_date || val,
                                                message: updateAbsenceMessageSuggestion(absenceMode, prev.title, prev.return_date || val, val),
                                            }));
                                        }}
                                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] px-2.5 py-1.5 text-xs font-mono"
                                    />
                                </div>
                            </div>

                            {/* Message exact prononcé par l'IA */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                                    Message d&apos;accueil prononcé par l&apos;IA :
                                </label>
                                <textarea
                                    rows={2}
                                    value={newAbsence.message}
                                    onChange={(e) => setNewAbsence({ ...newAbsence, message: e.target.value })}
                                    placeholder="Ex: Bonjour ! Notre entreprise est actuellement fermée jusqu'au..."
                                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141d] p-2.5 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed outline-none focus:border-blue-500"
                                />
                                <span className="text-xs text-slate-500 dark:text-[#8E95A5] block">
                                    Ce texte sera fidèlement utilisé par l&apos;IA lors de chaque appel pendant cette période.
                                </span>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-blue-100 dark:border-white/[0.04]">
                                <button
                                    type="button"
                                    onClick={() => setShowAddAbsence(false)}
                                    className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs"
                                >
                                    Valider cette période
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Liste des absences programmées */}
                    {absences.length > 0 ? (
                        <div className="space-y-2.5">
                            {absences.map((abs) => {
                                const isCurrent = todayStr >= abs.start_date && todayStr <= abs.end_date;
                                const isFuture = todayStr < abs.start_date;

                                return (
                                    <div
                                        key={abs.id}
                                        className={`p-3.5 rounded-xl border transition-all ${
                                            isCurrent
                                                ? 'border-blue-500/60 bg-blue-50/40 dark:border-blue-500/30 dark:bg-blue-500/[0.04]'
                                                : 'border-slate-200/80 dark:border-white/[0.06] bg-neutral-50/30 dark:bg-white/[0.01]'
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-white/[0.04]">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                                                    {abs.title || 'Indisponibilité'}
                                                </span>

                                                {/* Badge Discret ou Motif */}
                                                {abs.is_discreet ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 px-2 py-0.5 text-xs font-medium">
                                                        <EyeOff className="h-3 w-3" />
                                                        Discret (sans motif)
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-xs font-medium">
                                                        Motif public
                                                    </span>
                                                )}

                                                {isCurrent && (
                                                    <span className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 px-2 py-0.5 text-xs font-semibold animate-pulse">
                                                        En cours actuellement
                                                    </span>
                                                )}
                                                {isFuture && (
                                                    <span className="rounded-full bg-neutral-100 text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-400 px-2 py-0.5 text-xs font-medium">
                                                        À venir
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeAbsence(abs.id)}
                                                className="self-end sm:self-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition cursor-pointer"
                                                title="Supprimer cette période"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="pt-2 space-y-1">
                                            <p className="text-xs text-slate-500 dark:text-[#8E95A5] font-mono">
                                                Du {new Date(abs.start_date).toLocaleDateString('fr-FR')} au {new Date(abs.end_date).toLocaleDateString('fr-FR')}
                                            </p>
                                            {abs.message && (
                                                <p className="text-xs text-neutral-700 dark:text-neutral-300 italic bg-white/60 dark:bg-white/[0.02] p-2 rounded-lg border border-slate-100 dark:border-white/[0.04]">
                                                    &laquo; {abs.message} &raquo;
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 p-6 text-center text-xs text-neutral-400">
                            Aucune période d&apos;absence programmée. Cliquez sur « Ajouter une absence » pour préparer vos congés.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
