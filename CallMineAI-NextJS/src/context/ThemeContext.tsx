'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePage } from '@/lib/page-router';

const STORAGE_KEY = 'theme';

export const ThemeContext = createContext({
    theme: 'dark',
    setTheme: () => {},
});

function getInitialTheme(serverTheme, hasUser, stored) {
    // Always prefer localStorage so theme persists across navigations and isn't overwritten by server default
    if (stored === 'dark' || stored === 'light') return stored;
    if (hasUser && serverTheme) return serverTheme;
    if (serverTheme) return serverTheme;
    // Default to dark luxury theme across all pages
    return 'dark';
}

function disableTransitionsTemporarily() {
    if (typeof document === 'undefined') return () => {};
    const css = document.createElement('style');
    css.setAttribute('type', 'text/css');
    css.appendChild(
        document.createTextNode(
            `*, *::before, *::after {
                -webkit-transition: none !important;
                -moz-transition: none !important;
                -o-transition: none !important;
                -ms-transition: none !important;
                transition: none !important;
            }`
        )
    );
    document.head.appendChild(css);
    return () => {
        // Force reflow
        (() => window.getComputedStyle(document.body))();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (css.parentNode) {
                    document.head.removeChild(css);
                }
            });
        });
    };
}

export function ThemeProvider({ children }) {
    const page = usePage();
    const serverTheme = page.props.theme;
    const hasUser = !!page.props.auth?.user;

    const [theme, setThemeState] = useState(() => {
        if (typeof window === 'undefined') return serverTheme || 'dark';
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return getInitialTheme(serverTheme, hasUser, stored);
    });

    // Sync from server when user is present (e.g. after login or refresh).
    useEffect(() => {
        if (!hasUser || !serverTheme || serverTheme === theme) return;
        const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
        if (stored === 'dark' || stored === 'light') {
            if (stored !== serverTheme) return; // keep user's choice when it conflicts with server
        }
        setThemeState(serverTheme);
    }, [hasUser, serverTheme, theme]);

    // Apply class to <html>
    useEffect(() => {
        const cleanup = disableTransitionsTemporarily();
        document.documentElement.classList.toggle('dark', theme === 'dark');
        cleanup();
    }, [theme]);

    const setTheme = useCallback((next) => {
        setThemeState((prev) => {
            const value = typeof next === 'function' ? next(prev) : (next === 'dark' || next === 'light' ? next : prev === 'dark' ? 'light' : 'dark');
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, value);
                try {
                    fetch('/api/theme/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: value }),
                    }).catch(() => {});
                } catch {}
                const cleanup = disableTransitionsTemporarily();
                document.documentElement.classList.toggle('dark', value === 'dark');
                cleanup();
            }
            return value;
        });
    }, []);

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
