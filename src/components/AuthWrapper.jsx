import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { login as loginAuth } from "../store/auth";
import { fetchCurrentUser } from "../store/auth/thunks";
import { fetchModulos } from "../store/RolPermisoUsuario/thunks";

export const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const lastRevalidateAtRef = useRef(0);
  const inFlightRef = useRef(false);
  const lastResolvedUidRef = useRef(null);
  const lastAuthFingerprintRef = useRef("");

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

      const fetchData = async ({ allowRetry = true, force = false, syncModules = false } = {}) => {
        if (isCancelled) return;

        const now = Date.now();
        const minGapMs = 45 * 1000;
        if (!force && now - lastRevalidateAtRef.current < minGapMs) return;
        if (inFlightRef.current) return;

        inFlightRef.current = true;
        try {
          const current = await dispatch(fetchCurrentUser()).unwrap();
          lastRevalidateAtRef.current = Date.now();

          const resolvedUid =
            current?.user?.id ||
            current?.id ||
            localStorage.getItem("usuarioId") ||
            uid;

          const roleId = current?.user?.roleId ?? current?.roleId ?? null;
          const paisId = current?.user?.paisId ?? current?.paisId ?? null;
          const routes = current?.permissions?.routes || [];
          const perms = current?.permissions?.perms || [];
          const authFingerprint = JSON.stringify({
            resolvedUid,
            roleId,
            paisId,
            routes,
            perms,
          });

          const hasAuthChanges = authFingerprint !== lastAuthFingerprintRef.current;

          if (
            (syncModules || hasAuthChanges) &&
            resolvedUid &&
            String(resolvedUid) !== String(lastResolvedUidRef.current)
          ) {
            await dispatch(fetchModulos(resolvedUid)).unwrap();
            lastResolvedUidRef.current = resolvedUid;
          } else if ((syncModules || hasAuthChanges) && resolvedUid) {
            await dispatch(fetchModulos(resolvedUid)).unwrap();
          }

          lastAuthFingerprintRef.current = authFingerprint;
          lastResolvedUidRef.current = resolvedUid;
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
                fetchData({ allowRetry: false, force: true });
              }, 2000);
            }
          }
        } finally {
          inFlightRef.current = false;
        }
      };

      fetchData({ force: true, syncModules: true });

      const interval = setInterval(
        () => fetchData({ force: true, syncModules: true }),
        3 * 60 * 1000,
      );

      let focusTimer = null;
      const onFocus = () => {
        if (focusTimer) clearTimeout(focusTimer);
        focusTimer = setTimeout(() => {
          fetchData({ syncModules: false });
        }, 250);
      };

      const onVisible = () => {
        if (document.visibilityState === "visible") {
          fetchData({ syncModules: false });
        }
      };

      const onOnline = () => fetchData({ force: true, syncModules: true });

      const onSessionExpired = () => {
        if (document.visibilityState === "visible") {
          window.location.assign("/auth/login");
        }
      };

      window.addEventListener("focus", onFocus);
      document.addEventListener("visibilitychange", onVisible);
      window.addEventListener("online", onOnline);
      window.addEventListener("auth:session-expired", onSessionExpired);

      return () => {
        isCancelled = true;
        if (retryTimer) clearTimeout(retryTimer);
        if (focusTimer) clearTimeout(focusTimer);
        clearInterval(interval);
        window.removeEventListener("focus", onFocus);
        document.removeEventListener("visibilitychange", onVisible);
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
