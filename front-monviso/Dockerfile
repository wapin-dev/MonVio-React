# Étape de build
FROM node:20-alpine as build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste du code source
COPY . .

# Build de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie des fichiers de build vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
