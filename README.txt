================================================================================
  CallMindAI | AI Voice Calling SaaS With Lead Qualification & Sales Automation
  Plateforme SaaS d'Appels Vocaux IA & Qualification de Leads
  Version 1.0.1
================================================================================

--------------------------------------------------------------------------------
🇫🇷 GUIDE EN FRANÇAIS
--------------------------------------------------------------------------------

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

COMPTES DE DÉMONSTRATION (Mot de passe initial : 12345678) :
  - Espace Client :      http://localhost:3000/app    (client@spagreen.net)
  - Console Super-Admin: http://localhost:3000/admin  (admin@spagreen.net)


--------------------------------------------------------------------------------
🇬🇧 ENGLISH GUIDE
--------------------------------------------------------------------------------

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

DEFAULT LOGINS (Default password: 12345678):
  - Customer Panel:     http://localhost:3000/app    (client@spagreen.net)
  - Admin Back-Office:  http://localhost:3000/admin  (admin@spagreen.net)

================================================================================
