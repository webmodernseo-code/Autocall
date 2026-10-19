# Audit de sécurité AutoCall-NextJS — contrôle post-refonte UX/onboarding

Date : 20 octobre 2026  
Branche / base : `main` / `0d908f0` avec 29 entrées non commitées issues de la refonte Antigravity  
Périmètre : `AutoCall-NextJS/src/`, `src/app/api/`, `prisma/`, `scripts/`  
Seuil de blocage : High / Critical

## Verdict

**ÉCHEC du gate High/Critical.** Une vulnérabilité High et une Medium ont été introduites dans le nouvel onboarding. Le runtime de production ne contient aucune dépendance npm connue vulnérable.

| ID | Sévérité | CWE | État | Résumé |
|---|---:|---|---|---|
| AC-SEC-UX-001 | High | CWE-862, CWE-863 | Ouvert | L’onboarding contourne le RBAC et permet à tout membre du locataire de modifier l’organisation et l’agent partagé |
| AC-SEC-UX-002 | Medium | CWE-352, CWE-749 | Ouvert | Le redémarrage de l’onboarding modifie la base via une requête GET |
| AC-SEC-UX-003 | Low ajusté | CWE-674, CWE-400 | Accepté temporairement | Neuf alertes limitées aux dépendances de développement |

## AC-SEC-UX-001 — Contournement RBAC dans l’onboarding (High)

### Preuve

`src/app/api/app/onboarding/route.js:14` appelle :

```js
gateClient({ routeName: 'client.onboarding.store' })
```

Or `src/lib/auth/route-permissions.js` ne mappe pas le module `onboarding`. `permissionForRoute()` renvoie donc `null` et `gateClient()` n’effectue aucun contrôle de permission métier. Tout utilisateur client authentifié et abonné, même sans permission `settings.update`, `agents.update` ou `contacts.create`, peut alors :

- remplacer les informations de l’organisation (`route.js:66-75`) ;
- modifier le premier agent et son prompt (`route.js:77-103`) ;
- créer un contact (`route.js:106-122`) ;
- terminer ou masquer l’onboarding partagé.

### Impact

Un membre faiblement privilégié d’une équipe peut altérer l’identité de l’entreprise et les instructions de l’agent vocal utilisé par les appels. Cela peut modifier le discours de production, détourner les transferts téléphoniques, créer des contacts non autorisés et perturber tous les utilisateurs du locataire.

### Correctif recommandé

Réserver les mutations d’onboarding à l’administrateur du client, ou contrôler explicitement les permissions nécessaires. Le choix le plus sûr pour un assistant qui modifie plusieurs modules est un contrôle administrateur explicite :

```diff
 const gate = await gateClient({ routeName: 'client.onboarding.store' });
 if (gate.response) return gate.response;
+if (gate.user.client_role !== 'administrator') {
+    return abort(403, 'Seul un administrateur peut modifier la configuration initiale.');
+}
```

Appliquer le même contrôle à la route `dismiss`, à la reprise et au redémarrage. Si les membres doivent participer à l’onboarding, séparer les mutations par module et exiger respectivement `settings.update`, `agents.update` et `contacts.create`. Ajouter des tests avec un membre sans permission et un administrateur.

## AC-SEC-UX-002 — Mutation persistante déclenchée par GET (Medium)

### Preuve

`src/app/app/onboarding/page.jsx:22-24` exécute `restartOnboarding(clientId)` lorsque l’URL contient `?restart=1`. Une simple navigation GET réinitialise `status`, `current_step`, `completed_at` et `dismissed_at`. Cette action ne passe ni par `handler()` ni par la défense CSRF des routes d’écriture.

### Impact

Un lien externe, une prélecture, un crawler ou une navigation forcée peut réinitialiser l’état d’un utilisateur connecté. Les cookies `SameSite=Lax` peuvent accompagner une navigation GET de premier niveau. Le dommage est surtout d’intégrité et de nuisance, mais viole aussi l’invariant « l’onboarding terminé ne revient pas ».

### Correctif recommandé

Supprimer toute mutation du Server Component GET et créer une route POST dédiée :

```diff
-if (params?.restart === '1') {
-    await restartOnboarding(clientId);
-    redirect('/app/onboarding?step=1');
-}
```

```js
export const POST = handler(async () => {
    const gate = await gateClient({ routeName: 'client.onboarding.restart' });
    if (gate.response) return gate.response;
    if (gate.user.client_role !== 'administrator') return abort(403);
    await restartOnboarding(gate.clientId);
    return redirectTo('/app/onboarding?step=1');
});
```

Déclencher cette route depuis un formulaire/bouton POST, avec confirmation claire.

## AC-SEC-UX-003 — Dépendances de développement vulnérables (Low ajusté)

`npm audit --omit=dev` retourne **0 vulnérabilité sur 298 dépendances de production**. L’audit complet retourne 7 High et 2 Moderate dans la chaîne Tailwind 3 / ESLint (`braces`, `micromatch`, `fast-glob`, `postcss-selector-parser`). Leur exploitation nécessite le contexte de build et des motifs/entrées contrôlés ; elles ne sont pas livrées dans le runtime.

Correctif : préparer une migration testée vers Tailwind 4 et une chaîne ESLint compatible, puis déployer avec `npm ci --omit=dev` dans l’image runtime. Ne pas appliquer le downgrade majeur proposé automatiquement par npm à `eslint-config-next@14` sur une application Next 16.

## Contrôles satisfaisants

- Les nouvelles écritures utilisent `readBody`, le validateur allowlist et la limite globale de payload.
- Les identifiants de locataire proviennent de la session ; aucun `client_id` fourni par le navigateur n’est utilisé.
- La migration possède une contrainte unique par client et une clé étrangère en cascade.
- L’accès à l’onboarding et au dashboard filtre les lectures par `client_id`.
- Les routes d’écriture restent enveloppées par `handler()` et sa protection CSRF.
- Aucun secret haute confiance, aucune requête Prisma brute non sûre, aucun `eval()` ni `new Function()` détecté.
- Les anciens correctifs du widget public, des formulaires, de Google Sheets et du SSRF restent présents.

## Vérifications exécutées

- Tests onboarding : 5/5 réussis.
- Tests sécurité des requêtes : 4/4 réussis.
- Tests d’entrées publiques : 2/2 réussis.
- `prisma validate` : réussi.
- `git diff --check` : réussi.
- `npm audit --omit=dev` : 0 vulnérabilité de production.
- `npm audit` complet : 7 High et 2 Moderate, développement uniquement.
- `npm run verify` : arrêté par timeout après environ 21 minutes sans sortie progressive ; ce résultat n’est pas interprété comme un succès. Les contrôles ciblés ci-dessus sont valides, mais lint intégral et build doivent être relancés après correction.

## Note de périmètre

Le fichier de consignes conserve plusieurs cases non cochées et champs `[Exemple…]`. L’audit a néanmoins couvert les frontières critiques historiques et la totalité du diff Antigravity, avec priorité sur l’autorisation, la session, l’isolation locataire, les mutations et les dépendances.

