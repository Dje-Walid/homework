# Initialiser le projet

Dans un premier temps il vous faudra initiliser npm sur chaque répertoire.

Voici comment lancer et initialiser le front :

- Lancez un terminal
```bash
cd /frontend
npm i
npm run dev
```

Vous devriez avoir votre page sur cette [url](http://localhost:5173/)

Maintenant voici comment initialiser le back :

- Lancez un nouveau terminal sans couper l'autre
- Faites une copie du .env.dist et renommer le .env
- Remplissez le .env 
- Vous trouverez les informations nécessaire pour le remplir [sur le lien suivant](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#get-application-id-and-authentication-key): 
```
AZURE_CLIENT_ID={your client id}
AZURE_TENANT_ID={your tenant id}
AZURE_CLIENT_SECRET={your client secret}
AZURE_SUBSCRIPTION_ID={your subscription id}
```

- Voici les étapes pour lancer le projet ensuite
```bash
cd /backend
npm i
npm run dev
```

Par défaut le backend sera lancé sur le port 3000 assurez vous qu'il soit libre.

## Utiliser le projet :

Voici les comptes qui vous permettront de vous connecter.

(nb : prenez en compte que chaque VM coute 50€, afin de faciliter vos tests si vous vous déconnecter et vous reconencter vous récupérer tous vos euros)

### Super admin avec 150€
- **email :** super@admin.fr
- **password :** superadmin

### Admin avec 50€
- **email :** admin@admin.fr"
- **password :** admin

### Utilisateur avec 0€
- **email :** user@admin.fr"
- **password :** user


Suite à un bug de dernière minute la page ne se rafraichit pas à la fin de la création de la VM par conséquent je vous demanderai de bien vouloir rafraichir la page manuellement au bout de 1/2 minutes.
De même lorsque vous supprimez manuellement la VM


