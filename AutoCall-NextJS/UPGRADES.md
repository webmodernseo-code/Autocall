# Politique de mise à jour des dépendances

## Version supportée

Le projet vise la dernière version **stable Active LTS** de Next.js, jamais une
version canary. Next.js, React, React DOM et `eslint-config-next` doivent évoluer
ensemble et rester verrouillés dans `package-lock.json`.

## Automatisation

Dependabot contrôle npm chaque lundi. Les correctifs de toutes les dépendances
sont regroupés séparément. Après réussite de l'intégralité du workflow
`Application CI`, ces correctifs sont fusionnés automatiquement par
`dependabot-auto-merge.yml`.

Les versions mineures et majeures sont proposées automatiquement mais ne sont
jamais fusionnées sans revue. Cela évite qu'une évolution d'API, de schéma ou de
compilateur casse silencieusement le SaaS. Chaque PR doit réussir :

```bash
npm ci
npm run test:seed-policy
npm run lint
npm run build
```

La CI reconstruit également l'image Docker et teste `/api/health`. La fusion
automatique d'un correctif ne déploie pas directement en production : elle suit
le pipeline staging et ses contrôles habituels.

## Mise à niveau majeure

1. Lire le guide officiel de migration de la nouvelle version.
2. Créer une branche `chore/next-major-upgrade`.
3. Exécuter le codemod officiel si la version le demande.
4. Examiner chaque modification du codemod ; ne pas la fusionner aveuglément.
5. Mettre à jour ensemble `next`, `react`, `react-dom` et
   `eslint-config-next` avec des versions exactes.
6. Exécuter la validation complète et tester login, admin, webhooks et worker.
7. Déployer en staging, observer, puis promouvoir le même SHA en production.

## Correctif de sécurité urgent

Créer immédiatement une PR dédiée avec la version corrigée exacte. Une CI verte
et un smoke test staging restent obligatoires, même pour une urgence. Le même
artefact immuable est ensuite promu en production.

## Pourquoi ne pas installer automatiquement `latest` en production ?

Une nouvelle majeure peut retirer une API ou changer le compilateur. Dependabot
automatise la détection et la proposition, tandis que la CI et la revue humaine
protègent les clients contre une régression silencieuse.
