# 🎨 UX.UI-21ST-MCP — Le Powerpack Frontend & Design Intelligence pour Agents IA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-8A2BE2.svg)](mcp.json)
[![Antigravity Ready](https://img.shields.io/badge/Antigravity-Ready-4285F4.svg)](GEMINI.md)
[![Codex & Claude](https://img.shields.io/badge/Codex%20%26%20Claude-Optimized-00A67E.svg)](AGENTS.md)
[![UI Styles](https://img.shields.io/badge/UI%20Styles-240%2B-orange.svg)](skills/ui-ux-pro-max)
[![Components](https://img.shields.io/badge/21st.dev-10%2C000%2B%20Components-blue.svg)](https://21st.dev)

> **La fondation ultime pour vos projets frontend assistés par IA.**  
> Combine l'intelligence de conception UI/UX de **UI/UX Pro Max** (240+ styles, 127+ typographies, palettes, règles UX) et le catalogue de plus de 10 000 composants réels React / Tailwind de **21st.dev MCP (ex-Magic MCP)**.

---

## 🌟 Pourquoi ce dépôt ?

Lorsque vous demandez à une IA de créer une interface, elle a souvent tendance à produire du design générique (*"AI Slop"* : dégradés violets fluo, pavés criards, emojis informels, responsive cassé).

Ce kit résout ce problème en fusionnant :
1. **Le Cerveau (UI/UX Pro Max)** : Sélectionne le style architectural, les tokens de couleur HSL, la typographie Google Fonts et les règles ergonomiques adaptées à votre industrie.
2. **Le Magasin de Pièces (21st.dev MCP)** : Récupère et injecte directement des composants React/Tailwind professionnels, testés, modernes et prêts pour la production.
3. **La Directive Ultra-Premium (Anti-Slop)** : Impose les standards d'excellence esthétique (style Apple, Stripe, Linear, Vercel) avec zéro emoji, vecteurs SVG purs et mobile-first garanti.

---

## 📁 Architecture du Dépôt

```text
UX.UI-21ST-MCP/
├── AGENTS.md                  # Instruction maîtresse universelle pour tous les agents IA
├── GEMINI.md                  # Directive système spécifique pour Google Antigravity
├── CLAUDE.md                  # Directive pour Claude Code
├── .cursorrules               # Configuration pour Cursor IDE
├── mcp.json / .mcp.json       # Déclaration native du serveur 21st.dev MCP
├── server.json                # Spécification officielle Model Context Protocol
│
├── skills/                    # Compétences IA prêtes à l'emploi
│   ├── ui-ux-pro-max/         # Moteur d'intelligence UI/UX (CSVs & scripts de recherche)
│   ├── 21st-ui/               # Pilotage du MCP 21st (+10 000 composants)
│   └── anti-slop-design/      # Directive des 5 lois du design ultra-premium
│
├── .agents/                   # Standard Agent Workspace pour Antigravity & Codex
│   ├── rules/                 # 4 règles granulaires (standards, mcp, mobile, typo)
│   ├── skills/                # Miroir des compétences
│   └── plugins/               # Manifeste marketplace local
│
├── src/
│   ├── ui-ux-pro-max/         # Bases de données canoniques (styles, couleurs, typo, charts)
│   └── mcp/                   # Code source et proxy MCP 21st.dev
│
├── scripts/
│   ├── search.mjs             # Moteur de recherche haute performance Node.js (zéro dépendance)
│   ├── search.py              # Wrapper Python pour recherche BM25
│   ├── setup.ps1              # Script d'installation Windows PowerShell
│   └── setup.sh               # Script d'installation macOS / Linux
│
└── docs/                      # Documentation complète & Bibliothèque de prompts
    ├── ANTIGRAVITY_WORKFLOW.md# Guide pas-à-pas pour Antigravity IDE
    ├── CODEX_WORKFLOW.md      # Guide pour OpenAI Codex, Claude Code & Cursor
    ├── PROMPT_LIBRARY.md      # Prompts d'exception prêts à copier-coller
    └── DESIGN_SYSTEM_CHEATSHEET.md # Aide-mémoire palettes & typographies
```

---

## 🚀 Démarrage Rapide

### 1. Cloner le dépôt
```bash
git clone https://github.com/webmodernseo-code/UX.UI-21ST-MCP.git
cd UX.UI-21ST-MCP
```

### 2. Initialiser l'environnement
- **Sur Windows (PowerShell)** :
  ```powershell
  .\scripts\setup.ps1
  ```
- **Sur macOS / Linux** :
  ```bash
  chmod +x scripts/setup.sh
  ./scripts/setup.sh
  ```

### 3. Configurer la clé 21st.dev MCP (Optionnel mais recommandé)
1. Obtenez votre clé API gratuite sur [21st.dev/mcp](https://21st.dev/mcp).
2. Définissez la variable d'environnement `API_KEY_21ST="votre_cle"`.

---

## 🔍 Comment utiliser le Moteur de Recherche UI/UX

Vous pouvez interroger les 240+ styles et palettes directement en ligne de commande :

```bash
# Recherche générale par mot-clé (auto-détection du domaine)
node scripts/search.mjs "fintech dashboard"

# Recherche ciblée par domaine :
node scripts/search.mjs "executive bento" --domain style      # Styles UI, classes Tailwind & keywords
node scripts/search.mjs "dark luxury saas" --domain color     # Palettes de couleurs complètes
node scripts/search.mjs "modern clean" --domain typography    # Combinaisons de polices Google Fonts
node scripts/search.mjs "checkout payment" --domain ux        # Heuristiques & anti-patterns UX
node scripts/search.mjs "conversion saas" --domain landing    # Structures de page d'atterrissage
node scripts/search.mjs "time series" --domain chart          # Types de graphiques recommandés
```

---

## 💎 Les 5 Lois du Design Ultra-Premium (Directive Anti-Slop)

1. **Zéro "AI Slop" (Style Apple / Stripe)** : Fonds clairs ou zinc profonds, bordures discrètes de 1px (`border-gray-200` ou `border-white/10`), micro-ombres douces.
2. **Typographie Sobre & Naturelle** : Rédigée en casse standard soignée, jamais de majuscules agressives, polices haut de gamme (Inter, Plus Jakarta Sans, Outfit, Geist).
3. **100% Vecteurs SVG Purs** : Zéro emoji informel dans l'UI (pas de 💬, 💳, 📦). Exclusivement des icônes SVG précises.
4. **Ergonomie Mobile-First** : Aucun écrasement de texte, inputs tactiles `h-10`/`h-11`, empilement vertical fluide.
5. **Micro-Réassurance Discrète** : Cadenas/bouclier vectoriel discret pour certifier les transactions sans alerte anxiogène.

---

## 🤖 Utilisation avec les Agents IA

### Dans Google Antigravity
Ouvrez ce dossier ou ajoutez-le à votre espace de travail. Antigravity détectera immédiatement `GEMINI.md`, `skills/` et `mcp.json`. Vous pouvez lui dire :
> *"Crée la page d'accueil de mon SaaS en utilisant les composants de 21st MCP et la charte graphique UI/UX Pro Max."*

### Dans OpenAI Codex / Claude Code / Cursor
Les fichiers `AGENTS.md`, `CLAUDE.md`, `.cursorrules` et `.codex-plugin/` garantissent une compatibilité plug-and-play immédiate.

---

## 📄 Licence
Distribué sous licence **MIT**. Voir [LICENSE](LICENSE) pour plus d'informations.
