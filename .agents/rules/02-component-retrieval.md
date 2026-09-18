# Recherche & Intégration de Composants (21st.dev MCP)

Lorsqu'un composant d'interface est requis (cartes, tableaux, formulaires, modales, graphiques, navigation) :

1. **Recherche prioritaire** : Interroger le serveur 21st.dev MCP via `search` avec des mots-clés précis en anglais (ex: `pricing card`, `kpi metrics stats`, `bento grid`, `glassmorphism navbar`).
2. **Récupération du code** : Utiliser l'outil `get_component` avec l'ID du composant sélectionné pour obtenir le code source TypeScript / React / Tailwind complet.
3. **Adaptation au Design System local** :
   - Remplacer les classes utilitaires conflictuelles par celles du projet cible.
   - Vérifier la compatibilité avec `cn()` (`clsx` + `tailwind-merge`).
   - Assurer le support natif du mode sombre (`dark:`).
4. **Zéro dépendance fantôme** : Vérifier que toutes les dépendances requises (`lucide-react`, `framer-motion`, `@radix-ui/*`) sont installées ou remplacées par du code standard.
