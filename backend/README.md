# Backend QuotFi

## Lancement du serveur

1. Installez MongoDB localement ou utilisez un service cloud (MongoDB Atlas).
2. Placez-vous dans le dossier `backend` puis lancez :
   
   ```bash
   node server.js
   ```

3. L’API écoute sur http://localhost:5000

## Structure de base
- `server.js` : point d’entrée du serveur Express
- `.env` : variables d’environnement (port, URI MongoDB, clé JWT)
- (À venir) `models/`, `routes/`, `controllers/` : pour organiser le code
