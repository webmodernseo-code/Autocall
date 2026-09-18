---
name: anti-slop-design
description: Ultra-premium design rules and heuristics to eliminate generic "AI slop". Enforces Apple/Stripe-level aesthetics, pure SVG vectors, zero informal emojis, mobile-first responsive layouts, and natural French/English typography.
---

# 💎 Directive Design Ultra-Premium & Anti "AI Slop"

Ce skill garantit que chaque interface produite respecte les standards les plus stricts du design d'exception.

## 1. Zéro "AI Slop" & Esthétique Épurée (Style Apple / Stripe)
- **Bannir les designs lourds** : Aucun gros pavé de couleur criarde, aucun badge fluorescent disproportionné, aucune bordure épaisse ou dégradé tape-à-l'œil.
- **Fonds & Bordures** : Utiliser des fonds blancs ou gris très légers (`bg-white`, `bg-gray-50/50`, `bg-zinc-900/50`), des bordures subtiles de 1px (`border-gray-200` ou `border-gray-300`, `border-white/10`) et des micro-ombres délicates (`shadow-2xs`, `shadow-xs`, `shadow-sm`).
- **Espacement & Respiration** : Privilégier des espacements aérés (`gap-4`, `gap-6`, `p-6`, `py-12`), des grilles modulaires structurées (Bento Grid) et des transitions fluides.

## 2. Typographie Sobre & Naturelle (Jamais de TOUT-MAJUSCULE agressif)
- Rédiger systématiquement les libellés, sous-titres et placeholders en casse standard (ex: *"Titulaire de la carte"* et non *"NAME ON THE CARD *" ou *"TITULAIRE *" en majuscules criardes).
- **Hiérarchie typographique fine** :
  - Titres nets : `font-bold text-gray-900 dark:text-white tracking-tight`
  - Sous-titres discrets : `text-sm text-gray-500 dark:text-zinc-400`
  - Chiffres / Métriques : `font-semibold tabular-nums text-2xl`
  - Polices modernes recommandées : Inter, Plus Jakarta Sans, Outfit, Geist, Satoshi.

## 3. 100% Vecteurs SVG Purs (Zéro Emoji & Zéro Pixellisation)
- N'utilise **JAMAIS d'emojis informels** (comme 💬, 💳, 📦, 🔥, 🚀) dans les interfaces professionnelles.
- Utilise exclusivement de **véritables composants vectoriels SVG** purs (`lucide-react`, `@heroicons/react`, ou SVG inline propres).
- Alignement vectoriel au millimètre sur tous les écrans (Retina, OLED, Mobile).

## 4. Ergonomie Mobile-First & Zéro Collision de Texte
- **Pas d'écrasement sur mobile** : Sur les écrans `< md` (smartphones), ne jamais compresser les textes dans des micro-colonnes étroites. Laisser le texte respirer sur 100% de la largeur avec un empilement vertical fluide (`flex-col md:flex-row`, `w-full`).
- **Inputs compacts et tactiles** : Hauteur de champ standard `h-10` ou `h-11`, coins arrondis doux (`rounded-xl` ou `rounded-lg`), padding intérieur équilibré (`px-3.5`).
- Les éléments côte à côte (ex: Date d'expiration et CVC) doivent être alignés au cordeau sans texte qui passe à la ligne de manière disgracieuse.

## 5. Micro-Réassurance Discrète
- Remplacer les gros blocs d'alerte encombrants par une simple **ligne sobre et élégante** avec icône cadenas/bouclier vectorielle SVG (ex: `🔒 Transaction chiffrée SSL 256-bit certifiée PCI-DSS`).
