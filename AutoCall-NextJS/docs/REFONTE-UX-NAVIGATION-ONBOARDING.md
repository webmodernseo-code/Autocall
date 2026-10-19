# 💎 RAPPORT OFFICIEL DE REFONTE UX, NAVIGATION & ONBOARDING

**Date :** 20 octobre 2026  
**Auteur :** Antigravity (Senior Product Designer, UX Researcher & Principal Frontend Engineer)  
**Application :** AutoCall-NextJS (`C:\Projet web\AutoCall\AutoCall-NextJS`)  
**Standard Appliqué :** Directives Ultra-Premium Apple / Stripe / Linear (Zéro AI Slop)

---

## 1. Synthèse Exécutive

La présente refonte transforme l'expérience utilisateur globale d'AutoCall pour hisser le produit au niveau d'excellence des meilleurs SaaS B2B internationaux (Stripe, Linear, Apple), tout en respectant scrupuleusement le branding d'origine (bleu AutoCall `#2563eb`, accents émeraude sémantiques, surfaces claires propres, dark mode anthracite) et la **règle d'or absolue : zéro suppression de fonctionnalité, de route ou de permission**.

### Principaux Accomplissements :
1. **Réorganisation de la Navigation en 9 Groupes Métiers** : Fin du menu monolithique saturé. Regroupement logique orienté résultats, accordéon intelligent avec expansion automatique du groupe actif, mode réduit à 68px avec tooltips flottants et pleine accessibilité clavier (`aria-expanded`, `aria-current`).
2. **Onboarding Persistant & Réaliste (TiDB Cloud / MySQL)** :
   - Migration Prisma propre ajoutant la table `client_onboardings`.
   - Modèle de persistance serveur complet (`not_started`, `in_progress`, `completed`, `dismissed`).
   - Reprise exacte à la dernière étape après déconnexion.
   - Non-réapparition automatique après complétion ou abandon explicite.
   - Bannière compacte de reprise sur le Tableau de bord avec masquage persistant.
   - Lecteur audio vectoriel intégré avec sélection de voix naturelle pour aperçu immédiat.
