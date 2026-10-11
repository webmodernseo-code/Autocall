import { SITE_NAME } from '@/lib/seo';

export default function manifest() {
    return {
        name: `${SITE_NAME} — Agents vocaux IA`, short_name: SITE_NAME,
        description: "Plateforme d'automatisation des appels par intelligence artificielle.",
        start_url: '/', display: 'standalone', background_color: '#08090C', theme_color: '#08090C', lang: 'fr',
        icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
    };
}
