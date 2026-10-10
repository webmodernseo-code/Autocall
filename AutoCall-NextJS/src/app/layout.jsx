import './globals.css';
import '@xyflow/react/dist/style.css';

import config from '@/lib/config';
import RouteProgress from '@/components/RouteProgress';
import { CookieConsent } from '@/components/ui/cookie-consent';

export const metadata = {
    title: config.app.name,
    description: "Plateforme d'appels vocaux propulsée par l'intelligence artificielle",
};

export const viewport = {
    themeColor: '#08090C',
};

export default function RootLayout({ children }) {
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
                <RouteProgress />
                {children}
                <CookieConsent cookiePolicyUrl="/cookies" />
            </body>
        </html>
    );
}
