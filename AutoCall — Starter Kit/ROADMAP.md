# AutoCall — ROADMAP de développement A à Z

> Document de pilotage commun à Codex et Antigravity. Cette copie se trouve dans le Starter Kit, à côté de [PASSATION.md](PASSATION.md). Ce plan n'est pas un remplacement du cahier des charges.

## 1. Objectif et ordre de réalisation

Livrer un SaaS exploitable, sécurisé, testé, déployé et maintenable. L'ordre retenu est **frontend d'abord, backend ensuite, puis intégration et production**, confirmé par le propriétaire le 23 novembre 2026. Les contrats de données sont préparés dès le frontend, sans serveur métier. Les fondations et modules serveur commencent après validation de J1. B04.07 est la première tranche connectée.

Périmètre prévisionnel : dashboard client et Super Admin, agents vocaux, téléphonie entrante/sortante, contacts et acquisition de prospects, campagnes, agenda, messagerie/email/WhatsApp, Social, analytics, abonnements et crédits. Le kit validé détermine le périmètre exact, les rôles, les fournisseurs et la stack ; cette roadmap ne les redéfinit pas. Les huit fichiers du kit ont été rapprochés de cette feuille de route dans la matrice P00.01 (§10). Toute modification de périmètre reste soumise à validation.

## 2. Protocole permanent pour les IA

1. Lire `PASSATION.md`, `ROADMAP.md`, `AGENTS.md` s'il existe, puis les spécifications pertinentes. Vérifier Git et les changements locaux. Ne jamais écraser le travail précédent.
2. Sélectionner la première mission non validée dont les dépendances sont satisfaites. L'utilisateur peut autoriser une autre mission ; signaler ses dépendances. Ne pas exécuter toute la roadmap d'un coup.
3. Avant modification, expliquer brièvement le résultat attendu, fichiers concernés, risques et tests. Respecter l'autorisation donnée ; demander une décision uniquement pour un blocage, une modification structurante, une dépense ou une action externe non autorisée.
4. Implémenter par petits incréments, réutiliser les composants, respecter le design system et les contrats. Ne pas introduire de fonctionnalités non validées ni de dépendances superflues.
5. Tester réellement ; consigner les commandes, résultats et limites. Ne jamais présenter des mocks, tests ignorés ou services non configurés comme fonctionnels en production.
6. Mettre à jour le statut de la mission dans ce fichier et `PASSATION.md` après chaque intervention significative. Consigner les changements, décisions, preuves, blocages et la prochaine mission. Attendre la validation du propriétaire avant de passer au prochain jalon, sauf autorisation explicite couvrant plusieurs missions.
7. Un seul agent modifie le dossier à la fois. Antigravity est proposé pour le frontend, Codex pour le backend et la revue technique ; les rôles ne sont pas exclusifs. Commit, push, déploiement, achats et actions réelles externes uniquement avec autorisation. Le dépôt cible autocall.v2 est privé. Protéger les secrets, données client et documents confidentiels à tout transfert.

### Statuts et critères communs

- `[ ]` À faire ; `[~]` en cours ; `[!]` bloqué ; `[x]` terminé et validé. Une mission n'est pas validée simplement parce que son code existe.
- Chaque mission doit avoir des critères métier satisfaits, des vérifications pertinentes réussies (lint, types, tests, build selon la phase), aucun défaut critique connu, documentation et passation à jour.
- Une mission non applicable doit être justifiée et approuvée ; elle ne doit pas disparaître silencieusement du plan.
- Pour le frontend, une validation signifie « interface simulée validée », jamais « service réel opérationnel ».
- Une anomalie bloquante suspend les missions dépendantes ; noter comment la reproduire et la corriger. Ne pas désactiver les contrôles pour faire passer les tests.

## 3. Préparation — P00

- [x] **P00.01 — Audit du kit.** Inventorier les fichiers, exigences, modules, rôles, technologies, intégrations, limites V1 et décisions. Établir une matrice exigences → missions → critères de recette, dans le suivi existant ou un fichier dédié si nécessaire. Résultat : aucun écart important non signalé.
- [x] **P00.02 — Audit environnement et Git.** Vérifier Node, pnpm, Git, dossier, branche et remote. Vérifier `.gitignore`, secrets et fichiers confidentiels avant toute publication. Documenter l'absence de Docker/WSL opérationnel ; ne pas bloquer le frontend pour cette raison. Résultat : environnement local reproductible et risques identifiés.
- [x] **P00.03 — Architecture et conventions.** Confirmer l'arborescence, versions, conventions de nommage, commandes, séparation UI / domaine / données, contrats et documentation. Résultat : compatibilité avec le kit validée et démarrage autorisé.

## 4. Frontend — F01 à F05

### F01 — Fondations, design system et composants

- [x] **F01.01 — Initialisation frontend.** Créer ou compléter uniquement l'application frontend avec la stack du kit, scripts dev/build/lint/typecheck, configuration TypeScript, lockfile et page de contrôle. Validation : démarrage local sous Windows et build réussi sans Docker.
- [x] **F01.02 — Direction visuelle.** Définir couleurs, typographie, espacements, rayons, ombres, icônes, densité, contrastes et états sémantiques ; respecter le branding déjà approuvé. Valider une planche de composants et un écran représentatif avant généralisation.
- [~] **F01.03 — Bibliothèque UI.** Boutons, champs, sélecteurs, badges, tableaux, pagination, filtres, cartes KPI, graphiques, menus, modales, toasts, skeletons, états vide/erreur/chargement. Validation : composants réutilisables, navigation clavier, focus visible, labels et contraste.
- [~] **F01.04 — App Shell.** Sidebar, header, navigation, fil d'Ariane si utile, responsive, menus utilisateur et layouts client/admin distincts. Validation : routes navigables sur desktop/mobile, absence de liens cassés. *(Écart D003 : tout est regroupé dans `apps/dashboard` ; `apps/web` et `apps/admin` absents.)*
- [~] **F01.05 — Couche de données simulées.** Définir types, DTO et contrats provisoires, fixtures cohérentes, interfaces de services et adaptateurs mock. Centraliser les données et simuler attente, erreur, pagination et permissions. Pas d'API réelle ni de secret frontend. Validation : remplacement futur des mocks possible sans réécrire les écrans. *(Écart : pas encore de `packages/contracts`, `packages/domain` ni couche adaptateurs unifiée.)*

