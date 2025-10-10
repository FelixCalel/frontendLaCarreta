import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

export const useAuthError = () => {
  const toast = useToast();

  const handleAuthError = useCallback(
    (error, options = {}) => {
      const {
        autoClose = null,
        redirectTo = null,
        customMessage = null,
      } = options;

      const isAuthError =
        error?.code === "SESSION_EXPIRED" ||
        error?.code === "AUTH_ERROR" ||
        error?.code === "REFRESH_FAILED" ||
        error?.message?.includes("jwt expired") ||
        error?.message?.includes("You are not logged in") ||
        error?.response?.status === 401;

      if (isAuthError) {
        let title = "Sesión expirada";
        let description =
          customMessage ||
          error?.message ||
          "Tu sesión ha expirado. Por favor, recarga la página e inicia sesión nuevamente.";

        if (error?.code === "SESSION_EXPIRED") {
          title = "Sesión expirada";
        } else if (error?.code === "REFRESH_FAILED") {
          title = "Error de conexión";
          description =
            "No se pudo renovar tu sesión. Por favor, inicia sesión nuevamente.";
        } else if (error?.message?.includes("jwt expired")) {
          title = "Token expirado";
          description = "Tu sesión ha expirado automáticamente. Recargando...";
        }

        toast({
          title,
          description,
          status: "warning",
          duration: 8000,
          isClosable: true,
          position: "top-right",
        });

        if (autoClose && typeof autoClose === "function") {
          setTimeout(() => autoClose(), 1000);
        }

        if (redirectTo) {
          setTimeout(() => {
            if (typeof redirectTo === "string") {
              window.location.href = redirectTo;
            } else if (typeof redirectTo === "function") {
              redirectTo();
            }
          }, 2000);
        }

        return true;
      }

      return false;
    },
    [toast]
  );

  return { handleAuthError };
};

export const useModalAuthError = (onClose) => {
  const { handleAuthError: baseHandler } = useAuthError();

  const handleAuthError = useCallback(
    (error) => {
      return baseHandler(error, { autoClose: onClose });
    },
    [baseHandler, onClose]
  );

  return { handleAuthError };
};

export const useErrorHandler = () => {
  const { handleAuthError } = useAuthError();
  const toast = useToast();

  const handleError = useCallback(
    (error, fallbackMessage = "Ha ocurrido un error inesperado") => {
      if (handleAuthError(error)) {
        return;
      }

      const errorMessage =
        error?.message ||
        error?.error ||
        error?.response?.data?.message ||
        fallbackMessage;

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    [handleAuthError, toast]
  );

  return { handleError, handleAuthError };
};
