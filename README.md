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
**CallMindAI** est une plateforme SaaS tout-en-un de prospection et de qualification d'appels téléphoniques par Intelligence Artificielle. Elle permet aux entreprises et aux agences de déployer des agents vocaux intelligents capables d'émettre des appels sortants à grande échelle, de tenir des conversations humaines et fluides, de qualifier les prospects (*Chaud / Tiède / Froid*) en temps réel et de synchroniser les résultats avec leur CRM.

Le projet est entièrement **auto-hébergé**, prêt pour la commercialisation en **marque blanche (white-label)** et dispose d'une architecture **multi-tenant** avec facturation intégrée.

---

### 🚀 Fonctionnalités Clés

#### 1. 🤖 Agents Vocaux IA
* **Voix ultra-réalistes** : Intégration d'ElevenLabs et OpenAI avec gestion des intonations, émotions et accents.
* **Personnalisation complète** : Nom, persona, script d'ouverture, consignes système et température.
* **Base de connaissances (RAG)** : Chargement de documents d'entreprise pour ancrer les réponses de l'agent.
* **Support multilingue** : 29 langues prises en charge avec détection automatique.

#### 2. 📞 Campagnes d'Appels & Dialer Asynchrone
* **Campagnes de masse** : Import de listes de contacts via fichier CSV.
* **Composeur intelligent (Dialer)** : Régulation automatique de la concurrence, gestion des créneaux horaires et des quotas journaliers.
* **Relances automatiques** : Reprogrammation des numéros occupés ou sans réponse.
* **Enregistrements & Transcriptions** : Retranscription mot à mot par IA et synthèse exploitable de chaque appel.

#### 3. 🎯 Scoring & Intelligence Commerciale
* **Qualification en direct** : Classification immédiate du prospect (*Hot, Warm, Cold*).
* **Analyse de sentiment** : Évaluation du niveau d'intérêt et détection des objections.
* **Synchronisation CRM** : Envoi instantané vers HubSpot, Salesforce, Pipedrive ou n'importe quel webhook.

#### 4. 🔀 Constructeur Visuel de Flux (Flows)
* Scénarios automatisés par nœuds connectés (React Flow / `@xyflow/react`).
* Déclencheurs basés sur l'issue de l'appel : envoi de SMS/WhatsApp, confirmation par e-mail, prise de rendez-vous ou transfert humain.

#### 5. 👥 Espace Multi-Tenant & Super-Admin
* **Portail Client (`/app`)** : Gestion des agents, campagnes, contacts, rendez-vous, widget web et équipe (RBAC).
* **Console Super-Admin (`/admin`)** :
  * Supervision en direct des appels et files d'attente.
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

#### 🔑 Comptes de Démonstration (par défaut)
* **Portail Client (`/app`)** : `client@spagreen.net` / `12345678`
* **Super-Admin (`/admin`)** : `admin@spagreen.net` / `12345678`

---

<a name="-english-version"></a>
## 🇬🇧 English Version

### 🌟 Overview
**CallMindAI** is an all-in-one AI Voice Calling & Lead Qualification SaaS platform. It enables businesses and agencies to deploy intelligent voice agents capable of placing outbound phone calls at scale, holding natural human-like conversations, qualifying leads (*Hot / Warm / Cold*) in real time, and syncing results directly to their CRM.

The codebase is **100% self-hosted**, white-label ready, and engineered with a robust **multi-tenant** architecture and built-in billing.

---

### 🚀 Key Features

#### 1. 🤖 AI Voice Agents
* **Ultra-Realistic Voices**: ElevenLabs and OpenAI integration with fine-tuned emotion, accent, and tone control.
* **Full Customization**: Name, persona, opening line, system instructions, and temperature.
* **Knowledge Base (RAG)**: Ground agent responses with company documents and FAQs.
* **Multilingual Calling**: 29 supported languages with native regional accents.

#### 2. 📞 Outbound Campaigns & Dialer Worker
* **Bulk Campaigns**: CSV contact list import and scheduled calling windows.
* **Smart Dialer**: Concurrency-aware queue processing with daily caps and pacing.
* **Auto-Retries**: Automatic rescheduling for busy signals and missed calls.
* **Audio & Transcripts**: Full call audio recording, AI transcription, and key takeaways.

#### 3. 🎯 Lead Intelligence & Scoring
* **Live Qualification**: Real-time *Hot / Warm / Cold* grading.
* **Sentiment Analysis**: Sentiment detection and objection logging.
* **CRM Integration**: Instant sync to HubSpot, Salesforce, Pipedrive, or webhooks.

#### 4. 🔀 Visual Flow Builder
* Node-based visual automation builder powered by React Flow (`@xyflow/react`).
* Outcome-based triggers: send SMS/WhatsApp, email confirmations, calendar bookings, or live agent transfers.

#### 5. 👥 Multi-Tenant Architecture & Super-Admin
* **Client Portal (`/app`)**: Manage agents, campaigns, contacts, calendar appointments, web widgets, and team RBAC permissions.
* **Super-Admin Console (`/admin`)**:
  * Live call monitoring and queue inspection.
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

#### 🔑 Default Demo Accounts
* **Customer Portal (`/app`)**: `client@spagreen.net` / `12345678`
* **Super-Admin Console (`/admin`)**: `admin@spagreen.net` / `12345678`

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
├── Documentation/            # Offline HTML Documentation (Open index.html in browser)
├── Licensing/                # Commercial & Open-Source Licenses
├── README.md                 # Project Overview & Setup (FR / EN)
└── README.txt                # Plain-text quick start guide (FR / EN)
```

---

### 📄 License / Licence
Distributed under commercial license terms. See [Licensing/LICENSE.txt](Licensing/LICENSE.txt) for details.
