import DocsView from '@/views/frontend/Docs';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: "Documentation et centre d'aide", description: "Documentation officielle, guides de démarrage, API REST et assistance technique pour la plateforme d'agents vocaux IA AutoCall.", path: '/docs' });

export default function DocsPage() {
    return <DocsView />;
}
