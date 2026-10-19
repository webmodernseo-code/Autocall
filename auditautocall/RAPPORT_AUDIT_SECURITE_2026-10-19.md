# Audit de sécurité AutoCall-NextJS

Date : 19 octobre 2026  
Branche / commit : `main` / `9e8e964` + modifications locales non commitées  
Seuil de blocage : High / Critical  
Périmètre : `src/`, `src/app/api/`, `prisma/`, `scripts/`

## Verdict

**CORRIGÉ DANS LE CODE — déploiement conditionné à la migration des secrets.** Les deux vulnérabilités High ont été remédiées le 19 octobre 2026. Avant redémarrage/déploiement, sauvegarder la base, exécuter `npm run security:encrypt-legacy-secrets` et faire tourner les secrets susceptibles d'avoir été exposés.

| ID | Sévérité | CWE | État | Résumé |
|---|---:|---|---|---|
| AC-SEC-2026-001 | High | CWE-918 | Corrigé | SSRF via l'URL WhatsWay contrôlée par un locataire |
| AC-SEC-2026-002 | High | CWE-312 | Corrigé, migration requise | Secrets téléphonie/messaging/IA stockés en clair |
| AC-SEC-2026-003 | Medium | CWE-400, CWE-20 | Corrigé | Corps HTTP non bornés et planning non validé |
| AC-SEC-2026-004 | Medium | CWE-598 | Corrigé | Secret OAuth Meta placé dans l'URL |
| AC-SEC-2026-005 | Low ajusté | CWE-674, CWE-400 | Accepté temporairement | 9 alertes npm limitées à la chaîne de développement |

## Vulnérabilités validées

### AC-SEC-2026-001 — SSRF via l'URL WhatsWay (High)

**Preuves.** La route `src/app/api/app/messaging/whatsapp/accounts/route.js:24` accepte toute URL syntaxiquement valide dans `base_url`. Cette valeur est persistée, puis `src/lib/services/messaging.js:185` exécute un `fetch()` vers cette origine lorsqu'un message est envoyé. La garde robuste déjà disponible dans `src/lib/services/outbound-guard.js` n'est pas appelée.

**Scénario.** Un utilisateur locataire autorisé enregistre `http://127.0.0.1:...`, une adresse RFC1918, l'endpoint de métadonnées cloud, ou un domaine de DNS rebinding, crée/utilise une conversation puis déclenche l'envoi. Le serveur effectue la requête depuis son réseau et transmet en plus la clé WhatsWay dans `Authorization`.

**Impact.** Exploration du réseau interne, accès potentiel aux métadonnées cloud et fuite du jeton fournisseur vers un hôte contrôlé. La portée est limitée à un utilisateur client authentifié disposant de la permission messaging, mais le franchissement de frontière réseau justifie High.

**Correctif recommandé.** Refuser les URL non HTTPS, valider/résoudre la cible à l'enregistrement, et remplacer le `fetch()` d'envoi par `safeFetch()` afin d'épingler l'IP validée et d'empêcher le rebinding. Idéalement, supprimer l'URL personnalisable et utiliser une liste d'hôtes fournisseur administrée. Ne jamais envoyer la clé avant validation de la destination.

```diff
--- a/src/lib/services/messaging.js
+++ b/src/lib/services/messaging.js
@@
+import { safeFetch } from '@/lib/services/outbound-guard';
@@
-            const res = await fetch(`${String(base).replace(/\/+$/, '')}${path}`, {
+            const target = `${String(base).replace(/\/+$/, '')}${path}`;
+            const res = await safeFetch(target, {
```

Ajouter aussi une validation serveur qui exige `https:` et un test couvrant loopback, RFC1918, IPv6 local, metadata cloud et DNS rebinding.

### AC-SEC-2026-002 — Secrets opérationnels stockés en clair (High)

**Preuves.** Le projet possède un chiffrement authentifié via `src/lib/crypt.js`, déjà utilisé pour SMTP et les intégrations. Pourtant, des secrets sont écrits directement en base :

