const XOF_COUNTRIES = new Set(['BJ', 'BF', 'CI', 'GW', 'ML', 'NE', 'SN', 'TG']);
const EUR_COUNTRIES = new Set([
    'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV',
    'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
]);
const FRANCOPHONE_COUNTRIES = new Set([
    ...XOF_COUNTRIES,
    'BE', 'BI', 'CM', 'CA', 'CF', 'TD', 'CD', 'CG', 'KM', 'DJ', 'FR', 'GA',
    'GN', 'GQ', 'HT', 'LU', 'MG', 'MC', 'MA', 'MR', 'MU', 'RW', 'SC', 'CH',
    'TG', 'TN', 'DZ',
]);

function normalizedCountry(headers) {
    const raw = headers?.get?.('cf-ipcountry')
        || headers?.get?.('x-vercel-ip-country')
        || headers?.get?.('x-country-code')
        || '';
    return /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : null;
}

function browserPrefersFrench(headers) {
    const accepted = headers?.get?.('accept-language') || '';
    const first = accepted.split(',')[0]?.trim().toLowerCase();
    return first === 'fr' || first?.startsWith('fr-');
}

export function detectRegionalPreferences(headers) {
    const country = normalizedCountry(headers);
    const locale = 'fr';
    const currency = country && XOF_COUNTRIES.has(country)
        ? 'XOF'
        : country && EUR_COUNTRIES.has(country)
            ? 'EUR'
            : country
                ? 'USD'
                : 'EUR';

    return { country, locale, currency };
}

export const SUPPORTED_LOCALES = ['fr', 'en'];
export const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'XOF'];
