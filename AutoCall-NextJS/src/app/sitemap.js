import { SITE_URL } from '@/lib/seo';

const pages = [
    ['/', 'weekly', 1], ['/faq', 'monthly', 0.8], ['/docs', 'weekly', 0.8], ['/blog', 'weekly', 0.7],
    ['/status', 'daily', 0.4], ['/privacy', 'yearly', 0.3], ['/terms', 'yearly', 0.3],
    ['/cookies', 'yearly', 0.2], ['/mentions-legales', 'yearly', 0.2],
];

export default function sitemap() {
    const lastModified = new Date();
    return pages.map(([path, changeFrequency, priority]) => ({
        url: new URL(path, SITE_URL).toString(), lastModified, changeFrequency, priority,
    }));
}
