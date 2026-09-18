================================================================================
  CallMineAI | AI Voice Calling SaaS With Lead Qualification and Sales Automation
  Version 1.0.1
================================================================================

Thank you for purchasing CallMineAI.


WHAT IS IN THIS PACKAGE
--------------------------------------------------------------------------------

  CallMineAI-NextJS/     The application source code. This is what you deploy.
  Documentation/         Full documentation. Open index.html in any browser.
                         Works offline — no internet connection required.
  Licensing/             Item license and third-party open-source licenses.


START HERE
--------------------------------------------------------------------------------

  1. Open  Documentation/index.html  in your browser.
  2. Read  "Installation"  then  "Configuration".
  3. Deploy from the  CallMineAI-NextJS/  folder.


SERVER REQUIREMENTS
--------------------------------------------------------------------------------

  Node.js 20 LTS or newer, npm 10+, MySQL 8 / MariaDB 10.4+.

  IMPORTANT — your host must allow LONG-RUNNING BACKGROUND PROCESSES.
  The dialer runs in a background worker that has to stay alive (npm run
  worker), kept running by PM2, systemd or Supervisor.

    Works:      a VPS, a dedicated server, or any container host where you can
                keep a process running.
    Does not:   shared hosting that kills background processes, and pure
                serverless hosting with no always-on process.

  You may host the web tier serverlessly only if the worker runs somewhere
  else, or an external per-minute cron calls the /api/cron/* endpoints.
  Without one of those, campaigns queue calls and nothing ever dials.

  A public HTTPS URL is required for the telephony webhooks.
  1 GB RAM minimum; 2 GB+ once campaigns run concurrently.


QUICK INSTALL
--------------------------------------------------------------------------------

    cd CallMineAI-NextJS
    npm install
    cp .env.example .env

    # Edit .env — at minimum:
    #   DATABASE_URL   mysql://user:pass@host:3306/dbname
    #   AUTH_SECRET    a random string of at least 32 characters
    #   APP_URL        the public URL of your installation

    npm run key:generate      # REQUIRED — writes APP_KEY into .env.
                              # Without it no provider credential can be saved.
                              # (db:seed also does this if you skip it.)

    npx prisma db push        # create the schema
    npm run db:seed           # reference data + admin/demo accounts

    npm run build
    npm start                 # http://localhost:3000

  In a second terminal, start the dialer (required for calling):

    npm run worker

  Default logins are created by the seed step with the password 12345678.
  The addresses come from ADMIN_SEED_EMAIL and CLIENT_SEED_EMAIL in .env.

    Admin back-office   /admin
    Customer panel      /app

  CHANGE BOTH PASSWORDS IMMEDIATELY AFTER THE FIRST LOGIN.


THIRD-PARTY ACCOUNTS
--------------------------------------------------------------------------------

  The calling features need your own accounts with Twilio (or a SIP trunk),
  ElevenLabs and OpenAI. Payment gateways (Stripe / PayPal / Paddle) are
  optional and are configured from the admin panel. No provider account, API
  key or calling credit is included with this item.


LICENSE
--------------------------------------------------------------------------------

  The Regular License and the Extended License include this same download: the
  complete, un-encrypted source code and the identical feature set. No module,
  file or capability is withheld from either one. They differ only in how you
  may use the end product you build — Regular for an end product that is free
  to its end users, Extended for one you charge them for. See
  Licensing/LICENSE.txt.


SUPPORT
--------------------------------------------------------------------------------

  Item support covers installation help, bug fixes and questions about the
  documented features, per the Envato item support policy. When reporting an
  issue, please include your purchase code, the page or endpoint involved, and
  any server log output.


CHANGELOG
--------------------------------------------------------------------------------

  1.0.1  Security and documentation release.
         - Team permissions now fail closed: a member with no assigned role
           holds no permissions instead of full access. Both screens that
           create a customer user always attach a role (Viewer by default).
         - Every customer-side write endpoint is now covered by team RBAC.
         - APP_KEY is required and generated on install (npm run key:generate);
           the in-call agent's callback tokens are never signed with an empty
           key, and provider credentials save correctly on a fresh install.
         - Google sign-in is fully implemented: ID tokens are verified
           server-side against Google's published signing keys.
         - SMTP now validates TLS certificates by default.
         - All dependency advisories cleared (npm audit: 0 vulnerabilities).
         - New documentation: Branding & styling, Email templates; expanded
           server requirements and licensing sections.

  1.0.0  Initial release.

================================================================================
