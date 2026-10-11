import { SITE_URL } from '@/lib/seo';

export default function robots() {
    return {
        rules: [{
            userAgent: '*', allow: '/',
            disallow: ['/admin/', '/app/', '/api/', '/webhooks/', '/login', '/register', '/forgot-password', '/reset-password/', '/verify-email', '/confirm-password', '/dashboard-demo', '/landing-demo'],
        }],
        sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
        host: SITE_URL.origin,
    };
}
