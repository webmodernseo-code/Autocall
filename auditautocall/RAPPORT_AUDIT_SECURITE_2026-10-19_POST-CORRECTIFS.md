# Audit de sécurité AutoCall-NextJS — contrôle post-correctifs

Date : 19 octobre 2026  
Branche / commit : `main` / `baa39ec`  
État du worktree au début de l'audit : propre  
Seuil de blocage : High / Critical  
Périmètre : `src/`, `src/app/api/`, `prisma/`, `scripts/`

## Verdict

**GATE High/Critical VALIDÉ après remédiation.** Les deux vulnérabilités High et les deux Medium découvertes pendant ce contrôle ont été corrigées. Le risque Low restant concerne uniquement la chaîne de développement et demeure accepté temporairement.

| ID | Sévérité | CWE | État | Résumé |
|---|---:|---|---|---|
| AC-SEC-POST-001 | High | CWE-770, CWE-400 | Corrigé | Appels LLM publics sans rate limit ni quota |
| AC-SEC-POST-002 | High | CWE-312 | Corrigé | Jetons OAuth Google Sheets stockés/utilisés en clair |
| AC-SEC-POST-003 | Medium | CWE-20, CWE-400, CWE-915 | Corrigé | Formulaire public non borné, sans quota et hors schéma |
| AC-SEC-POST-004 | Medium | CWE-79 | Corrigé | Injection HTML persistante dans le widget embarqué |
| AC-SEC-POST-005 | Low ajusté | CWE-674, CWE-400 | Accepté temporairement | Alertes limitées aux dépendances de développement |

## Remédiation appliquée le 19 octobre 2026

- Lecture bornée et message limité à 2 000 caractères sur le chat public.
- Quotas stricts par IP/widget/client et refus `503` si le stockage des quotas est indisponible.
- Défense explicite contre les instructions hostiles injectées dans le prompt du widget.
- Soumissions publiques limitées aux champs déclarés, aux valeurs scalaires et à des longueurs définies.
- Validation e-mail et interdiction de modifier implicitement un contact CRM existant.
- Titre du widget assigné avec `textContent`, sans concaténation de contenu locataire dans `innerHTML`.
- Déchiffrement à la demande des jetons Google Sheets et migration idempotente des jetons historiques.
- Deux tests unitaires couvrent les bornes et l'allowlist des entrées publiques.

Validation finale : lint ciblé réussi, `git diff --check` réussi, build Next.js/TypeScript réussi et 114 pages statiques générées.

## Vulnérabilités validées

### AC-SEC-POST-001 — Appels LLM publics sans rate limit ni quota (High)

**Preuves.** `src/app/api/widget/[token]/chat/route.js:30` lit directement un JSON non borné. La route publique n'utilise ni `handler`, ni `readBody`, ni `tooManyAttempts`. À chaque requête contenant un message, elle appelle `defaultAiProvider().complete()` avec jusqu'à 250 tokens (`:41-47`). Le jeton du widget est volontairement public dans le script embarqué.

**Impact.** Toute personne visitant un site équipé du widget peut automatiser des requêtes et épuiser les quotas OpenAI, générer une facture importante, saturer la base/cache ou dégrader le service partagé. Le token public ne constitue pas une authentification.

**Correctif recommandé.** Utiliser `readBody`, limiter `message` à 2 000 caractères, imposer un rate limit par couple widget/IP et un budget journalier atomique par client. Rejeter en mode fermé si le backend de quota est indisponible. Ajouter CAPTCHA/challenge après un seuil et journaliser les abus sans contenu sensible.

```diff
 import { defaultAiProvider } from '@/lib/services/ai';
+import { readBody } from '@/lib/http';
+import { clientIp } from '@/lib/request-security.mjs';
+import { hit, tooManyAttempts } from '@/lib/rate-limit';
@@
-const body = await request.json().catch(() => ({}));
-const userMessage = (body.message || '').toString().trim();
+const body = await readBody(request);
+const userMessage = String(body.message ?? '').trim().slice(0, 2000);
+const bucket = `widget:${widget.id}:${clientIp(request)}`;
+if (await tooManyAttempts(bucket, 20)) return NextResponse.json({ error: 'Trop de requêtes.' }, { status: 429 });
+await hit(bucket, 60);
```

Le compteur IP seul ne remplace pas un quota de dépenses par client, car un attaquant peut distribuer les requêtes.

### AC-SEC-POST-002 — Jetons OAuth Google Sheets en clair (High)

**Preuves.** `prisma/schema.prisma:840-841` déclare `access_token` et `refresh_token` en texte. `src/lib/domain/google-sheets.js:55-65` lit `conn.access_token` et le place directement dans `Authorization`. Aucun `encryptString`/`maybeDecrypt` n'est utilisé et le script `security:encrypt-legacy-secrets` ne migre pas ce modèle.

**Impact.** Une fuite SQL, sauvegarde ou accès DBA compromet les feuilles Google autorisées. Selon les scopes, un attaquant peut lire, modifier ou supprimer des données métier. Le scope demandé inclut l'accès complet aux spreadsheets.

**Correctif recommandé.** Chiffrer les deux jetons avec `APP_KEY`, déchiffrer uniquement au moment de l'appel Google, inclure les lignes existantes dans la migration idempotente puis révoquer/renouveler les jetons historiques.

```diff
+import { maybeDecrypt } from '@/lib/crypt';
@@
-if (conn.access_token && conn.spreadsheet_id) {
+const accessToken = maybeDecrypt(conn.access_token);
+if (accessToken && conn.spreadsheet_id) {
@@
-Authorization: `Bearer ${conn.access_token}`,
+Authorization: `Bearer ${accessToken}`,
```

