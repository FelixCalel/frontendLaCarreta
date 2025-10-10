import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";

export const useSessionValidator = () => {
  const toast = useToast();

  useEffect(() => {
    const checkInitialSession = () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!accessToken && !refreshToken) {
        console.log("⚠️ No hay sesión activa - usuario necesita hacer login");
        return;
      }

      if (refreshToken && !accessToken) {
        console.log(
          "ℹ️ Hay refresh token pero no access token - se renovará automáticamente"
        );
        return;
      }

      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          const timeToExpiry = payload.exp - currentTime;

          if (timeToExpiry <= 0) {
            console.log(
              "⚠️ Access token expirado, pero hay refresh token disponible"
            );
          } else {
            console.log(
              `✅ Sesión válida - expira en ${Math.floor(
                timeToExpiry / 60
              )} minutos`
            );
          }
        } catch (error) {
          console.log("⚠️ Access token malformado:", error);
          localStorage.removeItem("access_token");
        }
      }
    };

    checkInitialSession();

    const interval = setInterval(checkInitialSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useSessionValidator;
