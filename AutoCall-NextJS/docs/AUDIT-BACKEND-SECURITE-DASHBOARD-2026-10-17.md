# Audit backend, sécurité et tableau de bord — mise à jour du 18 octobre 2026

## Conclusion

Le backend compile, les migrations configurées sont appliquées et les contrôles automatisés passent. Les routes client et API examinées appliquent l’authentification, les permissions et l’isolation par `client_id`. Le tableau de bord n’affiche plus de jeu de données de démonstration ni de métriques fabriquées.

Les intégrations externes restent dépendantes de comptes réels et doivent être testées séparément avec Twilio, Plivo, ElevenLabs, OpenAI, Stripe, PayPal, Paddle, SMTP et WhatsApp.

## Corrections appliquées

### Tableau de bord

- Suppression du jeu de données fictif retourné lorsque la base était indisponible.
- Les erreurs de base ne sont plus transformées silencieusement en faux succès.
- Le filtre 7, 30 ou 90 jours pilote maintenant les requêtes serveur.
- Les bornes de période affichées proviennent des dates réellement interrogées.
- Le volume, le taux d’appels complétés, les prospects qualifiés et la durée moyenne proviennent des appels du client sur la période choisie.
- Les agents supprimés et les campagnes supprimées ne sont plus comptés.
- L’export ouvre désormais le véritable export CSV.
- Les faux identifiants d’appels et faux scores IA ont été supprimés.
- La durée utilise le champ réel `duration_seconds`.
- La qualification affichée provient de l’appel enregistré.
- Le widget simulé a été remplacé à l’écran par les campagnes actives issues de la base.
- La route publique `/dashboard-demo`, qui exposait un jeu complet de chiffres fictifs, a été supprimée.
- La comparaison fabriquée avec « mois dernier » et l’année figée ont été supprimées du graphique.
- Les séries 7, 30 et 90 jours regroupent désormais uniquement les appels réellement compris dans la période sélectionnée.
- Le total du graphique est calculé depuis cette même série, sans mélange avec le cumul historique.
- Des tests garantissent que chaque appel est compté exactement une fois dans la bonne tranche.
- Les statistiques de la page Appels ne retombent plus sur `1240 / 1170 / 184` ni sur une durée fictive lorsque la base échoue.
- Les pages Contacts et Analytics ne remplacent plus une panne de base par des volumes, tendances ou campagnes fictifs.
- Les listes Agents et Campagnes ne retombent plus non plus sur des compteurs de démonstration en cas d’échec SQL.
- Le catalogue des voix n’invente plus 42 voix ni des filtres fictifs lorsque le fournisseur ou la base échoue.

### Navigation

- L’espace client utilise une navigation progressive : Tableau de bord épinglé, rubriques principales, puis pages de la rubrique sélectionnée.
- La rubrique de la route active est restaurée automatiquement.
- La navigation administrateur n’est pas modifiée.

### Sécurité

- Aucun secret réel ou fichier `.env` n’est suivi par Git.
- `npm audit --omit=dev` ne signale aucune vulnérabilité connue.
- Les chemins du stockage sont maintenant résolus et confinés à leur disque afin de bloquer les traversées de répertoires, y compris sous Windows.
- Les téléchargements et redirections d’enregistrements sont limités à HTTPS et aux domaines Twilio/Plivo explicitement autorisés.
- Des tests couvrent les URL fiables, les domaines trompeurs, HTTP, localhost et les schémas non web.
- Les cookies de session sont `httpOnly`, `sameSite=lax` et sécurisés en production.
- Les webhooks Twilio et Plivo échouent fermés et vérifient leur signature avec comparaison constante.
- Les mots de passe sont hachés avec bcrypt, les clés API sont hachées et disposent de scopes, expiration, révocation, liste IP et limitation de débit.
- Le proxy vérifie de nouveau le JWT avant de laisser accéder aux pages `/app`.
- Les liens de réinitialisation de mot de passe ne sont plus écrits dans les logs de débogage.
- Le script de démarrage utilise maintenant le serveur Next.js standalone réellement produit par le build.

## Vérifications réalisées

- Schéma Prisma valide.
- 4 migrations détectées ; base configurée à jour.
- 31 tests Node réussis.
- 14 tests HTTP de production réussis : pages publiques, redirections d’authentification, API protégées, santé, en-têtes de sécurité et SEO.
- ESLint réussi sans erreur.
- Build Next.js de production réussi et 114 pages générées.
- `git diff --check` réussi.

## Limites de validation

- Le smoke test HTTP local complet passe. La base distante n’était toutefois pas joignable depuis le bac à sable pendant ce test ; les parcours authentifiés avec données réelles restent à rejouer depuis l’environnement autorisé.
- Aucun appel téléphonique réel, paiement réel, e-mail réel ou message WhatsApp réel n’a été envoyé pendant cet audit.
- La disponibilité, les quotas et la configuration des fournisseurs externes ne peuvent pas être prouvés uniquement par l’analyse du dépôt.
