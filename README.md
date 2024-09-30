La Carreta - E-commerce Frontend
Este repositorio contiene el frontend del proyecto de comercio electrónico "La Carreta", desarrollado con React y Vite. La interfaz está diseñada con Chakra UI y utiliza Redux Toolkit para la gestión de estado, junto con otras herramientas modernas de desarrollo.

Tecnologías Principales
React 18
Vite
Chakra UI
Redux Toolkit
React Router
Axios
Formik para formularios
Yup para validación
Recharts para gráficos
ESLint y TypeScript
Instalación y Configuración
Sigue los pasos a continuación para levantar el proyecto en tu entorno local.

1. Clonar el repositorio
Clona este repositorio en tu máquina local usando el siguiente comando:

bash
Copiar código
git clone https://github.com/usuario/la-carreta.git

2. Instalar dependencias
Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

npm install
3. Configurar variables de entorno
Copia el archivo .env.template y renómbralo a .env. Llena las variables necesarias con tus configuraciones, como las claves API y URLs del servidor.

Ejemplo:
VITE_API_URL=

4. Levantar el servidor de desarrollo
Ejecuta el siguiente comando para iniciar el servidor de desarrollo:

npm run dev
Esto abrirá la aplicación en tu navegador (generalmente en http://localhost:3000/).

5. Compilar para producción
Para compilar la aplicación para producción, utiliza el siguiente comando:

bash
Copiar código
npm run build
6. Vista previa de producción
Para ejecutar una vista previa de la aplicación en modo producción, ejecuta:

npm run preview
Scripts disponibles
npm run dev: Levanta el servidor de desarrollo.
npm run build: Compila la aplicación para producción.
npm run preview: Sirve una versión de producción de la aplicación localmente.
npm run lint: Ejecuta ESLint para encontrar errores en el código.
Estructura del Proyecto
El proyecto sigue una estructura estándar de Vite y React:

la-carreta/
├── public/              # Archivos públicos
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas o vistas
│   ├── redux/           # Lógica de Redux
│   └── App.jsx          # Punto de entrada de la aplicación
├── .env.template        # Plantilla de variables de entorno
├── package.json         # Dependencias y scripts del proyecto
├── vite.config.js       # Configuración de Vite
└── README.md            # Este archivo
Contribuciones
Las contribuciones son bienvenidas. Abre un issue o realiza un pull request si tienes alguna mejora o funcionalidad que agregar.

