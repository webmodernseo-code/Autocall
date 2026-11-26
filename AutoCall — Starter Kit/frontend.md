# AutoCall — FRONTEND

Version de travail 0.2 (démarrage de zéro) · Référentiel pour Codex · 23 novembre 2026

Sources : AutoCall_Product_Blueprint_v0.1.pdf (pages 5–36, 51–77), décisions de conception accessibles et backend.md. Ce fichier est une spécification de réalisation, pas un produit déployé. Les routes, noms de composants et étapes de build ci-dessous sont des propositions techniques à valider dans le dépôt. Les maquettes historiques complètes et les libellés individuels de la matrice 6.10 restent à récupérer.

## 1. Mission de Codex

Construire AutoCall, plateforme CRM et gestion d'appels IA pour les TPE/PME : trouver, contacter, qualifier, suivre et convertir. Aucun module V1 ne peut être supprimé sans accord explicite. France d'abord, Côte d'Ivoire après qualification. Compte propriétaire et invités en lecture seule ; pas de gestion d'équipe complète en V1.

- Développer entièrement de zéro, sans réutiliser CallMine AI. Inspecter le dépôt uniquement pour reprendre les travaux AutoCall déjà réalisés. Lire AGENTS.md et DECISIONS.md.
- Lire backend.md et le PDF, surtout les captures p.68–77. Ne pas reproduire les images de landing rejetées. Les schémas reconstruits ne sont pas des captures exactes des prototypes originaux.
- Travailler par lots verticaux testables, produire un plan de modifications, documenter les décisions et vérifier lint, typecheck, tests, build à chaque lot. Ne pas déclarer une fonction terminée si elle ne fait qu'afficher des données fictives.
- Séparer démo isolée et production. Pas de faux clients, logos, témoignages, statistiques, intégrations actives ou promesses de conformité.
- Ne jamais inventer un contrat API : coordonner avec backend.md, générer les types OpenAPI depuis le serveur. Les simulations visuelles ne déclenchent aucun appel, email, réservation ou paiement.

## 2. Architecture cible

Next.js App Router, React, TypeScript strict, Tailwind, shadcn/ui, TanStack Query/Table/Virtual, React Hook Form + Zod, Recharts, React Flow, next-intl, Driver.js facultatif. Versions maintenues compatibles, lockfile commité. Solar Bold Duotone pour les icônes. Storybook pour composants et états.

Monorepo proposé :

```text
autocall/
  apps/web/          # getautocall.fr : marketing et réservation publique
  apps/dashboard/    # app.getautocall.fr : client
  apps/admin/        # administration séparée
  apps/api/          # NestJS
  apps/worker/       # tâches asynchrones
  packages/design-tokens/
  packages/ui/       # primitives + composants métier
  packages/domain/   # logique pure partagée
  packages/contracts/# schémas et client API généré
  packages/i18n/
  packages/config/
  docs/              # frontend.md backend.md, décisions, recette, captures
```

Routes proposées, non contractuelles : web `/`, `/fonctionnalites/[module]`, `/solutions/[secteur]`, `/tarifs`, `/integrations`, `/comparatifs/[concurrent]`, `/aide/[categorie]/[article]`, `/contact`, `/demo`, `/book/[entreprise]`, `/blog`, `/nouveautes`, `/a-propos`, `/partenariats`, pages légales. Dashboard `/overview`, `/acquisition/*`, `/crm/*`, `/communications/*`, `/agents/*`, `/campaigns/*`, `/social/*`, `/automations/*`, `/analytics/*`, `/settings/*`, `/onboarding`. Admin routes séparées par module. Définir les redirections et slugs localisés sans casser liens profonds.

## 3. Design system obligatoire

Layered Minimalism pour application ; Editorial Premium pour marketing. Toile grise neutre, cartes blanches et surface intérieure grisée (KPI double surface). Pas de glow, dégradés, verre, néon, ombres colorées, sparkles IA. Logo Signal A provisoire ; asset final commun aux trois applications. Geist Sans et Geist Mono ; couleurs pastel réservées aux catégories et couleurs sémantiques aux états.

| Token | Valeur |
|---|---|
| Palette neutre | #FFFFFF #FCFCFC #F8F8F8 #F2F2F2 #EFEFEF #E5E5E5 #D4D4D4 #A3A3A3 #737373 #525252 #404040 #262626 #171717 #0A0A0A |
| CTA principal | #171717 / blanc |
| CTA secondaire | blanc bordé ; texte #171717 |
| Accent / tertiaire | #008F6D / #00775B |
| Succès / avertissement / danger / info | #15803D / #B45309 / #B91C1C / #1D4ED8 |
| IA origine / neutre | #6D28D9 / #525252 |
| Score chaud / tiède / froid | #C2410C / #A16207 / #1D4ED8 ; inconnu gris |

