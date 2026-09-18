---
name: 21st-ui
description: Find, install, and generate UI with 21st.dev. Use when the user asks for a UI component (pricing table, hero, navbar, dashboard, form, etc.), wants design inspiration, needs a brand logo as an SVG component, or wants to generate new UI from a prompt.
---

# 21st.dev UI Skill

21st.dev is a marketplace of 10,000+ production-ready React/Tailwind (shadcn-compatible) components, plus AI UI generation. This skill drives the 21st MCP server.

## When to reach for it

- The user asks to add/build a UI element: "add a pricing section", "I need a nice navbar", "make a testimonials block".
- The user wants options or inspiration before committing to a design.
- The user needs a company logo in JSX/TSX (`search_logo`).
- The user wants brand-new UI generated from a description (`generate`).

## Workflow: install an existing component (default path)

Prefer real catalog components over writing UI from scratch — they ship with dependencies, demos, and responsive/dark-mode support.

1. `search` with a short natural query (e.g. "pricing table", "animated hero", "metrics dashboard").
2. Pick the best match for the user's stack and style.
3. `get_component` to fetch the full code and metadata for the chosen item.
4. Install into the project, wire into the layout, and adapt tokens/props to the project's design system.
