# AutoCall — BACKEND

Version de travail 0.2 (démarrage de zéro) · Référentiel pour Codex · 23 novembre 2026

Sources : AutoCall_Product_Blueprint_v0.1.pdf (p.5–34, 37–50, 65–67), décisions de conception accessibles et frontend.md. Architecture cible, non déployée. Les noms de tables, endpoints, événements et lots ci-dessous sont des propositions d'implémentation ; ne pas les confondre avec des contrats déjà validés. La matrice 6.10 originale et le schéma SQL détaillé ne sont pas disponibles.

## 1. Instructions impératives à Codex

AutoCall est un système commercial assisté par IA pour indépendants, TPE/PME : trouver, contacter, qualifier, suivre, convertir. Toutes les familles V1 sont obligatoires. France d'abord ; Côte d'Ivoire conditionnée à la qualification des fournisseurs, de la conformité et de l'économie unitaire. Propriétaire + invités lecture seule, sans gestion complète d'équipes V1.

- Lire frontend.md et le PDF. Développer entièrement de zéro, sans réutiliser CallMine AI. Inspecter les travaux AutoCall existants à chaque reprise et proposer des migrations non destructives. Lire AGENTS.md et DECISIONS.md.
- Ne pas inventer de secrets, tarifs fournisseurs, résultats d'intégration ou API non documentées. Ne pas appeler de clients, publier, dépenser ou utiliser des données réelles pour les tests. Utiliser mocks, sandbox et comptes de test explicites.
- Réaliser par tranches verticales vérifiables ; conserver README, CHANGELOG, DECISIONS, PENDING, contrats OpenAPI, migrations, seeds fictifs, tests et procédures exploitation. Lint, typecheck, tests, build avant chaque lot. Signaler les blockers sans supprimer de fonctionnalités.
- Aucun agent ne peut s'attribuer un droit. Conditions avant action : sécurité/loi, état plateforme/marché, plan, organisation, agent/révision, exécution, quota/budget, disponibilité fournisseur. La règle la plus restrictive l'emporte.

## 2. Architecture technique cible

Monolithe modulaire NestJS, TypeScript strict, workers BullMQ. PostgreSQL Neon UE (Frankfurt), Prisma, pgvector, Redis AOF/noeviction, S3 compatible (Scaleway Paris). BetterAuth ; Zod ; Pino ; OpenTelemetry ; Prometheus/Grafana. Frontend Next.js App Router, contrats partagés, TypeScript. Docker + Coolify sur VPS OVH France cible 6 vCPU/12 Go/100 Go, Ubuntu LTS, Traefik, Let's Encrypt. GitHub Actions, staging/prod séparés. Versions maintenues compatibles à vérifier ; pas de Kubernetes/Kafka au démarrage. VPS unique = SPOF assumé, pas de haute disponibilité prétendue.

```text
apps/api/src/modules/
  auth tenancy onboarding crm acquisition booking
  communications telephony mail whatsapp agents knowledge
  campaigns social automations analytics reports assistant
  integrations provider-gateway billing usage catalog
  admin support adoption cms security audit notifications
apps/worker/         # workers + tâches planifiées
packages/domain/     # règles pures et calculs
packages/contracts/  # DTO, events, OpenAPI, client généré
packages/config/     # validation env, config typée
```

Flux : client → API/auth/tenant guard → service métier → PG/RLS + outbox → workers → gateway fournisseurs → événements/webhooks signés → réconciliation/ledger → API/read models. Tout effet externe a identifiant stable, suivi et résultat auditables. Ne pas mettre de calls fournisseurs dans une transaction DB longue. Outbox/inbox transactionnelles proposées pour livraison au moins une fois avec déduplication. Prioriser voix et communications urgentes > automations > campagnes > bulk, file facturation séparée. Isolation files et quotas par tenant ; DLQ, backpressure, circuit breaker. Pas de retry aveugle d'effet externe inconnu ; réconcilier via identifiants fournisseur.

## 3. Données et API (contrats proposés)

Chaque entité privée porte tenant_id ; nouveau schéma à valider avant implémentation. UUID, timestamps UTC, timezone IANA, monnaie ISO EUR/XOF, montants entiers en unités mineures (EUR centimes / XOF francs), pas de float monétaire. Contraintes uniques tenant-scoped, FK composites quand pertinent, migrations versionnées et index par tenant + filtres. Historique immutable des versions facturées et actions ; soft-delete seulement quand justifié, purge effective selon conservation. RLS sur tous objets privés, contexte transactionnel compatible pooler, rôle DB non propriétaire sans BYPASSRLS ; vérifier absence de fuite sur workers, exports, stockage, recherche vectorielle et connexions réutilisées.