| Catégorie | Fond | Icône |
|---|---|---|
| Téléphonie | #DEF5EC | #008064 |
| Email | #FCE7EB | #CE5C70 |
| Acquisition | #FFF0D6 | #B7791F |
| CRM | #E4EEFE | #4073C5 |
| Automatisations | #F0E8FC | #8760C4 |
| RDV | #DFF4F8 | #25859A |
| Social | #FBE6F3 | #AD508D |
| Agents | #EEEEEE | #525252 |

Rayons carte 12, input 8, modal 16 px ; grille 12 colonnes ; unité 4 px ; gap 16 ; padding 24–32 ; sidebar 232/64 px ; topbar 56 ; table 48/36. Texte 14, table 13, minimum 12 ; KPI 36/44 ; section 20/28. Vérifier contraste effectif, notamment icônes pastel et textes secondaires ; ne pas utiliser la couleur seule. Avatars Soft 3D type Memoji non photoréalistes, 30–50 à terme, WebP transparents 64/128/256/512, droits à valider ; identité, voix et avatar indépendants. Pas de robot futuriste générique.

Bibliothèque proposée : AppShell, Sidebar, Topbar, Breadcrumb, PageHeader, KpiCard, DataTable, FilterBar, SearchBuilder, StatusChip, ScoreChip, EmptyState, ErrorState, Skeleton, DetailDrawer, ConfirmDialog, FormField, Timeline, ConversationThread, AudioPlayer, AgentCard, AgentWizard, Calendar, Kanban, WorkflowCanvas, ExecutionInspector, UsageMeter, PlanCard, MarketSelector, PricingTable, FeatureDemo, AccessibleAccordion. Toutes les actions réelles doivent avoir un handler et un état serveur ; pas de boutons décoratifs dans les écrans utilisables.

## 4. Navigation et responsive

Huit entrées : Vue d'ensemble, Acquisition, CRM, Communications, Agents IA, Campagnes, Réseaux sociaux, Automatisations. Rendez-vous sous CRM ; téléphone/email/WhatsApp sous Communications. Analytics, rapports, Ask AutoCall transversaux. Paramètres/profil/support en bas. Topbar recherche globale Ctrl/Cmd+K, création rapide, notifications (toutes/non lues/prioritaires ; lu ≠ résolu), Ask AutoCall. Drawer aperçu et détails pleine page, modales et wizards selon tâche ; conserver filtres, pagination, retour et deep links ; confirmer les modifications non enregistrées.

Breakpoints 320–479, 480–767, 768–1023, 1024–1279, 1280–1535, ≥1536. Desktop sidebar, tablette rail, mobile navigation basse Accueil/CRM/Messages/Agents/Plus (tous modules accessibles), top Ask + notifications. Admin distinct. KPI quatre desktop/deux mobile ; table adaptative, kanban swipe + liste, inbox panneaux successifs, canvas automation desktop et branches structurées mobile même source. Alternative clavier au drag. WCAG 2.2 AA cible : 4,5:1 normal, 3:1 grand/non texte, 44×44 cible interne, reflow 320 px, zoom 200 %, focus, reduced motion, labels accessibles, transcriptions lorsque disponibles. Préférences FR/EN indépendantes de devise, pays, fuseau et langue agent. Format local des dates/prix via Intl, pas de traduction des données métier sans demande.

## 5. Écrans client et comportements de recette

Les références 8.8 ci-dessous correspondent aux sections de conception ; chaque écran inclut chargement, vide, erreur, permissions, quota, intégration indisponible et état incertain lorsque applicable. Clés API tenant-scoped ; aucun cache privé persistant non maîtrisé ; purge au logout/changement de contexte. Pas d'affichage optimiste pour paiement, message envoyé ou RDV confirmé sans confirmation serveur.

