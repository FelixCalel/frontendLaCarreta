# Usa una imagen base oficial y más ligera de Node.js
FROM node:18-alpine

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY . .

# Instala las dependencias
RUN npm install
    
# Expone el puerto en el que correrá la aplicación
EXPOSE 5173

# Define el comando para correr la aplicación
CMD ["npm", "run", "dev", "--", "--host"]
