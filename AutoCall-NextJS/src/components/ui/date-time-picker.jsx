'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock, Check, X, ChevronDown } from 'lucide-react';

const TIME_PRESETS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '18:00'
];

/**
 * Format date to "YYYY-MM-DDTHH:mm" for datetime-local standard
 */
function toDateTimeLocalString(date, time = '10:00') {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${time}`;
}

function parseInitial(val) {
    if (!val) return { date: undefined, time: '10:00' };
    try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return { date: undefined, time: '10:00' };
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return { date: d, time: `${hours}:${minutes}` };
    } catch {
        return { date: undefined, time: '10:00' };
    }
}

export function DateTimePicker({ value, onChange, placeholder = 'Sélectionner date et heure...', className = '' }) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef(null);

    const initial = React.useMemo(() => parseInitial(value), [value]);
    const [selectedDate, setSelectedDate] = React.useState(initial.date);
    const [selectedTime, setSelectedTime] = React.useState(initial.time);

    // Sync when external value changes
    React.useEffect(() => {
        const parsed = parseInitial(value);
        setSelectedDate(parsed.date);
        setSelectedTime(parsed.time);
    }, [value]);

    // Close on click outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open]);

    const handleDateSelect = (d) => {
        setSelectedDate(d);
        if (d && onChange) {
            onChange(toDateTimeLocalString(d, selectedTime));
        }
    };

    const handleTimeSelect = (t) => {
        setSelectedTime(t);
        if (selectedDate && onChange) {
            onChange(toDateTimeLocalString(selectedDate, t));
        }
    };

    const formattedDisplay = React.useMemo(() => {
        if (!selectedDate) return null;
        try {
            const dateStr = selectedDate.toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
            return `${dateStr} à ${selectedTime}`;
        } catch {
            return null;
        }
    }, [selectedDate, selectedTime]);

    const handleClear = (e) => {
        e.stopPropagation();
        setSelectedDate(undefined);
        onChange?.('');
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger Button styled like Stripe/Apple input */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="group flex h-10 w-full items-center justify-between rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3.5 text-xs sm:text-sm font-medium transition-all hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-neutral-900 dark:text-white shadow-2xs cursor-pointer"
            >
                <div className="flex items-center gap-2.5 truncate">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <CalendarIcon className="h-3.5 w-3.5" />
                    </span>
                    {formattedDisplay ? (
                        <span className="font-semibold text-neutral-900 dark:text-white truncate">
                            {formattedDisplay}
                        </span>
                    ) : (
                        <span className="text-neutral-400 dark:text-neutral-500 font-normal">
                            {placeholder}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {selectedDate && (
                        <span
                            onClick={handleClear}
                            title="Effacer"
                            className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-white/[0.08] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                        >
                            <X className="h-3.5 w-3.5" />
                        </span>
                    )}
                    <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* Popover Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute left-0 top-full z-50 mt-2 flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0E121B] shadow-[0_25px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl w-[calc(100vw-2.5rem)] sm:w-[610px] max-w-[95vw]"
                    >
                        {/* 1. Calendrier Animated Premium - Priorité Absolue */}
                        <div className="flex-1 p-3 sm:p-4 border-b sm:border-b-0 sm:border-r border-neutral-200/80 dark:border-white/[0.08] flex flex-col justify-start">
                            <div className="mb-2 px-1 flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                <span>Sélectionner la date</span>
                                {selectedDate && (
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                        {selectedDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </span>
                                )}
                            </div>
                            <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                defaultMonth={selectedDate || new Date()}
                                className="border-0 shadow-none p-0 bg-transparent w-full"
                            />
                        </div>

                        {/* 2. Colonne de sélection de l'heure */}
                        <div className="flex flex-col w-full sm:w-[240px] p-4 justify-between bg-neutral-50/70 dark:bg-white/[0.02]">
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-neutral-900 dark:text-white">
                                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    <span>Heure du créneau</span>
                                </div>

                                {/* Sélecteur manuel d'heure */}
                                <div className="mb-3">
                                    <input
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => handleTimeSelect(e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#131622] px-3 py-2 text-sm font-semibold text-neutral-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center tracking-wider shadow-2xs"
                                    />
                                </div>

                                {/* Grille de créneaux rapides */}
                                <p className="text-xs font-semibold normal-case tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                                    Créneaux recommandés
                                </p>
                                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                                    {TIME_PRESETS.map((t) => {
                                        const isCurrent = selectedTime === t;
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => handleTimeSelect(t)}
                                                className={`rounded-xl py-1.5 px-2 text-xs transition-all cursor-pointer text-center ${
                                                    isCurrent
                                                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                                                        : 'bg-white dark:bg-white/[0.04] border border-neutral-200/70 dark:border-white/[0.06] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.08] font-medium'
                                                }`}
                                            >
                                                {t}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bouton de confirmation rapide */}
                            <div className="pt-3 mt-3 border-t border-neutral-200/70 dark:border-white/[0.06] flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => handleDateSelect(new Date())}
                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                    Aujourd&apos;hui
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 transition cursor-pointer"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Valider</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default DateTimePicker;
