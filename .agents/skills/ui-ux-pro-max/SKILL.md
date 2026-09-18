---
name: ui-ux-pro-max
description: Searchable design intelligence for UI/UX styles, color palettes, font pairings, chart recommendations, UX guidelines, and stack-specific best practices. Use whenever designing, styling, or auditing web & mobile interfaces.
---

# UI/UX Pro Max — Design Intelligence Skill

Provides 240+ design styles, 127+ font pairings, 99+ UX heuristics, tailored color palettes, and stack-specific rules (Next.js, Tailwind, React, etc.) via a fast, local BM25 search engine.

## When to Use

1. **Before writing frontend code** : Identify the product archetype (SaaS, FinTech, E-Commerce, Healthcare) and select harmonious palettes & typography.
2. **When choosing a visual aesthetic** : Search for UI styles (Minimalist, Bento Grid, Apple Clean, Glassmorphism, Dark Luxury) to get exact CSS keywords, Tailwind classes, and layout rules.
3. **When implementing complex UI** : Retrieve chart types, motion intensity, landing page CTA structures, and UX anti-patterns to avoid.

## How to Query the Knowledge Engine

Run the local Python search script:

```bash
# General search with auto-domain detection
python scripts/search.py "<query>"

# Search specific domains:
python scripts/search.py "<query>" --domain style       # UI styles, CSS classes, keywords
python scripts/search.py "<query>" --domain typography  # Curated font pairings & Google Fonts imports
python scripts/search.py "<query>" --domain color       # Tailored color palettes (hex / HSL tokens)
python scripts/search.py "<query>" --domain ux          # UX heuristics, accessibility & anti-patterns
python scripts/search.py "<query>" --domain chart       # Best chart types for data visualization
python scripts/search.py "<query>" --domain landing     # Hero sections, landing structures, CTA logic
python scripts/search.py "<query>" --domain icons       # Icon recommendations (Lucide, Phosphor, Heroicons)

# Generate a complete cohesive Design System:
python scripts/search.py "<query>" --design-system --variance 3 --motion 2 --density 4
```
