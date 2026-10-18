# Audit de sécurité AutoCall — 18 octobre 2026

## Résumé exécutif

- **Cible :** `AutoCall-NextJS`, branche `main`
- **Périmètre :** `src/app/api`, `src`, `prisma`, `scripts`, configuration Next.js et dépendances de production
- **Seuil de blocage :** `high`
- **Verdict : ÉCHEC DU GATE** — 2 vulnérabilités `high` doivent être corrigées avant une mise en production sensible.
- **Résultats :** 0 critique, 2 high, 4 medium, 2 low
- **Dépendances :** `npm audit --omit=dev` a analysé 298 dépendances de production et ne signale aucune vulnérabilité connue.

Cet audit est une analyse statique approfondie du dépôt et de sa configuration. Il ne remplace pas un test d’intrusion dynamique depuis l’infrastructure de production. Le paquet `@openai/codex-security` mentionné dans le brief n’est pas installé dans le dépôt ; les résultats ont donc été produits par inspection du code, recherches de motifs sensibles, audit npm, lint, tests et compilation.

## Synthèse des vulnérabilités

| Identifiant | Sévérité | CWE | État | Résumé |
|---|---:|---|---|---|
| AUTOCALL-SEC-001 | High | CWE-918 | Ouvert | Protection SSRF vulnérable au DNS rebinding/TOCTOU |
| AUTOCALL-SEC-002 | High | CWE-400 / CWE-409 | Ouvert | Téléversement et décompression KB sans limite préalable |
| AUTOCALL-SEC-003 | Medium | CWE-307 | Ouvert | Rate limiting fail-open et IP transférée non fiabilisée |
| AUTOCALL-SEC-004 | Medium | CWE-352 | Ouvert | Protection CSRF reposant principalement sur SameSite |
| AUTOCALL-SEC-005 | Medium | CWE-613 | Ouvert | Sessions JWT longues non révoquées après changement de mot de passe |
| AUTOCALL-SEC-006 | Medium | CWE-693 / CWE-79 | Ouvert | CSP autorisant les scripts inline |
| AUTOCALL-SEC-007 | Low | CWE-434 / CWE-113 | Ouvert | Validation KYC fondée sur l’extension et nom de fichier non normalisé |
| AUTOCALL-SEC-008 | Low | CWE-798 | Ouvert | Jeton de vérification Meta prévisible par défaut |

## Vulnérabilités détaillées

### AUTOCALL-SEC-001 — Contournement SSRF par DNS rebinding

**Sévérité : High — CWE-918**

`resolveSafeTarget()` résout et valide les adresses DNS, mais les appels `fetch()` utilisent ensuite à nouveau le nom d’hôte original. Le système réseau effectue donc une seconde résolution indépendante. Un domaine contrôlé par un attaquant peut d’abord répondre avec une IP publique, puis avec une IP privée ou une adresse de métadonnées cloud au moment du `fetch`.

**Emplacements :**

- `src/lib/services/outbound-guard.js` : résolution de contrôle ;
- `src/app/api/app/knowledge-base/route.js` : import d’URL avec `fetch(data.source_url)` ;
- `src/lib/services/webhook-dispatcher.js` : livraison avec `fetch(webhook.target_url)` alors que `target` n’est pas utilisé.

**Impact :** un client authentifié peut potentiellement atteindre des services internes, l’interface du fournisseur cloud ou des applications non exposées publiquement.

**Correctif recommandé :**

1. Résoudre une seule fois puis connecter la requête à l’IP validée, tout en conservant le `Host` et le SNI du domaine attendu.
2. Revalider chaque redirection et conserver `redirect: 'manual'`.
3. Interdire explicitement les plages privées, réservées, documentation, benchmark et métadonnées cloud en IPv4 et IPv6.
4. Ajouter des tests de DNS rebinding avec deux réponses successives.

**Patch proposé :** faire retourner par le garde un dispatcher HTTP/HTTPS épinglé sur `target.ip`, puis passer ce dispatcher au client HTTP. Ne jamais lancer un nouveau `fetch(hostname)` après la validation DNS.

### AUTOCALL-SEC-002 — Déni de service par fichiers KB volumineux ou compressés

**Sévérité : High — CWE-400, CWE-409**

La route de base de connaissances appelle `request.formData()`, transforme ensuite le fichier complet avec `file.arrayBuffer()`, l’écrit, puis tente d’extraire le texte. Contrairement aux imports CSV et KYC, aucune limite de taille ni liste blanche de types n’est appliquée avant l’ingestion. Les DOCX/PDF sont analysés en mémoire et les flux compressés sont décompressés sans plafond dédié.

**Emplacements :**

- `src/app/api/app/knowledge-base/route.js` ;
- `src/lib/storage.js` (`Buffer.from(await file.arrayBuffer())`) ;
- `src/lib/services/document-text.js` (`unzipSync`, extraction PDF/DOCX).

**Impact :** épuisement mémoire/CPU ou disque par un utilisateur authentifié, avant même l’application du quota de stockage du forfait.

**Correctif recommandé :**

1. Refuser les requêtes dont `Content-Length` dépasse une limite globale.
2. Limiter chaque document KB (par exemple 10 Mo) avant `arrayBuffer()`.
3. Autoriser uniquement `txt`, `pdf`, `doc`, `docx` et vérifier MIME + signature magique.
4. Extraire dans un worker isolé avec délais, plafond de mémoire, taille décompressée et ratio de compression maximum.
5. Vérifier le quota avant l’extraction et supprimer systématiquement le fichier en cas d’échec.

### AUTOCALL-SEC-003 — Rate limiting contournable ou désactivé en panne

**Sévérité : Medium — CWE-307**

