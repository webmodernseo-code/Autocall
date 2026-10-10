# AutoCall — Next.js Application

> 🌐 **Navigation / Langue** :  
> 🇫🇷 [Version Française](#-version-française) | 🇬🇧 [English Version](#-english-version)

---

<a name="-version-française"></a>
## 🇫🇷 Version Française

### ⚡ Démarrage Rapide

```bash
# 1. Accédez au répertoire
cd AutoCall-NextJS

# 2. Configurez le fichier .env (DATABASE_URL, AUTH_SECRET, APP_KEY)
cp .env.example .env

# 3. Installez les dépendances
npm install

# 4. Générez le client Prisma et initialisez les données
npx prisma generate
npm run key:generate
npx prisma db push
npm run db:seed

# 5. Démarrez le serveur de développement
npm run dev

# 6. Dans un second terminal, démarrez le dialer d'appels
npm run worker
```

### 🔑 Identifiants locaux
Les comptes sont créés par le seed à partir des variables `ADMIN_SEED_*` et, uniquement si le mode démo local est activé, `CLIENT_SEED_*`. Aucun identifiant public ne fonctionne comme accès de secours.

### 🛠️ Commandes Disponibles

| Commande | Action |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement local |
| `npm run build` | Génère le schéma Prisma et compile le bundle de production |
| `npm start` | Lance le serveur de production compilé |
| `npm run worker` | Exécute le composeur d'appels et les tâches planifiées |
| `npm run db:push` | Applique le schéma Prisma à la base MySQL |
| `npm run db:seed` | Remplit la base avec les données de démonstration et rôles |
| `npm run key:generate` | Génère la clé de chiffrement `APP_KEY` dans `.env` |

---

<a name="-english-version"></a>
## 🇬🇧 English Version

### ⚡ Quick Start

```bash
# 1. Navigate to directory
cd AutoCall-NextJS

# 2. Setup your .env file (DATABASE_URL, AUTH_SECRET, APP_KEY)
cp .env.example .env

# 3. Install packages
npm install

# 4. Generate Prisma client & seed demo data
npx prisma generate
npm run key:generate
npx prisma db push
npm run db:seed

# 5. Start dev server
npm run dev

# 6. In a second terminal, start the calling dialer
npm run worker
```

### 🔑 Local credentials
Seeded accounts use the `ADMIN_SEED_*` variables and, only when local demo mode is enabled, `CLIENT_SEED_*`. There are no public fallback credentials.

### 🛠️ Available Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Starts local Next.js development server |
| `npm run build` | Runs `prisma generate` and builds production bundle |
| `npm start` | Starts the production server |
| `npm run worker` | Runs background dialer worker & scheduled tasks |
| `npm run db:push` | Pushes Prisma schema to the database |
| `npm run db:seed` | Seeds roles, permissions, plans, and demo accounts |
| `npm run key:generate` | Generates encryption `APP_KEY` into `.env` |

---

### 📂 Architecture & Routing
* **App Router**: `src/app/` (pages and `/api` REST endpoints)
* **Views**: `src/views/` (frontend, client panel, super-admin views)
* **Components**: `src/components/` & `src/layouts/`
* **Services**: `src/lib/services/` (telephony, voice, billing, AI, CRM)
* **Translations**: `src/locales/` (FR, EN, AR, etc.)