| Référence | Écran | Fonctionnalités attendues / recette |
|---|---|---|
| 8.8.1 | Vue d'ensemble | 4 KPI horizontaux exemple 486 prospects, 48 RDV, 126 appels récupérés, 8 450 € ventes attribuées ; synthèse IA, graphique, priorités, activité, agenda, 74 hors horaires, 2 agents, 8 signaux. Filtres cohérents et détails accessibles ; chiffres fictifs uniquement en démo. Voir PDF p.68–69. |
| 8.8.2–3 | Analytics / rapports | Onglets commercial, communications, agents, campagnes, rentabilité. Cohortes, coût, attribution, funnel, ROI contribution et non bénéfice net. Exports PDF/CSV, personnalisation, rapports planifiés ; statuts génération/livraison séparés. |
| 8.8.4 | Acquisition entreprises | Recherche NL traduite en filtres modifiables NAF, effectif, zone, recrutement, CA, âge ; liste, fiche, source/fraîcheur, crédit estimé, recherches enregistrées, ajout CRM et enrichissement. Pas de KPI décoratifs. |
| 8.8.5 | Acquisition contacts | Rôle, séniorité, département, email/téléphone/LinkedIn, aperçu du coût et confirmation ; vérifié ≠ autorisé à prospecter. |
| 8.8.6–7 | Signaux / alertes | Emplois par entreprise, intitulés/compétences/contrats, récence, pertinence ; filtres ET/OU, plafonds, notifications app/email, listes et déduplication ; aucun besoin commercial présenté comme certain. |
| 8.8.8–9 | CRM contacts / entreprises | Tables sans KPI, filtre, tri, pagination, création/édition, import CSV aperçu/mapping/erreurs, fusion contrôlée, historique, consentements ; scoring adéquation distinct engagement ; chaud ≥75, tiède ≥40, froid <40, inconnu si preuves insuffisantes ; SIREN/domaine et filiales distincts. Brouillon campagne sans envoi. |
| 8.8.10 | Pipeline | Kanban/table, Nouveau, Contacté, Qualifié, RDV, Proposition, Gagné, Perdu ; couleurs gris/bleu/violet/teal/orange/vert/rouge ; étapes personnalisables cible max 12, valeur pondérée ≠ cash ; transitions auditées, liste accessible. |
| 8.8.11 | Rendez-vous | Agenda, types, disponibilité, buffers, TZ, rappels, page publique de réservation, Google/MS ; créer/modifier/annuler ; statut confirmé uniquement après preuve fournisseur ; créneau indisponible et conflit explicites. |
| 8.8.12 | Inbox | Liste 300 px, fil flexible, contexte CRM 300 px ; appels/email/WA, notes internes vs réponses, historique, transcription/résumé, takeover et reprise explicite des automatisations. |
| 8.8.13 | Téléphonie | Journal, manqués, dialer humain, campagnes IA distinctes, softphone mute/attente/transfert/notes/recording selon droits ; numéro nouveau/renvoi/portage/SIP, SVI, horaires, humain d'abord 0–45 s ou IA d'abord ; état de secours visible. |
| 8.8.14 | Email | Gmail, Outlook, SMTP/IMAP, composer riche, signatures, brouillons, réponse, envoi planifié, relances J0/J3/J7/J14 configurables, pièces jointes, statuts accepté/livré distincts ; arrêt réponse/opposition/vente/humain. |
| 8.8.15 | WhatsApp | Embedded Signup, conversation, notes vocales, lecteur vitesse/timestamps, transcription, traduction, résumé, synthèse vocale selon droits ; fenêtre 24 h et modèles approuvés, opt-out visible. |
| 8.8.16 | Agent Studio | Cartes Emma/Alex/Lina sans KPI ; wizard identité, missions, connaissances, permissions, canaux/horaires, tests, activation ; avatar obligatoire, Playground, voix indépendante, outils interdit/lecture/approbation/auto ; version, rollback, révocation ; blocage activation si test exact non validé. |
| 8.8.17 | Connaissances | Import site/PDF/DOCX/XLSX/CSV/TXT/FAQ, progression, quarantaine, sources, faits structurés, tarifs, RDV ; approbation, versions, suppression ; mémoire CRM séparée. |
| 8.8.18 | Supervision agents | Historique/activité, revues, évaluations, corrections, incidents ; traces factuelles, pas de raisonnement privé ; transfert humain approprié ≠ échec. |
| 8.8.19 | Campagnes | Wizard objectif, audience fixe/dynamique, canal, séquence, test, validation, calendrier, lancement, pause/arrêt ; modes manuel/assisté/auto, contrôle éligibilité et budget avant envoi. |
| 8.8.20 | Séquences | Éditeur vertical étapes/attentes/conditions/approbations/arrêt ; exemple J1 email J4 email J7 humain J10 email. |
| 8.8.21–22 | Modèles / résultats | Modèles email/appel/WA, variables, signatures, preview, traduction, AB/version, approbation Meta distincte ; résultats quatre KPI, funnel, coût, canal et attribution. |
| 8.8.23 | Social Studio | Contenu maître/variantes langue/réseau/compte, Facebook/Instagram/LinkedIn selon autorisations, thèmes, IA texte/image, UTM, programmation, approbation et publication. |
| 8.8.24–26 | Calendrier / médias / analytics social | Semaine/mois/liste, 4×3 contenus exemple, verrou révision approuvée, fuseaux/DST ; médiathèque, droits, expiration, crops 1:1 et 4:5, upload scanné ; portée non unique cross-network, conversions vérifiées, résultats partiels. |
| 8.8.27 | Automation Studio | Cartes/liste, trois compteurs, création manuelle/modèle/NL, React Flow, déclencheurs, conditions ET/OU/inconnu, actions intermodules, attentes, approbation, arrêt, budget, versions. |
| 8.8.28–29 | Bibliothèque / journal | 30 modèles génériques cible sans marketplace ; dépendances et tests avant activation. Inspector contexte/étapes/faits/coût, états queued/running/waiting/approval/done/stopped/blocked/suspended/uncertain/partial/failed/cancelled ; pas de retry aveugle. |
| 8.8.30 | Paramètres | Profil, entreprise, téléphonie, intégrations, notifications, abonnement/crédits, confidentialité, préférences ; propriétaire/guest, offres, registre, alertes 80/95/100, panier, recharge auto off et plafond. |
| 8.8.31 | Ask AutoCall | Drawer 420–480 px, assistant métier : question, préparation, exécution sous permissions et approbation. Citations données métier, historique distinct ; support technique flottant séparé, pas de SQL brut. |

