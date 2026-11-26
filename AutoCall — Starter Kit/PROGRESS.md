# AutoCall — État réel du développement

Dernière actualisation : 26 novembre 2026 (audit complet du frontend et rapprochement `ROADMAP.md` / `frontend.md`).

- **Conception** : décisions `D001`–`D014` et kit de référence documentés ; maquettes historiques et matrice `6.10` d'origine encore à récupérer.
- **Développement** : prototypes écrans construits dans `apps/dashboard` (client, site public `/landing`, auth/onboarding, légal et Super Admin 12 domaines), mais **des écarts structurels et fonctionnels restent à solder avant validation du jalon J1 (`F05`)**.
- **Phase active** : Audit frontend complet terminé ; mise en conformité des écarts critiques (`D003`, `D006`, `D007`, `D009`, `D010`, tests et réutilisation UI) avant la recette `F05`.

| Tâche | Statut | Preuve / résultat |
|---|---|---|
| Kit documentaire | Prêt | 9 documents de pilotage et spécification dans `AutoCall — Starter Kit/` |
| P00.01 — Analyse des spécifications | Validée | Matrice V1 et écarts dans `ROADMAP.md` §10 |
| P00.02 — Environnement local et Git | Validée | Node 26.13.1, pnpm 11.28.11 et Git vérifiés sous Windows |
| Initialiser ou rattacher Git selon P00.02 | À faire | Aucun dépôt Git local dans `c:\Projet web\AutoCall` (dépôt cible privé `webmodernseo-code/autocall.v2`) |
| P00.03 — Architecture et conventions | Validée | Conventions monorepo, versions cibles et contrats dans `ROADMAP.md` §10 |
| F01.01 — Initialisation frontend | Validée | Workspace pnpm, `apps/dashboard`, lint, typage strict, build et HTTP 200 vérifiés |
| F01.02 — Direction visuelle | Validée | Planche `/direction-visuelle`, tokens CSS (`packages/design-tokens`), contrastes et Chrome contrôlés |
| F01.03 — Bibliothèque UI | À valider | `packages/ui` + Storybook livrés, mais très peu réutilisés dans les écrans métier (uniquement sur `/direction-visuelle`) |
| F01.04 — App Shell | En cours (prototype) | Sidebar (`240/64 px`), topbar (`56 px`), recherche, notifications, Ask AI et nav mobile actifs ; écart D003 (`apps/web` et `apps/admin` non séparés) et icônes `Solar Linear` vs `Solar Bold Duotone` |
| F01.05 — Couche de données simulées | En cours (écarts) | Fixtures intégrées dans les vues et routes `/api/*` locales, mais absence de `packages/contracts`, `packages/domain` et adaptateurs service unifiés |
| F02.01 — Accès | En cours (prototype) | `/login`, `/signup`, `/super-admin/login` présents ; manquants : vérification e-mail, récupération mot de passe persistée, garde-route client/admin réelle |
| F02.02 — Onboarding | En cours (prototype) | `/onboarding` (3 étapes + checklist objectifs dans `overview-view.tsx`) fonctionnel en démo ; incomplet sur import site 10 pages, test téléphonie et brouillon Emma relié |
| F02.03 — Dashboard | En cours (prototype) | Cockpit 8 sections (`overview-view.tsx`), avatars IA, mode nouveau client et `overview-analytics.tsx` actifs ; espacement corrigé le 26/11 ; écart i18n FR/EN partiel |
| F02.04 — Paramètres | En cours (écarts) | 9 onglets présents (`settings-view.tsx`) ; écart D009 (gestion d'équipe multi-rôles affichée au lieu de Propriétaire + invités lecture seule) |
| F03.01 — Contacts, prospects & acquisition | En cours (prototype) | `lead-workspace.tsx` connecté à `recherche-entreprises.api.gouv.fr` + CRM/Pipeline/Détail contact/Factures ; champs et formulaires encore sans React Hook Form/Zod ni TanStack Table |
| F03.02 — Agents IA | En cours (prototype) | `agents-view.tsx`, Studio 7 onglets (`agent-studio.tsx`), Base de connaissances, Supervision et 13 avatars ; validation révision exacte avant activation à durcir |
| F03.03–F03.07 — Téléphonie, Agenda, Campagnes, Inbox, WhatsApp | En cours (prototype) | Écrans complets interactifs en démonstration (`conversations-view.tsx`, `crm/appointments.tsx`, `campaigns-view.tsx`, outils appel/email/WA) ; pas de page publique `/book/[entreprise]` |
| F03.08 — Social | En cours (prototype) | `social-view.tsx` (2 595 lignes) complet en démo ; contient un reliquat de clé `"es"` |
| F03.09 — Analytics | En cours (prototype) | `overview-analytics.tsx` + export CSV ; non branché sur Recharts ni sur rapports planifiés persistés |
| F03.10 — Abonnements et crédits | En cours (écarts critiques) | `billing-plan-panel.tsx` non conforme à D007/D008/D009 (`Découverte 0 € / Pro 49 € / Scale 129 €`, `-20 %`, badge `"Populaire"`, sans XOF ni Stripe/GeniusPay client) |
| F04.01 — Super Admin | En cours (prototype) | 12 domaines complets dans `/super-admin`, tarification D007 et logos Stripe/GeniusPay intégrés, panneau conformité `/api/compliance*` ; à isoler dans `apps/admin` (D003) |
| F04.02 — Site public | En cours (écarts critiques) | `/landing` (10 bandes) + `/legal` et 12 routes légales ; écarts vs `frontend.md` §8 & D010 (Hero exact, faux avis `10k`/`4,9/5`, tarifs D007, footer blanc vs graphite, calculateur ROI, 6 secteurs, routes dédiées) |
| F05.01–F05.03 — Recette frontend (J1) | À faire | 0 test automatisé (`Vitest` / `Playwright` absents) ; dépend de la résorption des écarts ci-dessus |

## Journal de développement

- **23 novembre 2026** · Propriétaire / Codex · Cadrage `P00.01`–`P00.03` validé, initialisation `apps/dashboard` (`F01.01`) et direction visuelle (`F01.02`) validées ; bibliothèque UI (`F01.03`) livrée pour validation ; dépôt privé `webmodernseo-code/autocall.v2` confirmé (404 non authentifié).
- **26 novembre 2026 (lot navigation)** · Vérification HTTP 200 sur le site public, connexion client/admin, inscription, onboarding, Super Admin et raccourcis client ; `tsc --noEmit` et `eslint` passés avec code `0`.
- **26 novembre 2026 (audit complet + correctifs dashboard)** · Antigravity ·
  - Code touché en amont de l'audit : `apps/dashboard/src/app/app-shell.tsx`, `apps/dashboard/src/app/overview-view.tsx` (cockpit 8 sections + correction d'espacement onglets `Performance commerciale`, badge `22 actions`, cartes larges `Emma`/`Alex`), `apps/dashboard/src/app/ask-ai.tsx` (`autocall:open-ask-ai`).
  - Audit technique & fonctionnel complet de tout le workspace frontend : `pnpm --filter @autocall/dashboard typecheck` (code `0`), `pnpm --filter @autocall/dashboard lint` (code `0`), `pnpm build` (31 routes Next.js, code `0`). Écarts critiques D003, D004, D006, D007, D009, D010, sous-utilisation de `@autocall/ui` et absence de suite Vitest/Playwright consignés dans `ROADMAP.md` §10, `DECISIONS.md`, `HANDOFF.md` et `PASSATION.md`.
