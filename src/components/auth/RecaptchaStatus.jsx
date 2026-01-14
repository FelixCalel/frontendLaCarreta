import React from "react";
import { HStack, Text, Spinner, Icon, Fade } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { SiGoogle } from "react-icons/si";

/**
 * @param {Object} props
 * @param {'idle' | 'loading' | 'success' | 'error'} props.status
 * @param {string} [props.errorMessage]
 */
export const RecaptchaStatus = ({ status, errorMessage }) => {
  if (status === "idle" || !status) return null;

  return (
    <Fade in={true}>
      <HStack
        spacing={2}
        p={2}
        justify="center"
        align="center"
        bg={status === "error" ? "red.50" : "gray.50"}
        rounded="md"
        border="1px solid"
        borderColor={status === "error" ? "red.100" : "gray.200"}
        minH="40px"
      >
        {(status === "loading" || status === "submitting") && (
          <>
            <Spinner size="sm" color="blue.500" speed="0.8s" thickness="2px" />
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              {status === "loading"
                ? "Verificando seguridad..."
                : "Iniciando sesión..."}
            </Text>
            {status === "loading" && (
              <Icon as={SiGoogle} color="gray.400" boxSize={3} ml={1} />
            )}
          </>
        )}

        {status === "success" && (
          <>
            <Icon as={CheckCircleIcon} color="green.500" boxSize={3} />
            <Text fontSize="xs" color="green.600" fontWeight="bold">
              Verificado
            </Text>
          </>
        )}

        {status === "error" && (
          <>
            <Icon as={WarningIcon} color="red.500" boxSize={3} />
            <Text fontSize="xs" color="red.600">
              {errorMessage || "Error de verificación"}
            </Text>
          </>
        )}
      </HStack>
    </Fade>
  );
};
