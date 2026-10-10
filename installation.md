# Mise en production et commercialisation de AutoCall

> Guide d'installation, d'exploitation et de lancement commercial  
> Cible initiale : `https://autocall.webmodernseo.co`  
> Application : `AutoCall-NextJS` — Next.js 16.3.8, React 19.3, Prisma 6 et MySQL  
> Version du guide : 1.0 — 4 octobre 2026

## 1. Objet du document

Ce document décrit le chemin réaliste pour transformer le dépôt actuel en SaaS exploitable et commercialisable. Il couvre l'infrastructure, le déploiement, la base de données, le worker, les fournisseurs externes, les paiements, la sécurité, la conformité, les sauvegardes, la supervision, le support et le futur changement de marque.

Il ne faut pas confondre « l'interface contient une fonctionnalité » et « la fonctionnalité est prête à être vendue ». Une mise sur le marché n'est autorisée qu'après validation de la checklist Go/No-Go de la section 22.

## 2. État constaté du dépôt

Le produit contient déjà les fondations suivantes :

- application Next.js avec App Router ;
- comptes client et super-administrateur ;
- séparation des clients et gestion d'équipe/RBAC ;
- agents vocaux, campagnes, contacts, appels et file d'appels ;
- Twilio et Plivo pour la téléphonie ;
- ElevenLabs et OpenAI pour la voix et l'IA ;
- WhatsApp Cloud/Whatsway et SMTP ;
- plans, abonnements, crédits et plusieurs passerelles de paiement ;
- API v1, clés API et webhooks ;
- KYC, journal d'audit, support, CRM et base de connaissances ;
- worker `scripts/worker.mjs` pour les tâches planifiées.

### Blocages avant production

1. **Droits commerciaux du code d'origine** : conserver hors publication la facture, la preuve d'achat et les conditions applicables. Ne jamais publier un code d'achat, une facture ou les fichiers de conformité dans l'image Docker. Ne pas revendre le code source ou le thème ; le produit commercialisé est le service SaaS personnalisé.
2. **Migrations initialisées le 4 octobre 2026** : la migration de référence est versionnée dans `prisma/migrations/20261004000000_initial_schema/`. La base TiDB existante a été comparée sans dérive puis baselinée avec succès. Le workflow se trouve dans `prisma/MIGRATIONS.md`. Il reste à confirmer l'application sur une base staging vide via la CI.
3. **Identifiants de démonstration corrigés** : les valeurs faibles ou absentes sont désormais refusées en staging/production et cette politique est couverte par sept tests automatisés.
4. **Build certifié localement** : le build de production Next.js 16.3.8 avec Turbopack a réussi intégralement le 4 octobre 2026. La certification GitHub Actions reste requise avant lancement.
5. **Artefacts de déploiement implémentés** : Docker, Compose et les workflows staging/production sont présents. Leur exécution réelle attend la configuration du VPS, de GHCR et des secrets GitHub.
6. **Validation fonctionnelle nécessaire** : toutes les intégrations doivent être testées en sandbox puis en production avec des webhooks réels, des reprises sur erreur et des tests d'isolation entre clients.

### Registre des travaux restant à reprendre

Ces éléments restent volontairement **ouverts** et devront être traités avant la
commercialisation. Ne pas les retirer de la checklist sans preuve de validation :

| Sujet | État | Condition de clôture |
|---|---|---|
| Accès TiDB Cloud et baseline Prisma | Résolu le 4 octobre 2026 | Port 4000 joignable, aucune dérive détectée, migration initiale enregistrée et base déclarée à jour par Prisma |
| Identifiants de seed par défaut | Corrigé le 4 octobre 2026 | Valeurs faibles refusées hors développement local, client démo interdit en staging/production et politique couverte par tests automatisés |
| Build de production | Certifié localement le 4 octobre 2026 | Build Next.js complet réussi : compilation, types, collecte, 105 pages et traces ; confirmation GitHub Actions attendue au prochain push |
| Cycle de mise à jour des dépendances | Automatisé le 4 octobre 2026 | Dependabot vérifie tout npm chaque semaine ; les correctifs sont fusionnés après CI verte, les évolutions mineures/majeures restent soumises à revue et staging |
| Régionalisation | Implémentée le 4 octobre 2026 | Français principal, anglais secondaire ; EUR, USD et XOF ; détection Cloudflare/pays avec repli navigateur et choix manuel prioritaire |
| Docker de production | Implémenté, confirmation CI attendue | Dockerfile multi-stage non-root, web/worker/migration, filesystem protégé, healthcheck et smoke test automatisé ajoutés ; Docker Engine indisponible sur le poste local |
| Pipeline de déploiement | Implémenté, configuration serveur attendue | Staging automatique après CI verte, images GHCR immuables, migrations uniques, healthcheck, rollback applicatif et production manuelle protégée sont définis ; secrets GitHub et VPS restent à configurer |

Chaque clôture devra indiquer la date, le commit concerné et la preuve obtenue
(journal CI, résultat de test, image Docker ou sortie Prisma).

## 3. Architecture recommandée

Pour un premier lancement commercial, privilégier une architecture simple, réversible et observable :

```text
Internet
   |
Cloudflare (DNS, WAF, anti-DDoS, TLS)
   |
Caddy ou Traefik (reverse proxy, limite des requêtes)
   |---------------------------|
Next.js web (port 3000)        Worker Node.js (1 instance)
   |---------------------------|
          MySQL 8.4 géré
                |
     sauvegardes chiffrées hors site

Services externes : Stripe, Twilio/Plivo, ElevenLabs, OpenAI,
Meta WhatsApp, SMTP transactionnel, Sentry et moniteur d'uptime.
```

### Choix d'hébergement

**Recommandation de départ :** un VPS européen chez OVHcloud, Scaleway ou Hetzner, piloté avec Coolify, plus une base MySQL gérée lorsqu'elle est disponible. Une alternative plus managée est Railway/Render pour l'application et le worker, avec un MySQL managé distinct.

