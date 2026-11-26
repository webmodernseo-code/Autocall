# AutoCall — Protocole permanent de passation entre IA

Ce fichier est commun à Codex et Antigravity. Il s'applique pendant toute la vie du projet : développement, tests, déploiement, maintenance et évolutions. Il constitue à la fois un protocole de reprise et un état de passation actualisable.

## 1. Instructions permanentes

Lorsque l'utilisateur demande de lire `PASSATION.md`, appliquer ce protocole avant toute intervention. Ne pas dépendre de la mémoire des conversations précédentes.

- Respecter le cahier des charges, les instructions du dépôt (notamment `AGENTS.md` s'il existe), l'architecture, le design system et les décisions validées.
- Réutiliser les fichiers de suivi existants plutôt que les dupliquer. En cas de contradiction, signaler le problème et demander une décision avant de modifier le périmètre.
- Ne pas réécrire, supprimer ou dupliquer une fonctionnalité existante sans justification et validation si cela change son comportement attendu.
- Ne pas modifier l'architecture, les dépendances majeures, les contrats d'API ou le schéma de données de manière incompatible sans validation.
- Protéger les secrets, données personnelles et documents confidentiels. Le dépôt cible autocall.v2 est privé. Vérifier l’accès authentifié avant tout transfert.
- Un seul agent intervient à la fois sur le même dossier de travail. Pour des interventions parallèles, utiliser des branches et des dossiers de travail distincts, après accord de l'utilisateur.
- Ne jamais écraser les changements non enregistrés d'un autre agent. Aucun `git reset --hard`, nettoyage destructif, force push, commit ou push automatique sans autorisation explicite.

## 2. À l'arrivée (reprise)

1. Lire ce fichier, notamment la section 5, puis les instructions et documents pertinents du projet.
2. Vérifier le dossier, la branche active et l'état réel de Git avec `git status --short --branch`, `git diff --stat`, `git diff --cached --stat` et `git log -5 --oneline` si l'historique existe. Si le dépôt n'est pas initialisé, le signaler.
3. Examiner les fichiers modifiés, y compris les fichiers non suivis pertinents. Comparer l'état réel avec la dernière passation. Si le travail est distant, vérifier la référence distante avant toute intégration ; ne pas fusionner automatiquement.
4. Identifier les tâches terminées, les travaux en cours, les décisions, les tests, les blocages et la prochaine action.
5. Présenter un bilan bref : état actuel, écarts éventuels, risques et prochaine tâche proposée. Attendre l'accord de l'utilisateur avant de commencer à coder, sauf s'il a déjà explicitement autorisé cette tâche.

Si des informations sont absentes, les reconstituer à partir du code et de Git lorsque possible ; distinguer les faits vérifiés des hypothèses. Ne jamais inventer un résultat de test ou déclarer un travail terminé sans preuve.

## 3. Pendant l'intervention

- Travailler dans le périmètre demandé et conserver les modifications existantes.
- Vérifier les effets sur les modules concernés, la sécurité, l'isolation des données et les parcours utilisateurs.
- Exécuter les vérifications pertinentes disponibles (lint, typage, tests, build). Indiquer les commandes, résultats et limites ; ne pas masquer un échec.
- Mettre à jour la documentation et le suivi de tâches existants lorsque nécessaire.
- En cas de blocage, documenter la cause, ce qui a été tenté et la prochaine piste. Ne pas contourner silencieusement une contrainte.

## 4. Au départ (préparation de la passation)

Avant de changer d'IA, et après toute intervention significative, mettre à jour la section 5 de ce fichier avec l'état réel du projet. Conserver les sections 1 à 4 et les instructions d'utilisation.

- Identifier l'agent, la date, la branche et le dernier commit connu (ou préciser qu'il n'existe pas).
- Résumer les tâches terminées, les modifications non commitées et les fichiers concernés.
- Documenter les décisions et leurs raisons, les tests réellement exécutés et les blocages.
- Définir une prochaine action précise, avec les conditions nécessaires pour la réaliser.
- Signaler séparément les travaux non commencés, incomplets ou non vérifiés.
- Ne pas effectuer de commit ou de push sans autorisation. Si la passation se fait sur un autre ordinateur ou dans le cloud, confirmer que le code et la passation sont accessibles à l'agent suivant via un moyen autorisé. La présence de ce fichier ne synchronise pas automatiquement les fichiers.

Les anciennes passations peuvent être conservées dans l'historique Git ou le journal existant. La section suivante doit rester concise et refléter le dernier état, sans accumulation de résumés contradictoires.

## 5. Dernière passation

- **Agent et date** : Antigravity · 26 novembre 2026.
- **Dépôt et état Git** : Aucun dépôt Git local initialisé dans `c:\Projet web\AutoCall` (aucun commit ni push effectué). Serveur local Next.js actif sur `http://127.0.0.1:3001/`.
- **État réel livré et audité** :
  - **Code applicatif** : `packages/design-tokens` et `packages/ui` opérationnels ; `apps/dashboard` regroupe actuellement le dashboard client complet (`/` : `AppShell` avec `overview-view.tsx` 8 sections + avatars IA + mode `new-client`, `lead-workspace.tsx` + `/api/acquisition/companies`, `crm-view.tsx`, `appointments.tsx`, `contact-detail-view.tsx`, `invoice-editor.tsx`, `conversations-view.tsx`, `agents-view.tsx` + `agent-studio.tsx` + `agent-knowledge-tab.tsx`, `campaigns-view.tsx`, `social-view.tsx`, `automations-view.tsx`, `settings-view.tsx`, `support-view.tsx`, `ask-ai.tsx`), le site public (`/landing`), l'authentification (`/login`, `/signup`), `/onboarding`, `/direction-visuelle`, `/legal` + 12 routes légales et `/super-admin` (12 domaines complets + `/super-admin/login` + conformité `/api/compliance*`).
  - **Dernières modifications UI** : restauration des modules dans `app-shell.tsx`, raccordement de `overview-view.tsx` (props onboarding + événement `autocall:open-ask-ai`) et correction des zones serrées (`Performance commerciale`, badge `22 actions`, cartes larges `Emma`/`Alex`).
  - **Vérifications exécutées** : `pnpm --filter @autocall/dashboard typecheck` (`next typegen && tsc --noEmit`) = code `0` ; `pnpm --filter @autocall/dashboard lint` (`eslint .`) = code `0` ; `pnpm build` (`next build`, 31 routes) = code `0` ; scan statique emojis = 0 ; scan tests applicatifs (`*.test.*` / `*.spec.*`) = 0.
- **Travaux incomplets / écarts ouverts avant jalon J1** :
  - Monolithisation dans `apps/dashboard` (`apps/web` et `apps/admin` absents — D003), sous-utilisation de `@autocall/ui`, absence de `packages/contracts`/`domain`/`i18n`/`config`, absence de tests Vitest/Playwright et de `React Hook Form + Zod` / `TanStack Query/Table` / `next-intl` / `Recharts` / `React Flow`.
  - Écarts produit/design dans `landing-view.tsx` et `settings/billing-plan-panel.tsx` (tarifs `Découverte/Pro/Scale` `-20 %` vs `Starter/Pro/Business` `49/99/179 € HT` `-5 %` + XOF D007, badge `"Populaire"` vs `"Recommandé"` graphite, chiffres sociaux fictifs `10k`/`4,9/5`, footer blanc vs graphite D010, sections et routes publiques manquantes, multi-équipes vs D009, restes `"es"` dans les locales client et `Solar Linear` vs `Solar Bold Duotone` D004).
- **Prochaine action recommandée** : Valider avec le propriétaire la liste des corrections prioritaires (P0/P1) issues de l'audit frontend du 26 novembre 2026 — à commencer par la mise en conformité tarifs/D007, D009, D010 et le nettoyage des fausses métriques de la landing avant d'entamer la recette J1 (`F05`).

---

## Utilisation par le propriétaire du projet

Dans ce dossier, ouvrir PASSATION.md dans le Starter Kit depuis la roadmap.

**Avant de quitter une IA :**
> Lis PASSATION.md et applique le protocole de départ. Actualise la section Dernière passation avec l'état réel de ton travail.

**En ouvrant l'autre IA :**
> Lis PASSATION.md et applique le protocole de reprise. Reprends le projet à partir de son état réel.

Sur le même ordinateur, ouvrir le même dossier dans les deux outils et enregistrer les fichiers avant de changer d'agent. Sur des environnements différents, il faut en plus transférer les modifications de manière autorisée. Ce protocole est manuel : il ne garantit pas une lecture automatique à chaque nouvelle session. Pour rendre la règle automatique, la référencer également dans les instructions permanentes reconnues par chaque outil, si elles sont disponibles.

