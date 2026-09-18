# Ergonomie Mobile-First & Zéro Collision

Toutes les interfaces doivent être pensées dès l'origine pour les petits écrans (`< 640px` et `< 768px`) :

1. **Aucun écrasement de texte** : Ne jamais forcer de grille multi-colonnes (`grid-cols-3` ou `grid-cols-4`) sur mobile. Utiliser systématiquement `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
2. **Cibles tactiles confortables** :
   - Boutons et inputs : hauteur minimale de `h-10` (40px) à `h-11` (44px) pour faciliter le clic au doigt.
   - Espacements verticaux suffisants entre éléments interactifs (`space-y-3` ou `gap-3`).
3. **Formulaires et inputs alignés** :
   - Les groupes de champs (ex: Date d'expiration et CVC) doivent rester lisibles sans retour à la ligne anarchique.
   - Utiliser `flex flex-col sm:flex-row` pour assurer une transition propre.
4. **Défilement horizontal proscrit** : Aucun `overflow-x-auto` involontaire sur la page principale.
