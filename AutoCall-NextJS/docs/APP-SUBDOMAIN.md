# Configuration de `app.getautocall.fr`

Le routage applicatif est déjà pris en charge par `src/proxy.js`. Les requêtes reçues sur un hôte commençant par `app.` sont réécrites vers `/app` et les visiteurs anonymes sont redirigés vers `/login`.

## DNS

Créer chez le fournisseur DNS l'un des enregistrements suivants :

- `A` : nom `app`, valeur `57.129.173.31`, si le sous-domaine pointe directement vers le VPS ;
- ou `CNAME` : nom `app`, valeur `getautocall.fr`, si le fournisseur et le proxy l'autorisent.

## Plateforme de déploiement

Ajouter `https://app.getautocall.fr` aux domaines du service `autocall-web`, activer HTTPS, puis conserver :

```env
APP_URL=https://getautocall.fr
NEXT_PUBLIC_APP_URL=https://getautocall.fr
```

Le domaine canonique marketing reste `getautocall.fr`. Le sous-domaine `app` est réservé à l'espace authentifié et porte déjà une directive `noindex` via `src/app/app/layout.jsx`.

## Validation

Après propagation DNS :

1. `https://app.getautocall.fr` doit rediriger un visiteur anonyme vers `/login` ;
2. le certificat TLS doit couvrir `app.getautocall.fr` ;
3. `https://app.getautocall.fr/api/health` doit répondre `200` ;
4. les pages `/app/*` doivent contenir `noindex, nofollow`.
