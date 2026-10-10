# Pipeline staging et production

## Fonctionnement

1. Un push sur `main` déclenche `Application CI`.
2. Après succès, `Release to staging` reconstruit le commit vérifié et publie
   deux images immuables dans GHCR : `app:<SHA>` et `app-migration:<SHA>`.
3. Le même SHA est déployé automatiquement sur l'environnement GitHub
   `staging`. Les migrations sont exécutées une fois avant le redémarrage.
4. La production se déclenche manuellement avec le workflow `Deploy production`
   et le SHA déjà validé en staging. Aucun rebuild n'a lieu.
5. Le déploiement attend `/api/health`. En cas d'échec, l'image applicative
   précédente est redémarrée. Une migration de données n'est jamais annulée
   automatiquement.

## Environnements GitHub à créer

Créer `staging` et `production` dans **Settings > Environments**. Ajouter une
protection avec approbateur obligatoire sur `production`.

Dans chaque environnement, définir :

| Type | Nom | Exemple |
|---|---|---|
| Variable | `APP_URL` | `https://staging-autocall.webmodernseo.co` |
| Secret | `DEPLOY_HOST` | IP ou nom DNS du VPS |
| Secret | `DEPLOY_USER` | `deploy` |
| Secret | `DEPLOY_PORT` | `22` |
| Secret | `DEPLOY_PATH` | `/opt/autocall-staging` |
| Secret | `DEPLOY_SSH_KEY` | clé privée dédiée sans phrase secrète |
| Secret | `DEPLOY_KNOWN_HOSTS` | ligne `ssh-keyscan` vérifiée hors CI |

Au niveau du dépôt, définir :

| Type | Nom | Valeur |
|---|---|---|
| Variable | `STAGING_APP_URL` | URL HTTPS publique du staging |
| Variable | `NEXT_PUBLIC_APP_NAME` | marque affichée au build |

## Préparation de chaque serveur

- Docker Engine et Compose v2 installés ;
- utilisateur `deploy` membre du groupe Docker, sans accès root distant ;
- clé publique CI dans `~deploy/.ssh/authorized_keys` ;
- répertoire de déploiement appartenant à `deploy` ;
- fichier `.env` créé manuellement dans ce répertoire, permissions `600` ;
- port applicatif accessible uniquement depuis le reverse proxy local ;
- sauvegarde MySQL fonctionnelle avant d'autoriser les migrations.

Le pipeline ne crée, ne lit et ne remplace jamais le `.env` distant.

## Premier déploiement

1. Configurer d'abord `staging` et pousser sur `main`.
2. Vérifier GitHub Actions, le healthcheck, les logs et les fonctions critiques.
3. Copier les réglages avec de nouveaux secrets sur le serveur de production.
4. Ouvrir `Actions > Deploy production > Run workflow`.
5. Saisir le SHA complet déployé en staging et approuver l'environnement.

## Retour arrière

Le serveur mémorise le dernier SHA sain dans `.deployed-image`. Si le nouveau
conteneur ne répond pas, `deploy.sh` redémarre l'image précédente. Pour un retour
manuel, relancer `Deploy production` avec un ancien SHA encore présent dans GHCR.

Les migrations doivent rester compatibles avec l'ancienne et la nouvelle
version selon le modèle expand/contract. Le pipeline ne restaure jamais la base
automatiquement.