Toutes les écritures futures de `access_token`/`refresh_token` doivent utiliser `encryptString`.

### AC-SEC-POST-003 — Formulaire public non borné, sans quota et hors schéma (Medium)

**Preuves.** `src/app/api/f/[token]/submit/route.js:27` utilise directement `request.json()`. La route n'a ni limite de taille ni rate limit. Elle vérifie seulement les champs requis, mais persiste l'objet complet dans `FormSubmission.data` (`:108-116`) et inspecte tous les champs arbitraires pour mettre à jour un contact existant ayant le même téléphone (`:42-93`). Elle déclenche ensuite une synchronisation Google Sheets.

**Impact.** Spam de base, consommation mémoire/IO, amplification d'appels Google et empoisonnement des champs nom/email/entreprise d'un contact si son téléphone est connu. Des clés non définies dans le formulaire sont conservées.

**Correctif recommandé.** Utiliser `readBody`, appliquer un quota par formulaire/IP et global par client, construire un objet allowlist depuis `form.fields`, borner chaque valeur, refuser les objets/tableaux inattendus et ne jamais modifier automatiquement un contact existant à partir d'une soumission publique sans règle explicite ou vérification.

### AC-SEC-POST-004 — Injection HTML persistante dans le widget embarqué (Medium)

**Preuves.** Le titre du widget accepte toute chaîne jusqu'à 255 caractères dans `src/app/api/app/website-widget/route.js`. Il est injecté dans `CFG`, puis concaténé dans `box.innerHTML` dans `src/app/widget/[token]/route.js` (`'<span>' + CFG.title + '</span>'`).

**Impact.** Une valeur comme une balise avec gestionnaire d'événement s'exécute dans l'origine du site qui embarque le widget. L'attaquant doit contrôler ou compromettre le compte AutoCall du propriétaire du widget, mais le code s'exécute chez les visiteurs du site tiers.

**Correctif recommandé.** Ne concaténer aucune donnée dans `innerHTML`. Construire le DOM avec `createElement` et assigner les contenus avec `textContent`. À défaut, encoder strictement les caractères HTML côté génération et ajouter une CSP adaptée sur le site hôte.

### AC-SEC-POST-005 — Dépendances de développement vulnérables (Low ajusté)

`npm audit --omit=dev` retourne 0 vulnérabilité sur 298 dépendances de production. L'audit complet signale 7 High et 2 Moderate transitifs dans Tailwind/ESLint (`braces`, `micromatch`, `fast-glob`, `postcss-selector-parser`). Ces paquets ne sont pas nécessaires dans l'image runtime.

**Correctif recommandé.** Migrer Tailwind vers la version corrigée dans une branche dédiée, suivre `eslint-config-next`, installer le runtime avec `npm ci --omit=dev` et ne jamais fournir de motifs glob contrôlés par un utilisateur aux outils de build.

## Contrôles satisfaisants

- Isolation locataire présente dans les routes client inspectées (`gateClient`, `assertOwned`, filtres `client_id`).
- API v1 protégée par clés hachées, scopes, whitelist IP et rate limiting partagé.
- Cookies de session `HttpOnly`, `SameSite=Lax`, `Secure` en production/HTTPS ; JWT signé avec secret minimum.
- CSRF basé sur Origin/Fetc​​h Metadata maintenu sur les routes enveloppées par `handler`.
- Stripe, Twilio, Plivo et Meta WhatsApp rejettent les signatures invalides ; les corps des webhooks sont bornés.
- SSRF WhatsWay et webhooks sortants protégée par résolution publique et connexion épinglée via `safeFetch`.
- Secrets WhatsApp, SIP, ElevenLabs, SMTP, Meta et passerelles chiffrés ou migrables avec `APP_KEY`.
- Aucun secret haute confiance, `$queryRawUnsafe`, `$executeRawUnsafe`, `eval()` ou `new Function()` détecté.
- Les enregistrements d'appels sont limités aux fournisseurs HTTPS approuvés et contrôlés par propriétaire.
- Le LLM d'appel n'expose pas d'outil privilégié. Une prompt injection peut influencer le discours/`[END_CALL]`, mais ne déclenche pas directement de mutation privilégiée.

## Vérifications exécutées

- Revue statique locale des routes API, frontières locataires, secrets, sorties réseau, webhooks, paiements et LLM.
- `npm audit --omit=dev --json` : 0 vulnérabilité de production.
- `npm audit --json` : 7 High, 2 Moderate, uniquement chaîne de développement.
- Tests Node : 34 réussis, 2 échoués sur `registration-plan` (attentes `free` vs comportement `pro`), sans lien direct avec les correctifs de sécurité mais constituant une régression à traiter.
- Build Next.js 16.3.8 : réussi ; TypeScript réussi ; 114 pages statiques générées.
- Scanner distant `@openai/codex-security` non exécuté : aucune transmission externe du dépôt n'a été autorisée. La copie locale `auditautocall` ne déclare pas de CLI exécutable dans son `package.json`.

## Priorités

1. Bloquer ou limiter immédiatement `/api/widget/[token]/chat` avant exposition publique.
2. Chiffrer et faire tourner les jetons Google Sheets.
3. Durcir `/api/f/[token]/submit` avec lecteur borné, allowlist et quotas.
4. Supprimer la concaténation du titre dans `innerHTML`.
5. Corriger les deux tests d'inscription puis migrer la chaîne de développement.
