# Mon Viso Budget - Application de Gestion de Budget

Application de gestion de budget avec frontend React et backend Django, conteneurisée avec Docker.

## Architecture du Projet

- **Frontend**: React/TypeScript avec Vite
- **Backend**: Django REST Framework
- **Base de données**: PostgreSQL
- **Outils supplémentaires**: pgAdmin pour la gestion de la base de données

## Prérequis

- Docker
- Docker Compose

## Configuration

1. **Cloner le projet**:
   ```bash
   git clone <votre-repo>
   cd mon-viso-budget
   ```

2. **Configurer les variables d'environnement**:
   ```bash
   cp back-monviso/.env.example back-monviso/.env
   ```
   Modifiez les valeurs dans le fichier `.env` selon vos besoins.

3. **Configurer l'URL de l'API dans le frontend**:
   Si nécessaire, modifiez l'URL de l'API dans `front-monviso/src/services/api.ts` pour qu'elle pointe vers le backend:
   ```typescript
   const API_URL = '/api/';  // Sera redirigé via Nginx
   ```

## Démarrage

1. **Construire et démarrer les conteneurs**:
   ```bash
   docker-compose up -d --build
   ```

2. **Initialiser la base de données**:
   ```bash
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py createsuperuser
   ```

3. **Accéder à l'application**:
   - Frontend: http://localhost
   - Backend API: http://localhost/api/
   - Admin Django: http://localhost/api/admin/
   - pgAdmin: http://localhost:5050

## Structure des Conteneurs

- **frontend**: Serveur Nginx servant l'application React compilée
- **backend**: Serveur Django avec Gunicorn
- **db**: Base de données PostgreSQL
- **pgadmin**: Interface d'administration pour PostgreSQL

## Développement

### Mode développement

Pour travailler en mode développement avec rechargement à chaud:

1. **Frontend**:
   ```bash
   cd front-monviso
   npm install
   npm run dev
   ```

2. **Backend**:
   ```bash
   cd back-monviso
   python -m venv venv
   source venv/bin/activate  # Sur Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py runserver
   ```

### Commandes utiles

- **Voir les logs**:
  ```bash
  docker-compose logs -f [service]
  ```

- **Exécuter des commandes dans un conteneur**:
  ```bash
  docker-compose exec [service] [commande]
  ```

- **Arrêter les conteneurs**:
  ```bash
  docker-compose down
  ```

## Déploiement en Production

Pour un déploiement en production:

1. Modifiez les variables d'environnement dans `back-monviso/.env`:
   - Définissez `DEBUG=False`
   - Utilisez un `SECRET_KEY` fort et unique
   - Configurez correctement `ALLOWED_HOSTS` et `CORS_ALLOWED_ORIGINS`

2. Construisez et démarrez les conteneurs:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

## Sauvegarde et Restauration

### Sauvegarde de la base de données

```bash
docker-compose exec db pg_dump -U monviso_user -d monviso > backup.sql
```

### Restauration de la base de données

```bash
cat backup.sql | docker-compose exec -T db psql -U monviso_user -d monviso
```