- jetons WhatsApp : `src/app/api/app/messaging/whatsapp/accounts/route.js:56-57` ;
- mot de passe SIP : `src/app/api/app/sip/trunks/route.js:47` et mise à jour ligne 38 de la route dynamique ;
- clés ElevenLabs : routes admin de création/mise à jour, lignes 21 et 27 ;
- secret Meta : `src/app/api/admin/messaging/route.js:34`.

Les colonnes correspondantes (`WhatsAppAccount.access_token/api_key`, `SipTrunk.password`, `ElevenLabsKey.api_key`, `MessagingSetting.meta_app_secret`) sont du texte brut.

**Impact.** Une lecture SQL, sauvegarde exposée, export ou accès DBA compromet immédiatement des comptes de téléphonie/messaging/IA, permettant toll fraud, usurpation de messages et consommation de crédits. Le chiffrement applicatif ne remplace pas le contrôle d'accès DB mais réduit fortement l'impact d'une fuite au repos.

**Correctif recommandé.** Chiffrer à l'écriture avec `encryptString`, déchiffrer uniquement au dernier moment avec `maybeDecrypt`, ne jamais renvoyer les secrets dans les DTO/logs, puis migrer les valeurs existantes par un job idempotent. Effectuer la migration avant de rendre les lectures strictes et prévoir une rotation des secrets historiques.

```diff
--- a/src/app/api/app/messaging/whatsapp/accounts/route.js
+++ b/src/app/api/app/messaging/whatsapp/accounts/route.js
@@
+import { encryptString } from '@/lib/crypt';
@@
-            access_token: token,
-            api_key: data.api_key ?? null,
+            access_token: token ? encryptString(token) : null,
+            api_key: data.api_key ? encryptString(data.api_key) : null,
--- a/src/lib/services/messaging.js
+++ b/src/lib/services/messaging.js
@@
+import { maybeDecrypt } from '@/lib/crypt';
@@
-        const token = account.access_token;
+        const token = maybeDecrypt(account.access_token);
```

Appliquer le même patron aux secrets SIP, ElevenLabs et Meta. Ajouter des tests garantissant que la valeur brute n'apparaît jamais dans la base ni les réponses API.

### AC-SEC-2026-003 — Corps HTTP non bornés et planning non validé (Medium)

**Preuves.** `src/lib/http.js:15` appelle `request.json()` ou `request.formData()` sans limite commune. La nouvelle route `src/app/api/app/availability/route.js:48` accepte ensuite `body.availability` sans schéma, profondeur, nombre d'absences ni taille maximale et le duplique dans tous les agents du locataire.

**Impact.** Consommation mémoire/CPU, amplification en base et corruption logique du planning. Un abonnement/client compromis peut dégrader son tenant et exercer une pression sur le service partagé.

**Correctif recommandé.** Imposer une limite de corps au reverse proxy et dans l'application (par défaut 1 Mio, plus faible pour JSON), rejeter tôt selon `Content-Length`, utiliser un lecteur borné pour le chunked, puis valider le planning avec Zod : jours en enum, heures `HH:mm`, chaînes bornées, dates ISO et nombre d'absences limité. Mettre à jour les agents en transaction/bulk plutôt que séquentiellement.

### AC-SEC-2026-004 — Secret OAuth Meta dans la query string (Medium)

**Preuve.** `src/app/api/app/messaging/whatsapp/accounts/route.js:36` construit une URL contenant `client_secret` et le code OAuth.

**Impact.** Les URL peuvent être capturées par des proxys, traces APM ou logs d'erreur. Le code ne journalise pas explicitement cette URL, mais la pratique augmente inutilement le risque de fuite.

**Correctif recommandé.** Envoyer l'échange en `POST` avec `application/x-www-form-urlencoded`, garder un timeout court, vérifier `res.ok`, borner la réponse et retourner une erreur fermée plutôt que créer un compte `connected` sans jeton.

### AC-SEC-2026-005 — Dépendances de développement (Low ajusté)

`npm audit` signale 7 High et 2 Moderate transitifs dans Tailwind/ESLint (`braces`, `micromatch`, `fast-glob`, `postcss-selector-parser`). `npm audit --omit=dev` confirme **0 vulnérabilité** sur 298 dépendances de production. Le risque runtime est donc faible sous réserve que les dépendances de développement soient absentes de l'image finale et que les outils ne traitent pas de motifs non fiables.

