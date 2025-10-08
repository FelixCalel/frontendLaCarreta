import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { App } from "./App";
import { theme } from "../src/components/Dashboard/themes/themePY";
import { AuthProvider } from "./pages/auth/context";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthWrapper } from "./components/AuthWrapper";
import { SearchProvider } from "./components/component/SearchContext";
import axios from "axios";

// Configurar un interceptor global de Axios para adjuntar el token dinámicamente
axios.interceptors.request.use(
  (config) => {
    // Buscar token siempre en el momento del request (sin depender de recargas)
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Evita intentar refresh en múltiples requests simultáneos
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  pendingQueue = [];
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;

    // Si no es 401 o ya reintentamos, rechazar
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // No intentar refresh si el endpoint fallido es el propio refresh o login
    const url = (originalRequest.url || "").toString();
    if (
      url.includes("/login/refresh-token") ||
      url.includes("/usuarios/exchange-token") ||
      url.includes("/login")
    ) {
      return Promise.reject(error);
    }

    // Marcar para no entrar en bucle
    originalRequest._retry = true;

    // Si ya hay un refresh en curso, esperar a que termine
    if (isRefreshing) {
      try {
        const newToken = await new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        });
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    isRefreshing = true;
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token available");

      const resp = await axios.post(`${baseUrl}/login/refresh-token`, {
        refreshToken,
      });
      const newAccessToken =
        resp?.data?.accessToken || resp?.data?.access_token;
      if (!newAccessToken)
        throw new Error("No access token in refresh response");

      // Guardar y actualizar header
      localStorage.setItem("access_token", newAccessToken);
      processQueue(null, newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      // Limpieza mínima y redirección opcional
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      // window.location.href = "/";
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <SearchProvider>
              <AuthWrapper>
                <App />
              </AuthWrapper>
            </SearchProvider>
          </BrowserRouter>
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
