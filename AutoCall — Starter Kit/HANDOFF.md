# AutoCall — Passation active

## Intervention en cours / dernier état vérifié

- **Date / agent / tâche / objectif autorisé** : 26 novembre 2026 · Antigravity · Audit frontend complet, relevé des écarts par rapport au cahier des charges (`frontend.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `ROADMAP.md`) et remise à niveau des fichiers de pilotage (`DECISIONS.md`, `HANDOFF.md`, `PASSATION.md`, `PROGRESS.md`, `ROADMAP.md`). Aucun changement au code applicatif durant l'audit après la correction d'espacement de `overview-view.tsx`.
- **Dépôt / branche / état Git** : Workspace local sans dépôt Git initialisé (`c:\Projet web\AutoCall`, `git status` impossible — aucun commit, aucune branche, aucun push).
- **Travail réellement accompli et fichiers inspectés / mis à jour** :
  - Inventaire complet de l'arborescence (`apps/dashboard/src`, `packages/design-tokens`, `packages/ui`, `AutoCall — Starter Kit`, `visual-audit`).
  - Audit technique (stack, dépendances, `next build`, `build-storybook`, typage TypeScript strict, ESLint, scan statique des liens, URLs externes, locales, emojis, `dangerouslySetInnerHTML`, API routes, tests).
  - Audit fonctionnel écran par écran : `/landing`, `/login`, `/signup`, `/onboarding`, `/` (`AppShell` + 8 sections `OverviewView` + modules client), `/legal` + 12 routes légales, `/direction-visuelle`, `/super-admin` (12 domaines + conformité), `/api/*`.
  - Réalignement des 5 documents de pilotage dans `AutoCall — Starter Kit/`.
- **Commandes exactes exécutées et résultats** :
  - `pnpm --filter @autocall/dashboard typecheck; pnpm --filter @autocall/dashboard lint` (`next typegen && tsc --noEmit` + `eslint .`) → succès (code `0`, zéro avertissement/erreur).
  - `pnpm build` (`next build` Next.js 16.4.6 Turbopack) → succès (31 routes compilées/générées).
  - `pnpm build-storybook` → vérifié dans le lot final (voir journal `PROGRESS.md`).
  - Recherche `*.test.*` / `*.spec.*` dans le code applicatif → 0 test unitaire, composant ou E2E présent (hors `node_modules`).
- **Services locaux actifs** : Serveur de développement Next.js actif localement sur `http://127.0.0.1:3001/`.
- **Risques / blocages / décisions attendues** :
  1. **Critique (D007 / D009 / D010 / `frontend.md` §1 & §8)** : tarifs/plans incohérents entre Super Admin (aligné D007) et Landing + Paramètres client (`Découverte 0 € / Pro 49 € / Scale 129 €`, `-20 %`, `"Populaire"`), présence de chiffres sociaux fictifs sur la landing (`10k`, `4,9 / 5 Avis clients`), footer landing blanc au lieu de graphite (D010), sections/routes publiques manquantes (ROI, 6 secteurs, Recharges interactives, `/tarifs`, `/book/[entreprise]`, etc.) et rôles d'équipe multi-rôles côté client contraire à D009.
  2. **Architecture (D003 / `frontend.md` §2 & §9)** : monolithisation temporaire dans `apps/dashboard`, sous-utilisation de `@autocall/ui` (utilisé uniquement dans `/direction-visuelle`), absence des packages `contracts`/`domain`/`i18n`/`config`, absence de couche adaptateurs typés unifiée et absence totale de suite de tests (`Vitest`, `Playwright`).
  3. **Git / Sécurité** : toujours aucun dépôt Git local ni `.env.example`, routes `/api/compliance/*` et `/api/acquisition/companies` sans couche d'authentification (protocole prototype local uniquement).
- **Prochaine action unique et critères d'acceptation** :
  - Arbitrer et exécuter un lot de **mise en conformité D007/D008/D009/D010** avant F05 (J1) :
    1. Aligner `landing-view.tsx` et `settings/billing-plan-panel.tsx` sur `Starter / Pro / Business` (`49 / 99 / 179 € HT`, `-5 %` annuel, marché CI `15 000 / 30 000 / 60 000 XOF HT`, badge Pro « Recommandé » en bordure graphite, logos Stripe + GeniusPay), et retirer les mentions chiffrées fictives (`10k`, `4,9 / 5`).
    2. Passer le CTA + footer de `landing-view.tsx` en composition B graphite (D010) et compléter les sections manquantes de la landing (Hero exact + calculateur ROI + 6 secteurs + recharges).

## Modèle de suivi pour les prochains lots

- Date / agent / tâche / objectif autorisé :
- Branche / HEAD / état git :
- Travail réellement accompli et fichiers touchés :
- Travail partiel et intention avant interruption :
- Commandes exactes exécutées / résultats / tests non exécutés et raisons :
- Services locaux actifs / migrations appliquées (sans secrets) :
- Risques / blocages / décisions attendues :
- Prochaine action unique et critères d'acceptation :

## Reprise après interruption

Arrêter l'agent précédent et ses opérations d'écriture. Lire les instructions (`AGENTS.md`, `PASSATION.md`, `ROADMAP.md`), puis vérifier `git status --short --branch`, `git log -5 --oneline`, `git diff` et `git diff --cached` (si un dépôt Git a été initialisé). Examiner les fichiers non suivis sans les supprimer. Comparer à cette passation, identifier les modifications partielles et relancer seulement les vérifications pertinentes. En cas de divergence ou de migration incertaine, signaler et attendre arbitrage avant toute action destructrice. Reprendre uniquement la tâche autorisée ; ne pas recommencer un module par défaut.
