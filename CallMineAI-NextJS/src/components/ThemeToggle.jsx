'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

/** Light/dark switch. Reuses the app-wide theme (toggles `dark` on <html>, persists). */
export default function ThemeToggle({ className = '' }) {
    const { theme, setTheme } = useTheme();
    const dark = theme === 'dark';
    return (
        <button
            type="button"
            onClick={() => setTheme(dark ? 'light' : 'dark')}
            aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            title={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            className={`group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-neutral-200/80 bg-white/80 text-neutral-600 transition-all hover:border-neutral-300 hover:bg-neutral-100/80 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white cursor-pointer shadow-2xs backdrop-blur-md ${className}`}
        >
            <Sun className={`h-4.5 w-4.5 transition-all duration-300 ${dark ? 'rotate-0 scale-100 opacity-100 text-amber-300' : '-rotate-90 scale-0 opacity-0'}`} />
            <Moon className={`absolute h-4.5 w-4.5 transition-all duration-300 ${dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 text-neutral-700'}`} />
        </button>
    );
}
