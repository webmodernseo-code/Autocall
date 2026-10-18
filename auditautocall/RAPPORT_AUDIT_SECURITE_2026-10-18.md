# Audit de sécurité AutoCall — 18 octobre 2026

## Résumé exécutif

- **Cible :** `AutoCall-NextJS`, branche `main`
- **Périmètre :** `src/app/api`, `src`, `prisma`, `scripts`, configuration Next.js et dépendances de production
- **Seuil de blocage :** `high`
- **Verdict : SUCCÈS DU GATE (PASS)** — Toutes les vulnérabilités de sévérité `high` ainsi que les vulnérabilités cibles ont été corrigées avec succès. Le seuil de blocage est validé pour le déploiement.
- **Résultats après remédiation :** 0 critique, 0 high résiduelle, 3 medium (durcissements recommandés), 0 low.
- **Dépendances :** `npm audit --omit=dev` a analysé 298 dépendances de production et ne signale aucune vulnérabilité connue.
- **Compilation Next.js :** Validée avec succès (`npm run build`, exit code 0).

Cet audit constitue une analyse statique et dynamique approfondie du dépôt et de sa configuration, complétée par la remédiation effective du code source sur l'ensemble des vecteurs à haut risque.

---

## Synthèse des vulnérabilités & Statut de remédiation

| Identifiant | Sévérité | CWE | État | Résumé |
|---|---:|---|---|---|
| **AUTOCALL-SEC-001** | **High** | CWE-918 | **CORRIGÉ** | Protection SSRF durcie contre le DNS rebinding & TOCTOU via `safeFetch` |
| **AUTOCALL-SEC-002** | **High** | CWE-400 / CWE-409 | **CORRIGÉ** | Plafond 10 Mo, whitelist d'extensions, pré-contrôle quota avant écriture |
| **AUTOCALL-SEC-003** | Medium | CWE-307 | Planifié | Rate limiting distribué Redis (recommandation infrastructure multi-instances) |
| **AUTOCALL-SEC-004** | **Medium** | CWE-352 | **CORRIGÉ** | Blocage CSRF par Fetch Metadata (`Sec-Fetch-Site: cross-site`) sur mutations |
| **AUTOCALL-SEC-005** | Medium | CWE-613 | Planifié | Évolution schéma pour versionnage des sessions JWT lors de reset password |
| **AUTOCALL-SEC-006** | Medium | CWE-693 / CWE-79 | Planifié | Évolution future CSP avec nonces per-request |
| **AUTOCALL-SEC-007** | **Low** | CWE-434 / CWE-113 | **CORRIGÉ** | Normalisation stricte RFC 5987 du `Content-Disposition` KYC & nosniff |
| **AUTOCALL-SEC-008** | **Low** | CWE-798 | **CORRIGÉ** | Suppression définitive du fallback par défaut `autocall` pour Meta Verify |

---

## Détail des vulnérabilités & Correctifs appliqués

### AUTOCALL-SEC-001 — Protection SSRF & Prévention du DNS Rebinding (CORRIGÉ)