## 6. Onboarding (8.9)

Compte email/mot de passe, Google/MS, vérification email, réinitialisation, récupération, TOTP facultatif client/obligatoire admin, sessions révocables. Connexions OAuth métier séparées du login. Entreprise : nom, secteur, pays, TZ, devise, langue ; import public jusqu'à 10 pages, revue avant écriture. Huit objectifs : appels manqués, recherche, prospection, relance, RDV, centralisation, visibilité, tâches répétitives ; multiples, recommandations déterministes, dépendances et modes explicites. Connecter seulement outils utiles, connecté ≠ opérationnel ; tests renvoi/nouveau numéro/portage/SIP. Créer agent Emma en brouillon, approuver connaissances et permissions, valider tests critiques de la révision exacte avant activation. Checklist J0/J1/J3/J7 basée sur serveur (à faire/en cours/terminé/bloqué/reporté/N/A), visite guidée facultative. Démo fictive isolée.

## 7. Super Admin (8.10)

Application isolée, accès admin MFA obligatoire, rôles et reauth pour opérations critiques. Pas d'accès universel au contenu privé. Toutes les actions sensibles ont motif, aperçu impact, confirmation, audit et retour serveur.

| Module | Écrans et contrôles |
|---|---|
| 01 Vue d'ensemble | Synthèse/Économie/Santé ; KPI entreprises, utilisateurs, MRR, coûts/marge ; distinguer cash, revenu reconnu, coût réel/estimé. |
| 02 Entreprises et utilisateurs | Fiche 360, invitations, statut, suspension, diagnostic support lecture seule 30 min révocable sur consentement/motif/ticket/reauth ; fermeture/résiliation/suppression distinctes. |
| 03 Facturation | Abonnements, offres immuables, transactions, factures, promotions, remboursements ; migration explicite, contrôle devise/montant, journal. |
| 04 Consommations | Synthèse, entreprises, services, registre, quotas, anomalies ; réservations/débits/libérations/expiration/ajustements/compensation ; est/mesuré/confirmé. |
| 05 Finance | Revenus, entreprises, offres/marchés, fonctionnalités, dépenses, acquisition/rétention, prévisions/simulations ; MRR ARR GRR NRR CAC LTV waterfall, contribution non nette. |
| 06 Fournisseurs | Connexions, tarifs versionnés, clés écriture seule, rotation, routage, historique, état/qualité/coût et réconciliation. |
| 07 Gouvernance IA | Supervision, modèles officiels, avatars, voix, qualité, versions, tests et validation, licences. |
| 08 Support | Tickets, support IA, diagnostics, docs, réponses types, performances ; support humain direct, CSAT confirmé vs abandon, priorités P1–P4 objectifs ouvrés non SLA. |
| 09 Adoption | Onboarding, fonctionnalités, rétention, santé, feedback, accompagnement, expérimentations ; exclure tests, première valeur ≠ login, pas de sanction auto. |
| 10 Infrastructure | Infrastructure, performances, files/workers, logs/erreurs, sauvegardes, déploiements, incidents, page status externe ; seuils et historique. |
| 11 Sécurité | Auth, données, RGPD, gouvernance IA, communications, audit, risques, incidents ; contrôles, demandes de droits, pas de promesses non vérifiées. |
| 12 Paramètres globaux | Général, marchés, fonctionnalités/flags, notifications, branding, modèles, CMS, maintenance, historique ; brouillon→validation→impact→approbation→publication→surveillance→rollback nouvelle révision. |

