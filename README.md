# TaskFlow - Application de gestion de projets collaboratifs

![TaskFlow Logo](https://img.shields.io/badge/version-1.0.0-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![JWT](https://img.shields.io/badge/JWT-Authentication-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## 📋 Table des matières
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage de l'application](#démarrage-de-lapplication)
- [Utilisation de l'application](#utilisation-de-lapplication)
- [Commandes utiles](#commandes-utiles)
- [Dépannage](#dépannage)
- [Structure du projet](#structure-du-projet)
- [Arrêt et nettoyage](#arrêt-et-nettoyage)

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- **Docker Desktop** (version 20.10+)
  - [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Minimum 4GB de RAM allouée à Docker
- **Git** (optionnel, pour cloner le dépôt)
- **Navigateur web** (Chrome, Firefox, Edge recommandés)

## 📥 Installation

### Méthode 1: Cloner le dépôt GitHub (Recommandé)

```bash
# Cloner le projet
git clone https://github.com/aminekn-0/taskflow-app.git

# Entrer dans le dossier du projet
cd taskflow-app

🚀 Démarrage de l'application
Étape 1: Créer le fichier de configuration
Créez un fichier .env à la racine du projet :

```bash
# Cloner le projet
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/taskflow
JWT_SECRET=super_secret_key_change_this_$(Get-Random) // or JWT_SECRET=super_secret_key_$(date +%s) in linux
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:80

Étape 2: Démarrer l'application
bash
# Construire et démarrer tous les services
docker-compose up --build

⏱️ La première installation peut prendre 3-5 minutes (téléchargement des images Docker)

Étape 3: Accéder à l'application
Une fois le démarrage terminé, ouvrez votre navigateur et allez à :

text
http://localhost

📱 Utilisation de l'application
Créer un compte (Signup)

🛑 Arrêt et nettoyage
Arrêter l'application (conserve les données)
bash
# Dans le terminal où tourne docker-compose
Ctrl + C

# Ou dans un nouveau terminal
docker-compose down