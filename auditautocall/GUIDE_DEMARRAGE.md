# 🚀 Guide de Démarrage — Agent de Sécurité Codex & Audit AutoCall

Ce dossier `auditautocall/` contient l'ensemble du dépôt et des outils de l'**agent de sécurité officiel OpenAI Codex Security** (`@openai/codex-security`), configuré pour auditer l'application **AutoCall**.

---

## 📁 Contenu du Dossier `auditautocall/`

| Fichier / Dossier | Description |
| :--- | :--- |
| **`PROMPT_AUDIT_SECURITE.md`** | **Le fichier de prompt principal à remplir** avec vos consignes, périmètres et priorités d'audit. |
| **`action.yml`** | Action GitHub prête à l'emploi pour automatiser les scans de sécurité dans vos workflows CI/CD. |
| **`github-action/`** | Code source TypeScript et runtime de l'Action GitHub Codex Security. |
| **`sdk/`** | SDK TypeScript complet et documentation officielle de Codex Security. |
| **`plugins/`** | Plugins de sécurité spécialisés pour l'analyse approfondie et les règles de conformité. |
| **`docker/` & `compose.yaml`** | Environnements conteneurisés pour exécuter des scans en sandbox étanche. |
| **`SECURITY.md`** | Modèle de politique de sécurité et règles de détection. |
| **`README.md`** | Documentation technique complète d'origine de l'agent. |

---

## ⚡ En 3 Étapes Rapides

### 1. Remplir le Brief d'Audit
Ouvrez le fichier [PROMPT_AUDIT_SECURITE.md](file:///c:/Projet%20web/AutoCall/auditautocall/PROMPT_AUDIT_SECURITE.md) et complétez les sections selon vos besoins (routes sensibles, politiques de tokens, webhooks Twilio/Stripe, etc.).

### 2. Définir votre clé API
Assurez-vous que votre clé d'API OpenAI est configurée dans votre terminal :
```powershell
$env:OPENAI_API_KEY = "votre-cle-api-openai"
```

### 3. Lancer le Scan
Exécutez simplement la commande CLI suivante depuis la racine du projet :
```bash
# Scan ciblé sur le projet Next.js
npx @openai/codex-security scan ./AutoCall-NextJS --fail-on-severity high

# Ou scan approfondi (Deep scan)
npx @openai/codex-security scan ./AutoCall-NextJS --mode deep --effort high
```