Le worker permanent, les webhooks téléphoniques et les traitements longs rendent une plateforme Node persistante plus simple à exploiter qu'un déploiement uniquement serverless. Next.js recommande un reverse proxy devant le serveur auto-hébergé. Le mode `output: 'standalone'` permet de produire une image plus petite ([documentation Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)).

### Dimensionnement initial

- application : 2 à 4 vCPU, 4 à 8 Go RAM, 40 Go SSD ;
- base : MySQL 8.4 LTS, 2 vCPU, 4 Go RAM au minimum ;
- une instance web et une instance worker ;
- stockage objet S3 compatible pour les documents et enregistrements avant montée en charge ;
- région UE si la clientèle et les personnes appelées sont principalement européennes.

Mesurer avant d'augmenter. La valeur `CALL_DIALER_CONCURRENCY=60` est trop agressive pour un lancement sans tests de charge et sans limites fournisseurs confirmées. Commencer entre 2 et 5.

## 4. Comptes et prérequis

Oui, **TiDB Cloud fait partie de l'installation** : il héberge la base MySQL compatible utilisée par Prisma. Créer tous les comptes au nom juridique de l'entreprise, utiliser une adresse telle que `ops@votre-domaine.tld`, activer le MFA, ajouter un second administrateur de secours et stocker les codes de récupération dans un gestionnaire de mots de passe.

### 4.1 Ordre conseillé et prix de référence

Prix consultés le **5 octobre 2026**, hors taxes et susceptibles d'évoluer. Toujours ouvrir le lien officiel avant souscription.

