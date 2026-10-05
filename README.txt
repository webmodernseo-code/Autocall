================================================================================
  CallMindAI | AI Voice Calling SaaS With Lead Qualification & Sales Automation
  Plateforme SaaS d'Appels Vocaux IA & Qualification de Leads
  Version 1.0.1
================================================================================

--------------------------------------------------------------------------------
🇫🇷 GUIDE EN FRANÇAIS
--------------------------------------------------------------------------------

FONCTIONNALITÉS MAJEURES :
  - Conversations autonomes et fluides en temps réel (OpenAI & ElevenLabs).
  - Appels Sortants (campagnes de masse, dialer asynchrone, gestion des relances).
  - Appels Entrants 24/7 (routage intelligent, transfert d'appel humain, boîte vocale IA).
  - Débriefing post-appel : résumé exécutif IA, transcription mot à mot, scoring (Hot/Warm/Cold).
  - Constructeur de flux (Flows) pour automatiser SMS, WhatsApp, emails et webhooks CRM.

CONTENU DU PACKAGE :
  CallMineAI-NextJS/    Code source de l'application Next.js (prêt à déployer).
  Documentation/        Documentation complète consultable hors-ligne (index.html).
  Licensing/            Licences logicielles et licences tierces.
  README.md             Documentation bilingue complète avec instructions détaillées.

PRÉREQUIS SERVEUR :
  - Node.js 20 LTS ou supérieur, npm 10+, MySQL 8 ou MariaDB 10.4+.
  - Serveur autorisant les processus d'arrière-plan persistants (VPS, Dédié, Docker).
  - Un worker d'appels (npm run worker) gère le dialer en continu via PM2 ou systemd.

INSTALLATION RAPIDE :
  1. cd CallMineAI-NextJS
  2. npm install
  3. cp .env.example .env
     (Renseignez DATABASE_URL, AUTH_SECRET et APP_KEY dans votre fichier .env)
  4. npm run key:generate
  5. npx prisma db push
  6. npm run db:seed
  7. npm run dev        (ou npm run build && npm start)

  Dans un second terminal, démarrez le composeur d'appels :
  8. npm run worker

COMPTES LOCAUX :
  Définir ADMIN_SEED_* et, seulement en mode démo local, CLIENT_SEED_*.
  Aucun identifiant public ou de secours n'est intégré au SaaS.


--------------------------------------------------------------------------------
🇬🇧 ENGLISH GUIDE
--------------------------------------------------------------------------------

KEY CAPABILITIES:
  - 100% autonomous bidirectional voice conversations in real time (OpenAI & ElevenLabs).
  - Outbound Campaigns (bulk calling dialer, pacing regulation, smart auto-retries).
  - Inbound Calls 24/7 (AI receptionist, human call forwarding, AI-transcribed voicemail).
  - Post-call AI debriefing: executive summaries, full transcripts, and lead scoring (Hot/Warm/Cold).
  - Visual Flow Builder to automate follow-up SMS, WhatsApp, emails, and CRM webhooks.

PACKAGE CONTENTS:
  CallMineAI-NextJS/    Next.js application source code (ready to deploy).
  Documentation/        Complete offline documentation (open index.html in browser).
  Licensing/            Item license and third-party open-source licenses.
  README.md             Comprehensive bilingual documentation and architecture guide.

SERVER REQUIREMENTS:
  - Node.js 20 LTS or newer, npm 10+, MySQL 8 / MariaDB 10.4+.
  - Host allowing long-running background processes (VPS, Dedicated Server, Docker).
  - The dialer runs in a background worker (npm run worker) kept alive by PM2 or systemd.

QUICK INSTALLATION:
  1. cd CallMineAI-NextJS
  2. npm install
  3. cp .env.example .env
     (Edit .env with your DATABASE_URL, AUTH_SECRET, and APP_KEY)
  4. npm run key:generate
  5. npx prisma db push
  6. npm run db:seed
  7. npm run dev        (or npm run build && npm start)

  In a second terminal, start the dialer worker:
  8. npm run worker

LOCAL ACCOUNTS:
  Set ADMIN_SEED_* and, for local demo mode only, CLIENT_SEED_*.
  No public or fallback credentials are built into the SaaS.

================================================================================
