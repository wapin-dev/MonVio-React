# MonViso Budget - Application de Gestion Budgétaire

## 📋 Description

MonViso Budget est une application web moderne de gestion budgétaire personnelle qui aide les utilisateurs à suivre leurs finances selon la règle budgétaire 50/30/20. L'application offre une interface intuitive pour gérer les revenus, dépenses et objectifs d'épargne.

## 🎯 Fonctionnalités Principales

### ✅ Authentification & Onboarding
- **Inscription/Connexion** sécurisée avec JWT
- **Processus d'onboarding** en 4 étapes :
  1. Informations personnelles (prénom, nom)
  2. Configuration des revenus (salaire principal, revenus complémentaires)
  3. Gestion des dépenses (fixes et variables)
  4. Définition des objectifs d'épargne

### 📊 Dashboard Financier
- **Vue d'ensemble** des finances personnelles
- **Cartes de résumé** : Solde actuel, Dépenses totales, Revenus mensuels, Économies recommandées
- **Graphiques interactifs** : 
  - Répartition des dépenses (camembert)
  - Évolution budgétaire (barres)
- **Règle 50/30/20** intégrée :
  - 50% pour les besoins essentiels (dépenses fixes)
  - 30% pour les envies (dépenses variables)
  - 20% pour l'épargne

### 👤 Gestion de Profil
- **Profil utilisateur** complet avec informations personnelles
- **Modification des revenus** mensuels
- **Historique** des données financières

### 🎨 Interface Utilisateur
- **Design moderne** avec Tailwind CSS
- **Interface responsive** adaptée mobile/desktop
- **Thème sombre** avec effets glassmorphism
- **Navigation intuitive** avec sidebar animée
- **Indicateurs visuels** de progression budgétaire

## 🏗️ Architecture Technique

### Backend (Django REST Framework)
```
back-monviso/
├── api/                    # API REST endpoints
│   ├── views.py           # Vues API (Auth, Onboarding, Dashboard)
│   ├── serializers.py     # Sérialiseurs DRF
│   └── urls.py           # Routes API
├── budget/                # Modèles de données
│   ├── models.py         # UserProfile, Income, Expense, SavingsGoal
│   └── admin.py          # Interface d'administration
└── monviso/              # Configuration Django
    ├── settings.py       # Paramètres (JWT, CORS, DB)
    └── urls.py          # URLs principales
```

**Modèles de données :**
- `UserProfile` : Profil utilisateur avec revenu mensuel
- `Income` : Sources de revenus (salaire, freelance, investissements)
- `Expense` : Dépenses fixes et variables
- `SavingsGoal` : Objectifs d'épargne avec progression

### Frontend (React + TypeScript)
```
front-monviso/
├── src/
│   ├── components/        # Composants React
│   │   ├── Dashboard.tsx     # Tableau de bord principal
│   │   ├── OnboardingModal.tsx # Processus d'onboarding
│   │   ├── UserProfile.tsx   # Gestion du profil
│   │   └── Layout.tsx       # Layout principal avec sidebar
│   ├── contexts/         # Contextes React
│   │   └── AuthContext.tsx  # Gestion auth + données financières
│   ├── services/         # Services API
│   │   └── api.ts          # Appels API (auth, onboarding, dashboard)
│   └── pages/           # Pages de l'application
└── public/              # Assets statiques
```

## 🚀 Installation & Démarrage

### Prérequis
- Docker & Docker Compose
- Node.js 18+ (pour développement local)
- Python 3.9+ (pour développement local)

### Démarrage avec Docker
```bash
# Cloner le repository
git clone <repository-url>
cd mon-viso-budget

# Lancer l'application complète
docker-compose up -d

# L'application sera accessible sur :
# - Frontend: http://localhost:8080
# - Backend API: http://localhost:8000
```

### Variables d'environnement
Créer un fichier `.env` à la racine :
```env
# Base de données
DATABASE_URL=postgresql://user:password@db:5432/monviso_budget

# JWT
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:8080
```

## 📱 Utilisation

### 1. Première connexion
1. Créer un compte sur `/register`
2. Se connecter sur `/login`
3. Compléter l'onboarding (4 étapes)

### 2. Navigation principale
- **Dashboard** (`/`) : Vue d'ensemble financière
- **Profil** (`/profile`) : Gestion des informations personnelles
- **Sidebar** : Navigation rapide avec aperçu budgétaire

### 3. Gestion budgétaire
- Les données sont automatiquement calculées selon la règle 50/30/20
- Les graphiques se mettent à jour en temps réel
- La barre de progression indique le budget restant

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/register/` - Inscription
- `GET /api/profile/` - Profil utilisateur

### Onboarding
- `POST /api/onboarding/` - Soumission des données d'onboarding
- `GET /api/onboarding/status/` - Statut de l'onboarding

### Dashboard
- `GET /api/dashboard/` - Données financières complètes

## 🎨 Technologies Utilisées

### Backend
- **Django 4.2** - Framework web Python
- **Django REST Framework** - API REST
- **JWT Authentication** - Authentification sécurisée
- **PostgreSQL** - Base de données
- **Docker** - Containerisation

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Recharts** - Graphiques interactifs
- **Lucide React** - Icônes modernes
- **React Router** - Navigation

## 🔮 Fonctionnalités à Venir

- [ ] Gestion des transactions détaillées
- [ ] Catégories personnalisées
- [ ] Notifications et alertes budgétaires
- [ ] Export des données (PDF, Excel) (peut-être une partie entreprise)
- [ ] Objectifs d'épargne avancés sur la loi des 50/30/20 adapter a l'utilisateur
- [ ] Analyse prédictive des dépenses (peut-être une partie entreprise)
- [ ] Mode multi-comptes (coloc, couple, etc etc..)
- [ ] Application mobile

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé avec ❤️ pour une gestion budgétaire moderne et intuitive.
