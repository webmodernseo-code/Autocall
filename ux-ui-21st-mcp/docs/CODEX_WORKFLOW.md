# 🤖 GUIDE DE DÉVELOPPEMENT AVEC CODEX / CLAUDE CODE / CURSOR

Ce guide détaille l'utilisation de **UX.UI-21ST-MCP** avec les agents compatibles OpenAI Codex, Claude Code et Cursor.

---

## 1. Configuration MCP (Model Context Protocol)

Pour connecter l'agent au catalogue de 10 000+ composants de 21st.dev :

1. Récupère ta clé API gratuite sur [21st.dev/mcp](https://21st.dev/mcp).
2. Définis la variable d'environnement ou configure ton client :
   - Pour **Claude Code** :
     ```bash
     claude mcp add 21st https://21st.dev/api/mcp -H "x-api-key: YOUR_21ST_API_KEY"
     ```
   - Pour **Cursor** : Ajouter dans les paramètres MCP (`mcp.json`) le serveur `21st`.
   - Pour **Codex / Plugins** : Le fichier `.codex-plugin/plugin.json` et `.mcp.json` sont déjà configurés à la racine du dépôt.

---

## 2. Commandes de Recherche Design

L'agent peut utiliser les scripts de recherche pour obtenir instantanément des spécifications techniques de style :

```bash
# Recherche générale
node scripts/search.mjs "saas landing page"

# Recherche de composants de navigation
node scripts/search.mjs "header navbar responsive" --domain style

# Recherche de polices Google Fonts
node scripts/search.mjs "modern clean tech" --domain typography
```

---

## 3. Bonnes pratiques de prompt avec Codex & Claude

Pour obtenir les meilleurs résultats :
1. **Spécifier le niveau d'exigence** : Mentionner *"Applique les règles du standard Apple/Stripe définies dans AGENTS.md"*.
2. **Imposer les vecteurs SVG** : Rappeler *"N'utilise aucun emoji informel, utilise exclusivement Lucide Icons ou SVG purs"*.
3. **Valider le responsive** : *"Assure-toi que les cartes et grilles basculent en colonne unique sur mobile sans compression de texte"*.
