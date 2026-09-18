# 🧠 GUIDE MAÎTRE MULTI-AGENTS — UX.UI-21ST-MCP POWERPACK
*(Compatible : Google Antigravity, OpenAI Codex, Claude Code, Cursor, Windsurf)*

Bienvenue dans le dépôt maître **UX.UI-21ST-MCP**, conçu pour transformer les agents IA en développeurs frontend de calibre production. Ce kit unifie la **pensée design stratégique** (UI/UX Pro Max) et le **catalogue de composants réels** (21st.dev MCP).

---

## 🏗️ ARCHITECTURE DU KIT

```text
UX.UI-21ST-MCP/
├── AGENTS.md                  # Instruction maîtresse multi-agents (Ce document)
├── GEMINI.md                  # Configuration dédiée pour Antigravity
├── CLAUDE.md                  # Configuration pour Claude Code
├── .cursorrules               # Configuration pour Cursor IDE
├── mcp.json / .mcp.json       # Déclaration du serveur MCP 21st.dev
├── server.json                # Schéma officiel Model Context Protocol
├── skills/
│   ├── ui-ux-pro-max/         # Moteur de recherche et intelligence design (240+ styles, palettes)
│   ├── 21st-ui/               # Pilotage du MCP 21st.dev (+10 000 composants React/Tailwind)
│   └── anti-slop-design/      # Règles d'excellence esthétique (Apple/Stripe, zéro emoji)
├── .agents/                   # Standard d'intégration pour agents IA autonomes
│   ├── rules/                 # Règles modulaires (design, composants, mobile, typo)
│   ├── skills/                # Miroir des compétences pour découverte native
│   └── plugins/               # Manifeste de publication locale
├── src/
│   ├── ui-ux-pro-max/         # Code source du moteur BM25 & bases CSV
│   └── mcp/                   # Proxy et outils MCP 21st
├── scripts/
│   └── search.py              # Commande rapide de recherche design
└── docs/                      # Guides de démarrage et bibliothèque de prompts
```

---

## 💎 DIRECTIVE ABSOLUE : LES 5 LOIS DU DESIGN ULTRA-PREMIUM (ANTI "AI SLOP")

Chaque agent travaillant avec cette base doit appliquer STRICTEMENT les règles suivantes :

### 1. Zéro "AI Slop" & Esthétique Épurée (Style Apple / Stripe / Linear)
- **Bannir les designs lourds** : Aucun gros pavé de couleur criarde, aucun badge fluorescent disproportionné, aucune bordure épaisse ou dégradé violet/rose générique.
- **Fonds & Bordures** : Utiliser des fonds blancs ou gris très légers (`bg-white`, `bg-gray-50/50`, `bg-zinc-900/50`), des bordures subtiles de 1px (`border-gray-200` ou `border-gray-300`, `border-white/10`) et des micro-ombres délicates (`shadow-2xs`, `shadow-xs`, `shadow-sm`).
- **Respiration & Grille** : Espacements aérés (`gap-4`, `gap-6`, `p-6`, `py-12`), utilisation de Bento Grids équilibrées et de cartes aux coins doux (`rounded-xl` ou `rounded-2xl`).

### 2. Typographie Sobre & Naturelle (Jamais de TOUT-MAJUSCULE agressif)
- Rédiger systématiquement les libellés, sous-titres et placeholders en français (ou anglais selon la demande) soigné et en casse standard (ex: *"Titulaire de la carte"* et non *"NAME ON THE CARD *" ou *"TITULAIRE *" en majuscules criardes).
- **Hiérarchie typographique fine** :
  - Titres nets : `font-bold text-gray-900 dark:text-white tracking-tight`
  - Sous-titres discrets : `text-sm text-gray-500 dark:text-zinc-400`
  - Chiffres / Métriques : `font-semibold tabular-nums text-2xl`
  - Polices modernes recommandées : Inter, Plus Jakarta Sans, Outfit, Geist, Satoshi.

### 3. 100% Vecteurs SVG Purs (Zéro Emoji & Zéro Pixellisation)
- N'utilise **JAMAIS d'emojis informels** (comme 💬, 💳, 📦, 🔥, 🚀) dans les interfaces professionnelles.
- Utilise exclusivement de **véritables composants vectoriels SVG** (`lucide-react`, `@heroicons/react`, ou SVG inline purs).
- Alignement vectoriel au millimètre sur tous les écrans (Retina, OLED, Mobile).

### 4. Ergonomie Mobile-First & Zéro Collision de Texte
- **Pas d'écrasement sur mobile** : Sur les écrans `< md` (smartphones), ne compresse jamais les textes dans des micro-colonnes étroites. Laisse le texte respirer sur 100% de la largeur avec un empilement vertical fluide (`flex-col md:flex-row`, `w-full`).
- **Inputs compacts et tactiles** : Hauteur de champ standard `h-10` ou `h-11`, coins arrondis doux (`rounded-xl` ou `rounded-lg`), padding intérieur équilibré (`px-3.5`).
- Les éléments côte à côte (ex: Date d'expiration et CVC) doivent être alignés au cordeau sans texte qui passe à la ligne de manière disgracieuse.

### 5. Micro-Réassurance Discrète
- Remplace les gros blocs d'alerte encombrants par une simple **ligne sobre et élégante** avec icône cadenas/bouclier vectorielle SVG (ex: `🔒 Transaction chiffrée SSL 256-bit certifiée PCI-DSS`).

---

## 🔄 WORKFLOW D'EXÉCUTION OBLIGATOIRE DE L'AGENT

Lors de toute tâche de création ou de refonte d'interface, l'agent doit suivre les 4 étapes :

### Étape 1 : Exploration & Intelligence Design (UI/UX Pro Max)
Avant de coder, exécuter une recherche locale pour identifier la palette, la typographie et le style exacts :
```bash
# Identifier le style et les classes adaptées au projet
python scripts/search.py "<type_de_projet_ou_besoin>" --domain style

# Trouver la palette de couleurs parfaite
python scripts/search.py "<type_de_projet>" --domain color

# Trouver la typographie idéale
python scripts/search.py "<type_de_projet>" --domain typography

# Générer un Design System complet
python scripts/search.py "<type_de_projet>" --design-system
```

### Étape 2 : Recherche & Récupération de Composants (21st.dev MCP)
Plutôt que de coder à partir de zéro, exploiter le catalogue 21st.dev via les outils MCP :
1. `search` : Chercher le composant requis (ex: `"bento grid analytics"`, `"pricing table toggle"`, `"animated navbar"`).
2. `get_component` : Récupérer le code TSX/JSX complet.
3. `search_logo` : Récupérer les logos de marques vectoriels propres au format TSX.

### Étape 3 : Assemblage, Nettoyage & Harmonisation
1. Adapter les props et tokens au style défini à l'Étape 1.
2. Utiliser l'utilitaire `cn()` (`clsx` + `tailwind-merge`) pour fusionner les classes conditionnelles.
3. Vérifier le support systématique du mode sombre (`dark:`).
4. Remplacer les placeholders par des SVG vectoriels précis.

### Étape 4 : Audit Qualité & Accessibilité
- Vérifier la conformité des contrastes (WCAG AA).
- Valider le rendu mobile sans débordement horizontal.
- S'assurer que le code est exempt de toute régression de build (`npm run build` ou `tsc`).
