# 🛒 Frontend - La Carreta

Bienvenido al repositorio del **frontend** del e-commerce **La Carreta**. Este proyecto está diseñado para gestionar la venta y distribución de frutas y verduras, ofreciendo una experiencia de usuario fluida y moderna.

---

## 📌 **Tecnologías Principales**

| Tecnología          | Descripción                                      |
|--------------------|--------------------------------------------------|
| **React 18**       | Biblioteca de JavaScript para interfaces dinámicas. |
| **Vite**           | Herramienta de construcción rápida para React. |
| **Chakra UI**      | Biblioteca de componentes UI accesibles y elegantes. |
| **Redux Toolkit**  | Manejo global de estado con Redux. |
| **React Router**   | Enrutamiento dinámico para SPAs. |
| **Axios**          | Cliente HTTP para peticiones al backend. |
| **Formik + Yup**   | Manejo y validación de formularios. |
| **Recharts**       | Visualización de datos mediante gráficos. |
| **ESLint**         | Linter para asegurar la calidad del código. |

---

## 🚀 **Instalación y Configuración**

Sigue los pasos a continuación para configurar y ejecutar el frontend en tu entorno local.

### 📥 1️⃣ Clonar el repositorio
```sh
$ git clone http://10.111.102.10:3000/desa05/Frontend_La_Carreta
        #o
$ git clone https://desarrollo110@bitbucket.org/popoyan01/frontendlacarreta.git
cd Frontend_La_Carreta
```

### 📦 2️⃣ Instalar Dependencias
Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
```sh
$ npm install
```

### 📄 3️⃣ Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
```env
VITE_API_URL=http://localhost:3000
FRONTEND_ENV=dev

# Configuración de Firebase
VITE_API_KEY="AIzaSyDu-bq0UOjCpnYx7o2_KLseEOy4DpGuoCw"
VITE_AUTH_DOMAIN="la-carreta-116af.firebaseapp.com"
VITE_DATABASE_URL="https://la-carreta-116af-default-rtdb.firebaseio.com"
VITE_PROJECT_ID="la-carreta-116af"
VITE_STORAGE_BUCKET="la-carreta-116af.appspot.com"
VITE_MESSAGING_SENDER_ID="276225132297"
VITE_APP_ID="1:276225132297:web:5498dcb37214c4b495f5d8"
VITE_MEASUREMENT_ID="G-1PT1PHSMMS"
```

---

## ▶️ **Ejecutar el Proyecto**

Después de la configuración, inicia el frontend con:
```sh
npm run dev
```

El servidor de desarrollo estará disponible en **[http://localhost:5173](http://localhost:5179)**.

Para compilar el código para producción, usa:
```sh
npm run build
```

Para previsualizar la compilación antes de desplegar:
```sh
npm run preview
```

---

## 📂 **Estructura del Proyecto**
```bash
Frontend_La_Carreta/
│── src/                  # Código fuente del frontend
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Páginas principales de la aplicación
│   ├── store/            # Estado global con Redux Toolkit
│   ├── router/           # Configuración de rutas con React Router
│   ├── hooks/            # Hooks personalizados
│   ├── utils/            # Utilidades y helpers
│   ├── assets/           # Imágenes y archivos estáticos
│   ├── styles/           # Estilos globales
│   ├── App.jsx           # Componente principal de React
│   ├── main.jsx          # Punto de entrada de la aplicación
│── public/               # Archivos estáticos (favicon, index.html, etc.)
│── .env                  # Variables de entorno
│── package.json          # Dependencias y scripts
│── vite.config.js        # Configuración de Vite
│── Dockerfile            # Configuración para despliegue con Docker
│── .gitignore            # Archivos ignorados por Git
```

---

## 🚢 **Despliegue con Docker**

Este frontend está preparado para **Docker**, facilitando su despliegue en servidores o en la nube.

### 🏗️ **Construcción de la imagen**
Ejecuta:
```sh
docker build -t frontend-lacarreta .
```

### ▶️ **Ejecutar el contenedor**
```sh
docker run -p 5179:5179 frontend-lacarreta
```

### 📌 **Docker Compose**
También puedes levantar la aplicación con `docker-compose.yml`:
```sh
docker-compose up --build
```

---

## 🔥 **Autenticación y Seguridad**
El frontend usa **Firebase** para autenticación en ciertas funcionalidades y **JWT** (JSON Web Tokens) para manejar sesiones seguras con el backend. Asegúrate de configurar correctamente las claves en `.env` para un funcionamiento adecuado.

---

## 📜 **Mejores Prácticas**
✔ **Usar ESLint** para mantener un código limpio:
```sh
$ npm run lint
```
✔ **Seguir la estructura modular** para una mejor escalabilidad.  
✔ **Separar la lógica en hooks y utilidades** para evitar código repetitivo.  
✔ **Evitar el uso de estados globales innecesarios**, usando `React Context` o `Redux` de manera eficiente.  
✔ **Realizar pruebas antes del despliegue**, usando `vite preview`.  

---

📌 **Desarrollador:** *Ing. Felix Calel*  
📧 **desarrollo1@popoyan.com.gt**  
📂 **[Repositorio Oficial](http://10.111.102.10:3000/desa05/Frontend_La_Carreta)**  
