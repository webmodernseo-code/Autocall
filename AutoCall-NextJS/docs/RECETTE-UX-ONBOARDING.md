# ✅ CHECKLIST DE RECETTE MANUELLE — UX, NAVIGATION & ONBOARDING

Ce guide pas-à-pas permet à l'équipe Produit et QA de valider l'expérience utilisateur complète d'AutoCall, de la première connexion jusqu'aux cas avancés de gestion multi-tenant.

---

## 📋 Scénario 1 : Première Connexion & Onboarding Guidé (Nouveau Client)

- [ ] **1.1 Accès initial** : Se connecter avec un compte client vierge sans configuration préalable.
  - *Comportement attendu* : Redirection automatique vers `/app/onboarding`. L'état en base est `not_started` ou `in_progress`.
- [ ] **1.2 Étape 1 (Objectif & Cas d'usage)** :
  - Sélectionner un type d'agent (ex: *Qualification de prospects* ou *Secrétariat*).
  - Renseigner le nom de l'entreprise et cliquer sur *Continuer*.
  - *Comportement attendu* : Transition fluide sans rechargement brutal, jauge de progression passant à 20%.
- [ ] **1.3 Étape 2 (Voix naturelle & Aperçu audio)** :
  - Cliquer sur le bouton de lecture audio vectoriel d'une voix (ex: *Amélie* ou *Thomas*).
  - *Comportement attendu* : L'extrait sonore est joué clairement sans bug de lecture ni bouton déformé. Sélectionner la voix et cliquer sur *Continuer*.
- [ ] **1.4 Étape 3 (Instructions & Scénario)** :
  - Personnaliser les directives et renseigner les horaires d'ouverture.
  - *Comportement attendu* : Les champs sont clairs, les libellés en français naturel (pas de terme "prompt" brut).
- [ ] **1.5 Étape 4 (Numéro de téléphone & Ligne)** :
  - Sélectionner une ligne AutoCall ou cocher l'option *Conserver mon numéro habituel (renvoi d'appel)*.
  - *Comportement attendu* : Le guide de renvoi d'appel s'affiche discrètement avec les codes GSM opérationnels.
- [ ] **1.6 Étape 5 (Simulation d'appel de test)** :
  - Renseigner un numéro mobile de test et cliquer sur *Lancer l'appel de test*.
  - *Comportement attendu* : L'appel de simulation s'exécute, l'état passe à `completed` en base.
- [ ] **1.7 Arrivée sur le Tableau de bord** :
  - Cliquer sur *Accéder à mon tableau de bord*.
  - *Comportement attendu* : Redirection vers `/app/dashboard`. Le bandeau d'onboarding n'est plus intrusif.

---

## 📋 Scénario 2 : Persistance & Non-Réapparition Automatique

- [ ] **2.1 Reprise de session interrompue** :
  - Commencer l'onboarding, avancer jusqu'à l'étape 3, puis se déconnecter ou fermer le navigateur.
  - Se reconnecter :
  - *Comportement attendu* : L'application redirige automatiquement vers l'étape 3 exacte sans perdre les saisies préalables.
- [ ] **2.2 Abandon volontaire ("Faire plus tard" / Masquage)** :
  - Cliquer sur *Faire plus tard* ou sur la croix de la carte du dashboard.
  - *Comportement attendu* : Appel POST vers `/api/app/onboarding/dismiss`. L'état passe à `dismissed`.
  - Se déconnecter puis se reconnecter :
  - *Comportement attendu* : L'utilisateur arrive directement sur `/app/dashboard`. L'onboarding ne s'ouvre plus automatiquement.
- [ ] **2.3 Relance manuelle** :
  - Depuis les Paramètres ou l'URL `/app/onboarding?force=1&reset=1`, relancer l'assistant.
  - *Comportement attendu* : L'onboarding est accessible à la demande pour reconfiguration.

---

## 📋 Scénario 3 : Navigation par Objectifs & Ergonomie

- [ ] **3.1 Dépliement & Repliement des Groupes** :
  - Cliquer sur *Appels*, *Agents IA*, *Contacts*, *Messages*, *Automatisation*, *Analyses*, *Paramètres*, *Avancé*.
  - *Comportement attendu* : Animation fluide en accordéon, le chevron pivote, le sous-menu s'ouvre.
- [ ] **3.2 Maintien de l'état actif** :
  - Naviguer sur `/app/agents` ou `/app/contacts`.
  - *Comportement attendu* : Le groupe parent reste automatiquement ouvert et l'élément actif est mis en valeur en bleu avec un fond doux.
- [ ] **3.3 Sidebar réduite (68px)** :
  - Réduire la barre latérale via le bouton en bas de menu.
  - Survoler les icônes vectorielles.
  - *Comportement attendu* : Les tooltips flottants s'affichent instantanément à droite avec le nom du groupe et ses sous-pages.
- [ ] **3.4 Navigation Mobile (< 768px)** :
  - Ouvrir l'application sur smartphone ou émulateur mobile (375px et 320px).
  - Ouvrir le menu burger :
  - *Comportement attendu* : Menu plein écran tactile, fermeture fluide au clic ou sur le bouton croix, aucun texte tronqué ou écrasé.

---

## 📋 Scénario 4 : Primitives de Design System & Zéro AI Slop

- [ ] **4.1 États vides actionnables (`EmptyState`)** :
  - Se rendre sur *Campagnes* ou *Agents* sans aucun élément créé.
  - *Comportement attendu* : L'état vide explique clairement à quoi sert la fonction, affiche un bouton d'action évident (*Créer ma première campagne*), et liste 3 conseils concrets de démarrage.
- [ ] **4.2 Filtrage sans résultat** :
  - Appliquer un filtre de recherche inexistant.
  - *Comportement attendu* : L'état vide passe en mode recherche avec un bouton *Réinitialiser les filtres*.
- [ ] **4.3 Zéro Emoji & Vecteurs SVG Purs** :
  - Inspecter les en-têtes, statuts, boutons et menus.
  - *Comportement attendu* : Aucun emoji informel (💬, 💳, 📦, 🚀, 🔥). Seules les icônes Lucide SVG nettes sont utilisées.
- [ ] **4.4 Mode Sombre (Dark Mode)** :
  - Basculer en mode sombre.
  - *Comportement attendu* : Fonds anthracite profonds (`#131622`), bordures subtiles (`border-white/10`), textes contrastés et lisibles conformes WCAG AA.

---

## 📋 Scénario 5 : Non-Régression & Sécurité Multi-Tenant

- [ ] **5.1 Isolation des Espaces Clients** :
  - Tenter d'accéder ou de mettre à jour l'onboarding d'un autre `client_id` via l'API.
  - *Comportement attendu* : L'API résout exclusivement le `client_id` via la session authentifiée et rejette toute tentative de falsification avec une erreur 401/403.
- [ ] **5.2 Préservation intégrale des routes** :
  - Tester les URL directes : `/app/dashboard`, `/app/agents`, `/app/campaigns`, `/app/contacts`, `/app/calls`, `/app/phone-numbers`, `/app/flows`, `/app/crm`, `/app/sip`, `/app/api-keys`.
  - *Comportement attendu* : Toutes les pages s'ouvrent sans 404 ni régression de permission.