| Ordre | Compte | Statut au lancement | Prix indicatif | Usage dans ce projet |
|---:|---|---|---|---|
| 1 | GitHub privé | Obligatoire | Free : 0 USD, 2 000 minutes Actions/mois ; Team : 4 USD/utilisateur/mois | dépôt, CI, Dependabot, images et déploiement ([tarifs](https://github.com/pricing)) |
| 2 | Cloudflare | Obligatoire | Free : 0 USD ; Pro : 20 USD/mois annuel ou 25 USD mensuel | DNS, TLS, proxy, protection DDoS ([tarifs](https://www.cloudflare.com/plans/)) |
| 3 | VPS Ubuntu | Obligatoire | généralement 8 à 25 EUR/mois pour 4 vCPU, 8 Go RAM au démarrage | conteneurs web et worker ; comparer OVHcloud, Scaleway et Hetzner |
| 4 | Coolify | Recommandé | auto-hébergé : 0 USD ; Cloud : 5 USD/mois pour 2 serveurs, puis 3 USD/serveur | déploiement et secrets ([tarifs](https://www.coolify.io/pricing)) |
| 5 | TiDB Cloud Starter | Obligatoire | 0 USD dans le quota ; puis 0,10 USD/million RU et 0,20 USD/Gio supplémentaire | base de production et de staging ([tarifs](https://www.pingcap.com/pricing/)) |
| 6 | Brevo SMTP | Obligatoire | Free : 300 e-mails/jour ; Starter dès 7 EUR/mois | vérification, mots de passe, factures, alertes ([tarifs](https://help.brevo.com/hc/fr/articles/208589409)) |
| 7 | Stripe | Obligatoire pour vendre | sans abonnement ; 1,5 % + 0,25 EUR/carte EEE standard | abonnements EUR, USD et moyens locaux disponibles ([tarifs](https://stripe.com/fr/pricing)) |
| 8 | Twilio **ou** Plivo | Obligatoire pour les appels | à l'usage ; exemple Twilio France : 0,0187 USD/min fixe, 0,0404 USD/min mobile depuis l'EEE, numéro local 1,35 USD/mois | téléphonie et webhooks ([tarifs France](https://www.twilio.com/fr-fr/voice/pricing/fr)) |
| 9 | ElevenLabs | Obligatoire pour le moteur recommandé | Free/PAYG ; Flash/Turbo 0,05 USD/1 000 caractères ; Speech Engine 0,08 USD/min | synthèse vocale et voix ([tarifs API](https://elevenlabs.io/pricing/api)) |
| 10 | OpenAI API | Obligatoire pour les agents | paiement à l'usage, variable selon le modèle | conversation et analyse ; contrôler le modèle choisi sur la [page officielle](https://developers.openai.com/api/docs/pricing) |
| 11 | Better Stack | Fortement recommandé | Free : 10 moniteurs/heartbeats, 3 Go de logs ; offres payantes à l'usage | uptime, worker, logs et alertes ([tarifs](https://betterstack.com/pricing)) |
| 12 | Cloudflare R2/S3 | Recommandé avant enregistrements réels | R2 : 10 Go-mois gratuits puis 0,015 USD/Go-mois | fichiers, exports et sauvegardes ([tarifs](https://www.cloudflare.com/plans/)) |
| 13 | Meta Business/WhatsApp | Optionnel | facturation variable par modèle, catégorie et pays | canal WhatsApp ; activer après la voix et le paiement |
| 14 | PayPal ou Paddle | Optionnel | PayPal FR : 2,9 % + 0,35 EUR ; Paddle : 5 % + 0,50 USD | seconde passerelle ; Paddle agit comme Merchant of Record ([PayPal](https://www.paypal.com/fr/business/fees), [Paddle](https://www.paddle.com/pricing)) |

Ne pas ouvrir Plivo si Twilio est retenu, ni PayPal/Paddle tant que Stripe n'est pas certifié. `WhatsWay` est une alternative non indispensable et ne doit être activée qu'après validation de son contrat, de son DPA et de ses tarifs.

### 4.2 GitHub : code, CI et déploiement

1. Créer une organisation GitHub et un dépôt **privé** ; ne jamais publier ce dépôt.
2. Activer MFA, Dependabot et les protections de branche sur `main`.
3. Pousser le dépôt, puis ouvrir `Settings > Secrets and variables > Actions`.
4. Créer les secrets attendus par `.github/workflows/release-staging.yml` et `deploy-production.yml` en recopiant exactement leurs noms depuis les fichiers YAML.
5. Dans `Actions`, lancer `CI`, vérifier le build, puis lancer staging. La production ne doit partir qu'après validation du staging.
6. Fixer un budget Actions et une alerte à 75 % et 90 %.

### 4.3 Cloudflare : DNS du sous-domaine temporaire

1. Ajouter `webmodernseo.co` à Cloudflare et conserver les serveurs DNS fournis.
2. Dans `DNS`, créer un enregistrement `A` nommé `autocall` vers l'IPv4 du VPS ; activer le proxy orange.
3. Créer `staging-autocall` vers le serveur de staging.
4. Dans `SSL/TLS`, choisir `Full (strict)` après émission du certificat d'origine par Coolify.
5. Ne jamais mettre en cache `/api/*`, `/webhooks/*`, `/admin/*` ni `/app/*`.
6. Vérifier que `https://autocall.webmodernseo.co` répond avant de connecter les webhooks.

### 4.4 TiDB Cloud : base de données

1. Créer l'organisation TiDB Cloud et deux projets ou instances séparés : `autocall-staging` et `autocall-production`.
2. Choisir **Starter** au début, une région européenne proche du VPS, puis définir un plafond de dépenses et des alertes.
3. Ouvrir l'instance — cela signifie simplement **cliquer sur son nom dans la console TiDB Cloud** — puis `Connect`.
4. Créer un utilisateur SQL propre à chaque environnement avec un mot de passe généré ; ne pas employer `root` dans l'application.
5. Dans `Networking/Security`, autoriser uniquement l'IP publique fixe du VPS sur le port `4000`. L'IP du poste local peut être ajoutée temporairement puis supprimée.
6. Copier la chaîne Prisma fournie et ajouter les paramètres TLS indiqués par TiDB :

```dotenv
DATABASE_URL="mysql://UTILISATEUR:MOT_DE_PASSE@HOTE:4000/NOM_BASE?sslaccept=strict"
```

7. En staging, exécuter `npm run db:migrate`, puis `npm run db:seed`. En production, exécuter uniquement `npm run db:migrate` dans l'étape release, puis le seed initial avec les identifiants administrateur définitifs.
8. Contrôler `npm run db:migrate:status`, la page Usage, le plafond et la restauration d'une sauvegarde.

Le quota Starter officiel comprend jusqu'à 5 Gio de données ligne, 5 Gio colonnaire et 50 millions de RU par instance gratuite ; la page commerciale agrège jusqu'à cinq instances par organisation. Une instance gratuite peut refuser de nouvelles connexions lorsqu'elle atteint son quota : ne pas lancer une production payante sans plafond, alertes et procédure de montée en gamme ([documentation TiDB](https://docs.pingcap.com/tidbcloud/serverless-faqs/?plan=starter)).

### 4.5 VPS et Coolify

1. Louer un VPS Ubuntu LTS avec IPv4 fixe ; démarrer à 4 vCPU, 8 Go RAM et 80 Go SSD.
2. Ajouter une clé SSH, désactiver la connexion SSH par mot de passe, activer le pare-feu et les mises à jour de sécurité.
3. Installer Coolify auto-hébergé ou relier le VPS à Coolify Cloud.
4. Connecter le dépôt GitHub privé, sélectionner le `Dockerfile`, créer deux ressources distinctes `web` et `worker`.
5. Coller les variables de `.env.example` dans le coffre de secrets, jamais dans Git.
6. Exposer seulement le service web ; le worker n'a aucun port public.
7. Configurer healthcheck, redémarrage automatique, limites mémoire, sauvegardes et rollback vers l'image précédente.

### 4.6 Brevo SMTP

1. Créer un compte Brevo, ajouter et authentifier le domaine d'envoi.
2. Publier dans Cloudflare les enregistrements SPF, DKIM et DMARC fournis.
3. Créer une clé SMTP dédiée à la production ; ne pas utiliser le mot de passe du compte.
4. Renseigner `MAIL_HOST`, `MAIL_PORT=587`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION=tls`, `MAIL_FROM_ADDRESS` et `MAIL_FROM_NAME`.
5. Envoyer un test vers Gmail et Outlook, puis vérifier SPF, DKIM, DMARC, lien de désinscription lorsque requis, bounces et plaintes.

### 4.7 Stripe

1. Créer et vérifier le compte entreprise Stripe ; commencer en mode test.
2. Créer les produits/prix récurrents en EUR. Pour USD/XOF, vérifier les devises réellement acceptées par le compte et la banque de règlement ; l'affichage régional ne garantit pas qu'une passerelle accepte XOF.
3. Créer le webhook `https://autocall.webmodernseo.co/webhooks/stripe` et sélectionner les événements d'abonnement, facture et paiement utilisés par l'application.
4. Copier la clé secrète et le secret de signature : `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, puis activer `BILLING_STRIPE_ENABLED=true`.
5. Tester succès, refus, 3-D Secure, renouvellement, annulation, remboursement et rejeu de webhook.
6. Refaire l'étape avec les clés live seulement après validation et ne jamais mélanger test/live.

### 4.8 Twilio, ElevenLabs et OpenAI

1. **Twilio** : vérifier l'entreprise, acheter un numéro autorisé pour l'usage visé, récupérer `Account SID` et un API Key/token dédié. Renseigner les variables `TWILIO_*`, puis les URLs `/webhooks/twilio/voice`, `/gather`, `/status` et `/recording` en HTTPS. Appliquer plafonds pays/coûts et respecter les règles locales d'appels automatisés.
2. **ElevenLabs** : créer une clé restreinte, la saisir dans `/admin/elevenlabs-keys`, lancer le health check puis synchroniser les voix. Commencer avec une concurrence de 2 ou 3, jamais 30 sans validation du forfait.
3. **OpenAI** : créer un projet API dédié production, une clé de service et un budget mensuel avec alertes. Renseigner `OPENAI_API_KEY` et un modèle actuellement disponible, puis tester latence, limites et coût. Un abonnement ChatGPT ne paie pas l'API.
4. Effectuer un appel réel court, vérifier le transcript, les webhooks, le débit de crédits et le coût cumulé des trois fournisseurs.

### 4.9 Monitoring, stockage et comptes optionnels

1. Dans Better Stack, créer un moniteur HTTPS sur `/`, un heartbeat pour le worker et des alertes e-mail/SMS. Ne jamais envoyer de transcript, numéro complet ou secret dans les logs.
2. Créer un bucket R2/S3 privé séparé pour production, activer chiffrement, versioning/rétention et clés limitées au bucket. Tester restauration et expiration automatique des enregistrements.
3. Pour Meta WhatsApp, vérifier Meta Business, créer l'application, ajouter WhatsApp, configurer `https://autocall.webmodernseo.co/webhooks/whatsapp/meta`, le token de vérification et le secret, puis faire approuver les modèles.
4. PayPal ou Paddle ne doivent être ajoutés qu'en second temps, avec leur propre webhook `/webhooks/paypal` ou `/webhooks/paddle` et des tests sandbox complets.

### 4.10 Registre des comptes

Tenir un tableau privé : fournisseur, propriétaire légal, administrateurs, MFA, e-mail de facturation, environnement, quatre derniers caractères de la clé, date de rotation, plafond, DPA, région des données et procédure de fermeture. Ne jamais y copier la clé complète.

## 5. Préparer les environnements

Maintenir trois environnements isolés :

| Environnement | Domaine conseillé | Données | Paiements |
|---|---|---|---|
| Local | `localhost:3000` | fictives | sandbox |
| Staging | `staging-autocall.webmodernseo.co` | fictives/anonymisées | sandbox |
| Production | `autocall.webmodernseo.co` | réelles | live |

Chaque environnement doit avoir sa propre base, ses secrets, ses clés API, ses webhooks et, idéalement, ses sous-comptes téléphoniques. Ne jamais copier la base de production vers un poste local sans anonymisation.

## 6. DNS initial

Dans Cloudflare :

1. créer un enregistrement `A` pour `autocall.webmodernseo.co` vers l'IPv4 publique du serveur ;
2. créer `staging-autocall.webmodernseo.co` vers le staging ;
3. activer le proxy Cloudflare après validation directe du certificat ;
4. utiliser le mode TLS **Full (strict)** ;
5. activer HSTS seulement après confirmation que tous les sous-domaines concernés fonctionnent en HTTPS ;
6. limiter l'accès au staging par Cloudflare Access ou une authentification équivalente.

Valeurs publiques de production :

```dotenv
APP_NAME="AutoCall"
APP_URL="https://autocall.webmodernseo.co"
NEXT_PUBLIC_APP_NAME="AutoCall"
NEXT_PUBLIC_APP_URL="https://autocall.webmodernseo.co"
APP_ENV="production"
APP_DEBUG="false"
APP_DEMO_MODE="false"
APP_INSTALLED="true"
APP_LOCALE="fr"
APP_FALLBACK_LOCALE="en"
```

L'URL doit être identique dans l'application, les fournisseurs OAuth, les webhooks, Stripe, Twilio, Plivo, Meta et les e-mails.

## 7. Préparer le serveur Ubuntu

Utiliser une version Ubuntu LTS maintenue. Créer un utilisateur d'exploitation sans connexion directe root, puis installer Docker Engine et le plugin Compose depuis le dépôt officiel Docker.

Règles minimales :

- connexion SSH par clé uniquement ;
- désactiver le mot de passe SSH et la connexion root distante ;
- pare-feu : exposer uniquement `22`, `80` et `443` ;
- mises à jour de sécurité automatiques ;
- horloge NTP active et serveur en UTC ;
- Docker et MySQL jamais exposés directement sur Internet ;
- MFA sur le panneau d'hébergement et le gestionnaire de déploiement.

Exemple de vérification :

```bash
docker version
docker compose version
timedatectl
sudo ufw status verbose
```

## 8. Gestion des secrets

Ne jamais committer `.env`. Stocker les secrets dans Coolify, Doppler, 1Password Secrets Automation, Infisical ou les secrets du fournisseur CI/CD.

Générer des valeurs différentes pour chaque environnement :

```bash
openssl rand -base64 48  # AUTH_SECRET
openssl rand -base64 48  # CRON_SECRET
npm run key:generate     # APP_KEY dans un environnement contrôlé
```

`APP_KEY` chiffre des valeurs en base. Sa perte rend ces données illisibles ; sa rotation exige une procédure de rechiffrement. La sauvegarder dans un coffre avec historique.

### Variables obligatoires

```dotenv
DATABASE_URL="mysql://USER:MOT_DE_PASSE@HOST:3306/BASE?sslaccept=strict"
AUTH_SECRET="VALEUR_ALEATOIRE_UNIQUE"
CRON_SECRET="AUTRE_VALEUR_ALEATOIRE_UNIQUE"
APP_KEY="VALEUR_GENEREE_PAR_LE_SCRIPT"

ADMIN_SEED_EMAIL="admin@votre-entreprise.fr"
ADMIN_SEED_PASSWORD="MOT_DE_PASSE_UNIQUE_24_CARACTERES_MINIMUM"
CLIENT_SEED_EMAIL="demo-internal@votre-entreprise.fr"
CLIENT_SEED_PASSWORD="AUTRE_MOT_DE_PASSE_UNIQUE"
```

Après le premier seed, changer le mot de passe administrateur dans l'application, vérifier le hash en base et supprimer/désactiver le compte client de démonstration. Ne jamais réutiliser un secret entre `AUTH_SECRET`, `CRON_SECRET` et `APP_KEY`.

## 9. Base MySQL et migrations Prisma

Créer une base et un utilisateur dédiés, avec TLS obligatoire, jeu de caractères `utf8mb4` et fuseau UTC. Le compte applicatif ne doit pas être un compte administrateur global.

### Créer la migration initiale avant toute donnée réelle

Sur une base locale vide :

```bash
cd AutoCall-NextJS
npm ci
npx prisma generate
npx prisma migrate dev --name init
npx prisma migrate status
```

Vérifier et committer `prisma/migrations/`. Pour Prisma 6 utilisé par ce projet, le déploiement est :

```bash
npx prisma migrate deploy
```

Ne jamais exécuter `prisma db push`, `migrate dev` ou `migrate reset` en production. Prisma recommande d'appliquer les migrations versionnées dans le pipeline ([documentation Prisma](https://docs.prisma.io/docs/orm/prisma-client/deployment/deploy-migrations-from-a-local-environment)).

Si une base existante doit être conservée, effectuer un **baseline Prisma** au lieu de recréer la base. Tester cette opération sur une copie avant production.

### Politique de migration

- sauvegarde vérifiée avant chaque migration destructive ;
- migration testée sur staging avec un volume représentatif ;
- stratégie expand/contract pour renommer ou supprimer une colonne ;
- une seule tâche CI applique les migrations ;
- aucune migration au démarrage simultané de plusieurs conteneurs ;
- procédure de rollback applicatif documentée ; les données ne se « rollbackent » pas toujours automatiquement.

## 10. Conteneuriser l'application

Ajouter à `next.config.mjs` :

```js
const nextConfig = {
  output: 'standalone',
  // conserver les options et headers existants
};
```

Créer ensuite un Dockerfile multi-stage non-root. Le principe attendu est :

1. installation reproductible avec `npm ci` ;
2. génération Prisma et `npm run build` ;
3. copie de `.next/standalone`, `.next/static`, `public` et des moteurs Prisma ;
4. exécution avec un utilisateur sans privilèges ;
5. `NODE_ENV=production`, port `3000` ;
6. image épinglée à une version Node LTS précise et scannée en CI.

Le web et le worker doivent utiliser la **même image et le même commit**, avec deux commandes :

```text
web:    node server.js
worker: node scripts/worker.mjs
```

Attention : le build standalone ne copie pas automatiquement tout fichier utilisé hors du graphe Next. Vérifier explicitement la présence de `scripts/worker.mjs`, `prisma/`, `public/` et des binaires Prisma dans l'image finale.

## 11. Déploiement avec Coolify ou Docker Compose

Configurer deux services issus de la même image :

- `web` : une instance, port interne 3000, domaine public ;
- `worker` : une instance, aucun port public, commande `node scripts/worker.mjs` ;
- base MySQL gérée ou service privé persistant ;
- politique de redémarrage automatique ;
- limites CPU/RAM ;
- arrêt gracieux d'au moins 30 secondes.

Ordre de déploiement :

```text
1. construire une image immuable identifiée par le SHA Git ;
2. sauvegarder la base ;
3. appliquer `npx prisma migrate deploy` une seule fois ;
4. déployer le web ;
5. exécuter les smoke tests ;
6. déployer/redémarrer le worker ;
7. surveiller erreurs, file et webhooks pendant 30 minutes.
```

Ne pas lancer plusieurs workers tant que le verrouillage distribué, l'idempotence des jobs et les limites de concurrence n'ont pas été testés. Le code dispose d'un verrou en base, mais son comportement doit être éprouvé sous interruption et double exécution.

## 12. Reverse proxy et sécurité HTTP

Le proxy doit :

- rediriger HTTP vers HTTPS ;
- transmettre `Host`, `X-Forwarded-For` et `X-Forwarded-Proto` ;
- accepter les requêtes longues nécessaires à la voix sans timeout arbitrairement court ;
- limiter la taille des uploads selon les limites applicatives ;
- appliquer un rate limit aux connexions, réinitialisations de mot de passe et API publiques ;
- conserver les routes de webhook accessibles publiquement ;
- ne pas mettre en cache les pages authentifiées ni les réponses de webhook.

Les headers existants (`nosniff`, `SAMEORIGIN`, politique de référent et permissions) sont une bonne base. Ajouter et tester une Content-Security-Policy progressive en mode Report-Only, puis bloquant. Ajouter `Strict-Transport-Security` au proxy après stabilisation du domaine.

## 13. E-mails transactionnels

Configurer un sous-domaine dédié, par exemple `mail.webmodernseo.co`, puis publier SPF, DKIM et DMARC. Utiliser une adresse suivie telle que `support@webmodernseo.co`.

```dotenv
MAIL_HOST="smtp.fournisseur.tld"
MAIL_PORT="587"
MAIL_USERNAME="..."
MAIL_PASSWORD="..."
MAIL_ENCRYPTION="tls"
MAIL_FROM_ADDRESS="support@webmodernseo.co"
MAIL_FROM_NAME="AutoCall"
MAIL_ALLOW_SELF_SIGNED="false"
```

Tester inscription, vérification d'adresse, mot de passe oublié, factures, alertes de paiement et tickets. Traiter les bounces et plaintes ; ne pas envoyer du marketing depuis le flux transactionnel.

## 14. Paiements et facturation

### Stripe recommandé pour le premier lancement

1. créer produits et prix mensuels/annuels dans Stripe ;
2. reporter les Price IDs dans l'administration/plans ;
3. activer `BILLING_STRIPE_ENABLED=true` ;
4. enregistrer le endpoint webhook exact de l'application ;
5. placer le secret `whsec_...` dans `STRIPE_WEBHOOK_SECRET` ;
6. tester paiement réussi, refusé, 3-D Secure, remboursement, upgrade, downgrade, annulation, renouvellement et webhook rejoué ;
7. vérifier que chaque événement est idempotent et rapproché avec le ledger de crédits ;
8. configurer TVA, adresses de facturation, numéros de TVA, factures et avoirs avec un comptable.

```dotenv
BILLING_STRIPE_ENABLED="true"
STRIPE_SECRET="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
BILLING_PAYPAL_ENABLED="false"
BILLING_PADDLE_ENABLED="false"
```

Ne jamais débloquer un abonnement sur la seule page de retour navigateur : le webhook signé fait foi. Utiliser d'abord le mode test et les horloges de test Stripe. Stripe documente séparément les abonnements, le portail client et la fiscalité ([documentation Stripe](https://docs.stripe.com/billing/subscriptions/overview)).

Définir contractuellement ce qu'est un crédit, sa durée de validité, les dépassements, les remboursements et le sort des crédits lors d'une résiliation. Les coûts variables réels (téléphonie + synthèse vocale + LLM + stockage + taxes) doivent être inférieurs au prix facturé avec une marge de sécurité.

## 15. Téléphonie, voix et IA

Commencer avec une seule combinaison certifiée, par exemple Twilio + ElevenLabs + OpenAI.

```dotenv
CALL_DEFAULT_ENGINE="elevenlabs_twilio"
CALL_DIALER_CONCURRENCY="3"
CALL_MAX_RETRIES="3"
TELEPHONY_PROVIDER="twilio"
TWILIO_ENABLED="true"
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_DEFAULT_FROM="+33..."
ELEVENLABS_ENABLED="true"
ELEVENLABS_API_KEY="..."
ELEVENLABS_MAX_CONCURRENCY="3"
AI_PROVIDER="openai"
AI_OPENAI_ENABLED="true"
OPENAI_API_KEY="..."
OPENAI_MODEL="MODELE_VALIDE_TESTE"
```

Configurer les callbacks à partir du domaine public :

```text
https://autocall.webmodernseo.co/webhooks/twilio/voice
https://autocall.webmodernseo.co/webhooks/twilio/status
https://autocall.webmodernseo.co/webhooks/twilio/recording
```

Vérifier les chemins exacts dans les consoles fournisseurs et dans le code avant enregistrement. Les signatures Twilio/Plivo et plusieurs signatures de paiement sont déjà vérifiées dans le dépôt ; les tests doivent prouver qu'une signature invalide reçoit bien un rejet.

### Tests téléphoniques obligatoires

- appel répondu, occupé, sans réponse, numéro invalide et rejet opérateur ;
- timeout LLM/TTS et panne d'un fournisseur ;
- webhook reçu deux fois ou dans le désordre ;
- appel interrompu pendant le traitement ;
- coût et débit de crédits exacts ;
- libération d'une clé ElevenLabs après échec ;
- reprise des appels bloqués par `reap-stuck` ;
- désinscription immédiate et liste d'opposition ;
- limites par pays, horaires et consentement.

Ne jamais autoriser le client à usurper librement le numéro appelant. Restreindre les destinations à risque, instaurer plafonds journaliers et alertes de coût, et surveiller la fraude IRSF/premium-rate.

## 16. WhatsApp et API

Pour Meta WhatsApp :

```dotenv
MESSAGING_ENABLED="true"
WHATSAPP_PROVIDER_MODE="meta"
META_APP_ID="..."
META_APP_SECRET="..."
META_CONFIG_ID="..."
META_VERIFY_TOKEN="SECRET_ALEATOIRE"
META_GRAPH_VERSION="VERSION_ACTUELLEMENT_SUPPORTEE"
```

Webhook :

```text
https://autocall.webmodernseo.co/webhooks/whatsapp/meta
```

Faire approuver les modèles avant lancement. Vérifier opt-in, fenêtre de conversation, statuts envoyé/livré/lu et signature Meta.

Pour l'API SaaS :

- documenter chaque endpoint et code d'erreur ;
- afficher le secret d'une clé une seule fois ;
- stocker uniquement son hash ;
- scopes minimaux et rotation/révocation ;
- rate limit partagé entre instances ;
- journaliser sans corps sensible ;
- versionner sans casser `/api/v1`.

Le rate limiter actuel repose sur une table `cache` MySQL. Il peut suffire au lancement, mais Redis/Valkey devient pertinent en cas de fort trafic ou de plusieurs instances.

## 17. Stockage des fichiers et enregistrements

Les fichiers applicatifs ne doivent pas dépendre du disque éphémère du conteneur. Migrer les uploads KYC, documents, audio et exports vers un bucket S3 compatible privé :

- chiffrement serveur ;
- clés par environnement ;
- URLs signées courtes ;
- antivirus pour les uploads ;
- validation MIME réelle et taille maximale ;
- règles de rétention et suppression ;
- interdiction d'accès public au bucket ;
- région et sous-traitant compatibles avec la politique de données.

Les documents KYC et enregistrements vocaux sont particulièrement sensibles. Ne jamais les envoyer dans les logs ou dans Sentry.

## 18. Sauvegardes et reprise d'activité

Objectif initial conseillé : RPO 24 h maximum, RTO 4 h maximum. Pour un produit actif, viser ensuite RPO 1 h et RTO 1 h.

Minimum :

- sauvegarde MySQL quotidienne automatisée, rétention 30 jours ;
- snapshots hebdomadaires, rétention 3 mois ;
- copie chiffrée dans un autre compte ou une autre région ;
- versioning/lifecycle du bucket objet ;
- sauvegarde des configurations DNS, variables, webhooks et dashboards ;
- test de restauration complet mensuel sur une infrastructure isolée ;
- compte rendu de restauration avec durée et contrôles d'intégrité.

Une sauvegarde jamais restaurée n'est pas une sauvegarde fiable. Le déploiement doit être bloqué si la dernière sauvegarde est en échec.

## 19. Observabilité et alertes

Installer avant les premiers clients :

- Sentry côté serveur et navigateur, avec source maps privées ;
- logs JSON centralisés avec `request_id`, `tenant_id`, `call_id` et `provider_event_id` ;
- monitoring HTTPS depuis au moins deux régions ;
- métriques hôte/conteneurs/base ;
- alertes sur erreurs 5xx, latence, connexions DB, disque, redémarrages, worker silencieux, file croissante et taux d'échec d'appels ;
- synthétiques : login, création d'un agent en sandbox et endpoint public ;
- statut public séparé du serveur applicatif.

Ne jamais loguer mots de passe, tokens, clés API, corps complets de webhooks, numéros complets, transcriptions ou documents. Masquer les données personnelles.

Ajouter un endpoint technique minimal `/api/health` qui vérifie le processus et, séparément, `/api/ready` qui vérifie la base. Ne pas appeler OpenAI/Twilio à chaque probe.

## 20. CI/CD et qualité

Pipeline obligatoire sur chaque pull request :

```text
npm ci
npx prisma validate
npx prisma generate
lint (à rétablir avec ESLint moderne)
tests unitaires
tests d'intégration sur MySQL éphémère
npm run build
scan de secrets
npm audit --omit=dev (signal, à trier)
scan de l'image et génération SBOM
```

ESLint 9 utilise une configuration plate compatible Next.js 16. Les erreurs pertinentes font échouer la CI ; les nouvelles alertes de dette React 19 restent visibles dans `npm run lint:report` sans bloquer une livraison sans rapport avec leur correction.

Dependabot vérifie les dépendances npm chaque semaine. La politique détaillée se trouve dans `AutoCall-NextJS/UPGRADES.md` : versions stables uniquement, aucune fusion automatique, validation CI obligatoire, passage en staging puis promotion du même artefact en production.

Avant fusion : revue obligatoire pour authentification, facturation, crédits, webhooks, isolation tenant et migrations. Activer Dependabot/Renovate, protection de branche, commits signés si possible et déploiement uniquement depuis une branche protégée.

### Jeux de tests prioritaires

- un client ne peut lire/modifier aucune ressource d'un autre ;
- RBAC client et admin sur chaque route d'écriture ;
- session, expiration, reset, vérification e-mail et impersonation ;
- idempotence de tous les webhooks ;
- arrondis monétaires et concurrence sur le ledger ;
- import CSV hostile et fichiers malveillants ;
- SSRF/XSS/CSRF, injections, traversal et IDOR ;
- restauration d'une sauvegarde ;
- montée de version et rollback.

Faire réaliser un test d'intrusion indépendant avant une campagne commerciale importante.

## 21. Conformité et éléments commerciaux

Cette section est une checklist opérationnelle, pas un avis juridique. Faire valider le service par un avocat spécialisé dans les pays ciblés.

Avant vente :

- société, compte bancaire professionnel et assurance RC Pro/cyber ;
- CGU/CGV SaaS, politique de confidentialité, politique cookies ;
- DPA/accord de sous-traitance et liste des sous-traitants ;
- registre des traitements, base légale, durées de conservation ;
- procédure droits d'accès, export, rectification et suppression ;
- procédure violation de données et registre d'incidents ;
- mentions légales, support, SLA réaliste et politique de remboursement ;
- consentement et opposition à la prospection ;
- information claire qu'une IA intervient, lorsque requis ;
- règles par pays sur appels automatisés, heures, listes d'opposition et numéros ;
- transfert hors UE et clauses contractuelles appropriées ;
- AIPD/DPIA si le traitement présente un risque élevé.

La CNIL rappelle que l'information RGPD doit être fournie au plus tard lors de l'appel lorsque les coordonnées proviennent d'un tiers, et que l'enregistrement intégral et systématique de tous les appels peut contrevenir au principe de minimisation ([références CNIL 2026](https://www.cnil.fr/sites/default/files/2026-03/tablesil_cnil.pdf)). Prévoir une option de désactivation de l'enregistrement, une annonce en début d'appel, une rétention courte et une liste d'opposition réellement bloquante.

## 22. Checklist Go/No-Go

Le lancement payant est **No-Go** si une case critique reste vide.

### Juridique et commercial — critique

- [ ] Droits de commercialisation du code d'origine confirmés et preuves archivées hors publication.
- [ ] CGU, CGV, confidentialité, DPA, sous-traitants et mentions légales publiés.
- [ ] Règles d'appels et consentement validés pour chaque pays ouvert.
- [ ] TVA/facturation validées par un comptable.
- [ ] Tarifs rentables après tous coûts variables et taxes.

### Technique — critique

- [x] Migration Prisma initiale versionnée et `db push` protégé contre une exécution en production.
- [x] Base TiDB existante comparée sans dérive et migration initiale baselinée.
- [ ] Migration reconstruite sur une base staging vide par la CI ou le futur staging.
- [ ] Build reproductible vert en CI.
- [ ] Aucun secret ou identifiant par défaut dans Git/production.
- [ ] Staging isolé et tests end-to-end verts.
- [ ] Paiement et webhooks live testés de bout en bout.
- [ ] Isolation multi-tenant et RBAC testés.
- [ ] Worker, retries, idempotence et appels bloqués testés.
- [ ] Sauvegarde restaurée avec succès.
- [ ] Logs, erreurs, uptime et alertes fonctionnels.
- [ ] Stockage persistant/objet pour toutes les données utilisateur.
- [ ] Scan sécurité et test d'intrusion sans faille critique/haute ouverte.

### Exploitation

- [ ] Runbooks incident, paiement, panne fournisseur et fuite de secret.
- [ ] Procédure de rollback et de restauration chronométrée.
- [ ] Support client, adresse e-mail et délais annoncés.
- [ ] Plafonds de dépenses Twilio/ElevenLabs/OpenAI et alertes.
- [ ] Page de statut et canal d'incident.
- [ ] Responsable d'astreinte identifié.

## 23. Procédure de lancement

### J-30 à J-14

1. lever les blocages de licence et migrations ;
2. ajouter conteneur, CI/CD, stockage objet et observabilité ;
3. déployer le staging ;
4. réaliser les tests sécurité, tenant, facturation et appels ;
5. finaliser contrats, politique de données et prix.

### J-14 à J-3

1. bêta privée avec 3 à 10 clients consentants ;
2. limites faibles de volume et dépenses ;
3. corriger chaque incident P0/P1 ;
4. restaurer une sauvegarde ;
5. tester support, remboursement et suppression de compte.

### Jour J

```bash
git tag -a v1.0.0 -m "Production launch"
git push origin v1.0.0
```

1. vérifier la dernière sauvegarde ;
2. déployer l'image correspondant au tag ;
3. appliquer les migrations ;
4. exécuter les smoke tests ;
5. activer le worker ;
6. effectuer un achat réel de faible montant puis remboursement ;
7. effectuer un appel réel autorisé ;
8. surveiller activement 2 heures puis quotidiennement pendant 14 jours.

## 24. Runbooks essentiels

### Web indisponible

1. vérifier uptime, DNS, certificat et proxy ;
2. vérifier état/redémarrages du conteneur ;
3. consulter les erreurs du dernier déploiement ;
4. si régression, redéployer l'image précédente sans modifier la base ;
5. si migration incompatible, appliquer le plan de récupération testé ;
6. publier un incident et conserver la chronologie.

### Worker arrêté ou file croissante

1. empêcher un second worker non contrôlé ;
2. vérifier `/admin/system`, logs et accès à `APP_URL` ;
3. vérifier `CRON_SECRET`, base et limites fournisseurs ;
4. redémarrer une seule instance ;
5. observer les doublons et le débit de crédits ;
6. rejouer uniquement les jobs idempotents.

### Secret compromis

1. révoquer chez le fournisseur ;
2. créer un nouveau secret ;
3. le déployer sans l'écrire dans Git/logs ;
4. redémarrer les services ;
5. rechercher l'usage frauduleux ;
6. documenter l'incident et notifier selon les obligations applicables.

### Incident paiement

1. ne pas modifier manuellement le ledger sans trace d'audit ;
2. retrouver l'ID événement, paiement, client et achat ;
3. vérifier signature et statut directement chez le prestataire ;
4. rejouer le webhook signé si la route est idempotente ;
5. rapprocher abonnement, facture et crédits.

## 25. Changement futur de nom et de domaine

Le nom de code ne doit jamais piloter le métier. Utiliser `APP_NAME` pour l'affichage et un identifiant interne stable indépendant de la marque.

### À rendre configurable dès maintenant

- nom, logo, favicon, couleurs et coordonnées société ;
- domaine public et domaine d'e-mail ;
- expéditeur SMTP et templates ;
- liens CGU/confidentialité/support ;
- nom des apps OAuth et WhatsApp ;
- descripteurs Stripe et libellés de facture ;
- noms des buckets, projets Sentry et pages de statut ;
- textes vocaux qui prononcent « AutoCall ».

Rechercher les chaînes codées en dur avant migration :

```bash
rg -ni "autocall|autocall|ancienne-marque|webmodernseo" AutoCall-NextJS
```

### Plan de migration de domaine sans interruption

Supposons le futur domaine `nouvelle-marque.fr` :

1. acquérir le domaine et préparer DNS, TLS, SPF, DKIM et DMARC ;
2. ajouter le nouveau domaine au proxy sans retirer l'ancien ;
3. déployer `APP_NAME`, `APP_URL`, `NEXT_PUBLIC_*` et les assets mis à jour ;
4. ajouter temporairement les deux domaines aux callbacks/OAuth autorisés ;
5. créer de nouveaux endpoints webhooks Stripe/Twilio/Meta sur le nouveau domaine ;
6. tester login, e-mail, paiement, appel et WhatsApp ;
7. basculer le trafic et surveiller ;
8. rediriger l'ancien domaine en `301` vers le nouveau, sauf les webhooks encore actifs ;
9. conserver l'ancien domaine et son certificat au moins 12 mois ;
10. supprimer les anciens callbacks seulement après absence vérifiée de trafic ;
11. informer les clients et mettre à jour contrats, factures, stores et documentation.

Les cookies de session ne migrent généralement pas entre domaines : annoncer une reconnexion. Ne jamais rediriger aveuglément un webhook POST en 301 ; reconfigurer le fournisseur et maintenir temporairement les deux endpoints.

## 26. Budget mensuel à prévoir

Établir un budget réel avant tarification :

- serveur, base managée, stockage et sauvegardes ;
- Cloudflare et observabilité ;
- e-mail transactionnel ;
- minutes Twilio/Plivo, numéros et enregistrements ;
- caractères/minutes ElevenLabs ;
- tokens et temps réel OpenAI ;
- frais Stripe/Paddle/PayPal et litiges ;
- support, comptabilité, juridique et assurance ;
- marge fraude, remboursements et pics de charge.

Pour chaque plan :

```text
Marge brute = prix HT
             - téléphonie
             - voix
             - LLM
             - paiement
             - stockage/infra variable
             - support variable
```

Déclencher une alerte quand la marge d'un client passe sous un seuil défini. Les crédits doivent être calculés sur le coût maximal raisonnable, pas sur le scénario moyen le moins cher.

## 27. Commandes de contrôle après déploiement

```bash
# application
curl -I https://autocall.webmodernseo.co

# état des conteneurs
docker compose ps
docker compose logs --since=15m web
docker compose logs --since=15m worker

# migrations (conteneur de release contrôlé)
npx prisma migrate status

# dépendances et build en CI
npm ci
npx prisma validate
npm run build
```

Contrôler manuellement : inscription, vérification e-mail, connexion, oubli de mot de passe, création d'agent, import de contact, appel autorisé, débit de crédits, achat, facture, annulation, webhook, suppression/export des données et séparation entre deux comptes.

## 28. Définition de « prêt à commercialiser »

Le SaaS est prêt lorsque :

1. chaque fonction vendue est testée de bout en bout avec le fournisseur réel ;
2. la séparation des clients est prouvée par des tests automatisés ;
3. les paiements et crédits sont idempotents et rapprochables ;
4. les sauvegardes ont été restaurées ;
5. une panne fournisseur produit une dégradation maîtrisée ;
6. sécurité, conformité, licence et contrats sont validés ;
7. l'équipe sait détecter, contenir et expliquer un incident ;
8. la marge est mesurée appel par appel et client par client ;
9. le changement de marque n'exige pas de réécrire le cœur métier ;
10. toutes les cases critiques Go/No-Go sont cochées avec preuve datée.

---

### Références techniques principales

- [Auto-hébergement Next.js](https://nextjs.org/docs/app/guides/self-hosting)
- [Build standalone Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Déploiement des migrations Prisma](https://docs.prisma.io/docs/orm/prisma-client/deployment/deploy-migrations-from-a-local-environment)
- [Abonnements Stripe](https://docs.stripe.com/billing/subscriptions/overview)
- [Références CNIL 2026](https://www.cnil.fr/sites/default/files/2026-03/tablesil_cnil.pdf)

Ce guide doit évoluer avec le code. Toute nouvelle intégration, catégorie de données, zone géographique ou méthode de paiement doit ajouter ses variables, tests, alertes, sauvegardes, règles de conformité et procédure d'incident avant activation en production.
