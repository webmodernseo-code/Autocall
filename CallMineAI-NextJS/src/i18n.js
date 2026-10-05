import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';

/** Nested translation shape handed to the client as `props.i18n.translations`. */
const BUNDLED_LOCALES = {
    fr,
    en,
};

/**
 * SPA translations are merged from (1) the bundled JSON below, (2) the page props, (3) LocaleSync.
 * Bundling locale files guarantees nested keys (e.g. client.user_management_ui.*) resolve even if
 * the server cache is stale or the shared payload is incomplete.
 */
export function initI18n() {
    const initialLang = typeof document !== 'undefined'
        ? (document.documentElement.getAttribute('lang') || 'fr').split('-')[0]
        : 'fr';

    i18n.use(initReactI18next).init({
        lng: initialLang,
        fallbackLng: 'fr',
        ns: ['translation'],
        defaultNS: 'translation',
        resources: {},
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

    Object.entries(BUNDLED_LOCALES).forEach(([lng, data]) => {
        i18n.addResourceBundle(lng, 'translation', data, true, true);
    });

    return i18n;
}

/**
 * Apply RTL/LTR to document and sync i18n language. Call after locale change.
 */
export function applyLocaleToDocument(locale, rtlLocales = ['ar']) {
    const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr';
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', locale);
    }
    if (i18n.isInitialized) {
        i18n.changeLanguage(locale);
    }
}

export default i18n;
