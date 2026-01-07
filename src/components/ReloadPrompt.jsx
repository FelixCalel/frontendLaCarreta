// import { useRegisterSW } from "virtual:pwa-register/react";
const useRegisterSW = () => ({
  offlineReady: [false, () => {}],
  needRefresh: [false, () => {}],
  updateServiceWorker: () => {},
});
import {
  Box,
  Button,
  Text,
  useToast,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FiRefreshCw, FiCheckCircle } from "react-icons/fi";

export function ReloadPrompt() {
  const toast = useToast();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {},
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    if (offlineReady) {
      toast({
        position: "bottom-right",
        render: () => (
          <Box
            color="white"
            p={4}
            bg="teal.600"
            borderRadius="md"
            boxShadow="lg"
            display="flex"
            alignItems="center"
            gap={3}
          >
            <Icon as={FiCheckCircle} boxSize={6} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">Listo para trabajar sin conexión</Text>
              <Text fontSize="sm">La aplicación se ha guardado en caché.</Text>
            </VStack>
            <Button
              size="sm"
              variant="ghost"
              onClick={close}
              _hover={{ bg: "teal.700" }}
            >
              Cerrar
            </Button>
          </Box>
        ),
        duration: 5000,
        isClosable: true,
      });
      setOfflineReady(false);
    }
  }, [offlineReady, toast, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      toast({
        position: "bottom-right",
        duration: null,
        render: () => (
          <Box
            color="white"
            p={5}
            bg="blue.600"
            borderRadius="lg"
            boxShadow="2xl"
            border="1px solid"
            borderColor="blue.400"
            display="flex"
            flexDirection="column"
            gap={3}
            maxWidth="350px"
          >
            <HStack spacing={3}>
              <Icon as={FiRefreshCw} boxSize={6} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="lg">
                  Nueva versión disponible
                </Text>
                <Text fontSize="sm" opacity={0.9}>
                  Hay una actualización lista. Actualiza para ver los cambios.
                </Text>
              </VStack>
            </HStack>
            <HStack justifyContent="flex-end" width="100%" pt={2}>
              <Button
                size="sm"
                variant="outline"
                colorScheme="whiteAlpha"
                onClick={close}
                _hover={{ bg: "whiteAlpha.200" }}
              >
                Ahora no
              </Button>
              <Button
                size="sm"
                bg="white"
                color="blue.600"
                onClick={() => updateServiceWorker(true)}
                _hover={{ bg: "gray.100" }}
                leftIcon={<FiRefreshCw />}
              >
                Actualizar
              </Button>
            </HStack>
          </Box>
        ),
      });
    }
  }, [needRefresh, toast, updateServiceWorker]);

  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.unregister();
          console.log(
            "Service Worker unregistered in dev mode to prevent logs."
          );
        }
      });
    }
  }, []);

  return null;
}
