# Dockerfile de Desarrollo
FROM node:18-alpine AS frontend-dev

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Dockerfile de Stage
FROM node:18-alpine AS frontend-stage

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "start"]

# Dockerfile de Producción
FROM node:18-alpine AS frontend-prod

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "start"]
