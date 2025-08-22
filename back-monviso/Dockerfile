# Utilisation de l'image Python officielle
FROM python:3.10-slim

# Définition des variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Création et définition du répertoire de travail
WORKDIR /app

# Installation des dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copie des fichiers de dépendances
COPY requirements.txt .

# Installation des dépendances Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copie du reste du code source
COPY . .

# Initialisation du projet Django si nécessaire
RUN if [ ! -f manage.py ]; then \
    django-admin startproject monviso . && \
    python manage.py startapp api && \
    python manage.py migrate; \
    fi

# Exposition du port 8000
EXPOSE 8000

# Commande pour démarrer le serveur Django
CMD ["gunicorn", "monviso.wsgi:application", "--bind", "0.0.0.0:8000"]
