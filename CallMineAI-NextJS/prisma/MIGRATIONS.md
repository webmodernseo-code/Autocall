# Gestion des migrations Prisma

Ce dossier est la chronologie officielle de la base de données. Le fichier
`schema.prisma` décrit l'état final attendu ; `migrations/` décrit, dans l'ordre,
comment atteindre cet état sans perdre les données déjà enregistrées.

## Règles

1. Ne jamais modifier une migration déjà appliquée sur staging ou production.
2. Ne jamais utiliser `db push`, `migrate dev` ou `migrate reset` en production.
3. Toute modification de `schema.prisma` doit être accompagnée d'une nouvelle
   migration relue et testée.
4. Les migrations et la modification applicative correspondante sont livrées
   dans la même pull request.
5. Une sauvegarde restaurable précède toute migration destructive.

## Développement : ajouter une évolution

Exemple : ajout d'un champ facultatif `company_name` à un client.

1. Modifier `schema.prisma` :

   ```prisma
   model Client {
     // champs existants
     company_name String? @db.VarChar(255)
   }
   ```

2. Générer et appliquer la migration sur la base locale :

   ```bash
   npm run db:migrate:dev -- --name add_client_company_name
   ```

3. Relire le nouveau `migration.sql`, puis vérifier :

   ```bash
   npm run db:migrate:status
   npm run build
   ```

4. Committer ensemble `schema.prisma`, le nouveau dossier de migration et le
   code qui utilise le champ.

## Staging et production

La CI ou le job de release exécute uniquement :

```bash
npm ci
npx prisma generate
npm run db:migrate
```

`prisma migrate deploy` applique seulement les migrations versionnées encore
absentes de la base. Il ne devine pas de changement et ne supprime pas la base.

## Exemple concret : pourquoi l'historique est indispensable

Version 1 possède une colonne `name`. Version 2 souhaite la remplacer par
`display_name`. Renommer brutalement la colonne peut casser l'ancienne version
pendant un déploiement. Un déploiement sûr se fait en plusieurs étapes :

1. migration A : ajouter `display_name` sans supprimer `name` ;
2. code A : écrire dans les deux colonnes et recopier les anciennes valeurs ;
3. code B : lire uniquement `display_name` après vérification ;
4. migration B ultérieure : supprimer `name`.

Chaque étape est datée, relue, testable en staging et appliquée une seule fois.
Sans migrations, deux serveurs peuvent avoir des structures différentes sans
que l'équipe sache précisément pourquoi.

## Nouvelle installation

Sur une base MySQL vide :

```bash
npm ci
npx prisma generate
npm run db:migrate
npm run db:seed
```

La migration initiale crée toutes les tables. Les migrations suivantes les font
évoluer dans le même ordre sur chaque environnement.

## Base existante créée auparavant avec `db push`

Ne pas exécuter directement la migration initiale : les tables existent déjà.
Il faut marquer cette migration comme déjà appliquée après avoir confirmé que la
base correspond exactement au schéma :

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --exit-code
npx prisma migrate resolve --applied 20261004000000_initial_schema
npm run db:migrate:status
```

Effectuer d'abord cette procédure sur une copie de la base. Un code de sortie
non nul à l'étape `migrate diff` signifie qu'il existe une dérive à analyser ;
il ne faut alors pas marquer la migration comme appliquée.

## Incidents

- Migration échouée : arrêter le déploiement, conserver les logs et consulter
  `npx prisma migrate status`. Ne pas éditer la migration déjà publiée.
- Migration appliquée manuellement : créer une migration corrective et utiliser
  `prisma migrate resolve` seulement après diagnostic et sauvegarde.
- Retour applicatif : redéployer l'image précédente. Pour la base, préférer une
  migration corrective ; restaurer une sauvegarde uniquement selon le runbook.
- Dérive suspectée : comparer la base au schéma avec `prisma migrate diff`.

La commande `npm run db:migrate:reset` efface toutes les données et n'est
acceptable que sur une base locale jetable. Le script refuse son exécution quand
`NODE_ENV=production`.
