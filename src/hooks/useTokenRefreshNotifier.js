import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

export const useTokenRefreshNotifier = () => {
  const toast = useToast();

  useEffect(() => {
    const handleTokenRefresh = () => {
      toast({
        title: "🔄 Renovando sesión",
        description: "Tu sesión se está renovando automáticamente...",
        status: "info",
        duration: 2000,
        isClosable: false,
        position: "top-right",
      });
    };

    const handleTokenRefreshSuccess = () => {
      toast({
        title: "✅ Sesión renovada",
        description: "Tu sesión se ha renovado exitosamente",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top-right",
      });
    };

    const handleTokenRefreshError = (event) => {
      toast({
        title: "❌ Error de sesión",
        description:
          event.detail?.message ||
          "No se pudo renovar tu sesión. Por favor, inicia sesión nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    };

    window.addEventListener("token-refresh-start", handleTokenRefresh);
    window.addEventListener("token-refresh-success", handleTokenRefreshSuccess);
    window.addEventListener("token-refresh-error", handleTokenRefreshError);

    return () => {
      window.removeEventListener("token-refresh-start", handleTokenRefresh);
      window.removeEventListener(
        "token-refresh-success",
        handleTokenRefreshSuccess
      );
      window.removeEventListener(
        "token-refresh-error",
        handleTokenRefreshError
      );
    };
  }, [toast]);
};

export const tokenRefreshEvents = {
  start: () => {
    window.dispatchEvent(new CustomEvent("token-refresh-start"));
  },

  success: () => {
    window.dispatchEvent(new CustomEvent("token-refresh-success"));
  },

  error: (message) => {
    window.dispatchEvent(
      new CustomEvent("token-refresh-error", {
        detail: { message },
      })
    );
  },
};