## 8. Site public : 14 sections validées

Largeur max 1200 px proposée, surfaces neutres, navigation pilule blanche : Fonctionnalités (mega menu 8 familles), Solutions, Tarifs, Ressources, Connexion, Commencer. Composants authentiques du SaaS réutilisés, contenus et tarifs issus CMS/API. FR/EN. Ne pas recréer un design indépendant.

| Section | Composition et contenu |
|---|---|
| 01 Hero | Titre exact « La plateforme CRM et de gestion d’appels IA pour les équipes modernes. » ; description « Centralisez vos prospects, automatisez vos échanges et ne laissez plus aucune opportunité vous échapper. » ; Commencer / Voir la démo. Composition B Orbaxon : deux panneaux suivi d'appel et transcription Emma, étapes qualification/contact CRM/RDV, fond pixelisé neutre, pas de dashboard inventé. |
| 02 Intégrations | Bande compacte logos outils client Gmail/Outlook/Calendar/WA/IG/LinkedIn ; catalogue dédié filtrable messagerie, agenda, communications, social ; inclure SMTP/IMAP, SIP, Outlook Calendar, Facebook. Fournisseurs internes distincts. |
| 03 Problèmes | Quatre cartes double surface : appels manqués, acquisition irrégulière, prospects oubliés, outils dispersés ; rouge/orange justifiés. |
| 04 Solution | Schéma écosystème AutoCall central relié à huit familles, interactions, mobile grille 2 colonnes ; « Toute votre activité commerciale. Enfin réunie. » |
| 05 Agents | Emma/Alex/Lina, avatars Soft 3D partagés ; démo scénarios, extrait Agent Studio, personnalisation, contrôle et capacités ; mobile carousel manuel. |
| 06 Modules | Composition B : onglets Acquisition, CRM, Communications, Campagnes/RDV, Social, Automatisations/pilotage ; page Fonctionnalités détaillée en sections alternées. |
| 07 Onboarding | Quatre étapes espace/outils/agents/pilotage ; 4 colonnes desktop, 2 tablette, chronologie mobile. Démo de configuration sans inscription via CTA. |
| 08 Secteurs | Six cartes photos professionnelles licenciées (nettoyage, immobilier, bâtiment/maintenance, services B2B, automobile, beauté/bien-être), grille 3×2, carousel mobile ; pages sectorielles, scénarios et modèles en brouillon. |
| 09 ROI | Calculateur interactif sans collecte : appels, manqués, récupération, conversion, panier, marge, temps, coût et recharges. Mensuel/annuel, EUR/XOF, hypothèses visibles, résultat négatif accepté ; exclure temps libéré du ROI financier. |
| 10 Tarifs | Starter/Pro/Business, Pro bordure graphite recommandé et non « populaire », marché/période, quotas, comparatif extensible, recommandation selon coût et besoins, démo vs essai, pages checkout. Prix backend.md ; pas de remise annuelle CI inventée. |
| 11 Comparatif | Sous tarifs : AutoCall/Aircall/Retell/Mantiks/HighLevel/Limova, filtres, mobile deux colonnes solutions ; chaque cellule source/date/conditions/statut, non confirmé ≠ absent ; ne publier qu'après contrôle individuel. AutoCall prévu ≠ opérationnel. Pages dédiées. |
| 12 Recharges | Onglets voix/acquisition/IA/images/transcription + options mensuelles, marché, simulateur coût vs changement plan, panier groupé dans espace client. |
| 13 FAQ | Desktop 35/65 titre/accordéons ; mobile filtre compact ; FAQ 12 questions, centre aide 14 catégories, recherche et support public sur sources approuvées, contact humain. |
| 14 CTA/footer | Composition B définitivement validée : CTA ET footer graphite, motif pixels monochrome, CTA blanc ; « Votre prochaine opportunité commence ici. » Footer Produit/Solutions/Ressources/Entreprise/Commencer, langue/marché, réseaux officiels, status, newsletter consentie, liens légaux, mobile accordéons. |