| Domaine | Entités conceptuelles (non SQL définitif) |
|---|---|
| Identité | users, organizations, memberships, invitations, sessions, support_grants, onboarding_progress, preferences |
| CRM | contacts, companies, opportunities, pipelines, stages, activities, score_evidence, consent_records, suppression_entries, imports, merges |
| Acquisition | saved_searches, search_filters, company_signals, enrichment_requests, source_records, alerts, lists |
| Communications | channel_connections, conversations, participants, messages, attachments, calls, call_events, recordings, transcripts, summaries, routing_rules, numbers |
| Agents | agents, agent_versions, tool_permissions, voice_profiles, avatars, knowledge_sources, source_versions, chunks, structured_facts, agent_tests, evaluations, reviews, incidents |
| RDV | calendar_connections, appointment_types, availability_rules, booking_holds, appointments, reminders |
| Campagnes | campaigns, audience_rules, campaign_contacts, sequences, sequence_versions, steps, executions, templates, template_versions, approvals |
| Social | social_accounts, master_contents, variants, assets, scheduled_publications, publication_attempts, metrics_snapshots |
| Automations | workflows, workflow_versions, workflow_runs, step_runs, triggers, approvals |
| Billing | markets, plan_versions, quota_rules, subscriptions, option_versions, pack_versions, orders, payments, invoices, credit_notes, credit_lots, ledger_entries, usage_reservations, usage_events, provider_rate_versions, cost_events, auto_refill_rules |
| Admin / transversal | audit_events, notifications, tickets, support_articles, cms_revisions, comparisons, feedback, adoption_events, experiments, provider_configs, feature_flags, incident_records, report_jobs, outbox, webhook_inbox |

Proposer ERD, cardinalités, constraints, indexes, RLS et migrations avant mise en œuvre. Un invité a accès en lecture seule aux données autorisées de son tenant ; toutes mutations interdites par serveur, y compris indirectes. Admin = rôles distincts, audit et pas de bypass général aux contenus privés. Auth BetterAuth email/pass Google/MS ; OAuth login ≠ OAuth outils, vérifier email, reset anti-énumération, TOTP optionnel client obligatoire admin, recovery, rate limit, révocation sessions. Minimum 12 caractères proposé. Cookies sécurisés HttpOnly/SameSite, CSRF selon flux, CORS allowlist. Workspace unique selon conception, invitation explicite, empêcher doublons et escalade de privilège.

API REST `/v1` proposée ; DTO request/response validés, OpenAPI généré, erreurs structurées code/message/fieldErrors/requestId/retryable, pagination cursor stable, filtres et tri allowlist. Idempotency-Key pour mutations à effets externes/financiers, scope tenant + action + payload hash, conflit si clé réutilisée avec autre payload. Concurrency control par version/ETag si utile. Ne jamais accepter tenant_id du client comme autorité. Webhook signatures et replay guard, stockage minimal, ACK durable et traitement asynchrone. SSE/WS authentifié tenant-scoped seulement si utile ; snapshot/sequence/catchup après reconnexion.