### F02 — Parcours d'accès et compte client

- [~] **F02.01 — Accès.** Connexion, inscription, vérification email, récupération de mot de passe, états d'expiration et refus d'accès selon spécifications. Validation : navigation et validation des champs simulées ; aucune promesse de sécurité réelle.
- [~] **F02.02 — Onboarding.** Configuration de l'entreprise, préférences, première action utile, guide de progression et interruption/reprise selon kit. Validation : parcours jusqu'au premier écran utilisable.
- [~] **F02.03 — Dashboard.** KPI liés aux appels, agents, activités, rendez-vous et consommation selon périmètre ; périodes, données cohérentes, états vides et raccourcis. Validation : chiffres concordants et lisibilité.
- [~] **F02.04 — Paramètres.** Profil, entreprise, notifications, horaires, intégrations, confidentialité et compte, selon droits prévus. Validation : formulaires, confirmations et erreurs simulées. *(Écart D009 : gestion d'équipe multi-rôles affichée au lieu de Propriétaire + invités lecture seule.)*

### F03 — Modules métier : interfaces et interactions simulées

- [~] **F03.01 — Contacts et prospects.** Liste, recherche, filtres, fiche, import, dédoublonnage et segmentation ; acquisition et coût en crédits selon kit. Les fournisseurs d'acquisition restent invisibles aux clients si exigé. Validation : parcours de recherche/import/qualification et erreurs lisibles.
- [~] **F03.02 — Agents IA.** Liste, création, édition, avatar, voix, instructions, base de connaissances, scénarios, horaires, test simulé et publication contrôlée. Validation : paramètres sauvegardés dans le mock, états brouillon/actif cohérents.
- [~] **F03.03 — Téléphonie.** Numéros, routage, transfert, horaires, SVI si prévu, historique, fiche appel, transcription, résumé et enregistrement fictif. Validation : parcours entrant, sortant, manqué, échec et détail appel.
- [~] **F03.04 — Agenda.** Calendrier, disponibilités, prise/modification/annulation de rendez-vous, fuseau horaire et intégrations simulées. Validation : conflits de créneaux et états de confirmation visibles. *(Page publique `/book/[entreprise]` manquante.)*
- [~] **F03.05 — Campagnes.** Création, audience, canal, contenu/scénario, planification, prévisualisation, lancement fictif, pause, arrêt et résultats. Validation : aucun envoi réel ; erreurs et exclusions simulées.
- [~] **F03.06 — Messagerie et email.** Boîte de réception, conversations, brouillons, modèles, résumé et intégrations prévues. Validation : réponses simulées, états non lus/échec/désabonnement selon canal.
- [~] **F03.07 — WhatsApp.** Connexion fictive, messages, notes vocales simulées, transcription, modèles et états de livraison. Validation : parcours conforme au kit, aucun message réel.
- [~] **F03.08 — Social.** Comptes Facebook, Instagram, LinkedIn selon kit, calendrier, brouillons, aperçu, publication fictive, erreurs, statistiques disponibles. Validation : différences de capacités par réseau visibles ; pas de promesse de publication réelle.
- [~] **F03.09 — Analytics.** Indicateurs, périodes, filtres et exports prévus ; définition des métriques, cohérence des chiffres et unités. Validation : cas sans activité et données partielles.
- [~] **F03.10 — Abonnements et crédits.** Plans, quotas, consommation, solde, historique et achat simulé de crédits, factures et changement de plan selon kit. Validation : solde insuffisant, paiement refusé et dépassement de limite simulés. *(Écart critique D007/D008 dans `billing-plan-panel.tsx`.)*

### F04 — Super Admin et site public

- [~] **F04.01 — Super Admin.** Layout distinct, gestion des comptes/clients, plans, crédits, consommation, intégrations, incidents et métriques selon spécifications. Validation : actions sensibles confirmées, permissions simulées, données fictives sans PII réelle.
- [~] **F04.02 — Site public.** Landing, fonctionnalités, tarifs, FAQ, contact, CTA et routes légales prévues. Validation : navigation, responsive, accessibilité et métadonnées SEO ; aucun témoignage/chiffre inventé présenté comme réel. *(Écarts critiques D007, D010 et `frontend.md` §1/§8 sur `/landing` et routes dédiées.)*

### F05 — Recette frontend (jalon J1)

- [ ] **F05.01 — Parcours complets.** Tester inscription → onboarding → dashboard → création agent → simulation appel → rendez-vous → consultation historique ; tester aussi campagnes, messagerie, Social, crédits et Super Admin selon périmètre.
- [ ] **F05.02 — Qualité visuelle et technique.** Contrôler desktop/mobile, clavier, contraste, zoom, états limites, erreurs, composants dupliqués, performance et build. Tests de composants et E2E mock sur parcours prioritaires.
- [ ] **F05.03 — Gel des interfaces.** Valider les écrans, contrats provisoires et inventaire des fonctionnalités ; noter les exceptions. Accord propriétaire avant backend. J1 atteint = prototype complet validé, sans backend opérationnel.

## 5. Backend — B01 à B06

### B01 — Architecture serveur et données

- [ ] **B01.01 — Initialisation backend.** Utiliser la stack validée, configuration par environnement, scripts, gestion des erreurs, logs structurés, endpoint de santé et documentation API. Choisir l'environnement de test compatible avec Windows et le kit ; si Docker est indispensable, résoudre WSL ou faire approuver une alternative.
- [ ] **B01.02 — Modèle de données.** Définir entités, relations, identifiants, index, contraintes, rétention, migrations et seeds synthétiques ; isolation par client/tenant selon architecture. Validation : installation d'une base vierge et migrations testées en environnement non productif.
- [ ] **B01.03 — Infrastructure asynchrone.** Mettre en place tâches/queues, retry borné, idempotence, délais, échecs et réconciliation selon besoin. Validation : simulation de panne et reprise sans duplication.
- [ ] **B01.04 — Contrats API.** Schémas requête/réponse, validation serveur, pagination, erreurs, versionnement et documentation (OpenAPI si pertinent). Comparer avec contrats frontend ; approuver changements incompatibles. Validation : tests de contrat.

### B02 — Identité, sécurité et services fondamentaux (jalon J2)

- [ ] **B02.01 — Authentification.** Sessions/tokens selon stack, vérification, récupération, expiration, révocation et limitation des tentatives. Aucun identifiant secret dans les logs. Validation : accès autorisé, refus, expiration et récupération testés.
- [ ] **B02.02 — Autorisations et isolation.** Appliquer le contrôle serveur à chaque ressource, y compris fichiers, exports, tâches, webhooks et admin. Validation : tests négatifs inter-clients et élévation de privilèges impossible dans les scénarios testés.
- [ ] **B02.03 — Comptes et paramètres.** Entreprise, profil, préférences, horaires, onboarding et audit des actions sensibles. Validation : persistance et droits.
- [ ] **B02.04 — Stockage et intégrations.** Accès privé aux fichiers, quotas, validation des uploads, accès temporaires, secrets côté serveur, OAuth si requis, révocation, signatures webhooks et rotation. Validation : aucun accès croisé, appels invalides rejetés.
- [ ] **B02.05 — Confidentialité et sécurité de base.** Modèle de menaces, validation des entrées, protections adaptées (CSRF/XSS/injections/SSRF), limitations de débit, journal d'audit, rétention/suppression/export. Protection effective des données dès maintenant. J2 : tests sécurité de base et socle API validés.

### B03 — Abonnements, crédits et coûts

- [ ] **B03.01 — Catalogue et droits.** Plans, quotas, droits et restrictions côté serveur ; limites de consommation. Validation : impossible de contourner un quota via API.
- [ ] **B03.02 — Comptabilité crédits.** Registre de mouvements, réservation/débit/remboursement selon règles validées, idempotence et transactions concurrentes. Validation : pas de double débit, dépassement non autorisé ou solde incohérent.
- [ ] **B03.03 — Paiements.** Fournisseur validé, checkout, renouvellement, échec, annulation, factures, achat de crédits, webhooks signés et réconciliation. En sandbox exclusivement jusqu'à autorisation. Validation : paiement dupliqué, événements désordonnés, refus et renouvellement.
- [ ] **B03.04 — Maîtrise des dépenses.** Mesure usage fournisseurs, limites d'appels et de campagnes, plafonds par client et alertes. Validation : arrêt sûr en cas de quota ou erreur ; aucune dépense réelle non approuvée.

### B04 — Services métier prioritaires (jalon J3 : valeur centrale)

- [ ] **B04.01 — Contacts et prospects.** CRUD, import validé/dédoublonné, recherche, segmentation et acquisition via adaptateurs fournisseurs autorisés. Contrôler droits, provenance des données, crédits, suppression et conformité. Validation : erreurs fournisseurs, doublons et isolation.
- [ ] **B04.02 — Agents vocaux.** CRUD, versions des instructions, voix/avatar, connaissances, outils autorisés et cycle brouillon/test/activation ; limiter accès à la base de connaissances et actions de l'agent. Validation : configurations persistées et tests en environnement simulé, protection contre instructions malveillantes et accès non autorisés.
- [ ] **B04.03 — Téléphonie entrante.** Fournisseur validé, numéros, routage, horaires, répondeur/transfert, état d'appel, webhooks signés et cas d'échec. Vérifier faisabilité par pays et numéro avant achat. Validation : appel sandbox ou test autorisé de bout en bout, échec et fallback.
- [ ] **B04.04 — Téléphonie sortante.** File d'attente, contrôle d'éligibilité des destinataires, consentement et exclusions selon usage, quotas, arrêt et états d'appel. Validation : impossible de lancer un appel interdit par les règles définies ; test autorisé uniquement.
- [ ] **B04.05 — Enregistrements, transcriptions, résumés.** Information/consentement lorsque requis, traitement asynchrone, stockage protégé, politique de rétention et erreurs ; identifier les résumés générés par IA. Validation : accès contrôlé, suppression et traitement en échec.
- [ ] **B04.06 — Rendez-vous et calendrier.** OAuth agenda, lecture des disponibilités, fuseaux horaires, réservation atomique ou protection contre conflits, confirmations, modification/annulation et retry. Validation : double réservation évitée dans les tests, jeton expiré et révocation traités.
- [ ] **B04.07 — Intégration verticale prioritaire.** Connecter un parcours client autorisé complet : configuration agent → appel entrant → demande de rendez-vous → réservation → transcription/résumé → dashboard et consommation. J3 : chaîne réelle en environnement de test contrôlé, ou blocage explicitement déclaré si fournisseur indisponible.

### B05 — Automatisation et canaux complémentaires

- [ ] **B05.01 — Campagnes.** Moteur de planification, audiences, horaires, approbation, pause/arrêt, retries, déduplication et résultats. Appliquer règles anti-abus, exclusions et coût avant exécution. Validation : reprise sans envoi double, arrêt et audit.
- [ ] **B05.02 — Email.** Intégrations validées (Gmail/Outlook ou email pro si prévu), OAuth, réception/envoi, modèles, statut, désabonnement et limites applicables. Validation : destinataire test autorisé, refus et révocation.
- [ ] **B05.03 — WhatsApp.** Intégration officielle ou partenaire validé, opt-in, modèles et fenêtres applicables, webhooks, médias privés, notes vocales et transcription ; confirmer disponibilité des droits. Validation : livraison/échec et respect des règles du canal en sandbox ou test autorisé.
- [ ] **B05.04 — Social.** Vérifier droits API, examen d'application, types de comptes, capacités et coûts réseau par réseau ; choisir fournisseur selon kit. Implementer OAuth, jetons, brouillons, planification, publication et états fournisseur. Validation : tests par réseau sur comptes de test autorisés, pas de fausse équivalence entre plateformes.
- [ ] **B05.05 — Notifications et automatisations.** Événements, préférences, modèles, idempotence, délais et historique ; validation des déclencheurs et échecs.

### B06 — Pilotage et administration (jalon J4)

- [ ] **B06.01 — Analytics.** Agrégations, périodes, fuseaux horaires, définitions KPI, exports et isolation. Validation : chiffres réconciliés avec événements et registre de consommation.
- [ ] **B06.02 — API Super Admin.** Droits privilégiés distincts, gestion comptes, plans, crédits, incidents et intégrations selon kit ; justification/audit des actions sensibles. Validation : accès client refusé, actions auditées.
- [ ] **B06.03 — Robustesse backend.** Tests unitaires, intégration, contrats, migrations, scénarios concurrents et pannes fournisseurs ; sauvegarde/restauration de test. J4 : API du périmètre V1 testées et limitations documentées.

## 6. Intégration complète — I01

> La connexion se fait par tranches verticales ; ne pas attendre que tout le backend soit fini pour détecter les incompatibilités. La tranche centrale B04.07 est la première intégration ; les autres peuvent commencer dès que leurs API sont validées.

- [ ] **I01.01 — Client API.** Configurer URL par environnement, transport, session, erreurs, validation et rafraîchissement des données. Ne jamais exposer de secret serveur. Les mocks restent réservés au développement/test explicite.
- [ ] **I01.02 — Compte et accès.** Connecter authentification, onboarding, profil et autorisations. Tester sessions, refus, routes protégées et multi-tenant réel.
- [ ] **I01.03 — Usage et facturation.** Connecter plans, droits, consommation, crédits et paiements sandbox. Tester les parcours d'échec et double événements.
- [ ] **I01.04 — Agents, appels et agenda.** Connecter les écrans et la chaîne centrale ; vérifier traitement asynchrone, actualisation et erreurs. Valider avec comptes/destinataires de test.
- [ ] **I01.05 — Contacts, campagnes, email, WhatsApp, Social.** Connecter progressivement aux API autorisées, vérifier statuts et actions disponibles réellement par canal.
- [ ] **I01.06 — Dashboard, analytics, Super Admin.** Connecter KPI, logs, exports et actions privilégiées ; vérifier chiffres et isolation.
- [ ] **I01.07 — Suppression des simulations de production.** Inventorier les mocks, placeholders, boutons inertes et TODO ; empêcher toute utilisation de fixtures dans le build production. Une fonctionnalité non livrée doit être masquée ou explicitement signalée après arbitrage, jamais annoncée comme active.
- [ ] **I01.08 — Recette intégrée (J5).** Tests E2E des parcours prioritaires, utilisateurs distincts, erreurs fournisseurs, responsive, performance et régression. Validation des exigences V1 avec preuves.

## 7. Préproduction, conformité et livraison — R01 à R03

### R01 — Durcissement et conformité

- [ ] **R01.01 — Audit sécurité.** Revue des accès, dépendances, secrets, webhooks, entrées, fichiers, isolation, logs et endpoints admin ; remédier aux vulnérabilités critiques/élevées exploitables avant lancement.
- [ ] **R01.02 — Conformité.** Examiner exigences RGPD, contrats sous-traitants, transferts, droits des personnes, conservation, enregistrements d'appels, règles de prospection et politiques de chaque canal/pays. Faire valider les points juridiques applicables par une personne qualifiée avant activité réelle. Documenter décisions et preuves ; aucune conformité ne se déduit automatiquement de cette checklist.
- [ ] **R01.03 — Performance et résilience.** Mesurer latence, charge, concurrence, consommation, temps de réponse vocal et coût moyen avec seuils approuvés. Tester limites, pannes, retries, backups et restauration.
- [ ] **R01.04 — Revue UX et accessibilité.** Audit clavier, lecteurs d'écran sur parcours essentiels, contrastes, messages, responsive et qualité du site public.

### R02 — Préproduction

- [ ] **R02.01 — CI/CD et environnements.** Contrôles automatisés sur branches/PR, build reproductible, secrets hébergés, séparation dev/staging/prod, migrations contrôlées et approbation des déploiements. Dépôt privé recommandé avant publication de code sensible ; aucune publication sans accord.
- [ ] **R02.02 — Déploiement staging.** HTTPS, domaine de test, base et stockage distincts, workers et webhooks, comptes de test ; vérifier santé des services. Aucun trafic client réel.
- [ ] **R02.03 — Exploitation.** Métriques, alertes, traces, budgets, procédure d'incident, sauvegarde/restauration, rollback testé, gestion des accès et documentation de support.
- [ ] **R02.04 — Pilote contrôlé.** Tester avec utilisateurs volontaires et données autorisées, critères de succès et budget approuvés. Corriger les anomalies et vérifier intégrations réelles autorisées. J6 : décision go/no-go documentée.

### R03 — Production et lancement

- [ ] **R03.01 — Préparation production.** Domaine, TLS, secrets production, contrats fournisseurs, comptes, limites, tarification et politiques validés ; vérifier coûts et disponibilité réelle des intégrations. Confirmer backup et rollback avant migration.
- [ ] **R03.02 — Déploiement autorisé.** Déployer progressivement ; smoke tests, métriques et alertes ; rollback si seuils critiques dépassés. Aucun déploiement ni envoi réel sans autorisation explicite.
- [ ] **R03.03 — Recette finale (J7).** Valider chaque exigence V1 par preuve, intégrations réelles approuvées, sécurité, conformité, accès, facturation, restauration et parcours clients. Documenter limitations résiduelles et accepter explicitement les reports éventuels.
- [ ] **R03.04 — Livraison.** README de démarrage, documentation architecture/API, manuel admin/client, procédures de support, exploitation, coûts, sauvegardes et release notes. Remettre l'état final au propriétaire et actualiser PASSATION.md.

## 8. Maintenance continue — M01

- [ ] **M01.01 — Organisation post-lancement.** Mettre en place suivi des incidents, retours utilisateurs, usage/coûts, mises à jour de dépendances, renouvellements de jetons et revues de sécurité. Cette mission valide l'organisation ; les opérations restent récurrentes.
- [ ] **M01.02 — Évolutions.** Prioriser les retours, créer des missions versionnées, tester en staging et documenter la passation avant toute release. Ne pas réouvrir la V1 sans nécessité.

## 9. Jalons de validation

| Jalon | Condition de sortie |
|---|---|
| J0 | Kit audité, environnement et périmètre confirmés |
| J1 | Frontend simulé complet, UX et contrats validés |
| J2 | Socle backend, accès, isolation et contrats testés |
| J3 | Parcours vocal central intégré en test contrôlé |
| J4 | Backend V1 et services complémentaires validés |
| J5 | Frontend/backend intégrés, recette V1 réussie |
| J6 | Préproduction et pilote validés, décision go/no-go |
| J7 | Production autorisée, recette finale et livraison documentées |

Le passage d'un jalon exige les missions associées et leurs dépendances validées ; aucun défaut bloquant connu ni capacité indispensable non vérifiée. Un report de périmètre exige l'accord explicite du propriétaire. Les permissions API externes, la conformité, la disponibilité des fournisseurs et la résolution de Docker si requis sont des dépendances réelles, pas des tâches que l'IA peut déclarer terminées sans preuve.

## 10. Registre de suivi — à tenir à jour

Le statut des missions ci-dessus est la source de suivi. Ne pas créer une deuxième liste contradictoire. Pour chaque mission significative, consigner brièvement dans le journal existant ou ci-dessous :

| Mission | Agent/date | Résultat et preuve de test | Validation ou blocage |
|---|---|---|---|
| P00.01 | Codex · 23 novembre 2026 | Inventaire, rapprochement des sources et matrice ci-dessous. Git ne détecte aucun dépôt dans ce dossier. | Validé par le propriétaire le 23 novembre 2026 |
| P00.02 | Codex · 23 novembre 2026 | Node/npm et Git exécutés sous Windows. Remote, protections et limites documentés ci-dessous. | Validé par le propriétaire le 23 novembre 2026 |
| P00.03 | Codex · 23 novembre 2026 | Architecture et conventions définies ci-dessous et rapprochées du kit. | Validé par le propriétaire le 23 novembre 2026 |

### Audit P00.02 — environnement Windows et Git

Le propriétaire confirme avoir rendu webmodernseo-code/autocall.v2 privé. Le connecteur GitHub reçoit désormais une réponse 404 et ne liste plus le dépôt. Vérifier l’accès authentifié avant tout rattachement ou transfert.

- Windows x64, PowerShell 5.1. Node v26.13.1 et npm 11.20.0 sont disponibles. Un test Node contrôlant la plateforme a réussi. pnpm et Corepack sont absents du PATH. Le cache npm par défaut a refusé la lecture dans cette session (EPERM). Versions cibles, gestionnaire et verrouillage à décider en P00.03. La reproductibilité du projet sera vérifiée avec le premier build F01.01.
- Git 2.56.1.windows.1 fonctionne. Les commandes git status --short --branch, git rev-parse --show-toplevel et git remote -v échouent depuis la racine du workspace, qui ne contient aucun dépôt local. Branche et HEAD locaux indisponibles. La valeur locale init.defaultBranch est master, tandis que le kit prescrit main.
- Le connecteur GitHub trouve deux dépôts du propriétaire, tous deux publics avec main comme branche par défaut. webmodernseo-code/Autocall contient des données selon sa taille GitHub. webmodernseo-code/autocall.v2 affichait une taille de zéro avant son passage en privé. Aucun rattachement ni transfert effectué.
- Aucun .gitignore, manifeste ou lockfile dans le workspace. Inventaire par noms de fichiers et recherche ciblée de signatures de clés dans les Markdown sans résultat. Le Blueprint PDF et le kit de conception nécessitent une décision de publication avant tout ajout à un dépôt public. Préparer les exclusions .env, secrets, données client et fichiers générés avant staging Git, puis tester avec git check-ignore et contrôler les fichiers déjà suivis si un dépôt est rattaché.
- Docker est absent du PATH et du chemin Windows standard vérifié. Le service WslService est actif, mais wsl --status et wsl --list --verbose échouent avec Wsl/E_ACCESSDENIED dans cette session. Docker/WSL sont à requalifier pour le backend si requis. Le frontend doit pouvoir démarrer avec Node natif.

P00.02 validée. Le cadrage de P00.03 figure ci-dessous.

### Audit P00.01 — sources et couverture V1

L’inventaire comprend cette roadmap et les huit fichiers du Starter Kit. **DECISIONS.md** (D001–D011) tranche les décisions validées, **AGENTS.md** régit l’intervention, **frontend.md** et **backend.md** consolident les exigences, et **AutoCall_Product_Blueprint_v0.1.pdf** (77 pages) documente la conception historique. **PASSATION.md**, **HANDOFF.md** et **PROGRESS.md** assurent la reprise et le suivi. Les mentions de réutilisation de CallMine AI (PDF p.37, 66–67) sont caduques selon D001. Les séquences backend ou mixtes proposées dans les référentiels cèdent la priorité à Frontend First. Les D002–D011 restent applicables.

Chaque ligne fixe un rattachement de recette documentaire validé avec P00.01. Les références 8.8–8.10 renvoient à la conception. La matrice 6.10 originale et ses libellés individuels restent à récupérer. Conserver ses identifiants réservés et utiliser des références FE-* et BE-* distinctes si un identifiant provisoire devient nécessaire. En J1, la preuve est une recette en simulation. En J5–J7, relier chaque exigence à l’écran, au contrat, au test exécuté et à son résultat.

| Exigence et source | Missions | Critère de recette |
|---|---|---|
| D001/D003 · Projet neuf, monorepo et trois applications web séparées. Next.js App Router, React, TypeScript strict, Tailwind, shadcn/ui. NestJS et workers, PostgreSQL Neon UE/Prisma/pgvector, Redis/BullMQ, S3 et BetterAuth. | P00.02–03, F01.01–05, B01.01–04, B02.01, R02.01–03 | Frontend Windows reproductible avec un lockfile et sans Docker. Contrats provisoires isolés derrière des adaptateurs, puis types issus de l’OpenAPI serveur. Cible d’exploitation Docker/Coolify, OVH France et S3 Scaleway Paris à qualifier aux missions concernées. |
| D004/D005 · Tokens Layered Minimalism / Editorial Premium, Geist, Solar Bold Duotone, avatars Soft 3D. | F01.02–04, F03.02, F05.02, R01.04 | Tokens partagés, identité/voix/avatar indépendants, états Storybook, reflow 320 px, zoom 200 %, clavier et cible WCAG 2.2 AA du kit. Assets validés et droits documentés avant diffusion. |
| 8.9 et 8.8.30 · Accès, onboarding, compte et notifications. D009 · Propriétaire, invités lecture seule, équipe complète hors V1, admin séparé. | F02.01–02, F02.04, B02.01–03, B05.05, I01.02, R01.01 | Email et Google/MS, OAuth métier séparé, révocation, tests agent avant activation, checklist J0/J1/J3/J7, droits lecture seule y compris mutations indirectes, MFA admin et isolation RLS par tenant. |
| 8.8.4–7 · Acquisition, signaux et alertes. SIRENE, Mantiks/Findymail sous conditions et alternatives du kit. | F03.01, B04.01, B05.05, I01.05 | Filtres éditables, source/fraîcheur visibles, coût avant confirmation, alertes dédupliquées et aucun double débit. Qualifier licence, revente et couverture. |
| 8.8.8–10 · CRM contacts et entreprises, import/fusion, scoring et pipeline. | F03.01, B04.01, I01.05 | CSV avec mapping et erreurs, fusion validée préservant les oppositions, scoring adéquation/engagement séparé, transitions de pipeline auditées et réalisables au clavier. |
| 8.8.12–13 · Inbox unifiée, téléphonie entrante et sortante. D008 · ElevenLabs/Twilio prioritaires, Retell/Telnyx conditionnels. | F03.03, F03.06, B04.03–05, B04.07, B05.05, I01.04–05 | Dialer humain distinct des campagnes IA, routage, secours, SVI, traitement des manqués, enregistrements selon droits, reprise humaine qui suspend les automatisations et réactivation explicite. Vérifier KYC, numéros/portage/SIP, coûts et pays. |
| 8.8.14–15 · Gmail, Microsoft Graph, SMTP/IMAP, WhatsApp Meta Cloud Embedded Signup. | F03.06–07, B02.04, B05.02–03, I01.05 | Brouillons/relances, statut accepté distinct de livré, notes vocales et transcription, modèles/fenêtre WhatsApp et opposition selon règles qualifiées, révocation et échecs. Resend transactionnel figure au PDF p.39, choix à confirmer pour les notifications avant B05.05. |
| 8.8.16–18 · Agent Studio, connaissances et supervision, OpenAI via adaptateur et RAG hybride. | F03.02, B04.02, B04.05, I01.04 | Connaissances approuvées et sourcées, outillage sous permissions, historique et rollback. Activation bloquée sans test de la révision exacte. Seuils faits 95 %, règles 98 %, qualification 90 %, RDV 98 %, escalade 95 % minimum, zéro fuite/action interdite/prix inventé/fausse confirmation. |
| 8.8.11 · RDV, Google/MS Calendar et réservation publique. | F03.04, F04.02, B04.06–07, I01.04 | Buffers et fuseaux/DST, conflit concurrent, confirmation après preuve fournisseur, révocation et état incertain. Page publique testée. |
| 8.8.19–22 · Campagnes, séquences, modèles et résultats. | F03.05, B05.01, I01.05 | Modes manuel/assisté/auto, versions, conditions et approbations, recontrôle éligibilité/budget avant chaque action, arrêt sur opposition/réponse et reprise sans doublon, attribution et coûts. |
| 8.8.23–26 · Social Studio, médias et analytics social. | F03.08, B05.04, I01.05 | Variantes réseau/langue, génération texte/image, UTM, droits média, révision approuvée, erreurs partielles réconciliées par destination et portée interprétée selon réseau. |
| 8.8.27–29 · Automation Studio, bibliothèque et journal. | F03.05, B01.03, B05.05, I01.05, I01.08 | Éditeur, cible de 30 modèles, version, conditions, approbation, budget, arrêt et inspection des exécutions. Tester cycles et état fournisseur inconnu. **Écart : missions UI et intégration à expliciter, B05.05 trop générique.** |
| 8.8.1–3 et 31 · Dashboard, analytics, rapports et Ask AutoCall. | F02.03, F03.09, B06.01, I01.06, I01.08 | KPI et attribution réconciliés, exports privés et rapports planifiés, Ask question/préparation/exécution sous droits et approbation avec citations. Support technique séparé. **Écart : Ask et rapports planifiés à expliciter.** |
| D006–D008 · Catalogue HT versionné, quotas, crédits, options et paiement Stripe FR / GeniusPay CI conditionnel. | F03.10, F04.02, B03.01–04, I01.03, R02.04, R03.01 | FR 49/99/179 EUR mensuels et annuel −5 %. CI 15 000/30 000/60 000 XOF mensuels, annuel ouvert. Appliquer les quotas/recharges du backend.md et séparer capacité, consommation et concurrence. Tester expiration, réservations concurrentes, webhook montant/devise, auto-recharge désactivée par défaut et plafonnée. FR/EN indépendant du marché et de la devise. |
| 8.10 · Super Admin, 12 domaines. | F04.01, B06.02, I01.06 | Recetter vue d’ensemble, entreprises/utilisateurs, facturation, consommations, finance, fournisseurs, gouvernance IA, support, adoption, infrastructure, sécurité, paramètres globaux/CMS. Diagnostic lecture seule 30 min, consenti, révocable et audité. **Écart : le libellé générique ne garantit pas les 12 domaines.** |
| D010 et frontend.md §8 · Site public, 14 sections, pages dédiées et démo isolée. CMS, aide/tickets et support public. | F04.02, B06.02, I01.06–08, R01.02, R01.04, R03.03 | Recetter les 14 sections dont ROI sans collecte, comparatifs sourcés et recharges, CTA et footer graphite, composants partagés, catalogue commun, contenu CMS FR/EN versionné, aide sur sources approuvées, contact et newsletter. **Écart : F04.02 et I01 n’explicitent pas cette couverture ni le raccordement CMS/site. I01.07 doit distinguer la démo publique isolée des fixtures interdites dans les parcours réels.** |
| Backend.md §§8–10 et PDF p.65 · Sécurité, conformité, performance, restauration et lancement France puis CI. | F05.02–03, B06.03, I01.08, R01.01–04, R02.01–04, R03.01–04, M01 | Tests isolation, restauration, réconciliation et couverture métier cible ≥80 %. Cibles p75 LCP ≤2,5 s / INP ≤200 ms / CLS ≤0,1 et p95 API ≤300 ms hors opérations externes longues. RPO 1 h/RTO 4 h. Pilote 5–10 PME, aucune vulnérabilité haute/critique non traitée. CI conditionnée à la couverture, à la conformité et à l’économie unitaire locale. |

**Preuves restant à obtenir.** Accès authentifié au dépôt privé avant transfert. Récupération des maquettes et de la matrice 6.10. B01.02–04 doit préciser ERD/SQL et API. B03 et les missions fournisseurs doivent qualifier le barème IA, les unités facturables, les conditions d’essai/options/prorata et les droits API. R01.02/R03.01 doivent qualifier les taxes, la conservation, les textes juridiques et les conditions CI.

**Suite après validation de P00.01.** Rendre explicites les critères des missions concernées avant leur exécution. Les maquettes historiques et la matrice 6.10 restent à récupérer.

### P00.03 — Architecture et conventions validées

Cadrage validé par le propriétaire le 23 novembre 2026. Compatible avec D001–D011, frontend.md §2 et backend.md §§2–3. Racine de travail : dossier AutoCall. Dépôt cible privé webmodernseo-code/autocall.v2, accès authentifié à confirmer avant rattachement ou transfert.

| Sujet | Convention et preuve attendue |
|---|---|
| Versions frontend | Node 26 LTS (26.13.1 observé localement comme point de départ), pnpm 11.28.11, Next.js 16 LTS App Router, React 19 avec la paire react/react-dom compatible avec Next.js, TypeScript strict, Tailwind 4 et shadcn/ui. F01.01 vérifie les correctifs maintenus et les dépendances compatibles, consigne les versions exactes et teste l’installation sur Windows. Les versions serveur seront qualifiées en B01.01. |
| Workspace | Workspaces pnpm, sans orchestrateur supplémentaire au démarrage. package.json racine privé, packageManager épinglé, version de Node documentée, pnpm-workspace.yaml et un seul pnpm-lock.yaml. Applications apps/web (site), apps/dashboard (client), apps/admin (Super Admin), chacune avec son App Router. Ports locaux proposés 3000/3001/3002 dans cet ordre. Créer les applications et packages au fil des missions, quand ils ont un premier usage. apps/api et apps/worker après J1. |
| Packages et dépendances | packages/design-tokens, ui, domain, contracts, i18n et config, sous @autocall/*. UI réutilisable et tokens en F01, domaine pur sans React, accès aux données ou appels réseau. Applications → UI et ports de données, adaptateurs → contrats/domaine. Aucune importation entre applications. Les packages client ne dépendent ni de NestJS ni de la persistance. |
| Dossiers et noms | src/app pour routes, layouts et pages, src/features/<domaine> pour écrans, formulaires et ports propres, adaptateurs de données isolés dans une couche data. Fichiers et répertoires en kebab-case, composants et types en PascalCase, variables et fonctions en camelCase. Alias @/ privé à chaque app et imports @autocall/* pour les packages. UI FR/EN via next-intl, locale distincte du marché, de la devise et du fuseau. |
| Contrats et données | F01.05 crée les types provisoires utilisés par les ports et fixtures fictives déterministes. Simuler permissions, pagination, chargement, erreurs et états incertains. Démo explicitement isolée, aucun secret ni effet externe. Utiliser montants entiers en unités mineures, codes EUR/XOF, timestamps UTC et fuseaux IANA. Après J1, B01.04 génère OpenAPI depuis le serveur et compare DTO/erreurs/pagination avec les ports. I01.01 remplace l’adaptateur dans les parcours réels. Le serveur détermine le tenant et contrôle les droits, même si l’UI masque les actions. |
| Commandes et recette | Depuis la racine, pnpm install --frozen-lockfile après création du lockfile, pnpm dev pour le premier frontend puis pnpm --filter @autocall/dashboard dev pour le cibler quand plusieurs apps existent. Scripts pnpm lint (ESLint), pnpm typecheck (tsc --noEmit), pnpm build (Next.js) en F01.01. Vitest, Storybook et Playwright ajoutés aux missions de composants et recette. Vérifier une page de contrôle et un build local Windows sans Docker. |
| Git et documentation | main stable, branche de tâche feat/f01-01-bootstrap quand Git est autorisé et accessible. Protéger .env, secrets, données client et artefacts générés avant staging. .env.example avec valeurs fictives seulement si utile. README de démarrage à produire avec le code, roadmap et passation à actualiser à chaque lot. |

Sources officielles consultées : [Node.js](https://nodejs.org/en/about/previous-releases), [pnpm 11.28.11](https://github.com/pnpm/pnpm/releases/tag/v11.28.11), [compatibilité pnpm](https://pnpm.io/installation), [support Next.js](https://nextjs.org/support-policy), [installation Next.js](https://nextjs.org/docs/app/getting-started/installation). La revue documentaire confirme la cohérence des conventions. L’installation, le serveur local, le lint, le typage et le build relèvent de F01.01.

P00.03 validée. Les résultats de F01.01 figurent ci-dessous.

### F01.01 — Initialisation frontend validée

Workspace pnpm et première application dans apps/dashboard suivant P00.03. Racine : package.json, pnpm-workspace.yaml, pnpm-lock.yaml, .node-version, .gitignore et README.md. Versions : Node 26.13.1, pnpm 11.28.11, Next.js 16.4.6, React/React DOM 19.3.1, Tailwind 4.3.5, TypeScript 5.9.3, ESLint 9.39.5. pnpm installé en dossier temporaire. Accès npm autorisé hors sandbox. Le registre a signalé ESLint 9.39.5 déprécié. Les composants shadcn/ui sont prévus au lot UI.

- pnpm install puis pnpm install --offline --frozen-lockfile : réussis.
- pnpm lint --max-warnings 0, pnpm typecheck et pnpm build : réussis. Next a généré les types de routes et ses propres instructions AGENTS.md dans apps/dashboard.
- pnpm dev : serveur prêt sous Windows sans Docker. GET / sur 127.0.0.1:3001 : HTTP 200, titre AutoCall et langue fr vérifiés.
- Aucun Git local, commit, transfert ni déploiement.

ARCHITECTURE.md a été aligné sur P00.03 et le kit : apps/web, apps/dashboard et apps/admin séparées, Solar Bold Duotone.

F01.01 validée par le propriétaire au lancement de F01.02.

### F01.02 — Direction visuelle validée

- Écran représentatif de la vue d’ensemble à / et planche à /direction-visuelle dans apps/dashboard (port 3001). Données fictives signalées. Surfaces neutres, KPI double surface, Geist Sans/Mono, Solar Bold Duotone, états textuels et actions au clavier. Attributions dans README.md.
- pnpm lint --max-warnings 0, pnpm typecheck et pnpm build réussis. Contrôle Chrome sur les deux routes à 320, 768 et 1440 px : HTTP 200, aucune barre de défilement horizontale, navigation clavier avec focus visible, divulgation au clavier, icônes et polices chargées. Contrastes textuels des états sur #F8F8F8 : 4,72:1 à 7,36:1. Captures revues.
- AGENTS.md, ARCHITECTURE.md, ROADMAP.md et PASSATION.md convergent sur Frontend First, apps/web, apps/dashboard et apps/admin séparées, Geist et Solar Bold Duotone. Le choix conserve P00.03 et D003/D004/D012. Aucun dépôt local ni transfert.
- Planche et écran approuvés par le propriétaire avant F01.03.

### F01.03 — Bibliothèque UI livrée pour validation

- Composants partagés dans packages/ui et tokens validés dans packages/design-tokens. Boutons, champs et sélecteurs, badges, tableau, pagination, filtres, KPI, graphique, menu, confirmation, notifications, skeleton et états vide/erreur/chargement. Les widgets de la vue d’ensemble réutilisent la bibliothèque. Radix fournit les primitives de menu, dialogue et notification.
- Catalogue interactif sur /direction-visuelle et dans Storybook (pnpm storybook). Installation des dépendances verrouillées et script de post-installation esbuild autorisé explicitement pour Storybook.
- Vérifications : pnpm lint --max-warnings 0, lint du package UI, pnpm typecheck, pnpm build et pnpm build-storybook réussis. Storybook émet des avertissements de bundler et de réglages globaux, le catalogue a été vérifié dans Chrome sans erreur d’exécution.
- Chrome à 320, 768 et 1440 px : HTTP 200 sur les deux routes et aucun débordement horizontal de page. Filtre, pagination, tableau, libellé et description d’erreur, menu aux flèches, confinement du focus dans le dialogue, fermeture par Échap et restitution du focus, notification fermable et reprise après erreur vérifiés. Contraste des états textuels entre 4,72:1 et 7,36:1.
- Dépôt Git local absent. Aucun commit, transfert ou déploiement. Point de contrôle : validation propriétaire avant F01.04, App Shell.

### F01.04 — Reprise de la navigation latérale

Variante en revue pour la navigation latérale : pictogrammes Solar Linear monochromes, 18 px.

La revue actuelle porte sur les sections « Espace de travail » et « Récents », leurs pictogrammes monochromes et la sélection de « Vue d’ensemble ». Les autres entrées attendent leurs pages. Le panneau de droite reste vide sur fond `#ECF1F4`.

La revue actuelle porte sur les sections « Espace de travail » et « Récents », leurs pictogrammes monochromes et la sélection de « Vue d’ensemble ». Les autres entrées attendent leurs pages. Le panneau de droite reste vide sur fond `#ECF1F4`.

La première proposition a été retirée à la demande du propriétaire. Reprendre la conception à sa prochaine consigne, une étape à la fois, sur la navigation latérale.

Première étape sur la route d’accueil : navigation blanche et vide de 232 px à gauche, trait vertical et contenu vide sur fond `#ECF1F4` à droite.

## 11. Commandes à donner aux IA

**Démarrer le projet :**
> Lis ROADMAP.md, PASSATION.md et les documents du kit. Exécute uniquement P00.01 : audit et rapprochement des exigences. Présente les preuves, les écarts et la prochaine mission. Actualise le suivi et la passation. Ne modifie pas le code métier pendant cet audit.

**Continuer après validation :**
> Lis ROADMAP.md et PASSATION.md. Exécute la prochaine mission autorisée dont les dépendances sont validées. Vérifie le résultat, actualise les deux fichiers et présente-moi la prochaine étape.

**Changer d'IA :**
> Lis PASSATION.md et ROADMAP.md. Applique le protocole de reprise, vérifie l'état réel du projet et poursuis uniquement la mission autorisée.

**Terminer la session :**
> Actualise ROADMAP.md et applique le protocole de départ de PASSATION.md avec les preuves de test, l'état des fichiers, les blocages et la prochaine action.
