# TaskFlow - Application de gestion de projets collaboratifs

## Installation

### Méthode de cloner le dépôt GitHub (Recommandé)

```bash
# Cloner le projet
git clone https://github.com/aminekn-0/taskflow-app.git
```
```bash
# Entrer dans le dossier du projet
cd taskflow-app
```
## Démarrage de l'application

### Étape 1: Créer le fichier de configuration `.env`

Créez un fichier .env à la racine du projet :

```bash
# Copiez le code ci-dessous et collez-le dans un nouveau fichier nommé .env à la racine de votre projet (dans le dossier taskflow-app):
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/taskflow
JWT_SECRET=super_secret_key_change_this_$(Get-Random)
// ou JWT_SECRET=super_secret_key_$(date +%s) in linux
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:80 // or any other port
```

### Étape 2: Démarrer l'application
```bash
# Construire et démarrer tous les services
docker-compose up --build
```
La première installation peut prendre 3-5 minutes (téléchargement des images Docker)

### Étape 3: Accéder à l'application
Une fois le démarrage terminé, ouvrez votre navigateur et allez à :
```text
http://localhost
```

## Utilisation de l'application
Créer un compte (Signup) & Se connecter (Login) & Après connexion, vous accédez à votre tableau de bord personnel

## Arrêt et nettoyage
Arrêter l'application (conserve les données)
```bash
# Pour arrête les conteneurs en cours d'exécution
Ctrl + C
```
```bash
# Ou pour arrête ET supprime les conteneurs
docker-compose down
```
