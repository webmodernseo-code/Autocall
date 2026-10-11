import NotFound from '@/app/not-found';

export const metadata = {
  title: 'Page non trouvée (404) - AutoCall',
  description: 'La page demandée est introuvable.',
  robots: { index: false, follow: false },
};

export default function Page404() {
  return <NotFound />;
}