**Correctif recommandé.** Migrer Tailwind 3 vers 4 dans une branche dédiée, suivre la correction `eslint-config-next`, conserver `npm ci --omit=dev` dans l'image runtime et ne jamais exposer les outils de build comme service.

## Contrôles satisfaisants

- Les routes client inspectées utilisent une garde d'authentification/RBAC et les lectures d'objets sensibles vérifient généralement `client_id` via `assertOwned`.
- Les API v1 utilisent une clé hachée, des scopes, une whitelist IP et un rate limiting.
- Les cookies de session sont `HttpOnly`, `SameSite=Lax`, et `Secure` en production/HTTPS.
- Stripe, Twilio, Plivo et Meta WhatsApp rejettent les webhooks sans signature valide ; Stripe applique une tolérance temporelle.
- L'idempotence des transactions de paiement est matérialisée par la migration dédiée.
- Aucun `$queryRawUnsafe`, `$executeRawUnsafe`, `eval()` ou `new Function()` n'a été trouvé dans le périmètre.
- Les corrections de l'audit du 18 octobre (CSRF par Origin, IP proxy de confiance, DNS rebinding sur les sorties déjà protégées) sont toujours présentes.
- Le LLM n'expose pas d'outil privilégié dans le chemin inspecté. Une injection peut influencer la conversation ou le jeton `[END_CALL]`, mais pas directement effectuer une mutation privilégiée ; conserver la séparation instructions/données et ajouter des tests adversariaux.

## Vérifications exécutées et limites

- Revue statique locale des routes API, gardes, secrets, Prisma, webhooks, sorties réseau et appels LLM.
- `npm audit --omit=dev --json` : 0 vulnérabilité, 298 dépendances de production.
- `npm audit --json` : 7 High, 2 Moderate, toutes dans la chaîne de développement.
- `npm run verify` global : interrompu après 5 minutes par le timeout de la première passe.
- Vérification finale ciblée : 36/36 tests réussis, ESLint réussi sur tous les fichiers modifiés, script de migration validé, build Next.js 16.3.8 réussi (114 pages statiques).
- `@openai/codex-security` : non exécuté. Son téléchargement/exécution a été refusé par la politique de sécurité car il pourrait transmettre le dépôt à un service externe. Aucun contournement n'a été tenté.
- Audit statique hors production : aucune preuve dynamique contre une instance déployée, un proxy réel ou une base réelle.

## Priorités de remédiation

1. Bloquer immédiatement les URL WhatsWay personnalisées ou les restreindre à une allowlist, puis intégrer `safeFetch`.
2. Chiffrer les secrets au repos, migrer les lignes existantes et faire tourner les secrets historiques.
3. Ajouter limites de corps et validation stricte du planning.
4. Corriger l'échange OAuth Meta et ne marquer un compte connecté qu'après validation fournisseur.
5. Relancer tests, lint et build avec une fenêtre suffisante ; corriger/migrer la chaîne dev séparément.

## Remédiation appliquée

- Les appels WhatsWay utilisent désormais `safeFetch`, avec résolution publique et IP épinglée ; les URL personnalisées non HTTPS sont refusées.
- Les nouveaux secrets WhatsApp, SIP, ElevenLabs et Meta sont chiffrés avec `APP_KEY`; les lectures restent compatibles avec l'ancien format le temps de la migration.
- `npm run security:encrypt-legacy-secrets` chiffre de manière idempotente les anciennes lignes.
- Les échanges OAuth Meta utilisent un POST form-encoded, un timeout, une vérification du statut et échouent en mode fermé.
- Les lectures JSON, formulaires et webhooks modifiées sont bornées à 1 Mio par défaut, y compris les transferts chunked. `MAX_REQUEST_BODY_BYTES` permet un réglage explicite.
- Le planning est validé avec un schéma Zod strict et des limites sur chaînes, dates, jours et nombre d'absences.
- 36 tests existants réussissent et ESLint réussit sur tous les fichiers touchés.
