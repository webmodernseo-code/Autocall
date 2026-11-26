# AutoCall — Architecture de référence

Statut : architecture cible approuvée par le propriétaire sous réserve de compatibilité avec le kit initial. Applicable à Codex et Antigravity. Lire aussi ROADMAP.md, PASSATION.md et AGENTS.md. En cas de contradiction avec le kit, signaler l'écart avant de modifier quoi que ce soit. Ne pas créer de dossiers vides par anticipation.

## 1. Principes

- Monorepo pnpm, TypeScript strict, monolithe modulaire NestJS et worker BullMQ séparé. Pas de microservices ni de bus distribué supplémentaire en V1.
- Frontend d'abord : Next.js App Router, React, Tailwind, shadcn/ui, icônes Solar Bold Duotone, TanStack Query/Table/Virtual, React Hook Form, Zod, Recharts selon les besoins. Backend ensuite : NestJS, PostgreSQL (Neon Europe), Prisma, Redis/BullMQ et pgvector si requis par les fonctionnalités validées.
- Un seul dépôt, un lockfile, applications déployables séparément. Pas de Turborepo obligatoire. Versions compatibles, épinglées et documentées.
- Fournisseurs vocaux/téléphoniques derrière des adaptateurs côté serveur ; ElevenLabs et Twilio prioritaires sous réserve de validation des capacités, coûts, contrats et conformité.

## 2. Arborescence cible progressive

```text
autocall/
├── apps/
│   ├── web/                        # Site public, port local 3000
│   ├── dashboard/                  # Espace client, port local 3001
│   ├── admin/                      # Super Admin, port local 3002
│   ├── api/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/             # Modules métier NestJS
│   │   │   ├── common/              # Guards, filtres, interceptors transversaux
│   │   │   └── config/
│   │   └── package.json
│   └── worker/
│       ├── src/                     # Exécution des jobs et bootstrap
│       └── package.json
├── packages/
│   ├── design-tokens/              # Tokens partagés après validation visuelle
│   ├── domain/                     # Logique pure partagée
│   ├── i18n/                       # Traductions partagées
│   ├── contracts/                   # DTO, schémas publics, événements/jobs
│   ├── ui/                          # UI et tokens partagés si utiles
│   ├── db/                          # Prisma schema, migrations, client serveur
│   ├── server-core/                 # Services métier partagés API/worker si nécessaires
│   └── config/                      # Configurations de build/lint/TypeScript partagées
├── AutoCall — Starter Kit/          # AGENTS, ARCHITECTURE, ROADMAP, PASSATION et référentiels
├── tests/                           # E2E et intégration transversale
├── .github/workflows/               # CI/CD au moment approprié
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── tsconfig.base.json
```

Les noms des routes et modules sont des conventions proposées : le kit détermine le périmètre exact. Les trois applications sont déployables séparément et disposent chacune de leur App Router dans src/app. Les fonctionnalités vivent dans src/features et les adaptateurs dans la couche data. Ne pas déplacer ou supprimer le kit sans vérifier les liens et obtenir accord si nécessaire. Conserver les configurations spécifiques à chaque application quand requises.

## 3. Modules métier

Créer progressivement les features web et modules API correspondant aux exigences : auth, tenancy/comptes, contacts/prospects, agents IA, téléphonie, conversations, agenda, campagnes, email, WhatsApp, social, analytics, notifications, intégrations, facturation/crédits et administration. Ce catalogue n'ajoute aucun périmètre au kit. Éviter un dossier par couche pour une petite fonctionnalité ; structurer les modules complexes en contrôleurs, services, accès aux données, adaptateurs et tests selon les besoins.

## 4. Frontières obligatoires

- Le frontend appelle des services typés ; les adaptateurs mock et HTTP respectent le même contrat. Les pages orchestrent les features ; ne pas mettre la logique métier dans les composants UI. Pas de données fictives dans le mode production.
- Le frontend ne se connecte jamais directement à Prisma, Redis ou aux clés des fournisseurs. Les types de base de données ne sont pas des contrats publics. Les packages serveur ne doivent jamais entrer dans le bundle web.
- API : validation des entrées à l'exécution, authentification, autorisation, identité tenant issue de la session vérifiée, règles métier et contrôle des quotas côté serveur. Dashboard Super Admin distinct, droits indépendants, opérations sensibles auditées. Les layouts ne constituent pas une protection de sécurité.
- PostgreSQL : migrations versionnées, contraintes et index, isolation tenant systématique et RLS selon le kit, contexte de tenant compatible avec pooling et transactions ; tests inter-tenants et comptes privilégiés. Un seul propriétaire du schéma Prisma. Aucun accès privilégié depuis le navigateur.
- Workers : Redis/BullMQ pour tâches différées ; jobs typés, idempotence, délais, retries bornés, traitement des échecs et suivi. Réutiliser les services serveur nécessaires sans importer l'application API dans le worker. Ne pas utiliser une file différée sur le chemin critique audio temps réel.
- Intégrations : adaptateurs fournisseurs, signatures webhooks, déduplication, contrôle des événements hors ordre, délais, limites et secrets côté serveur. Vérifier droits et consentements avant actions réelles. Ne jamais exposer les fournisseurs d'acquisition de prospects au client si le kit l'interdit.
- Crédits/facturation : écritures atomiques et idempotentes, journal des mouvements, contrôle concurrent des soldes et rapprochement des paiements/consommations.
- Logs structurés et corrélation sans secrets ni données sensibles ; sauvegardes/restauration, rétention et suppression selon règles validées.

## 5. Dépendances autorisées

web/dashboard/admin → contracts, ui, domain, i18n et config ; api/worker → contracts, db, server-core si utile, config ; server-core → contracts/db ; db → configuration serveur nécessaire. Aucun import des applications depuis les packages, aucun import des frontends vers api/worker/db/server-core ; pas de cycle. Les modules communiquent via interfaces/services publics plutôt que par accès aux détails internes d'un autre module.

## 6. Ordre de création

1. P00 : audit du kit, validation arborescence et état Git.
2. F01 : créer le workspace racine et apps/dashboard, puis apps/web et apps/admin selon les missions. Créer contrats et UI au premier usage ; démarrage Windows sans Docker ni WSL. Ne pas initialiser API, base ni worker à ce stade. Créer packages seulement quand utilisés.
3. F02–F05 : interfaces, mocks et recette frontend selon ROADMAP.md.
4. B01–B06 : créer API, db, worker et services partagés progressivement ; configurer services de test isolés. Docker/WSL reportés ; alternative hébergée approuvée si nécessaire.
5. Intégration, sécurité, recette, préproduction et production selon ROADMAP.md.

## 7. Règles de validation

Chaque IA lit ce fichier avant toute mission, contrôle les frontières, exécute les scripts pertinents (lint, typecheck, test, build), documente les résultats réels et actualise ROADMAP.md et PASSATION.md. Si un écart est nécessaire, expliquer la cause, les alternatives, les impacts et attendre validation avant changement structurant. Aucun secret ni document confidentiel dans le dépôt cible privé. Aucun commit/push/dépense/déploiement sans autorisation. Un agent écrit à la fois. Les tests, contrats et configurations doivent évoluer avec le code ; aucun dossier vide ni abstraction spéculative. Le document n'est pas une preuve que l'architecture ou le code a déjà été implémenté.