ROI : appels récupérés = appels × part manqués × taux récupération ; ventes = récupérés × conversion ; CA = ventes × panier HT ; marge = CA × taux marge ; contribution = marge − abonnement − frais/recharges ; ROI = contribution / coût ×100 si coût >0. Temps libéré = heures/semaine ×52/12, valeur séparée. Annuel projection ×12 à activité constante, pas une facturation annuelle implicite. Hypothèses exemple non prouvées : 100 appels, 25% manqués, 60% récupération, 20% conversion, 500€ panier, 40% marge, 4h/semaine, 25€/h, Pro 99€ → 1500€ CA, 600€ marge, 501€ contribution, 506% ROI. Avertir si quotas dépassés ; optimiser packs entiers, ne pas double compter. Comparer plans avec soldes disponibles et autres quotas avant recommandation.

Centre d'aide : premiers pas, agents, téléphonie, acquisition, CRM, communications, campagnes, RDV, social, automatisations, pilotage, abonnement, sécurité, support. Articles avec prérequis, étapes, captures réelles, erreurs, liens, feedback, version/date. CMS FR/EN, sources approuvées uniquement pour RAG public. Contact motif commercial/démo/support/partenariat/autre ; ne pas envoyer depuis un mock. Newsletter consentement et désinscription. Pages mentions légales, confidentialité, CGU, CGV, cookies, accessibilité, sécurité, sous-traitants ; rédaction/validation juridique avant mise en ligne. `status.getautocall.fr` indépendant. Sélection région ne modifie pas le pays de facturation d'un compte.

## 9. Contrats UX, performance et tests

- React Query : distinguer loading initial, refresh, stale, offline, retry sûr ; invalidation par ressource/tenant ; SSE ou WebSocket seulement selon contrat serveur. Ne jamais rejouer une action externe d'état inconnu.
- Formulaires : validation client utile, serveur autoritaire ; erreurs champ/global ; focus après erreurs, désactivation pendant mutation, prévention double soumission et idempotency key stable sur retry.
- États indisponibles : afficher raisons, conditions et alternative ; ne pas contourner flags marché/droits/quotas. Ne pas convertir les restrictions de sécurité en simple boutons masqués.
- Performance cible p75 LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1 ; lazy/virtualisation, code splitting, optimisation images, cache public par version, pas de promesse d'appels arrière-plan PWA mobile.
- Vitest composants/logique, Playwright parcours desktop/tablette/mobile, Storybook états, vérifications clavier/contraste. Tests critiques : isolation démo, invité sans mutation, erreurs OAuth, reprise humaine, quota, booking concurrent, webhook retardé, prix/monnaie, activation agent bloquée, permissions admin, changement langue/marché, erreurs et réconciliation.
- Relier exigences → écrans → endpoints → tests. Identifiants 6.10 historiques à restaurer, ne pas réaffecter. Ajouter des identifiants provisoires FE-* distincts.

## 10. Ordre de réalisation proposé pour Codex

1. Inventaire des assets autorisés et analyse des spécifications ; workspace, tokens, Storybook et shells responsive.
2. Auth, onboarding, SDK API et états communs ; routes protégées.
3. Tranches CRM/acquisition puis conversations/téléphonie, agents/connaissances/RDV, campagnes, automations, social et analytics/Ask.
4. Facturation/quotas et douze modules admin, à réaliser en parallèle des tranches métier concernées ; pas de report silencieux en V2.
5. Site public et démo alimentés par composants réels, catalogue central, CMS, aide/FAQ, pages de confiance.
6. Recette intégrée, accessibilité, performance, sécurité, pilotes et décision go/no-go.

Definition of Done : composant conforme tokens, contrat réel documenté, cas d'erreur/permissions/quotas, tests verts, comportement responsive et accessible, documentation et preuves en staging. Aucun lancement commercial tant que les dépendances backend et légales ne sont pas qualifiées.

Points non résolus : logo/avatars/voix/photos définitifs et licences, maquettes originales manquantes, textes juridiques, cellules comparatives, barème unités IA, marché CI, conditions essai/options, vérification des fournisseurs. Ne pas résoudre ces décisions par invention.
