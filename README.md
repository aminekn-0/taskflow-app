# TaskFlow

Application web fullstack de gestion de projets collaboratifs.

## Équipe

| Membre | Fonctionnalités |
|---|---|
| Omar Anekrif | Authentification · Gestion des membres |
| Raouia Mokhchan 23054043 | Gestion des projets · Tableau de bord personnel |
| Ilham Aueriaghel 24057813| Gestion des tâches · Assignation des tâches |
| Mohamed Amine Kannich 24063368 | Historique des activités · Notifications |
| Amal Aoulad El Haj 24059367 | Filtrage & Recherche · Sauvegarde des brouillons |

## Dépôt GitHub

[https://github.com/aminekn-0/taskflow-app](https://github.com/aminekn-0/taskflow-app)

---

## Stack technique

- **Backend** : Node.js · Express · Mongoose
- **Base de données** : MongoDB (conteneur Docker)
- **Authentification** : JWT · bcryptjs
- **Frontend** : HTML · CSS · JavaScript vanilla · Axios
- **Infrastructure** : Docker · Docker Compose · Nginx

---

## Démarrage

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installé et lancé

### Lancer l'application

```bash
git clone https://github.com/aminekn-0/taskflow-app.git
cd taskflow-app
docker-compose up --build
```

L'application démarre sur :
- **Frontend** : http://localhost
- **Backend** : http://localhost:5000

---

## Structure du projet

```
taskflow-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── Activity.js
│   │   │   └── Notification.js
│   │   ├── controllers/
│   │   │   ├── projectController.js
│   │   │   ├── activityController.js
│   │   │   ├── notificationController.js
│   │   │   └── dashboard.controller.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── project.routes.js
│   │   │   ├── activityRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── dashboard.js
│   │   │   └── projectMembers.js
│   │   └── middlewares/
│   │       └── auth.js
└── frontend/
    ├── Dockerfile
    ├── index.html
    ├── activities.html
    ├── notifications.html
    ├── tasks.html
    └── assign.html
```

---

## Fonctionnalités

### 1 — Authentification *(Omar Anekrif)*
- Inscription avec nom complet, email et mot de passe
- Mot de passe haché avec bcryptjs (10 rounds)
- Connexion avec génération d'un token JWT
- Token stocké dans le LocalStorage et envoyé via header `Authorization: Bearer`
- Middleware de protection des routes authentifiées

### 2 — Gestion des projets *(Raouia Mokhchan)*
- Création, modification et suppression de projets
- Statuts : actif, en pause, archivé
- Suppression en cascade des tâches via middleware Mongoose
- Liste paginée avec paramètres `page` et `limit`

### 3 — Gestion des tâches *(Ilham Aueriaghel)*
- Création, modification et suppression de tâches
- Priorité : basse, moyenne, haute
- Statut : à faire, en cours, terminé
- Validation via `enum` dans le schéma Mongoose
- Route `PATCH /api/tasks/:id/status` pour mise à jour du statut

### 4 — Assignation des tâches *(Ilham Aueriaghel)*
- Champ `assignedTo` avec populate (nom + email, sans mot de passe)
- Tableau de bord filtré par membre connecté
- Menu déroulant des membres du projet

### 5 — Tableau de bord personnel *(Raouia Mokhchan)*
- Nombre de projets actifs, tâches assignées, tâches terminées, tâches en retard
- Calculé côté serveur via pipeline d'agrégation MongoDB
- Tâches en cours triées par priorité décroissante puis date limite croissante

### 6 — Filtrage & Recherche *(Amal Aoulad El Haj)*
- Filtrage par statut, priorité et membre assigné
- Recherche par mot-clé via `$regex`
- Pagination avec retour de `data`, `total`, `page`, `totalPages`

### 7 — Sauvegarde des brouillons *(Amal Aoulad El Haj)*
- Sauvegarde automatique dans le LocalStorage à chaque modification
- Restauration du brouillon au chargement du formulaire
- Suppression du brouillon après soumission réussie

### 8 — Gestion des membres *(Omar Anekrif)*
- Invitation par email
- Contrôle d'accès par rôle (créateur vs membre)
- Retrait d'un membre avec suppression immédiate de l'accès

### 9 — Historique des activités *(Mohamed Amine Kannich)*
- Événements tracés : création/suppression de tâche, changement de statut, ajout/retrait de membre, modification de projet
- Collection MongoDB `activities` dédiée
- Route `GET /api/projects/:id/activities` — activités triées du plus récent au plus ancien
- Affichage dynamique dans `activities.html`

### 10 — Notifications *(Mohamed Amine Kannich)*
- Notifications lors d'une assignation, d'un changement de statut ou d'un ajout au projet
- Badge en temps réel sur l'icône de la cloche
- Polling toutes les 30 secondes via `setInterval`
- Marquage comme lu via `PATCH /api/notifications/:id/read`
- Archivage des notifications lues dans le LocalStorage

---

## Workflow Git

- `main` — code stable validé uniquement
- `develop` — branche d'intégration de l'équipe
- `feature/*` — une branche par fonctionnalité
- Fusions via Pull Requests relues par au moins un membre
- Messages de commits selon la convention **Conventional Commits**

---

## Variables d'environnement

Créer un fichier `.env` dans `/backend` :

```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/taskflow
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:80
```

> Le fichier `.env` n'est jamais versionné (inclus dans `.gitignore`).
