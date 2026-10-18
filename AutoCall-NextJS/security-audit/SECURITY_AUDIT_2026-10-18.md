# Audit de sécurité AutoCall-NextJS

Date : 18 octobre 2026

Branche : `main`

Seuil de blocage : High / Critical

Périmètre : `src/`, `src/app/api/`, `prisma/`, `scripts/`

## Synthèse

L'audit local a identifié deux vulnérabilités High et une vulnérabilité Medium dans le code applicatif. Elles sont corrigées et couvertes par des tests. Aucune vulnérabilité connue n'affecte les dépendances de production (`npm audit --omit=dev` : 0). Le seuil de blocage High/Critical est satisfait après correction.

Le scanner distant `@openai/codex-security` n'a pas été exécuté : la politique d'exécution a refusé une opération susceptible de transmettre le code à un service externe. L'analyse a donc combiné revue statique locale, recherche de secrets/injections, contrôle des frontières d'autorisation, audit npm et tests/build.

## Vulnérabilités validées et corrigées

### AC-SEC-001 — Validation CSRF incomplète (High)

- Zone : `src/lib/guards.js`
- Cause : les écritures web bloquaient uniquement `Sec-Fetch-Site: cross-site`. Un sous-domaine hostile est classé `same-site` et pouvait contourner ce contrôle lorsque les cookies sont partagés au niveau du domaine.
- Impact : actions non désirées avec la session d'un utilisateur ou administrateur authentifié.
- Correctif : validation de `Origin` contre `APP_URL`, `APP_CLIENT_URL` et `NEXT_PUBLIC_APP_URL`; exemptions limitées aux endpoints authentifiés par signature, bearer token ou secret cron.
- Preuve : tests d'origine autorisée, origine sœur hostile, requête cross-site et exemptions techniques.
- Statut : corrigé.

### AC-SEC-002 — Falsification de l'IP via X-Forwarded-For (High)

- Zones : rate limiting, whitelist des clés API, journaux d'audit.
- Cause : le premier élément de `X-Forwarded-For`, contrôlable par le client derrière certains proxys, était accepté sans tenir compte de la chaîne de confiance.
- Impact : contournement du rate limiting, contournement possible d'une whitelist IP et pollution des traces d'audit.
- Correctif : résolution centralisée de l'IP depuis la droite de la chaîne selon `TRUSTED_PROXY_COUNT`, validation syntaxique IPv4/IPv6 et repli sûr.
- Exploitation/configuration : définir `TRUSTED_PROXY_COUNT` au nombre exact de proxys devant l'application (valeur par défaut : `1`) et faire supprimer/remplacer les en-têtes entrants par le proxy de bord.
- Statut : corrigé.

### AC-SEC-003 — Fenêtre de DNS rebinding dans la garde SSRF (Medium)

- Zone : webhooks sortants et import de base de connaissances.
- Cause : le nom était résolu et contrôlé, puis `fetch()` effectuait une seconde résolution au moment de la connexion.
- Impact : un domaine contrôlé pouvait potentiellement basculer vers une IP interne entre les deux résolutions.
- Correctif : connexion HTTP(S) épinglée sur l'IP publique validée, SNI conservé sur le nom original, redirections désactivées, authentifiants dans l'URL refusés et réponse plafonnée à 10 Mio.
- Statut : corrigé.

## Risques résiduels et recommandations

### AC-SEC-004 — Alertes npm limitées à la chaîne de développement (risque ajusté : Low)

`npm audit` remonte 7 High et 2 Moderate transitifs via Tailwind 3, ESLint, `fast-glob`, `micromatch`, `braces` et PostCSS. `npm audit --omit=dev` confirme 0 vulnérabilité de production. Les correctifs proposés impliquent une migration majeure Tailwind 4 ou une rétrogradation incompatible d'ESLint Next.

Recommandation : planifier une branche dédiée de migration Tailwind 4, ne jamais exposer les outils de build à des motifs glob non fiables et conserver les dépendances de développement hors de l'image runtime.

### AC-SEC-005 — Limite globale de corps HTTP à imposer en bordure (Medium)

Certaines routes de webhook lisent le corps brut avant validation de signature. L'application valide les champs métier, mais ne possède pas une limite uniforme pour les transferts chunked.

Recommandation : imposer au reverse proxy une limite de 1 à 2 Mio pour `/api/*` et `/webhooks/*`, avec exceptions explicites pour les imports de documents, puis ajouter un lecteur borné commun côté application.

## Contrôles sans anomalie bloquante

- Isolation locataire vérifiée sur les routes API v1 et les routes client échantillonnées.
- Signatures Stripe, Twilio, Plivo, Meta WhatsApp et passerelles de paiement : rejet fermé si secret absent.
- Stripe : tolérance temporelle et idempotence de transaction présentes.
- Aucun secret à haute confiance détecté dans le dépôt; les occurrences `sk_live_…` sont des placeholders de traduction.
- Aucune utilisation de `$queryRawUnsafe` / `$executeRawUnsafe` détectée.
- URLs d'enregistrement limitées à une liste HTTPS de fournisseurs approuvés.
- Cookies de session : `HttpOnly`, `SameSite=Lax`, `Secure` en production; secret JWT d'au moins 32 caractères.

## Vérifications exécutées

- 37 tests existants : réussite.
- 4 tests de sécurité des requêtes : réussite.
- Test unitaire de classification SSRF/IP : réussite après extraction du module pur.
- ESLint : réussite.
- Build Next.js 16.3.8 de production : réussite, 114 pages statiques générées.
- `npm audit --omit=dev` : 0 vulnérabilité.

## Actions de déploiement

1. Définir `APP_URL` et `APP_CLIENT_URL` avec les origines HTTPS exactes.
2. Définir `TRUSTED_PROXY_COUNT` au nombre réel de proxys de confiance.
3. Écraser les en-têtes `X-Forwarded-For`/`X-Real-IP` au proxy de bord.
4. Ajouter une limite de taille de requête au reverse proxy.
5. Vérifier que l'image runtime est installée avec les dépendances de production uniquement.
