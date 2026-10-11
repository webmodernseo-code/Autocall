import config from '@/lib/config';

export const SITE_NAME = config.app.name || 'AutoCall';
export const SITE_URL = new URL(config.app.url || 'https://autocall.co');
export const DEFAULT_DESCRIPTION =
    "Automatisez vos appels avec des agents vocaux IA : qualification de prospects, campagnes, prise de rendez-vous et synchronisation CRM.";

export function pageMetadata({ title, description = DEFAULT_DESCRIPTION, path = '/', noIndex = false, type = 'website' }) {
    const canonical = new URL(path, SITE_URL).toString();
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Agents vocaux IA pour vos appels`;

    return {
        title,
        description,
        alternates: { canonical },
        robots: noIndex ? { index: false, follow: false, nocache: true } : { index: true, follow: true },
        openGraph: {
            type, locale: 'fr_FR', url: canonical, siteName: SITE_NAME, title: fullTitle, description,
            images: [{ url: '/images/hero-bg.jpg', width: 1200, height: 630, alt: `${SITE_NAME}, plateforme d'agents vocaux IA` }],
        },
        twitter: { card: 'summary_large_image', title: fullTitle, description, images: ['/images/hero-bg.jpg'] },
    };
}
