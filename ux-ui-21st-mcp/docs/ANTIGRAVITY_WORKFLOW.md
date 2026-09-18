# 🌌 GUIDE DE DÉVELOPPEMENT AVEC ANTIGRAVITY IDE

Ce guide explique comment tirer le meilleur parti de **UX.UI-21ST-MCP** dans Google Antigravity.

---

## 1. Comment Antigravity exploite ce dépôt

Lorsque tu ouvres ou références ce dépôt dans Antigravity :
1. **Découverte automatique des compétences (Skills)** : Antigravity charge automatiquement les compétences `skills/ui-ux-pro-max`, `skills/21st-ui` et `skills/anti-slop-design`.
2. **Directive Système (`GEMINI.md` & `AGENTS.md`)** : Antigravity intègre les règles d'excellence (Apple/Stripe, zéro emoji, vecteurs SVG, mobile first).
3. **Moteur de recherche local** : L'agent peut interroger la base des 240+ styles et palettes instantanément en exécutant `node scripts/search.mjs` ou `python scripts/search.py`.
4. **Protocole MCP 21st.dev** : L'agent peut importer directement des composants React/Tailwind via le serveur 21st.dev.

---

## 2. Le Workflow Optimal en 3 Étapes

### 🔹 Étape 1 : Demander la conception à Antigravity
Formule ta demande en décrivant ton besoin métier :
> *"Je veux créer une page de tableau de bord pour CallMindAI avec suivi des appels entrants, taux de conversion des leads et graphique de volume d'appels. Utilise le kit UX.UI-21ST-MCP pour définir la charte et trouver les composants."*

### 🔹 Étape 2 : Antigravity explore et prépare le Design System
L'agent va :
1. Consulter `skills/ui-ux-pro-max` pour sélectionner la typographie (ex: Inter + Plus Jakarta Sans) et la palette (ex: Slate/Indigo/Emerald).
2. Interroger 21st MCP pour trouver les cartes KPI, le tableau de données et le graphique.
3. Générer un plan de mise en œuvre conforme aux règles anti-slop.

### 🔹 Étape 3 : Implémentation & Finition
L'agent écrit le code TypeScript/React, connecte les composants réels, vérifie la réactivité mobile et valide l'absence d'erreurs TypeScript.

---

## 3. Exemples de commandes directes pour tester

```bash
# Rechercher les styles pour un dashboard analytique
node scripts/search.mjs "analytics dashboard" --domain style

# Trouver une palette sombre élégante
node scripts/search.mjs "dark luxury saas" --domain color

# Trouver les heuristiques UX pour formulaires et checkout
node scripts/search.mjs "form checkout payment" --domain ux
```
