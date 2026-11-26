# AutoCall — Registre des décisions

Les décisions ci-dessous proviennent des validations de conception accessibles. Elles sont des contraintes de réalisation, pas des preuves de déploiement.

| ID | Décision validée | Conséquence |
|---|---|---|
| D001 | Développement entièrement de zéro | Aucun code CallMine AI ; les anciennes mentions d'audit de CallMine dans le PDF sont obsolètes |
| D002 | Périmètre V1 intégral | Aucun module supprimé sans accord |
| D003 | Architecture modulaire et monorepo | Next.js/React/TS, NestJS, PostgreSQL Neon UE/Prisma/pgvector, Redis/BullMQ, S3 ; trois interfaces séparées |
| D004 | Design System | Layered Minimalism / Editorial Premium, Geist, composants réutilisables, couleurs et tokens du frontend.md |
| D005 | Agent IA avec avatar | Bibliothèque Soft3D, choix et personnalisation, droits à qualifier |
| D006 | Marchés et langues | France première cible, Côte d'Ivoire conditionnelle ; FR/EN indépendants de la devise |
| D007 | Tarifs | France 49/99/179 EUR HT mensuels, remise annuelle 5 % ; CI 15 000/30 000/60 000 XOF HT mensuels ; quotas et recharges du backend.md inchangés |
| D008 | Fournisseurs prioritaires | ElevenLabs/Twilio, OpenAI, Stripe/GeniusPay ; qualification technique, juridique et économique avant activation |
| D009 | Accès et sécurité | Propriétaire + invités lecture seule, Super Admin distinct, MFA admin, contrôle serveur et RLS |
| D010 | Site public | 14 sections validées ; composition B finale : CTA et footer graphite |
| D011 | Continuité multi-agent | Codex et Antigravity sur un projet commun, un agent actif à la fois, suivi dans Git et fichiers partagés |
| D012 | Cadrage P00.03 validé le 23 novembre 2026 | Monorepo pnpm, Node 26 LTS, conventions et contrats provisoires de ROADMAP.md §10. Frontend Windows natif avant J1. |
| D013 | Vue d'ensemble client en 8 sections avec avatars d'agents IA et Ask AI (26 novembre 2026) | Conservation de l'ensemble des modules client dans `AppShell`, cockpit 8 sections (`overview-view.tsx`) avec mode entreprise active / nouveau client, avatars d'agents IA conservés et panneau Ask AI flottant en bas à droite. |
| D014 | Prestataires visuels Stripe (FR) et GeniusPay (CI) dans la facturation (26 novembre 2026) | Logos officiels Stripe et GeniusPay fournis par le propriétaire et intégrés dans le module facturation Super Admin (`super-admin-billing.tsx`) ; intégration côté checkout/paramètres client à harmoniser. |

## Propositions et points non arbitrés
- **Architecture multi-applications (écart D003)** : le site public (`/landing`), les pages légales, le dashboard client (`/`) et le Super Admin (`/super-admin`) cohabitent provisoirement dans `apps/dashboard`. Arbitrer le calendrier de séparation physique vers `apps/web` et `apps/admin` avant la validation J1 / le démarrage backend B01.
- **Harmonie tarifaire & offres (écart D007)** : le Super Admin applique déjà Starter/Pro/Business (49/99/179 € HT, XOF CI, badge « Recommandé »), tandis que `landing-view.tsx` et `settings/billing-plan-panel.tsx` affichent encore Découverte (0 €) / Pro (49 €) / Scale (129 €), « Populaire » et `-20 %` annuel sans marché CI ni GeniusPay/Stripe client. À aligner sur D007 (`-5 %` annuel, bordure graphite Pro).
- **Bibliothèque `@autocall/ui` & stack `frontend.md` §2** : `@autocall/ui` existe dans `packages/ui` mais n'est quasiment utilisé que sur `/direction-visuelle` ; `packages/domain`, `contracts`, `i18n`, `config`, `next-intl`, `React Hook Form + Zod`, `TanStack Query/Table`, `Vitest` et `Playwright` restent à introduire avant J1/I01.
- **Iconographie & locales** : `workspace-navigation.tsx` utilise des icônes `Solar Linear` (testées en revue F01.04) au lieu de `Solar Bold Duotone` (D004), et expose une locale `"es"` partielle alors que D006 / `frontend.md` retiennent `FR/EN` indépendants de la devise.
- **Sites & conformité** : le footer de `/landing` est encore blanc à trame émeraude (vs composition B graphite validée en D010), plusieurs pages/sections du site public (`/tarifs`, `/fonctionnalites/[module]`, `/solutions/[secteur]`, `/book/[entreprise]`, calculateur ROI, 6 secteurs) restent à compléter et les mentions chiffrées d'essai (« 10k », « 4,9 / 5 Avis clients ») doivent être retirées pour respecter `frontend.md` §1/§8.
- Versions exactes backend à qualifier en B01.01. Le registre des versions frontend est dans `package.json`, `apps/dashboard/package.json` et `pnpm-lock.yaml`.
- ERD, SQL, contrats API, matrice de recette 6.10 originale à compléter ; maquettes historiques manquantes.
- Contrats fournisseurs, coûts réels, couverture CI, numéros et routage ; autorisations Meta/social, barème unités IA, voix personnalisées et services vocaux spécifiques.
- Taxes, conditions essai, prorata/options, renouvellement annuel CI, assistance CI, politique de conservation, textes juridiques publiés (actuellement en brouillon avec placeholders à compléter) et licences des assets.
- Plan ROADMAP.md à valider ; aucun choix proposé ne devient approuvé sans décision explicite.

## Ajouter une décision
ID / date / statut (proposée, validée, remplacée) / contexte / options / choix / justification / impacts / preuve d'accord / références des tâches et commits. Ne pas effacer l'historique ; marquer les décisions remplacées.
