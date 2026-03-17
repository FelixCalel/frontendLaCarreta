import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Para autenticación
import { getFirestore } from "firebase/firestore"; // Para Firestore

// Valida las variables de entorno
const validateEnvVariables = () => {
  const requiredVars = [
    "VITE_API_KEY",
    "VITE_AUTH_DOMAIN",
    "VITE_PROJECT_ID",
    "VITE_STORAGE_BUCKET",
    "VITE_MESSAGING_SENDER_ID",
    "VITE_APP_ID",
  ];

  requiredVars.forEach((key) => {
    if (!import.meta.env[key]) {
      throw new Error(`Falta la variable de entorno: ${key}`);
    }
  });
};

validateEnvVariables();

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa servicios
const auth = getAuth(app);
const firestore = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth };
