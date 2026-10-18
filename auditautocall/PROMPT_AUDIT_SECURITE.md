# 🛡️ CADRE & PROMPT D'AUDIT DE SÉCURITÉ — AUTOCALL

> **Mode d'emploi** : Ce fichier sert de modèle de brief pour configurer et lancer l'agent de sécurité **OpenAI Codex Security** (`@openai/codex-security`) sur le projet **AutoCall**. Complétez les champs entre crochets `[...]` selon vos priorités et besoins d'audit.

---

## 1. Informations Générales & Périmètre de l'Audit

- **Nom du Projet** : AutoCall (Plateforme SaaS d'Appels & Téléphonie IA)
- **Date de l'audit** : [Ex: 18/10/2026]
- **Auditeur / Responsable** : [Votre Nom / Équipe DevOps / Sécurité]
- **Version cible / Branche Git** : [Ex: main ou staging]
- **Environnement audité** : [ ] Développement  |  [ ] Staging  |  [ ] Production

---

## 2. Portée du Scan (Scope)

### Dossiers & Fichiers ciblés en priorité :
- [x] `AutoCall-NextJS/src/app/api/` *(Routes API Next.js backend & endpoints critiques)*
- [x] `AutoCall-NextJS/src/` *(Logique métier frontend & backend)*
- [x] `AutoCall-NextJS/prisma/` *(Schémas de base de données, migrations et modèles)*
- [x] `AutoCall-NextJS/scripts/` *(Scripts de maintenance, workers et tâches planifiées)*
- [ ] Autres fichiers spécifiques à auditer :
  - `[Chemin/vers/fichier_1]`
  - `[Chemin/vers/fichier_2]`

### Dossiers & Éléments à exclure :
- [x] `node_modules/`
- [x] `.next/`
- [x] `dist/` ou répertoires de build temporaires

---

## 3. Vecteurs de Vulnérabilités & Points d'Attention Critiques

Cochez et précisez les axes que l'agent Codex Security doit traquer en priorité :

### A. Authentification, Sessions & Multi-Tenancy (IDOR / BOLA)
- [ ] Isolation stricte des données entre locataires (Tenant A ne doit jamais accéder aux appels/contacts de Tenant B).
- [ ] Validation des tokens JWT, durée de vie des sessions et renouvellement (refresh tokens).
- [ ] Protection contre les attaques CSRF, gestion des cookies (`SameSite`, `HttpOnly`, `Secure`).
- [ ] Vérification des permissions sur chaque route API sensible (`/api/client/*`, `/api/admin/*`).

### B. Secrets & Variables d'Environnement
- [ ] Détection de clés API ou secrets hardcodés dans le code source (GitHub leak prevention).
- [ ] Vérification stricte des variables exposées au navigateur (variables préfixées par `NEXT_PUBLIC_`).
- [ ] Gestion des secrets sensibles : `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, etc.

### C. Téléphonie, VoIP & Webhooks (Twilio / WebRTC)
- [ ] Validation cryptographique des signatures des webhooks entrants (ex: signature Twilio `X-Twilio-Signature`).
- [ ] Protection des flux audio, enregistrements d'appels et métadonnées de communication.
- [ ] Protection contre le détournement d'appels ou la consommation abusive de crédits téléphoniques (Toll Fraud).

### D. Paiement & Facturation (Stripe)
- [ ] Validation stricte des signatures de webhooks Stripe (`stripe-signature`).
- [ ] Idempotence du traitement des événements de facturation pour éviter les doubles créditations.
- [ ] Sécurité des données de cartes et conformité PCI-DSS (aucune donnée bancaire brute stockée).

### E. Injections & Sécurité des Données
- [ ] Injections SQL / ORM (requêtes Prisma brutes `$queryRawUnsafe`).
- [ ] Cross-Site Scripting (XSS) stocké ou réfléchi dans les interfaces client/dashboard.
- [ ] Server-Side Request Forgery (SSRF) lors d'appels externes ou webhooks sortants.
- [ ] Injections de prompt LLM (Prompt Injection / Jailbreak) influençant la logique métier.

### F. DoS, Rate Limiting & Validation des Entrées
- [ ] Rate limiting appliqué sur les routes d'authentification (`/login`, `/register`, `/reset-password`).
- [ ] Validation stricte des schémas d'entrées (ex: Zod, Joi) sur l'ensemble des routes API.
- [ ] Taille maximale des payloads et protection contre les attaques par déni de service.

---

## 4. Politique & Règles de Blocage (Gating)

Indiquez les règles de sévérité requises pour l'audit :

- **Seuil critique de blocage (Fail on Severity)** :
  - [ ] `critical` *(Échoue uniquement en cas de faille critique immédiate)*
  - [x] `high` *(Recommandé : échoue pour High & Critical)*
  - [ ] `medium` *(Échoue pour Medium, High et Critical)*
  - [ ] `none` *(Audit informatif seul, pas de blocage)*

- **Génération de correctifs automatiques (Auto-Patching)** :
  - [x] L'agent doit proposer un correctif (diff/patch) pour chaque vulnérabilité validée.
  - [ ] L'agent ne doit produire qu'un rapport d'analyse sans patch.

- **Formats de rapport souhaités** :
  - [x] Rapport Markdown détaillé (avec explications et recommandations)
  - [x] Rapport SARIF (pour intégration dans GitHub Code Scanning / SonarQube)
  - [x] Rapport JSON / CSV structuré

---

## 5. Directives Spécifiques & Instructions Additionnelles

*Rédigez ici vos instructions personnalisées à destination de l'agent :*

```text
[Exemple : Portez une attention particulière à la route /api/calls/initiate et à la gestion des crédits utilisateurs. Vérifiez également que les enregistrements vocaux ne sont accessibles que par le propriétaire légitime.]
```

---

## 6. Commandes Prêtes à l'Emploi pour Lancer l'Audit

Une fois ce document rempli, exécutez l'une des commandes suivantes depuis la racine du projet :

### 1. Génération de la politique de sécurité du projet (Draft `SECURITY.md`) :
```bash
npx @openai/codex-security policy .
```

### 2. Scan standard de l'application Next.js :
```bash
npx @openai/codex-security scan ./AutoCall-NextJS --fail-on-severity high
```

### 3. Scan approfondi (Deep Scan avec agents de découverte parallèles) :
```bash
npx @openai/codex-security scan ./AutoCall-NextJS --mode deep --effort high
```

### 4. Scan des modifications Git récentes (Diff Scan) :
```bash
npx @openai/codex-security scan . --diff origin/main
```

### 5. Export des résultats au format SARIF pour GitHub Security :
```bash
npx @openai/codex-security scan ./AutoCall-NextJS --export-sarif auditautocall/results.sarif
```
