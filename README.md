# AutoCall

Monorepo AutoCall. Le premier frontend est l’espace client, dans `apps/dashboard`.

## Démarrer sous Windows

Installer Node 26.13.1 et pnpm 11.28.11. Si pnpm est absent du PATH, l’installer avec `npm.cmd install --global pnpm@11.28.11`.

Depuis la racine, dans PowerShell :

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd dev
```

Ouvrir [localhost:3001](http://127.0.0.1:3001) pour afficher l’aperçu de la vue d’ensemble. La planche est disponible sur [Direction visuelle](http://127.0.0.1:3001/direction-visuelle). Le démarrage local ne requiert ni Docker ni service externe.

## Vérifier

```powershell
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd build
```

## Bibliothèque UI

Composants dans `packages/ui` et tokens dans `packages/design-tokens`. La planche du dashboard contient les exemples interactifs. Pour ouvrir le catalogue Storybook, lance `pnpm.cmd storybook` puis ouvre [localhost:6006](http://127.0.0.1:6006). `pnpm.cmd build-storybook` compile le catalogue statique.

## Attributions

- Icônes [Solar](https://icon-sets.iconify.design/solar/) par 480 Design, licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Les couleurs de catégorie sont appliquées par AutoCall.
- Polices [Geist](https://github.com/vercel/geist-font) par Vercel, licence SIL Open Font License 1.1.
