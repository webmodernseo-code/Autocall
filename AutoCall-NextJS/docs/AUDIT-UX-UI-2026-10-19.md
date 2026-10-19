# Audit UX/UI approfondi — AutoCall

Date : 19 octobre 2026  
Périmètre : portail client, administration et composants partagés  
Référence visuelle : branding AutoCall bleu/émeraude, surfaces claires, mode sombre anthracite

## Résultat global

L'interface possède une identité cohérente, une bonne couverture sombre et une bibliothèque de composants déjà exploitable. Les principaux défauts provenaient moins des couleurs que de la densité : textes de 9 à 11 px, capitales répétées, grilles à deux colonnes dès les plus petits écrans, cartes trop proches du fond clair et hiérarchies typographiques variables.

Le socle partagé a été corrigé pour améliorer immédiatement l'ensemble du produit sans refaire le branding.

## Mesures relevées avant correction

| Indicateur | Occurrences | Risque UX |
|---|---:|---|
| `text-[10px]` | 120 | Lecture difficile et fatigue visuelle |
| `text-[9px]` | 6 | Texte inférieur au seuil raisonnable d'interface |
| `uppercase` | 157 | Libellés agressifs, largeur accrue, localisation fragile |
| `grid-cols-2` | 120 | Cartes et textes comprimés sur mobile |
| `grid-cols-3` | 62 | Collisions possibles sur petites largeurs |
| `truncate` | 49 | Information masquée sans solution systématique |
| `whitespace-nowrap` | 30 | Débordement horizontal possible |
| `bg-white` | 827 | Surfaces nombreuses mais contraste auparavant affaibli par le token blanc cassé |

## Corrections appliquées

### Typographie

- `Plus Jakarta Sans`, déjà chargée par l'application, devient la police réelle des familles `sans` et `display`.
- Le corps utilise 15 px avec une hauteur de ligne de 1,55, rendu optimisé et antialiasing.
- Les titres utilisent `text-wrap: balance`; les textes longs peuvent se couper proprement.
- Les métriques partagées passent à 30 px, avec chiffres tabulaires et tracking serré.
- Les libellés des cartes statistiques passent de 11 px en capitales à 14 px en casse naturelle.

### Cartes et surfaces claires

- Le token `white` redevient un blanc réel `#FFFFFF`, distinct du fond gris `#F3F4F8`.
- Les ombres sont recalibrées en deux nappes très légères, visibles sans effet flottant excessif.
- Les cartes partagées utilisent une bordure ardoise nette, des coins de 16 px et une ombre cohérente.
- Le mode sombre conserve les surfaces anthracite et supprime les ombres inutiles.
- Deux primitives CSS (`surface-card`, `surface-card-interactive`) permettent d'harmoniser progressivement les écrans historiques.

### Mobile et collisions

- Les cartes statistiques s'empilent sur une colonne en mobile, puis passent progressivement à 2, 3, 4, 5 ou 6 colonnes selon l'espace disponible.
- `PageOverview` s'empile verticalement avant `sm`; ses étapes acceptent les retours à la ligne.
- Les en-têtes de carte placent l'action sous le titre sur mobile.
- La pagination est centrée et tactile sur mobile, alignée à droite à partir de `sm`.
- Le contenu principal possède une largeur maximale de 1600 px et des marges cohérentes sur écrans larges.

### Formulaires et interaction

- Les champs ont une hauteur tactile de 44 px, un padding horizontal stable et une taille de texte mobile de 16 px pour éviter le zoom iOS.
- Les focus sont visibles et cohérents en bleu AutoCall.
- Les boutons partagés ont une hauteur de 44 px, des coins doux, une ombre discrète et un mouvement de 1 px seulement.
- Les labels et textes d'aide disposent de primitives lisibles en clair comme en sombre.

## Points conformes conservés

- Palette AutoCall bleu principal, émeraude signal et anthracite sombre.
- Icônes vectorielles Lucide sans emojis informels.
- Bordures fines, rayons doux et ombres sobres.
- Contrastes sombres déjà satisfaisants sur la majorité des composants partagés.
- Navigation latérale et topbar translucides, cohérentes avec le positionnement SaaS premium.
- Usage de chiffres tabulaires pour les données et métriques.

## Normalisation exhaustive appliquée

- Les 339 occurrences de textes arbitraires entre 8 et 11 px ont été remplacées par une taille minimale de 12 px.
- Les 156 styles `uppercase` ont été remplacés par une casse naturelle, sans modifier le contenu ni le branding.
- Les grilles métier à deux ou trois colonnes s'empilent désormais sur mobile puis se recomposent à partir de `sm`/`lg`.
- Les grilles fonctionnelles du calendrier et du sélecteur horaire restent volontairement compactes.
- Le widget embarqué affiche également ses textes secondaires à 12 px minimum.

## Dette visuelle restante non bloquante

Les composants partagés sont corrigés, mais plusieurs écrans historiques contiennent encore des styles locaux. La priorité suivante est :

1. Examiner au cas par cas les `truncate` : tooltip accessible pour identifiants longs, retour à la ligne pour noms et descriptions.
2. Conserver `whitespace-nowrap` uniquement pour les dates, montants, statuts et actions de tableaux horizontalement défilants.
3. Migrer progressivement les cartes locales restantes vers `Card` ou `surface-card`.
4. Pour les tables critiques, proposer à terme une vue en cartes sur mobile plutôt qu'un simple scroll horizontal.

## Critères de recette visuelle

- Aucun texte fonctionnel sous 12 px; 14 px minimum pour les labels et contenus importants.
- Aucun titre ou bouton tronqué à 320 px de large.
- Aucune grille de données métier à deux colonnes avant 640 px si les valeurs peuvent être longues.
- Contraste WCAG AA pour texte normal et états interactifs.
- Focus clavier visible sur tous les contrôles.
- Sur fond clair, chaque carte doit rester identifiable sans dépendre uniquement de son ombre.
- Sur fond sombre, les bordures doivent structurer l'interface sans créer de quadrillage lumineux.

## Recommandation de validation

Effectuer une recette visuelle sur 320, 375, 768, 1280 et 1536 px, en français et en anglais, modes clair et sombre. Les pages prioritaires sont : Dashboard client, campagnes, contacts, appels, WhatsApp, paramètres, dashboard admin et plans.