Le rate limiter retourne silencieusement « aucune tentative » lorsque la table `cache` est indisponible et ignore les échecs d’écriture. Les clés font également confiance à `X-Forwarded-For` sans liste de proxies de confiance. Une configuration proxy incorrecte permet la rotation d’IP déclarées.

**Correctif recommandé :** utiliser Redis/Upstash ou une opération SQL atomique, définir un comportement dégradé explicite, et ne lire `X-Forwarded-For` que derrière un proxy de confiance qui réécrit cet en-tête. Ajouter un plafond global par adresse et par compte.

### AUTOCALL-SEC-004 — Protection CSRF incomplète

**Sévérité : Medium — CWE-352**

Les sessions utilisent correctement `HttpOnly`, `Secure` en production et `SameSite=Lax`, mais les mutations authentifiées n’effectuent pas de validation systématique de `Origin`, `Referer` ou `Sec-Fetch-Site`, et aucun jeton CSRF n’est présent. Le risque augmente si `SESSION_DOMAIN` partage le cookie avec un sous-domaine vulnérable ou compromis.

**Correctif recommandé :** ajouter un garde central pour toutes les méthodes non sûres : origine exacte autorisée, rejet de `Sec-Fetch-Site: cross-site`, et jeton CSRF double-submit pour les formulaires. Garder les cookies host-only lorsque le partage inter-sous-domaines n’est pas indispensable.

### AUTOCALL-SEC-005 — Sessions non révoquées après changement de mot de passe

**Sévérité : Medium — CWE-613**

Les JWT restent valides 30 jours. Les requêtes revérifient l’existence et le statut du compte, ce qui est positif, mais aucun `session_version`/`password_changed_at` n’est comparé au JWT. Le champ `remember_token` modifié pendant la réinitialisation n’est pas utilisé lors de la validation de session.

**Correctif recommandé :** ajouter une version de session dans la base et le JWT, l’incrémenter lors d’un changement/réinitialisation de mot de passe, d’une déconnexion globale ou d’un événement sensible ; réduire la durée du jeton d’accès et utiliser une rotation contrôlée.

### AUTOCALL-SEC-006 — CSP affaiblie par `unsafe-inline`

**Sévérité : Medium — CWE-693, CWE-79**

La politique CSP comporte de bonnes restrictions (`object-src 'none'`, `base-uri`, `frame-ancestors`), mais `script-src 'unsafe-inline'` réduit fortement sa capacité à bloquer l’exécution d’un script injecté.

**Correctif recommandé :** générer un nonce par requête, l’appliquer aux scripts nécessaires, supprimer `unsafe-inline` de `script-src` et ajouter des rapports CSP en mode `Report-Only` avant activation stricte.

### AUTOCALL-SEC-007 — Validation insuffisante des documents KYC

**Sévérité : Low — CWE-434, CWE-113**

La taille est limitée et les fichiers restent sur un disque privé, mais le type est déterminé uniquement par l’extension. Le nom original est réutilisé dans `Content-Disposition` sans normalisation explicite.

**Correctif recommandé :** vérifier la signature magique/MIME réelle, neutraliser CR/LF et guillemets dans le nom, utiliser `filename*=` encodé et analyser les documents avec un antivirus avant consultation.

### AUTOCALL-SEC-008 — Jeton Meta par défaut prévisible

**Sévérité : Low — CWE-798**

`META_VERIFY_TOKEN` retombe sur la valeur publique `autocall`. La signature HMAC des requêtes POST reste une protection distincte, mais la vérification GET ne devrait pas accepter une valeur par défaut connue.

**Correctif recommandé :** supprimer la valeur par défaut et refuser la configuration WhatsApp Meta tant qu’un jeton aléatoire explicite n’est pas fourni.

## Contrôles satisfaisants observés

- Aucun secret réel détecté dans les fichiers suivis par Git ; les occurrences Stripe sont des exemples/placesholders.
- Aucune utilisation de `$queryRawUnsafe`, `$executeRawUnsafe`, `eval` ou `new Function` détectée.
- Les routes client sensibles vérifient généralement l’appartenance avec `assertOwned` ou un filtre `client_id`.
- Les enregistrements d’appels sont contrôlés par propriétaire et par liste d’hôtes de confiance.
- Twilio et Plivo échouent en mode fermé et comparent les signatures en temps constant.
- Stripe vérifie la signature et la fraîcheur ; les transactions sont idempotentes sur l’identifiant de passerelle.
- Les clés API sont générées aléatoirement, stockées avec bcrypt, révocables, limitées par scope et expiration.
- Les cookies de session sont `HttpOnly`, `SameSite=Lax`, `Secure` en production.
- Les chemins de stockage sont normalisés et bloquent la traversée hors racine.
- Les en-têtes HSTS, anti-frame, anti-MIME et Referrer-Policy sont configurés.

## Priorités de remédiation

1. **Avant production :** corriger AUTOCALL-SEC-001 et AUTOCALL-SEC-002.
2. **Sprint suivant :** renforcer rate limiting, CSRF et révocation des sessions.
3. **Durcissement :** CSP par nonce, validation MIME KYC et suppression des secrets par défaut.
4. Ajouter des tests automatisés SSRF, fichiers volumineux/zip bombs, CSRF, révocation de session et spoofing `X-Forwarded-For`.

## Validation réalisée

- Audit npm des dépendances de production : réussi, 0 vulnérabilité.
- Recherche de secrets suivis par Git : aucune clé réelle détectée.
- Recherche de sinks dangereux, appels sortants, accès fichiers et requêtes Prisma brutes.
- Revue des gardes client/admin, permissions, routes dynamiques, webhooks et paiements.
- Les résultats structurés associés sont disponibles dans `auditautocall/results-2026-10-18.json` et `auditautocall/results-2026-10-18.sarif`.
