import axios from "axios";

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

const performLogout = () => {
  const lsKeys = [
    "access_token",
    "refresh_token",
    "usuarioId",
    "roleId",
    "nombreUsuario",
    "correoUsuario",
    "authSlice",
    "userData",
  ];
  lsKeys.forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");

  const currentPath = window.location.pathname;
  if (!currentPath.includes("/login") && !currentPath.includes("/auth")) {
    window.location.href = "/auth/login";
  }
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {};
      const status = error?.response?.status;

      if (status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      const url = (originalRequest.url || "").toString();
      if (
        url.includes("/login/refresh-token") ||
        url.includes("/usuarios/exchange-token") ||
        url.includes("/login")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

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
        const storedRefreshToken = localStorage.getItem("refresh_token");

        if (!storedRefreshToken) {
          throw new Error("NO_REFRESH_TOKEN");
        }

        const resp = await axios.post(
          `${baseUrl}/login/refresh-token`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true },
        );

        const newAccessToken =
          resp?.data?.accessToken || resp?.data?.access_token;

        if (!newAccessToken) {
          throw new Error("INVALID_REFRESH_RESPONSE");
        }

        localStorage.setItem("access_token", newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("access_token");

        performLogout();

        const customError = new Error();
        customError.message = "Tu sesión ha expirado. Redirigiendo al login...";
        customError.code = "SESSION_EXPIRED";
        return Promise.reject(customError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};
