import './globals.css';
import '@xyflow/react/dist/style.css';

import RouteProgress from '@/components/RouteProgress';
import { CookieConsent } from '@/components/ui/cookie-consent';
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata = {
    metadataBase: SITE_URL,
    title: {
        default: `${SITE_NAME} | Agents vocaux IA pour vos appels`,
        template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: ['agent vocal IA', 'appels automatisés', 'prospection téléphonique IA', 'qualification de prospects', 'call center IA', 'automatisation téléphonique'],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'technology',
    formatDetection: { email: false, address: false, telephone: false },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.png', sizes: '512x512', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
        type: 'website', locale: 'fr_FR', url: '/', siteName: SITE_NAME,
        title: `${SITE_NAME} | Agents vocaux IA pour vos appels`, description: DEFAULT_DESCRIPTION,
        images: [{ url: '/images/hero-bg.jpg', width: 1200, height: 630, alt: `${SITE_NAME}, plateforme d'agents vocaux IA` }],
    },
    twitter: { card: 'summary_large_image', title: `${SITE_NAME} | Agents vocaux IA pour vos appels`, description: DEFAULT_DESCRIPTION, images: ['/images/hero-bg.jpg'] },
};

export const viewport = {
    themeColor: '#08090C',
};

export default function RootLayout({ children }) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: SITE_NAME, url: SITE_URL.toString(), logo: new URL('/images/autocall-logo.png', SITE_URL).toString(), email: 'contact@autocall.co' },
            { '@type': 'WebSite', '@id': `${SITE_URL}#website`, url: SITE_URL.toString(), name: SITE_NAME, inLanguage: 'fr-FR', publisher: { '@id': `${SITE_URL}#organization` } },
            { '@type': 'SoftwareApplication', name: SITE_NAME, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: SITE_URL.toString(), description: DEFAULT_DESCRIPTION, provider: { '@id': `${SITE_URL}#organization` } },
        ],
    };
    return (
        <html lang="fr" dir="ltr" className="dark" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
                {/* Apply stored theme or default to dark immediately */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`,
                    }}
                />
            </head>
            <body className="font-sans antialiased bg-[#F8F9FA] text-neutral-900 dark:bg-[#08090C] dark:text-neutral-100">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
                <RouteProgress />
                {children}
                <CookieConsent cookiePolicyUrl="/cookies" />
            </body>
        </html>
    );
}
