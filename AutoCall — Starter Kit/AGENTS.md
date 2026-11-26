# AutoCall — Instructions permanentes (Codex et Antigravity)

## Avant toute action
1. Lire ce fichier, DECISIONS.md, ARCHITECTURE.md, ROADMAP.md, PASSATION.md, PROGRESS.md et HANDOFF.md. Lire frontend.md et backend.md (sections pertinentes au minimum, intégralement lors du cadrage initial). Consulter le PDF pour les illustrations et décisions de conception.
2. Examiner git status --short --branch, git log -5 --oneline, git diff et git diff --cached si le dépôt existe. Comparer le code réel au suivi ; ne pas supposer qu'un statut déclaré est exact.
3. Identifier une seule tâche autorisée, ses dépendances et ses critères de recette. Annoncer le plan avant toute modification importante. Si aucune tâche n'est autorisée, rester en analyse.

## Sources et contraintes
- DECISIONS.md contient les décisions ultérieures explicites du propriétaire ; AGENTS.md définit la méthode. frontend.md et backend.md définissent les exigences. Le PDF V0.1 est un référentiel historique incomplet. En cas de contradiction non résolue par une décision explicite, demander arbitrage, sans modifier silencieusement les spécifications.
- Projet neuf, aucun code CallMine AI. Toutes les familles V1 restent obligatoires. Séparer apps/web, apps/dashboard et apps/admin. Appliquer Frontend First jusqu’à la validation de J1. France d'abord, Côte d'Ivoire sous conditions. CTA et footer graphite (composition B).
- Architecture cible : Next.js App Router, React, TypeScript strict, Tailwind, shadcn/ui, NestJS modulaire, PostgreSQL/Prisma/pgvector, Redis/BullMQ, stockage S3, BetterAuth. Versions maintenues compatibles à vérifier et verrouiller ; aucun changement majeur sans décision documentée.
- Respecter les tokens, Geist, Solar Bold Duotone, les maquettes validées et les tarifs/quotas. Ne pas inventer d'intégration active, de statistiques réelles ou de fonctionnalité terminée. Isoler les démos et mocks.
- Sécurité : tenant_id, contrôle serveur, RLS, moindre privilège, invités lecture seule, MFA admin, secrets hors Git/logs, données fictives en développement. Réserver et contrôler quotas/budgets avant effets payants ; webhooks vérifiés et idempotents. Aucun paiement, appel, email, publication réelle, déploiement ou migration destructive sans autorisation explicite.

## Git et collaboration
- Un seul agent modifie le même dossier à la fois. Ne pas travailler en parallèle sur une même branche. Branche main stable ; une branche de tâche (ex. feat/phase-01-bootstrap) après autorisation. Ne pas écraser le travail non commité, ni utiliser reset --hard, clean -fd, force-push ou suppression de branche sans accord. Identifier les modifications préexistantes.
- Verrouiller les dépendances ; conserver un seul lockfile. Ne pas changer gestionnaire de paquets, versions ou scripts sans justification. Vérifier .gitignore avant git add ; exclure .env réels, secrets, données clients, node_modules et builds. .env.example contient uniquement des noms et valeurs fictives.
- Commits locaux petits et cohérents, avec tests et documentation ; ne pas inclure de secrets ni de modifications sans rapport. Pas de push/merge/deploiement sans autorisation ou règle explicitement approuvée. Git n'est pas une sauvegarde de base de données.

## Définition de terminé
Pour chaque lot : critères d'acceptation vérifiés, lint/typecheck/tests/build pertinents exécutés avec commandes et résultats réels, sécurité/permissions/quotas testés, erreurs et reprise prises en compte, documentation à jour. Si un test n'est pas exécutable, indiquer pourquoi ; ne jamais annoncer « vert » sans preuve. Un mock ne valide pas une intégration réelle.

## Passation obligatoire
- Mettre à jour HANDOFF.md au début de la tâche (état en cours, intention, branche), puis après chaque sous-étape significative. Mettre à jour PROGRESS.md avec preuves, ROADMAP.md avec statuts et DECISIONS.md uniquement pour les décisions approuvées (propositions distinctes).
- Avant de terminer : indiquer fichiers touchés, dernière commande, résultats de tests, modifications non commitées, derniers commits, blocages, effets externes éventuels et prochaine action précise. Si interruption brutale, l'agent suivant inspecte Git et les tests avant de reprendre. Ne jamais annuler le travail précédent pour faire correspondre le code au suivi.
- Ne pas inscrire de clés, tokens, mots de passe ou données clients dans les fichiers de pilotage.
