# 🤖 INSTRUCTIONS POUR CLAUDE CODE & CODEX

Ce fichier guide Claude Code et les agents compatibles Codex lorsqu'ils interagissent avec ce projet.

## Commandes de Recherche Design

```bash
# Recherche générale (détection automatique)
python3 scripts/search.py "<query>"

# Recherche par domaine
python3 scripts/search.py "<query>" --domain style
python3 scripts/search.py "<query>" --domain color
python3 scripts/search.py "<query>" --domain typography
python3 scripts/search.py "<query>" --domain ux
python3 scripts/search.py "<query>" --domain chart
python3 scripts/search.py "<query>" --domain landing

# Génération d'un Design System complet
python3 scripts/search.py "<query>" --design-system --variance <1-10> --motion <1-10> --density <1-10>
```

*(Sur Windows, utiliser `python` au lieu de `python3`)*

## Intégration 21st.dev MCP

- Serveur configuré dans `.mcp.json`.
- Outils disponibles : `search`, `get_component`, `generate`, `search_logo`.
- Clé d'authentification attendue via variable d'environnement `API_KEY_21ST` ou configuration client.

## Règles de Design Ultra-Premium

- Référence : Apple / Stripe / Linear / Vercel.
- Zéro emoji informel dans l'interface (exclusivement des icônes SVG).
- Pas de texte en majuscules criardes sur les sous-titres et placeholders.
- Mobile-first avec grilles réactives (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
