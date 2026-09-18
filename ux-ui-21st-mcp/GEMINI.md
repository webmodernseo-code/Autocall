# 🌌 INSTRUCTIONS SYSTÈME POUR ANTIGRAVITY IDE

Ce fichier configure le comportement d'Antigravity sur ce projet ou lorsqu'il utilise ce dépôt comme bibliothèque de base.

## 🚀 Activation des Compétences & Outils

1. **Compétence UI/UX Pro Max** :
   - Fichiers de données dans `skills/ui-ux-pro-max/data/` et scripts dans `skills/ui-ux-pro-max/scripts/`.
   - L'agent peut interroger les styles, palettes, heuristiques UX et polices directement via le script de recherche :
     ```powershell
     python scripts/search.py "<query>" --domain style|color|typography|ux|chart|landing
     ```

2. **Serveur MCP 21st.dev** :
   - Configuration déclarée dans `mcp.json`.
   - Utiliser les outils `search`, `get_component`, `search_logo`, et `generate` pour interagir avec 21st.dev.
   - Si la clé API est absente, informer discrètement l'utilisateur qu'il peut obtenir sa clé gratuite sur `https://21st.dev/mcp` et définir `API_KEY_21ST`.

3. **Règles Strictes de Qualité Frontend (Directive Anti-Slop)** :
   - Consulter `skills/anti-slop-design/SKILL.md` et `.agents/rules/`.
   - Toujours privilégier des interfaces épurées de type Apple / Stripe / Vercel.
   - Bannir les emojis informels (💬, 💳, 📦) et utiliser exclusivement des SVG vectoriels (`lucide-react` ou SVG purs).
   - Garantir un responsive mobile irréprochable avec empilement vertical fluide.
