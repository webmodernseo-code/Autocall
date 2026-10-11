# Audit technique, UX et SEO — AutoCall

Date de l'audit : 11 octobre 2026

## Synthèse

Le socle Next.js est vaste et fonctionnel : App Router, séparation claire des domaines, contrôles d'accès, validation Zod, en-têtes de sécurité, tests ciblés et build de production opérationnel. Le principal défaut SEO était structurel : les métadonnées des pages marketing étaient rendues par un composant client qui ne les ajoutait pas au document HTML initial. Ce point est corrigé, avec une couverture SEO serveur sur toutes les pages publiques indexables.

## Correctifs réalisés

- Métadonnées globales complètes : titre, description, auteurs, mots-clés, icônes et manifeste.
- Titres et descriptions uniques pour l'accueil, FAQ, blog, documentation, statut et pages légales.
- URL canoniques absolues sur chaque page indexable.
- Cartes Open Graph et Twitter avec image, dimensions et texte alternatif.
- Données structurées JSON-LD `Organization`, `WebSite` et `SoftwareApplication`.
- `robots.txt` et `sitemap.xml` générés nativement par Next.js.
- `noindex, nofollow` sur les espaces client/admin, l'authentification, les démonstrations et la page 404.
- Manifeste web avec identité, couleurs et icône.
- Correction de quatre erreurs ESLint préexistantes dans les composants de la landing page.

## Audit par domaine

### SEO technique

État après correction : bon.

- Le rendu serveur expose maintenant les informations essentielles aux robots sans dépendre de JavaScript.
- Le sitemap ne contient que neuf routes publiques pertinentes.
- Les interfaces privées et endpoints sont exclus de l'exploration.
- La langue racine est correctement déclarée en `fr`.
- La page d'accueil possède un seul `h1`; les pages éditoriales principales possèdent également un titre de niveau 1.

Points restant à traiter :

- Définir `APP_URL` ou `NEXT_PUBLIC_APP_URL` avec l'URL HTTPS publique exacte en production. Sans cela, les canonical, le sitemap et les données structurées utilisent `http://localhost:3000`.
- Produire une image sociale dédiée de 1200 × 630 px. L'image hero actuelle sert de repli mais n'est pas une carte sociale éditorialisée.
- Le blog ne contient pas encore de pages d'articles individuelles. Pour viser des requêtes non-marque, ajouter des URLs stables, du contenu expert, `Article` JSON-LD, auteur, dates et maillage interne.
- Si une version anglaise publique est publiée, créer de vraies routes localisées et des liens `hreflang`; ne pas déclarer d'alternates avant leur existence.

### Contenu et acquisition

État : moyen.

- La proposition de valeur et les cas d'usage sont bien couverts sur la landing page.
- FAQ et documentation renforcent la confiance et le champ sémantique.
- Les liens sociaux et plusieurs liens de ressources du footer sont encore factices (`#`) : ils doivent être reliés ou retirés.
- Les pages marketing gagneraient à cibler des intentions distinctes via des pages dédiées : agent vocal immobilier, qualification B2B, permanence médicale, standard téléphonique IA et relance commerciale.
- Ajouter des preuves vérifiables : études de cas, métriques contextualisées, témoignages attribués et politique éditoriale.

### Performance et Core Web Vitals

État : à optimiser.

- Plusieurs images utilisent `<img>` au lieu de `next/image`, ce qui prive le projet de redimensionnement, formats modernes et prévention automatique du CLS.
- Les polices Google sont chargées par feuille externe dans le layout. `next/font` permettrait un hébergement local, moins de requêtes bloquantes et une meilleure stabilité visuelle.
- La page d'accueil est forcée en rendu dynamique pour récupérer les offres Prisma. Envisager une stratégie de cache/revalidation pour réduire le TTFB quand les tarifs changent peu.
- Les nombreuses animations et grandes images de sections doivent être mesurées sur mobile avec Lighthouse réel après déploiement.

### Accessibilité et UX

État : bon socle, contrôle manuel nécessaire.

- Présence d'un lien d'évitement, de libellés ARIA sur les commandes et d'une hiérarchie de titres cohérente sur les pages centrales.
- Les composants utilisent Lucide plutôt que des emojis, conformément au design system.
- Vérifier au clavier les menus, accordéons, dialogues et le lecteur vocal; tester aussi `prefers-reduced-motion`.
- Faire un passage automatisé axe/WAVE et un test manuel à 200 % de zoom sur mobile.
- Les libellés tout en majuscules présents dans certaines micro-copies restent à harmoniser avec les règles typographiques du projet.

### Sécurité et confidentialité

État : bon, avec un manque notable.

- En-têtes HSTS, `nosniff`, anti-framing, Referrer-Policy et Permissions-Policy présents.
- Aucun avis de sécurité connu dans les dépendances de production (`npm audit --omit=dev`).
- Les tests de redirection sûre et de politique de seed passent.
- Ajouter une Content-Security-Policy adaptée. Le script inline de thème nécessitera un nonce ou un hash.
- Confirmer en production les signatures de tous les webhooks, les limites de débit, la rotation des secrets et l'absence de secrets dans les logs.
- La route `/dashboard-demo` est publique par conception : conserver uniquement des données synthétiques et la désactiver si elle n'est pas utile commercialement.

### Architecture et qualité

État : bon, mais dette mesurable.

- Architecture par domaines et services lisible malgré un volume élevé de routes.
- ESLint passe après correction des quatre erreurs de composants.
- Le build Next.js de production compile les 110 pages avec succès.
- Un test reste en échec : un pays anglophone (`US`) reçoit `locale: fr` au lieu de `locale: en` dans `regional-preferences`.
- La commande `npm run build` complète peut échouer sous Windows quand la DLL Prisma est verrouillée (`EPERM`). Le build Next direct réussit; arrêter le processus qui utilise Prisma avant la CI locale ou isoler la génération du client.

## Priorités recommandées

1. Configurer l'URL publique de production et soumettre `/sitemap.xml` dans Google Search Console et Bing Webmaster Tools.
2. Corriger le test de préférences régionales et ajouter une CSP.
3. Convertir les images critiques vers `next/image`, migrer vers `next/font` et mesurer LCP/INP/CLS sur l'URL déployée.
4. Remplacer les liens factices et publier des pages de contenu métier ciblées avec données structurées propres.
5. Ajouter des tests E2E des parcours inscription, campagne, paiement et administration, puis un audit d'accessibilité automatisé en CI.