| Endpoint indicatif | Opérations |
|---|---|
| /auth, /organizations, /onboarding | session, invitations, profil, objectifs, checklist, import public et revue |
| /crm/contacts, /companies, /pipelines, /opportunities | CRUD scoped, import/merge, score evidence, transitions, activités |
| /acquisition/searches, /enrichments, /signals, /alerts | recherche, estimation coût, réservation débit, alertes |
| /conversations, /messages, /calls, /routing | inbox, draft, reply, takeover, dialer, inbound/outbound, états |
| /integrations | OAuth start/callback séparés, test, health, revoke |
| /agents, /knowledge, /agent-tests | brouillons versions, permissions, import, review, test/activate/rollback |
| /booking/types, /availability, /appointments | disponibilités, hold, create/update/cancel, public slugs |
| /campaigns, /sequences, /templates | draft, audience, approval, start/pause/stop, runs, résultats |
| /social/contents, /publications, /media | upload pré-signé quarantaine, versions, schedule/publish, analytics |
| /workflows, /executions, /approvals | validate, draft, publish, run, stop, inspector, reconcile |
| /analytics, /reports, /assistant | agrégats, exports, planification, Ask query/prepare/execute |
| /catalog, /subscriptions, /orders, /usage | catalogue public versionné, checkout, options/refill, historique, balance |
| /admin/*, /support/*, /cms/* | accès distinct, opérations contextualisées et auditées |
| /webhooks/{provider} | signature raw body, dedup, événements durables, pas de confiance callback navigateur |

Événements proposés : contact.created, enrichment.completed, call.completed, message.received, consent.revoked, human.takeover, appointment.confirmed, opportunity.won, campaign.stopped, publication.completed, usage.reserved/debited/released, payment.confirmed, quota.threshold, integration.revoked, agent.version.activated. Versionner schémas, correlation_id, causation_id, event_id, tenant, date ; pas de secrets dans payload/logs.

## 4. Règles métier par module

### CRM + acquisition (8.8.4–10)

Recherche en langage naturel → proposition de filtres validés et modifiables (NAF, zone, taille, CA, âge, recrutement ; contacts rôle/séniorité/département). SIRENE public, sources premium Mantiks/Findymail et alternatives Hunter/Dropcontact/Kaspr sous droit de revente, couverture et contrat. Provenance, fraîcheur, score de confiance et permission de prospection séparés. Signaux recrutement groupés par entreprise ; aucune certitude de besoin à partir d'un signal. Alertes ET/OU, plafonds, déduplication, notification app/email. Estimer coût puis réserver/débiter uniquement selon règles d'usage validées. Ne pas facturer deux fois un événement. Identités entreprise SIREN/domaine, filiales distinctes ; normalisation email/téléphone, suggestions de merge et validation humaine, conserver historique et opposition. Import CSV mapping/preview/validation puis worker avec rapport erreurs. Scoring adéquation/engagement séparés, preuves ; chaud≥75 tiède≥40 froid<40, inconnu si preuves insuffisantes, ne pas inventer score. Pipeline Nouveau/Contacté/Qualifié/RDV/Proposition/Gagné/Perdu, configurable (12 étapes cible), historique transitions ; pondération ≠ encaissement. Création brouillon campagne sans envoi.

### Téléphonie, inbox, email, WhatsApp (8.8.12–15)

Gateway ElevenLabs + Twilio prioritaires, Retell/Telnyx alternatives conditionnelles. KYC, numéros FR/CI, portage, renvoi, SIP, coûts contractuels/revente, stockage/traitement UE et qualité voix à qualifier. Entrant : routing humain d'abord 0–45s, IA d'abord, horaires/SVI, fallback humain ou autre route autorisée ; réserver capacité entrante ; contrôler destination, durée, concurrence, quotas. Sortant : dialer humain séparé des campagnes IA ; autorisations, opposition et règles locales avant chaque tentative. Mute, hold, transfert, notes, recording si autorisé ; information IA/enregistrement et alternative humaine. Événements fournisseur dédoublonnés, journal, manqués, résumé/transcription, pas de rappel aveugle si état inconnu. Pas de changement instantané de numéro/sender entre fournisseurs.

Inbox unifiée par contact/thread, dédup et attribution de canal, accès CRM, notes internes non envoyées. Takeover humain suspend automatisations incompatibles ; réactivation explicite. Email OAuth Gmail, Graph, SMTP/IMAP Nodemailer/ImapFlow ; connecteurs isolés, tokens renouvelés/révocables, signatures, brouillon, reply, planification, relances J0/3/7/14 selon modèle. Stop sur réponse/opposition/vente/humain. SPF/DKIM/DMARC à vérifier ; accepted ≠ delivered, ouverture peu fiable. Message transactionnel séparé du marketing ; attachments quarantaine et antivirus.

WhatsApp Meta Cloud Embedded Signup, autorisation canal, fenêtre 24h dernier inbound selon règle validée à implémenter et vérifier, en dehors modèle approuvé si applicable ; notes vocales STT/TTS, résumé, traduction, timestamps/lecture, opt-out. Contrôle droits, coût et statut ; préférer facturation Meta directe client si contrat compatible ; ne pas activer avant approbation. Isolation de clés et stockage audio.

### Agent Studio, connaissances, supervision (8.8.16–18)

Agent : brouillon → tests → approbation révision exacte → actif → pause/révocation ; versions immuables, pin à l'exécution, rollback nouvelle activation testée. Identité/voix/avatar indépendants, missions, canaux, horaires, outils interdit/lecture/approval/auto ; autorisation serveur à chaque outil, budgets et limites. Playground sans effets réels par défaut ; un changement de connaissance, permission ou configuration critique invalide les tests applicables. Modèles Emma/Alex/Lina copiés indépendamment, pas de modifications automatiques.

OpenAI adapter, modèles maintenus sélectionnés par benchmark coût/qualité ; RAG hybride lexical/pgvector filtré tenant et versions approuvées ; facts structurés tarifs/RDV distincts mémoire CRM. Import public site max10 pages, PDF/DOCX/XLSX/CSV/TXT/FAQ, scan MIME/AV/OCR selon besoin, SSRF protection (DNS/IP, redirects, réseaux privés), revue avant écriture, citations sources, suppression index/cache/provider. Contenu importé non fiable, pas d'instructions exécutables, pas d'entraînement sur données clients par défaut prévu. Outils contraints par schéma et contrôles indépendants du LLM ; pas de SQL brut. Escalader si inconnu/contradictoire ; jamais prix ou confirmation de RDV inventés. Historique, reviews, corrections, incidents, métriques et traces factuelles (pas de chaîne de pensée privée). Voix/avatars licences et consentement documentés, FR/Afrique de l'Ouest à tester.

### Rendez-vous (8.8.11)

Google/MS Calendar, types de RDV, durée, buffers, TZ IANA, disponibilité, rappels, lien public /book/entreprise. Calcul intersect disponibilité locale et busy provider ; ne révéler que libre/occupé. Hold avec TTL et verrou anti-chevauchement (contrainte ou transaction adaptée), revérifier juste avant création provider, idempotence/reconcile ; confirmation après résultat vérifié seulement. Échec/état inconnu → en attente ou humain, jamais confirmation fictive. Modifier/annuler, DST, rappel dédoublonné, rate limit formulaire public et collecte minimale.

### Campagnes et séquences (8.8.19–22)

Objectif/audience fixe ou dynamique/canal/séquence/test/approbation/planning. Version pin, audience dédupliquée, limites et fenêtres horaires ; recheck consentement, suppression, tenant, permissions, quota et état conversation à chaque action, pas seulement au lancement. Modes manuel/assisté/auto. Exemple J1 email J4 email J7 appel humain J10 email ; conditions, attente, approbation, stop. Priorité sécurité > humain > conversation active > RDV > devis > prospection. Arrêt sur réponse/vente/opposition ; annuler jobs incompatibles et contrôler course avec exécution. Modèles variables/preview/traduction/AB/signature/version, approbation WA distincte. Funnel cohorte, coût/canal, attribution ; ne pas traiter acceptation comme livraison.

### Social Studio (8.8.23–26)

Facebook/Instagram/LinkedIn via API officielles et permissions validées. Contenu maître, variantes réseau/langue/compte, thèmes et calendrier semaine/mois/liste, UTM, génération texte/images, médias et droits. Médias S3 presigned upload, quarantine, scan, transformations 1:1 et 4:5, expiration licences, métadonnées. Révision exacte approuvée avant planning, calendrier IANA/DST, récurrence contrôlée, pas de rattrapage aveugle, échecs par destination réconciliés. Modes manuel/assisté/auto, aucune fake preuve. Compteurs : distinguer contenus et destinations (ex. 12 contenus/24 destinations) ; unité exacte de publication facturable à confirmer. Analytics : reach non unique cross-network, conversions CRM vérifiées, ROI contribution.

### Automation Studio (8.8.27–29)

Graphe versionné validé, création manuelle/modèle/NL, bibliothèque cible 30 modèles sans marketplace. Déclencheurs/actions intermodules, conditions ET/OU/inconnu, attente, approbation, stop, modes et scope. Compiler vers exécution déterministe ; détecter cycles, plafonds de profondeur/boucle/temps/coût, réserver budget atomique, verrou concurrence. Pin version et input snapshot minimal, recheck gates avant side effects. États queued/running/waiting/approval/done/stopped/blocked/suspended/uncertain/partial/failed/cancelled. Retry 1/5/15 min proposé seulement si sûr ; état inconnu → réconciliation. Execution Inspector factuel contexte, étapes, décisions, coût ; pas de raisonnement privé. Compensation explicite si applicable, pas de rollback fictif d'un email envoyé.

### Analytics, rapports, Ask et onboarding (8.8.1–3, 30–31, 8.9)

Agrégats tenant/période/TZ/cohorte, définitions écrites des KPI, attribution vente reliée CRM, données manquantes explicites. Funnel exemple 486/310/180/95/48/21/12 en démo seulement. 8450 CA attribué, marge 30%, coût249 → 2286 contribution, ROI≈918% ; non net. Exports PDF/CSV asynchrones, droits recheck avant génération et téléchargement, lien court signé, livraison planifiée indépendante, protection CSV injection. Ask AutoCall query/prep/execute avec approbations ; contexte métier scoped, aucun accès SQL brut. Support ≠ Ask. Onboarding compte→entreprise→objectifs→outils→agent→tests→activation ; huit objectifs, recommandation déterministe, connecté≠opérationnel, checklist serveur J0/J1/J3/J7, états explicites, tests exclus analytics/adoption, démo isolée.

## 5. Catalogue tarifaire validé (HT)

Source unique catalogue versionné pour site, simulation, facturation et admin. Quotas mensuels renouvelés même pour un contrat annuel ; pas de freemium permanent. Toutes familles V1 incluses, capacités différentes. Montants CI en XOF ; voix, numéros, paiement et couverture CI gated. Les tableaux sont les valeurs de conception et non des prix fournisseur.

| Quota | FR Starter | FR Pro | FR Business | CI Starter | CI Pro | CI Business |
|---|---:|---:|---:|---:|---:|---:|
| Prix mensuel |49€|99€|179€|15000|30000|60000|
| Annuel HT |558,60€|1128,60€|2040,60€|TBD|TBD|TBD|
| Minutes voix/mois |60|150|300|20|50|100|
| Acquisition/mois |200|500|1000|50|100|250|
| Unités IA/mois |500|1500|2500|300|750|1500|
| Agents |2|5|10|2|4|8|
| Numéros |1|1|2|TBD|TBD|TBD|
| Concurrence appels |1|2|4|1|2|3|
| Contacts CRM |2000|10000|50000|1000|5000|20000|
| Entreprises |1000|5000|25000|500|2500|10000|
| Pipelines |1|3|10|1|3|5|
| Alertes |3|10|30|3|5|15|
| Types RDV |3|10|30|3|10|20|
| Campagnes |3|10|30|3|10|20|
| Séquences |5|20|60|5|15|30|
| Contacts campagne/mois |500|2000|5000|250|1000|3000|
| Transcription WA min/mois |50|150|300|50|150|300|
| Comptes sociaux |3|6|12|3|6|9|
| Publications/mois |30|100|300|30|100|200|
| Images IA/mois |3|10|20|2|5|10|
| Automatisations |5|20|50|5|15|30|
| Exécutions/mois |1000|5000|15000|500|2500|7500|
| Stockage Go |3|10|25|2|5|15|
| Invités lecture seule |1|3|10|1|3|5|
| Support |Standard|Prioritaire|Renforcé|TBD|TBD|TBD|

FR annuel −5% ; CI annuel non décidé. Démo gratuite fictive isolée ; essai réel France 7 jours 10 min, 10 crédits acquisition, 50 unités IA ; moyen paiement avant essai et conditions CI à décider. Pas de passage automatique payant implicite.

| Recharge | Quantité FR / CI | Prix FR € | Prix CI XOF |
|---|---|---:|---:|
| Voix |100 / 25 min|25|7000|
| Voix |250 / 50 min|60|13000|
| Voix |500 / 100 min|115|25000|
| Acquisition |100|6|4000|
| Acquisition |500|27|18000|
| Acquisition |1000|50|35000|
| IA |500|6|4000|
| IA |1000|10|7000|
| IA |5000|45|30000|
| Images |10|4.50|3000|
| Images |20|8|5500|
| Images |50|18|12000|
| Transcription |100 min|2|1500|
| Transcription |500 min|8|6000|

| Option mensuelle | FR € | CI XOF |
|---|---:|---:|
| +1 agent |5|3000|
| +1 numéro |5|TBD|
| +10 Go |3|2000|
| +5000 contacts et 2500 entreprises |5|3500|
| +5 automatisations |5|3500|
| +5000 exécutions |9|6000|
| +3 comptes sociaux |5|3500|
| +100 publications |5|3500|

Barème acquisition : public/CRM 0, vérification email 1, LinkedIn 1, email 2, décideur 2, enrichissement entreprise 2, téléphone 10, signal premium 10. Barème unités IA TBD (ne pas fixer arbitrairement), facturation granularité voix/transcription, compteurs publications et règles contacts campagne à préciser avant activation commerciale. Voix WA synthèse, dialer humain, transfert, international, concurrence extra, voix personnalisée à qualifier.

## 6. Facturation, consommation et invariants financiers

PlanVersion et PriceVersion immuables, souscription référence version, migration explicite. Distinguer quotas de capacité (contacts/agents etc.), quotas mensuels de consommation (min, crédits, etc.) et concurrence ; ne jamais débiter un compteur de capacité comme lot consommable. Crédits mensuels expirent sans report ; lots achetés expirent 12 mois, conservés après changement de plan, utilisation abonnement actif, consommer échéance la plus proche par catégorie. Panier groupé, montant recalculé serveur, prix/taxes/devises et version figés à commande. Taxes selon facturation, aucune fausse hypothèse de TVA universelle.

Stripe Checkout/Portal FR, GeniusPay CI sous contrat et sandbox ; Mobile Money Orange/MTN/Wave conditionnel. Sans mandat CI compatible : lien de renouvellement manuel. Vérification signature et provenance webhook, event id unique, montant/devise/commande/état vérifiés, paiement confirmé avant activation/crédit. Webhook retardé/dupliqué/désordonné : reconcile via fournisseur ; callback navigateur non autoritaire. États abonnement explicités (proposition trial/pending/active/past_due/suspended/cancelled/expired) ; upgrade après paiement, downgrade au terme, prorata et grâce 7j proposés à finaliser. Résiliation ≠ fermeture compte ≠ purge ; remboursement avec reauth/motif/audit et écritures compensatoires, pas d'annulation automatique des crédits déjà consommés. Transaction, facture et avoir distincts.

Ledger append-only : grant/reserve/debit/release/expire/adjust/compensate ; clé unique opération/tenant/catégorie, lot/version/quantité/échéance et lien usage_event. Réserver atomiquement sous verrou DB, empêcher double débit et négatif non autorisé, finaliser quantité réelle ou réconcilier inconnu, libérer surplus. Expiration sous verrou, préserver réservations légitimes selon règle à valider. Invariants tests : somme écritures = solde calculé ; réservations ≤ disponible ; même event n'ajoute qu'une fois ; deux demandes concurrentes ne dépassent pas quota ; pas de double charge de bundle. Alertes 80/95/100 dédoublonnées par cycle/catégorie. Si épuisé, pas de suppression données, appliquer fallback voix et bloquer nouvelles actions concernées. Downgrade sous capacité existante : préserver données, bloquer nouvelles créations selon politique à valider.

Auto recharge OFF par défaut, consentement explicite, seuil, pack, plafond mensuel, lock + idempotence pour éviter achats simultanés, plafond atomique inclut achats pending ; vérifier mandat, marché, statut, paiement. Si pas de mandat CI, proposer lien sans débit. Journaliser et notifier ; désactivation immédiate des futurs achats. Optimisation simulateur packs entiers ; utiliser solde existant et contraintes tous quotas, ne pas pousser plan supérieur sans raison.

Coûts : distinguer estimé/mesuré/confirmé, tarifs fournisseur versionnés, unités/source/currency/date, réconciliation facture, minimums fournisseurs non absorbés séparés. FR hypothèses voix 0,12€/min (stress .18), acq .02 (.04), IA .004 (.008), image .15 (.30), numéro1.22, audio .5/1/2, stockage .25/.5/1, support3/5/8, paiement2.2% TTC+.25 ; hypothèses non devis. Coûts variables exemples 20.1636/46.0836/87.4156€, contribution 28.8364/52.9164/91.5844€. Mix40/50/10 revenu87€, coût39.8488€, contribution47.1512€. Charges fixes et coûts non inclus séparés. CI voix cible120 XOF/min (négociation ≤95), acq14, IA3, image100, audio350/700/1400, base1000/1500/2500, support1000/2000/3500, paiement6%+100 hypothétique ; coût7550/16250/32100, contribution7450/13750/27900. À voix485 XOF/min, contributions150/−4500/−8600 : bloquer commercialisation locale non viable. Ne pas considérer ces hypothèses comme tarifs contractuels.

## 7. Super Admin : 12 domaines et règles

1. Vue d'ensemble : entreprises/utilisateurs, MRR et revenu reconnu, coût estimé/confirmé, santé, contribution, disponibilité.
2. Entreprises/utilisateurs : fiche360 métadonnées, invitations, suspension, support temporaire 30min lecture seule avec consentement propriétaire, ticket, motif, reauth, révocation et audit ; pas de lecture privée par défaut. Suspension stop nouvelles opérations, secours voix, conserver données.
3. Billing : offres versions, transactions, factures, promotions, remboursements, migrations explicites et audit.
4. Usage : registre, quotas, anomalies, coûts versionnés ; correction via compensations, reconciliation.
5. Finance : revenus, dépenses, offres/marchés, fonctionnalités, acquisition/rétention, simulations ; MRR ARR GRR NRR CAC LTV, waterfall, cash/revenu reconnu et contribution distincts ; pas de net fictif.
6. Providers : connexions, tarifs, clés écriture seule, rotation, routing ; gates pays/confidentialité/santé/qualité/capacité avant coût ; circuit breaker, historique, pas de bascule d'identité instantanée.
7. AI governance : modèles officiels, avatars/voix, droits, qualité, versions, tests et révocation ; copier modèles indépendamment.
8. Support : tickets, diagnostics, articles versionnés, RAG sources approuvées, escalade humaine directe, réponses types, CSAT distingué abandons. P1 1h, P2 4h, P3 1j, P4 2j ouvrés objectifs non SLA.
9. Adoption : événements métier réels (pas login/test), première valeur, onboarding, rétention, feedback, accompagnement, expérimentation AB stable par org ; score adoption30/fréquence25/onboarding20/intégration15/support10, normalisé N/A ; ≥75 bon,45–74 aide,<45 revue ; pas sanction auto.
10. Infra : health, métriques, queues, logs, backups, déploiements, incidents, page status externe, accès limité et audit.
11. Sécurité : auth, protection données, RGPD, IA, communications, audit, matrice risque 5×5, incidents, tests et demandes de droits.
12. Global/CMS : marchés FR EUR Paris +33 Stripe, CI XOF Abidjan +225 GeniusPay conditionnel ; flags dev/stage/pilot/gradual/available/maintenance/suspend, dépendances, modèles et notifications versionnés, branding assets, FAQ/blog/docs/comparatifs/pages FR/EN. Cycle draft→validate→impact→approve→publish→monitor→rollback nouvelle version. Schémas bornés, aucun code arbitraire, maintenance avec fallback voix. Comparatifs : source/date/conditions/cellule et validation humaine, aucune publication d'allégation non attestée. Support public indexe uniquement contenu approuvé public. Newsletter consentement/confirmation/désinscription, contact rate limit/anti-spam ; demandes support vers tickets, demandes commerciales vers CRM interne autorisé.

## 8. Sécurité, conformité, exploitation

TLS, AES-256-GCM pour secrets avec gestion de clés séparée, rotation et write-only UI, IAM moindre privilège, secrets gestionnaire/env non commité, logs redaction PII/credentials. Helmet, CSRF, XSS, SSRF, validation, rate limiting, anti-enum, audit tamper-evident proposé, stockage S3 privé URLs signées courtes, scan MIME/antivirus, webhook replay, isolation tenants DB/RLS/queues/s3/cache/vectors/exports, tests de fuite. Admin reauth et MFA obligatoire. Séparer données prod/stage/demo ; ne jamais entraîner avec contenu client par défaut prévu ; vérifier contrats fournisseurs.

Conformité à valider par professionnel avant lancement : France/CI (ARTCI), RGPD, rôles responsable/sous-traitant et DPA, AIPD si nécessaire, transferts/SCC, AI Act information IA, enregistrement et consentement/opposition. Hébergement UE ≠ traitement UE ; pas de certification inventée. Politique prudente : B2B email pertinent avec information/opposition ; B2C consentement ; appels IA B2B consentement préalable ; règles appels humains et WA à vérifier avant activation. Inconnu = bloqué. Réévaluer avant exécution, propager opposition et conserver suppression minimale ; pas de relance après opposition. Alternatives humaines. Durées proposées audio/WA30j, transcription90j, conversation12mois, logs6mois, backups30j, factures selon droit ; à valider contractuellement et juridiquement. Export, correction et effacement incluant caches/index/fournisseurs, réapplication suppression après restauration ; notification incident aux parties responsables selon obligations/risque, processus 72h RGPD applicable à vérifier. Aucun engagement conformité avant preuves.

Observabilité Pino structured logs, request/correlation IDs, métriques et traces OTel, Grafana/Prometheus ; Uptime Kuma externe, status.getautocall.fr indépendant. Seuils CPU/RAM75/90%, disque80/90%, connexions70/90%, Redis75/90% soutenus ; mesurer queue age, failures, fournisseur, coût, voix et latence. Cibles p95 API≤300ms (hors opérations externes longues explicitement distinguées), p75 LCP≤2.5s INP≤200ms CLS≤.1, disponibilité99.9% objectif non SLA. RPO1h/RTO4h cible, sauvegardes chiffrées séparées, restauration testée mensuellement, rollback DB compatible, release staging→prod, migration expand/contract, health/readiness, runbooks, incidents. Scale selon mesure, pas promesse liée à VPS. Pas de données privées dans monitoring externe.

## 9. Recette et développement par lots

Vitest, Supertest, Playwright, Testcontainers PG/Redis ; k6, OWASP ZAP, Trivy, Gitleaks, Dependabot. Couverture cible≥80% code métier, toutes branches critiques obligatoires, aucune vulnérabilité haute/critique non traitée pour lancement. Identifiants historiques à restaurer (ne pas réattribuer) : CRM01–16, ACQ01–17, TEL01–17, MAIL01–12, WA01–10, AI01–22, CAMP01–18, AUTO01–20, RDV01–20, ANA01–19, DASH01–15, SOC01–18, ONB01–16, ADM01–27, BILL01–22, SEC01–16, INF01–08, UX01–07. Ajouter BE-* provisoires indépendants. Traçabilité exigence→UI→contrat→test→preuve.

Tests prioritaires : cross-tenant DB et objets, invité mutations interdites, admin accès scoped expiré, OAuth révoqué, import hostile SSRF/AV/injection, identifiant webhook réutilisé, paiement mauvais montant/devise, deux réservations concurrence quota, crédits expirés, budget auto recharge, webhook désordre, état fournisseur inconnu, appels fallback, takeover/opt-out pendant attente campagne, RDV concurrent et provider timeout, DST, publication partielle, boucles/approbations workflow, suppression après restore, exports privés et sandbox isolée. IA : exactitude faits≥95%, règles≥98%, qualification≥90%, booking≥98%, escalade≥95% ; zéro fuite/action non autorisée/prix inventé/fausse confirmation ; tests de la révision exacte et cas critiques. Mesurer échantillons et méthodes, pas de scores simulés en production.

Ordre proposé :
1. Analyse des spécifications et licences des dépendances ; ADR, schéma initial, monorepo/CI, environnements, contrats, auth/tenancy/RLS, catalogue/versionnement et ledger, observabilité.
2. CRM/acquisition + tests source/dédup/quota ; frontend correspondant ; onboarding société/objectifs.
3. Gateway communications et connexions OAuth, journal, routage voix, inbox, email/WA.
4. Agents/knowledge/RAG, booking, permissions et activation ; onboarding tests/checklist.
5. Campagnes/sequences/templates, automations, Social Studio ; arrêt et réconciliation.
6. Analytics/rapports/Ask, facturation complète, admin 12 modules (construire progressivement par domaine), CMS/site/FAQ/démo.
7. E2E, security/perf/restore, sandbox fournisseurs, bêta 5–10 PME, validation légale et économie unitaire, go/no-go France puis CI.

Definition of Done : logique réelle, migrations réversibles ou stratégie de récupération, types/contrats et tests verts, permissions et quotas contrôlés serveur, erreurs/reprise/observabilité/audit, doc et preuve staging. Les lots ne sont pas des réductions du périmètre V1. Ne pas déployer ni engager dépenses sans autorisation.

## 10. Registre des décisions ouvertes

Analyse des spécifications ; schéma SQL/API précis ; matrice 6.10 originale ; fournisseur voix/KYC/revente et coût FR/CI, numéros/portage/SIP, fournisseur données licences/couverture CI, tarifs IA et unité de consommation, granularité voix, permissions Meta/social, voix personnalisée/WA, prix international/dialer/concurrence extra, facturation options/prorata/grâce et renouvellement annuel CI, essai avant paiement, taxes et support CI, droits visuels et voix, conservation et textes juridiques, compatibilité des versions et tests réels. Documenter chacun, owner, gate, preuve et statut. Aucun placeholder présenté comme opérationnel.
