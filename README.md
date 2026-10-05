# 📞 CallMindAI — AI Voice Calling & Lead Qualification SaaS

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208%20%2F%20MariaDB-4479A1?style=flat&logo=mysql)](https://www.mysql.com/)
[![AI](https://img.shields.io/badge/AI-OpenAI%20%7C%20ElevenLabs-FF6F00?style=flat)](https://elevenlabs.io/)
[![Telephony](https://img.shields.io/badge/Telephony-Twilio%20%7C%20Plivo%20%7C%20SIP-F22F46?style=flat)](https://www.twilio.com/)

> 🌐 **Navigation / Langue** :  
> 🇫🇷 [Version Française](#-version-française) | 🇬🇧 [English Version](#-english-version)

---

<a name="-version-française"></a>
## 🇫🇷 Version Française

### 🌟 Présentation
**CallMindAI** est une plateforme SaaS tout-en-un de télé-prospection, service client et qualification d'appels téléphoniques propulsée par l'Intelligence Artificielle. Elle permet aux entreprises et aux agences de déployer des agents vocaux autonomes capables :
* **D'émettre des appels sortants (Outbound)** à grande échelle pour prospecter, qualifier et relancer des listes de contacts.
* **De recevoir des appels entrants (Inbound)** 24h/24 et 7j/7 pour accueillir les clients, répondre aux questions, transférer vers des humains ou prendre des messages vocaux.
* **De tenir des conversations 100% autonomes** et fluides avec adaptation en temps réel aux objections.
* **De réaliser un débriefing complet post-appel** : génération d'un résumé exécutif par IA, transcription intégrale, analyse du sentiment et scoring commercial (*Chaud / Tiède / Froid*) avec mise à jour automatique du CRM.

Le projet est entièrement **auto-hébergé**, prêt pour la commercialisation en **marque blanche (white-label)** et dispose d'une architecture **multi-tenant** avec facturation intégrée.

---

### 🚀 Fonctionnalités Clés

#### 1. 🤖 Agents Vocaux IA & Conversations Autonomes
* **Dialogue 100% autonome & interactif** : Capacité d'écoute active, compréhension contextuelle et réponses adaptées en temps réel.
* **Voix ultra-réalistes** : Intégration d'ElevenLabs et OpenAI Realtime/TTS avec gestion fine des intonations, émotions et accents humains.
* **Personnalisation complète** : Nom, persona, script d'ouverture, consignes système, détection d'objections et température.
* **Base de connaissances (RAG)** : Chargement de documents d'entreprise et FAQ pour ancrer précisément les réponses de l'agent.
* **Support multilingue** : 29 langues prises en charge avec détection automatique.

#### 2. 📞 Gestion Complète des Appels : Entrants & Sortants (Inbound / Outbound)
* **Appels Entrants (Inbound 24/7)** :
  * Décrochage instantané par agent IA sur numéros dédiés ou trunks SIP.
  * Routage intelligent (*Incoming Connections*) : affectation d'agent, transfert direct vers conseiller humain (*Call forwarding*), ou boîte vocale IA (*Voicemail*).
  * Automatisation des appels manqués : envoi automatique de SMS (*Missed Call Auto-Text*).
* **Campagnes Sortantes (Outbound Dialer)** :
  * Import de listes de contacts via fichier CSV et planification horaire.
  * Composeur intelligent asynchrone régulant la concurrence et les quotas journaliers.
  * Relances automatiques intelligentes sur répondeur, ligne occupée ou non-réponse.

#### 3. 📋 Débriefing Post-Appel, Résumé IA & Scoring Commercial
* **Résumé exécutif par IA (`summary`)** : Synthèse claire et condensée générée dès la fin de l'appel récapitulant les points abordés et les accords pris.
* **Transcription & Audio complets** : Enregistrement écoutable et transcription mot à mot horodatée de l'échange.
* **Qualification immédiate** : Scoring automatique du lead (*Hot, Warm, Cold, Unqualified*).
* **Analyse de sentiment** : Détection du niveau d'intérêt (*positif, neutre, négatif*) et identification des freins.
* **Mise à jour CRM & Pipeline** : Progression automatique du lead dans l'entonnoir commercial et synchronisation instantanée via Webhook (HubSpot, Salesforce, Pipedrive, Zapier, Make).

#### 4. 🔀 Constructeur Visuel de Flux (Flows)
* Scénarios automatisés par nœuds connectés (React Flow / `@xyflow/react`).
* Déclencheurs événementiels : *Inbound call*, *Call completed*, *Lead qualified*, *Schedule*.
* Actions automatiques : envoi de SMS/WhatsApp de confirmation, email récapitulatif, prise de rendez-vous dans l'agenda ou transfert d'appel.

#### 5. 👥 Espace Multi-Tenant & Super-Admin
* **Portail Client (`/app`)** : Gestion des agents, campagnes sortantes, règles d'appels entrants, contacts, rendez-vous, widget web et équipe (RBAC).
* **Console Super-Admin (`/admin`)** :
  * Supervision en direct des appels, trunks SIP et files d'attente.
  * Gestion des comptes clients avec connexion instantanée (impersonation).
  * Centralisation des clés d'API (Twilio, Plivo, ElevenLabs, OpenAI).
  * Forfaits d'abonnements, packages de crédits et passerelles de paiement (Stripe, PayPal, Paddle).
  * Système de vérification KYC des identités clients.

---

### 💻 Stack Technique
* **Frontend** : Next.js 15.5 (App Router), React 19, Tailwind CSS, Lucide Icons, Recharts.
* **Backend** : Next.js API Routes, Server Actions, JWT (`jose`), Chiffrement AES (`crypt.js`).
* **Base de données** : Prisma ORM avec MySQL 8+ / MariaDB 10.4+ (schéma relationnel complet de 85 tables).
* **Worker d'arrière-plan** : Node.js worker (`scripts/worker.mjs`) pour le dialer et les tâches planifiées.

---

### ⚡ Installation Rapide

#### Prérequis
* Node.js 20 LTS ou supérieur
* npm 10+
* MySQL 8.0+ ou MariaDB 10.4+

#### Étapes d'installation

1. **Accédez au répertoire de l'application** :
   ```bash
   cd CallMineAI-NextJS
   ```

2. **Installez les dépendances** :
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement** :
   ```bash
   cp .env.example .env
   ```
   *Renseignez au minimum votre `DATABASE_URL` MySQL, `AUTH_SECRET` et `APP_KEY`.*

4. **Générez la clé d'application et la base de données** :
   ```bash
   npm run key:generate
   npx prisma db push
   npm run db:seed
   ```

5. **Démarrez le serveur de développement** :
   ```bash
   npm run dev
   ```
   *L'application est accessible sur : `http://localhost:3000` (ou `http://localhost:3002`).*

6. **Lancez le worker d'appels (dans un second terminal)** :
   ```bash
   npm run worker
   ```

#### 🔑 Comptes locaux
Définissez `ADMIN_SEED_*` et, uniquement pour une démo locale, `CLIENT_SEED_*`. Aucun identifiant public ou de secours n'est intégré au SaaS.

---

<a name="-english-version"></a>
## 🇬🇧 English Version

### 🌟 Overview
**CallMindAI** is an all-in-one AI Voice Calling, Customer Service & Lead Qualification SaaS platform. It enables businesses and agencies to deploy autonomous voice agents capable of:
* **Handling Inbound Calls (24/7)**: Answering inquiries, resolving customer questions, forwarding calls to human reps, or recording AI-transcribed voicemails.
* **Placing Bulk Outbound Calls**: Running cold calling campaigns at scale, following up on leads, and handling automated retries.
* **Conducting 100% Autonomous Conversations**: Natural bidirectional dialogues, intelligent objection handling, and smart appointment setting.
* **Delivering Full Post-Call Debriefings**: Generating instant executive AI summaries, timestamped word-for-word transcripts, sentiment analysis, and lead scoring (*Hot / Warm / Cold*) with automatic CRM sync.

The codebase is **100% self-hosted**, white-label ready, and engineered with a robust **multi-tenant** architecture and built-in billing.

---

### 🚀 Key Features

#### 1. 🤖 Autonomous Conversational AI Voice Agents
* **100% Autonomous & Bidirectional Dialogues**: Active listening, contextual understanding, and natural turn-taking in real time.
* **Ultra-Realistic Human Voices**: ElevenLabs and OpenAI Realtime/TTS integration with fine-tuned emotion, accent, and tone control.
* **Full Persona & Goal Customization**: Name, persona, opening lines, objection handling instructions, and temperature tuning.
* **Knowledge Base (RAG)**: Ground agent responses with company documents, FAQs, and product catalogs.
* **Multilingual Calling**: 29 supported languages with native regional accents and automatic language detection.

#### 2. 📞 Comprehensive Call Management: Inbound & Outbound
* **Inbound Calling (24/7 AI Receptionist)**:
  * Instant pickup on dedicated numbers or custom SIP trunks.
  * Intelligent routing rules (*Incoming Connections*): agent assignment, direct forwarding to human team members (*Call Forwarding*), or AI-powered voicemail.
  * Missed call recovery: automated SMS response (*Missed Call Auto-Text*).
* **Outbound Campaigns & Smart Dialer**:
  * Bulk CSV contact list imports with scheduled calling timeframes.
  * Concurrency-aware asynchronous dialer queue with daily caps and pacing.
  * Smart auto-retries for busy signals, voicemail detection, and unanswered calls.

#### 3. 📋 Post-Call AI Debriefing, Summaries & Lead Scoring
* **Instant Executive AI Summary (`summary`)**: Concise, actionable summary generated immediately after each call outlining customer needs and agreed next steps.
* **Full Audio & Word-for-Word Transcripts**: Browser audio playback and timestamped transcription.
* **Live Qualification**: Real-time *Hot / Warm / Cold / Unqualified* grading.
* **Sentiment Analysis**: Sentiment detection (*positive, neutral, negative*) and objection identification.
* **CRM & Pipeline Synchronization**: Automatic pipeline stage advancement and instant webhook dispatch (HubSpot, Salesforce, Pipedrive, Zapier, Make).

#### 4. 🔀 Visual Flow Builder (Flows)
* Node-based visual automation builder powered by React Flow (`@xyflow/react`).
* Event triggers: *Inbound call*, *Call completed*, *Lead qualified*, *Schedule*.
* Automated actions: send SMS/WhatsApp confirmations, recap emails, calendar scheduling, or live human transfer.

#### 5. 👥 Multi-Tenant Architecture & Super-Admin
* **Client Portal (`/app`)**: Manage agents, outbound campaigns, inbound connection rules, contacts, calendar appointments, web widgets, and team RBAC permissions.
* **Super-Admin Console (`/admin`)**:
  * Live call monitoring, SIP trunks oversight, and queue inspection.
  * Tenant management with 1-click customer impersonation.
  * Centralized provider credentials (Twilio, Plivo, ElevenLabs, OpenAI).
  * Subscription tiers, credit packages, and payment gateways (Stripe, PayPal, Paddle).
  * Customer KYC identity verification workflow.

---

### 💻 Technical Stack
* **Frontend**: Next.js 15.5 (App Router), React 19, Tailwind CSS, Lucide Icons, Recharts.
* **Backend**: Next.js API Routes, Server Actions, JWT (`jose`), AES payload encryption (`crypt.js`).
* **Database**: Prisma ORM with MySQL 8+ / MariaDB 10.4+ (85 relational tables).
* **Background Worker**: Node.js worker (`scripts/worker.mjs`) for dialer queuing and cron routines.

---

### ⚡ Quick Start Guide

#### Prerequisites
* Node.js 20 LTS or newer
* npm 10+
* MySQL 8.0+ or MariaDB 10.4+

#### Installation Steps

1. **Navigate to the application folder**:
   ```bash
   cd CallMineAI-NextJS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   *Set your MySQL `DATABASE_URL`, `AUTH_SECRET`, and `APP_KEY`.*

4. **Generate keys and push database schema**:
   ```bash
   npm run key:generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```
   *Access the web application at: `http://localhost:3000` (or `http://localhost:3002`).*

6. **Start the background dialer worker (in a second terminal)** :
   ```bash
   npm run worker
   ```

#### 🔑 Local accounts
Set `ADMIN_SEED_*` and, for local demo mode only, `CLIENT_SEED_*`. No public or fallback credentials are built into the SaaS.

---

### 📁 Repository Structure / Structure du Dépôt

```
CallMindAI/
├── CallMineAI-NextJS/        # Application Source Code (Next.js 15 + Prisma + Tailwind)
│   ├── prisma/               # Database Schema (schema.prisma) & Seeders
│   ├── scripts/              # Background Dialer Worker & Utilities
│   ├── src/
│   │   ├── app/              # Next.js App Router (Pages & API endpoints)
│   │   ├── components/       # Reusable UI & Marketing Components
│   │   ├── layouts/          # Marketing, Client, Admin & Auth Layouts
│   │   ├── lib/              # Core Services (Telephony, AI, Billing, Auth)
│   │   ├── locales/          # Multilingual Translations (FR, EN, AR, etc.)
│   │   └── views/            # Client, Admin & Marketing Views
│   └── package.json
├── ux-ui-21st-mcp/           # Frontend Powerpack & UI/UX Intelligence Engine
│   ├── skills/               # UI/UX Pro Max, 21st UI & Anti-Slop Skills
│   ├── src/ui-ux-pro-max/    # 240+ Design Styles, Palettes, Typography & Charts DB
│   └── scripts/search.mjs    # Instant Design Intelligence Search Engine
├── .agents/                  # Native Agent Workspace Skills & Rules for Antigravity & Codex
├── Documentation/            # Offline HTML Documentation (Open index.html in browser)
├── Licensing/                # Commercial & Open-Source Licenses
├── README.md                 # Project Overview & Setup (FR / EN)
└── README.txt                # Plain-text quick start guide (FR / EN)
```

---

### 📄 Propriété intellectuelle / Intellectual property
Le dépôt est privé. Les preuves d'acquisition et avis de tiers sont conservés séparément dans `Licensing/` pour la conformité et ne sont pas inclus dans les images de production.
