'use client';

import translationI18n from '@/i18n';
/**
 * AutoCall Official Emblem & Wordmark
 */
export default function BrandMark({ className = '', variant = 'auto', ...props }) {
    // Strip legacy square width classes (like w-7, w-9) so the wide wordmark retains its proper aspect ratio
    const cleanClass = className.replace(/\bw-(?:[0-9]+|px)\b/g, '').trim();
    const resolvedClass = cleanClass || 'h-4 sm:h-[18px]';

    if (variant === 'light') {
        return (
            <img
                src="/images/autocall-logo-dark.png"
                alt={translationI18n.t('app.name')}
                className={`w-auto max-h-5 object-contain ${resolvedClass}`}
                {...props}
            />
        );
    }

    if (variant === 'dark') {
        return (
            <img
                src="/images/autocall-logo.png"
                alt={translationI18n.t('app.name')}
                className={`w-auto max-h-5 object-contain ${resolvedClass}`}
                {...props}
            />
        );
    }

    return (
        <>
            <img
                src="/images/autocall-logo-dark.png"
                alt={translationI18n.t('app.name')}
                className={`w-auto max-h-5 object-contain dark:hidden ${resolvedClass}`}
                {...props}
            />
            <img
                src="/images/autocall-logo.png"
                alt={translationI18n.t('app.name')}
                className={`w-auto max-h-5 object-contain hidden dark:block ${resolvedClass}`}
                {...props}
            />
        </>
    );
}

/**
 * Vector Waveform Emblem (5 electric blue pills) from the official AutoCall identity
 */
export function AutoCallWaveIcon({ className = 'h-5 w-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
            <rect x="2" y="9" width="2.5" height="6" rx="1.25" fill="#3B82F6" />
            <rect x="6.5" y="6" width="2.5" height="12" rx="1.25" fill="#2563EB" />
            <rect x="11" y="3" width="2.5" height="18" rx="1.25" fill="#1D4ED8" />
            <rect x="15.5" y="6" width="2.5" height="12" rx="1.25" fill="#2563EB" />
            <rect x="20" y="9" width="2.5" height="6" rx="1.25" fill="#3B82F6" />
        </svg>
    );
}

/**
 * Official Brand Name Component
 */
export function BrandName({ brand = 'AutoCall' }) {
    const text = brand && brand.toLowerCase().includes('autocall') ? 'AutoCall' : (brand || 'AutoCall');
    return (
        <span className="font-hero-sans font-extrabold tracking-tight">
            {text}
        </span>
    );
}
