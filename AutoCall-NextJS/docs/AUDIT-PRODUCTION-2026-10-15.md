# Audit de préparation à la production — 15 octobre 2026

## Conclusion

Le code compile et les contrôles automatisés passent. Les protections critiques
sur les abonnements, les espaces clients et les paiements ont été renforcées.
La mise en production reste conditionnée à l'application des migrations et à la
validation réelle des services externes listés ci-dessous.

## Corrections appliquées

- Le forfait choisi est conservé pendant l'inscription e-mail et Google.
- L'offre gratuite est activée côté serveur ; les offres payantes conduisent au paiement.
- Un compte n'est plus créé si le forfait demandé est absent ou désactivé.
- L'absence d'abonnement ne donne plus un faux accès Pro de démonstration.
- Les pages et mutations client exigent désormais un abonnement actif, sauf les
  écrans nécessaires au paiement et à la gestion du profil.
- L'accès à un espace (`tenant`) vérifie maintenant la propriété ou l'adhésion réelle.
- Un abonnement payant prend le pas sur l'offre gratuite lors d'une montée en gamme.
- L'attribution de forfait et l'impersonation exigent la permission de modification client.
- Stripe exige une clé secrète et un secret de webhook avant activation.
- Le retour Stripe vérifie que la session Checkout appartient à l'utilisateur connecté.
- Les signatures Stripe acceptent correctement la rotation de secrets avec plusieurs `v1`.
- Une contrainte unique empêche l'enregistrement concurrent d'une même transaction.
- Les limites numériques contrôlent maintenant la valeur, et non la longueur du texte.
- La fausse connexion Google Sheets a été supprimée : elle répond explicitement comme indisponible.
- Le webhook SIP non authentifié échoue désormais fermé tant qu'une vérification fournisseur n'existe pas.

## État constaté sans lecture des secrets

| Domaine | État |
| --- | --- |
| Environnement | `staging`, debug désactivé, mode démo désactivé |
| Base de données | Accessible |
| Administrateurs | 2 comptes actifs |
| SMTP | Une configuration active et renseignée |
| Twilio | Activé, identifiants stockés ; numéro expéditeur à confirmer |
| OpenAI | Configuration active stockée en base |
| ElevenLabs | Une clé active en base |
| Stripe | Présent mais désactivé, aucun identifiant stocké |
| WhatsApp | Fournisseur désactivé, Meta non configuré |
| Google Sheets | OAuth réel non implémenté ; connexion désactivée |
| SIP OpenAI | Webhook désactivé tant que sa signature n'est pas vérifiée |

## Actions obligatoires avant ouverture commerciale

### 1. Déployer les migrations

Sauvegarder la base, puis exécuter :

```bash
npm run db:migrate
```

Migrations actuellement en attente :

- `20261015070000_registration_plans`
- `20261015080000_payment_transaction_idempotency`

Contrôler ensuite :

```bash
npx prisma migrate status
```

### 2. Connecter Stripe en mode test

Dans `Admin → Passerelles de paiement → Stripe` :

- sélectionner le mode test ;
- renseigner `sk_test_…` ;
- créer le webhook public `/webhooks/stripe` ;
- renseigner son secret `whsec_…` ;
- activer Stripe.

Événements minimaux :

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`

Effectuer ensuite un achat test mensuel et annuel, vérifier l'abonnement, la
transaction, les crédits, l'annulation et la réception répétée sans doublon d'un webhook.

### 3. Tester les e-mails

Depuis `Admin → Système e-mail` :

- lancer l'e-mail de test ;
- vérifier l'expéditeur, SPF, DKIM et DMARC ;
- tester inscription, vérification d'adresse, réinitialisation de mot de passe,
  confirmation de paiement et échec de paiement.

### 4. Tester la chaîne d'appel

Depuis `Admin → Moteurs` :

- tester Twilio et confirmer le numéro expéditeur ;
- tester OpenAI ;
- lancer la vérification de la clé ElevenLabs puis synchroniser les voix ;
- effectuer un appel entrant et sortant réel ;
- vérifier statut, enregistrement, transcription, crédits et relance worker.

### 5. Configurer ou masquer les fonctions optionnelles

- WhatsApp : choisir Meta ou WhatsWay, renseigner les secrets et tester les webhooks.
- Google Sheets : conserver la fonction indisponible jusqu'à l'implémentation OAuth réelle.
- SIP OpenAI : conserver le webhook fermé jusqu'à l'implémentation de la signature fournisseur.
- Plivo : laisser désactivé tant que les identifiants et numéros ne sont pas configurés.

### 6. Recette administrateur

- Créer, suspendre et supprimer un client de test.
- Attribuer successivement Découverte, Starter, Pro et Agency.
- Vérifier les limites d'agents, campagnes, contacts, numéros, API, WhatsApp et SIP.
- Tester chaque rôle administrateur non-super-admin.
- Tester l'impersonation et sa sortie, puis contrôler le journal d'audit.
- Examiner KYC, crédits, paiements, abonnements, devises et traductions.

## Validations automatisées réussies

- Schéma Prisma valide.
- Contrôle `git diff --check` réussi.
- 26 tests Node réussis.
- ESLint réussi.
- Compilation Next.js de production réussie, 114 pages générées.

## Limites de l'audit

Les tests automatisés ne prouvent pas la disponibilité des comptes externes.
Stripe, SMTP, Twilio, OpenAI, ElevenLabs et WhatsApp doivent être validés avec
leurs tableaux de bord et des opérations de test réelles. Aucun secret n'a été
affiché, exporté ou modifié pendant l'audit.