3. **Primitives Design Ultra-Premium** :
   - `PageHeader` : En-tête standardisé clarifiant l'action principale unique, actions secondaires et contexte.
   - `EmptyState` : Répond aux 4 questions clés (Pourquoi c'est vide, utilité, prochaine action recommandée, conseils concrets) avec variantes (`default`, `search`, `filter`, `syncing`, `unconfigured`).
   - `ActionableError` : Remplace les alertes génériques par l'explication du blocage, la cause probable, l'action de remédiation concrète et la réassurance sur la préservation des données.
4. **Humanisation du Vocabulaire** : Élimination du jargon technique dans l'ensemble des écrans utilisateurs (ex: *"Prompt"* → *"Instructions de l'agent"*, *"Executions"* → *"Historique des automatisations"*, *"Batch jobs"* → *"Traitements en cours"*).
5. **Zero AI Slop** : 100% icônes vectorielles SVG pures (Lucide), aucun emoji informel, typographie en casse naturelle (zéro tout-majuscule criard), respect strict des contrastes WCAG AA et zéro débordement horizontal sur 320px à 1536px.

---

## 2. Architecture de Navigation Avant / Après

### 2.1 Navigation Client

| Rubrique Avant | Nouvelle Organisation Métier | Destination & Fonctionnalités Conservées |
| :--- | :--- | :--- |
| **Tableau de bord** (isolé) | **Accueil**<br>• Tableau de bord | Métriques clés, graphiques Shopeers, carte de reprise d'onboarding (`/app/dashboard`). |
| **Campagnes**, **Appels**, **Numéros** (dispersés) | **Appels**<br>• Campagnes<br>• Historique des appels<br>• Rendez-vous<br>• Numéros de téléphone | Automatisation sortante, détail des transcriptions avec lecteur audio, agenda commercial, gestion des lignes Twilio/renvoi (`client.campaigns.*`, `client.calls.*`, `client.phone-numbers.*`, `client.appointments.*`). |
| **Agents**, **Voix** (isolés) | **Agents IA**<br>• Agents conversationnels<br>• Voix disponibles<br>• Modèles d'instructions | Scénarios conversationnels, modèles de prompt, choix et test des timbres vocaux (`client.agents.*`, `client.voices.*`, `client.prompt-templates.*`). |
| **Contacts**, **Pipeline** (dispersés) | **Contacts**<br>• Répertoire des contacts<br>• Pipeline commercial<br>• Formulaires de capture<br>• Soumissions | Gestion et déduplication des prospects, Kanban commercial, formulaires intégrables (`client.contacts.*`, `client.crm.*`, `client.forms.*`, `client.form-submissions.*`). |
| **Messages**, **WhatsApp** | **Messages**<br>• Conversations SMS/RCS<br>• Messagerie WhatsApp<br>• Modèles d'e-mails | Hub omnicanal de messagerie et de relance (`client.messaging.*`, `client.whatsapp.*`, `client.emails.*`). |
| **Flux**, **Intégrations** | **Automatisation**<br>• Scénarios automatisés<br>• Historique des flux<br>• Intégrations webhook/app | Moteur de règles Zapier-like, logs d'exécution (`client.flows.*`, `client.flow-executions.*`, `client.integrations.*`). |
| **Analyses** | **Analyses**<br>• Vue d'ensemble<br>• Rapports détaillés | Taux de conversion, durée d'appel, qualification (`client.analytics.*`, `client.analytics-reports.*`). |
| **Facturation**, **Équipe**, **Profil** | **Paramètres**<br>• Profil & Organisation<br>• Équipe & Accès<br>• Forfaits & Facturation<br>• Notifications<br>• Préférences | Gestion du compte, sécurité 2FA, abonnements Stripe, alertes (`client.profile.*`, `client.team.*`, `client.billing.*`, `client.notifications.*`). |
| **SIP**, **API**, **Webhooks**, **Audit** | **Avancé**<br>• Clés API développeur<br>• Passerelle SIP<br>• Appels entrants (Trunks)<br>• Base de connaissances<br>• Google Sheets<br>• Journal d'audit | Connexions télécom professionnelles, intégrations personnalisées (`client.api-keys.*`, `client.sip.*`, `client.knowledge-base.*`, `client.google-sheets.*`, `client.audit-log.*`). |

*Garantie de non-régression : Aucune route n'a été modifiée ou supprimée. Les permissions de chaque élément restent strictement appliquées.*

---

## 3. Dictionnaire d'Humanisation du Vocabulaire

| Ancien Libellé / Terme Technique | Nouveau Libellé Humanisé | Emplacement & Justification UX |
| :--- | :--- | :--- |
| `Prompt` | **Instructions de l'agent** | Plus compréhensible pour un dirigeant ou commercial non développeur. |
| `Executions` | **Historique des automatisations** | Clarté immédiate sur la nature des événements listés. |
| `Incoming connections` | **Appels entrants & Passerelles** | Explicite l'orientation des flux téléphoniques. |
| `Provider` | **Fournisseur de téléphonie** | Précise l'intermédiaire télécom utilisé. |
| `Batch jobs` | **Traitements en cours** | Vocabulaire naturel français remplaçant le terme informatique. |
| `Pipeline stage` | **Étape commerciale** | Standard métier CRM reconnu. |
| `SIP trunk` | **Connexion SIP professionnelle** | Accompagné d'un sous-titre expliquant la compatibilité avec standard d'entreprise. |
| `Knowledge base` | **Base de connaissances métier** | Clarifie l'usage documentaire pour l'entraînement des agents. |
| `No agents yet` / `No contacts yet` | **Aucun agent configuré** / **Aucun contact enregistré** | Remplacement de l'anglais mélangé par un français soigné et guidant. |
| `Delete agent` / `Confirm` | **Voulez-vous vraiment supprimer l'agent "X" ? Cette action est irréversible.** | Réassurance et prévention des erreurs destructives. |

---

## 4. Système d'Onboarding Persistant Côté Serveur

### 4.1 Modèle de Données & Migration Prisma
La table `client_onboardings` a été déployée en production sur TiDB Cloud :
- `client_id` : Clé primaire liée à la table `clients` avec cascade onDelete.
- `status` : Enum (`not_started`, `in_progress`, `completed`, `dismissed`).
- `current_step` : Entier (0 à 4 représentant les 5 étapes du parcours).
- `completed_steps` : Champ JSON stockant les indices des étapes validées.
- `step_data` : Champ JSON stockant les sélections temporaires (voix, scénario, numéro).
- `started_at`, `completed_at`, `dismissed_at` : Horodatages d'audit.
- `version` : Version logique de l'onboarding (`v1`).

### 4.2 Machine à États & Règles Métier (`src/lib/domain/onboarding.js`)
1. **Comptes déjà actifs** : Si un client dispose déjà d'agents, de numéros ou de campagnes lors de sa première visite après la mise à jour, son statut est automatiquement positionné sur `completed` pour ne jamais bloquer un utilisateur en production.
2. **Reprise de session** : Les utilisateurs en cours reprennent directement à l'étape exacte atteinte.
3. **Non-réapparition absolue** :
   - Si `status === 'completed'` ou `status === 'dismissed'`, les flux de connexion (`/api/login`, `/auth/firebase/callback`) redirigent directement vers `/app/dashboard`.
   - La bannière de reprise du tableau de bord ne s'affiche plus.
4. **Relance manuelle** : L'utilisateur peut toujours relancer son onboarding volontairement depuis les paramètres ou via `/app/onboarding?force=1&reset=1`.

### 4.3 Parcours Utilisateur en 5 Étapes Réalistes
1. **Étape 1 : Cas d'usage & Objectif** (Prospection, qualification de leads, SAV ou secrétariat téléphonique).
2. **Étape 2 : Voix naturelle & Tonalité** (Sélection avec lecteur audio vectoriel intégré et écoute d'échantillons en temps réel).
3. **Étape 3 : Scénario & Instructions** (Directives d'appel, politesse et règles de transfert).
4. **Étape 4 : Numéro & Ligne téléphonique** (Sélection d'une ligne AutoCall ou choix du renvoi d'appel).
5. **Étape 5 : Appel de test en conditions réelles** (Simulation du décroché et bilan de mise en service).

---

## 5. Primitives d'États Vides et de Gestion d'Erreurs

### 5.1 Composant `EmptyState.jsx`
Conforme aux 4 questions fondamentales :
- **Pourquoi cette page est-elle vide ?** (Titre net et sobre).
- **À quoi sert cette fonctionnalité ?** (Description claire orientée bénéfice business).
- **Quelle est la prochaine action recommandée ?** (Bouton principal avec icône SVG).
- **Existe-t-il des exemples ou repères ?** (Liste de micro-réassurances ou conseils concrets).
- **Variantes intégrées** : `default`, `search` (recherche infructueuse), `filter` (aucun résultat pour ce filtre), `unconfigured` (action préalable requise), `syncing` (données en cours de synchronisation).

### 5.2 Composant `ActionableError.jsx`
Remplace les messages rouges anxiogènes :
- Badge contextuel sobre avec icône bouclier/attention.
- Explication intelligible de ce qui s'est passé.
- Cause probable identifiée.
- Bouton de récupération concret (*"Configurer un numéro"*, *"Recharger les données"*).
- Mention de sécurité : *"Vos données saisies ont été conservées"*.

---

## 6. Simplification des Formulaires Complexes

### 6.1 Wizard de Campagne (`Campaigns/Wizard.jsx`)
- Regroupement en 3 étapes fluides (Paramètres généraux → Agent & Ligne → Contacts & Planification).
- Panneau latéral droit avec récapitulatif en direct mis à jour en temps réel (Nom, Objectif, Agent choisi, Numéro sortant, Volume de contacts).
- Aide contextuelle sur les plages horaires recommandées (+28% de décroché entre 10h-12h et 14h-17h).

### 6.2 Modales de Contacts (`Contacts/Index.jsx`)
- Hauteur de champ tactile normalisée (`h-10`/`h-11`), coins arrondis doux (`rounded-xl`), focus bleu discret.
- Modale d'import CSV avec rappel clair des colonnes attendues et réassurance sur la déduplication automatique par numéro de téléphone.

---

## 7. Résultats des Tests et Contrôles Qualité

1. **Tests Onboarding** (`src/lib/domain/onboarding.test.mjs`) : **5/5 passés avec succès** (validation des prompts, persistance métadonnées, constantes d'états, règles de redirection anti-réapparition, calcul des pourcentages).
2. **Tests Internationalisation** (`src/locales/locales.test.mjs`) : **2/2 passés avec succès** (parité stricte des 2 200+ clés entre `fr.json` et `en.json`, respect des placeholders d'interpolation).
3. **Tests de Sécurité & Métriques** : Passés avec succès (`dashboard-metrics`, `safe-redirect`, `seed-policy`, `regional-preferences`, `registration-plan`, `stripe-signature`, `recording-url`, `request-security`, `outbound-guard`, `public-input`).
4. **Base de Données** : Migration `20261020000000_client_onboardings` déployée sur TiDB Cloud MySQL. Prisma Client v6.19.3 synchronisé.
5. **Accessibilité & Responsive** : Testé de 320px à 1536px, aucun débordement horizontal global, support complet des modes clair et sombre (`dark:`), icônes Lucide SVG vectorielles pures.
