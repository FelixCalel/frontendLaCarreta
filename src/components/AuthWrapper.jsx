import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login as loginAuth } from "../store/auth";
import { fetchCurrentUser } from "../store/auth/thunks";
import { fetchModulos } from "../store/RolPermisoUsuario/thunks";

export const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    const nombre = localStorage.getItem("nombreUsuario");
    const correo = localStorage.getItem("correoUsuario");
    const avatar = localStorage.getItem("avatar");
    const uid = localStorage.getItem("usuarioId");
    const roleId = localStorage.getItem("roleId");
    const paisId = localStorage.getItem("paisId");

    let retryTimer = null;
    let isCancelled = false;

    if (token) {
      dispatch(
        loginAuth({
          uid,
          token,
          displayName: nombre,
          correo,
          photoURL: avatar,
          roleId,
          paisId,
        })
      );

      const fetchData = async ({ allowRetry = true } = {}) => {
        if (isCancelled) return;
        try {
          const current = await dispatch(fetchCurrentUser()).unwrap();
          const resolvedUid =
            current?.user?.id ||
            current?.id ||
            localStorage.getItem("usuarioId") ||
            uid;

          if (resolvedUid) {
            await dispatch(fetchModulos(resolvedUid)).unwrap();
          }
        } catch (error) {
          if (isCancelled) return;

          if (
            error === "Network Error" ||
            error === "ERR_NETWORK" ||
            (typeof error === "string" && error.includes("Network")) ||
            error?.code === "ERR_NETWORK"
          ) {
            if (allowRetry) {
              retryTimer = setTimeout(() => {
                fetchData({ allowRetry: false });
              }, 2000);
            }
          }
        }
      };

      fetchData();

      const interval = setInterval(fetchData, 15 * 60 * 1000);

      const onVisible = () => {
        if (document.visibilityState === "visible") {
          fetchData();
        }
      };

      const onFocus = () => fetchData();
      const onOnline = () => fetchData();

      const onSessionExpired = () => {
        if (document.visibilityState === "visible") {
          window.location.assign("/auth/login");
        }
      };

      document.addEventListener("visibilitychange", onVisible);
      window.addEventListener("focus", onFocus);
      window.addEventListener("online", onOnline);
      window.addEventListener("auth:session-expired", onSessionExpired);

      return () => {
        isCancelled = true;
        if (retryTimer) clearTimeout(retryTimer);
        clearInterval(interval);
        document.removeEventListener("visibilitychange", onVisible);
        window.removeEventListener("focus", onFocus);
        window.removeEventListener("online", onOnline);
        window.removeEventListener("auth:session-expired", onSessionExpired);
      };
    }

    return () => {
      isCancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [dispatch]);

  return children;
};