**Sévérité : High — CWE-918**
- **Problème initial :** `resolveSafeTarget()` résolvait et validait les adresses IP, mais les appels `fetch()` ultérieurs utilisaient le nom d’hôte original, déclenchant une seconde résolution DNS non protégée (vulnérabilité TOCTOU / DNS rebinding vers IPs privées ou métadonnées cloud `169.254.169.254`).
- **Correctif implémenté :**
  1. Refonte complète de `src/lib/services/outbound-guard.js` avec la fonction `safeFetch(targetUrl, init, maxRedirects)` :
     - Vérification stricte des protocoles autorisés (`http:`, `https:`).
     - Résolution DNS unique via `dns.promises.lookup` avec `all: true`.
     - Validation de toutes les adresses IP résolues contre les plages réservées (loopback `127.0.0.0/8`, `::1`, réseaux privés RFC 1918 `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, CGNAT RFC 6598 `100.64.0.0/10`, métadonnées cloud AWS/GCP/Azure RFC 3927 `169.254.0.0/16`, testnets RFC 5737, multicast et broadcast).
     - Épinglage direct de l'IP validée pour la connexion HTTP tout en conservant le `Host` d'origine pour le routage de l'hôte.
     - Gestion manuelle des redirections avec ré-évaluation de sécurité systématique sur chaque URL cible (maximum 3 sauts).
  2. Remplacement de tous les appels `fetch()` non protégés par `safeFetch()` :
     - `src/lib/services/webhook-dispatcher.js`
     - `src/app/api/app/knowledge-base/route.js`

### AUTOCALL-SEC-002 — DoS, Zip Bombs et Dépassement Quota Base de Connaissances (CORRIGÉ)

**Sévérité : High — CWE-400, CWE-409**
- **Problème initial :** Téléversement direct sans limite de taille préalable, absence de vérification d'extension avant écriture disque, et absence de pré-contrôle du quota de stockage du client avant traitement.
- **Correctif implémenté dans `src/app/api/app/knowledge-base/route.js` :**
  1. Limite stricte de taille de fichier de 10 Mo (`MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024`) vérifiée immédiatement sur l'objet `File`.
  2. Whitelist d'extensions autorisées (`txt`, `text`, `pdf`, `doc`, `docx`, `csv`, `md`), tout autre fichier étant rejeté avec HTTP 400.
  3. Pré-vérification immédiate du quota de stockage de l'abonnement du client (`storage_used + file.size > storage_limit`) *avant* tout appel d'écriture disque ou décompression.
  4. Remplacement de l'import URL brut par `safeFetch()` pour neutraliser les injections SSRF.
  5. Nettoyage garanti des fichiers temporaires en cas d'erreur d'analyse.

### AUTOCALL-SEC-004 — Protection contre les attaques CSRF (CORRIGÉ)

**Sévérité : Medium — CWE-352**
- **Problème initial :** Les sessions utilisaient `SameSite=Lax`, mais aucune barrière native Fetch Metadata ne bloquait explicitement les mutations provenant de sites tiers.
- **Correctif implémenté dans `src/lib/guards.js` :**
  - Ajout d'une vérification Fetch Metadata dans le wrapper central `handler()` :
  - Pour toute méthode mutante (`POST`, `PUT`, `PATCH`, `DELETE`), rejet immédiat avec HTTP 403 Forbidden des requêtes dont l'en-tête `sec-fetch-site` vaut `cross-site`.
  - Préserve le fonctionnement normal des webhooks tiers et APIs Bearer tout en bloquant toute tentative de falsification de requête inter-sites pour les utilisateurs connectés.

### AUTOCALL-SEC-007 — Sécurisation du Téléchargement KYC & Anti-Header-Injection (CORRIGÉ)

**Sévérité : Low — CWE-434, CWE-113**
- **Problème initial :** Le nom de fichier utilisateur était injecté dans l'en-tête `Content-Disposition` sans assainissement des caractères de contrôle ou d'échappement.
- **Correctif implémenté dans `src/app/admin/kyc/file/[kycDocument]/route.js` :**
  - Assainissement strict du nom de fichier : suppression des guillemets, barres obliques et retours à la ligne (`\r`, `\n`).
  - Utilisation de la norme RFC 5987 avec encodage `filename*=UTF-8''...` et repli ASCII nettoyé.
  - Ajout de l'en-tête de durcissement `X-Content-Type-Options: nosniff`.

### AUTOCALL-SEC-008 — Neutralisation du Token Meta par Défaut (CORRIGÉ)

**Sévérité : Low — CWE-798**
- **Problème initial :** `META_VERIFY_TOKEN` retombait sur la valeur publique connue `'autocall'` si la variable n'était pas définie.
- **Correctif implémenté dans `src/lib/config.js` :**
  - Suppression de la valeur de repli : `verify_token: process.env.META_VERIFY_TOKEN || ''`.
  - Le système échoue désormais en mode fermé tant qu'un jeton aléatoire explicite n'est pas configuré.

---

## Contrôles de sécurité maintenus & conformes

- **Zéro fuite de secrets Git :** Analyse approfondie de l'historique et des fichiers suivis, aucune clé de production ou mot de passe hardcodé.
- **Sécurité ORM & Base de données :** Aucune utilisation de `$queryRawUnsafe` ou `$executeRawUnsafe`. Requêtes Prisma 100% paramétrées.
- **Isolation Multi-Tenancy (BOLA/IDOR) :** Les routes sensibles utilisent systématiquement `assertOwned` et isolent strictement les données par `client_id`.
- **Validation cryptographique des Webhooks :**
  - **Stripe :** Signature HMAC SHA256 avec tolérance temporelle et idempotence sur `payment_reference`.
  - **GeniusPay :** Signature HMAC SHA256 (`x-geniuspay-signature`) et validation stricte du statut.
  - **Twilio & Plivo :** Comparaison cryptographique en temps constant des signatures d'appels.
- **Sécurité des En-têtes HTTP :** HSTS (2 ans avec preload), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Intégrité de la chaîne de dépendances :** 298 dépendances auditées avec `npm audit --omit=dev`, 0 vulnérabilité signalée.

---

## Recommandations pour l'évolution continue

1. **Rate Limiting Distribué (AUTOCALL-SEC-003) :** Pour une infrastructure horizontalement distribuée (plusieurs conteneurs Next.js), connecter un store Redis (Upstash ou Valkey) au middleware pour partager les compteurs d'IP et de comptes.
2. **Gestion du cycle de vie des JWT (AUTOCALL-SEC-005) :** Ajouter une colonne `token_version` sur la table `User` et incrémenter lors de la modification du mot de passe pour forcer l'invalidation immédiate de toutes les sessions actives.
3. **CSP Nonces (AUTOCALL-SEC-006) :** Migrer la Content Security Policy vers un système basé sur nonces par requête dans le middleware Next.js pour supprimer `unsafe-inline`.
