import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Flex, Stack, Button } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { startLoginWithEmailPassword } from "../../store/auth/thunks";
import { BrandingPanel } from "../../components/auth/BrandingPanel";
import { LoginFormFields } from "../../components/auth/LoginFormFields";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";
import SEO from "../../components/SEO";



export const LoginForm = () => {
  const actualUsuario = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (actualUsuario?.status === "authenticated") {
      navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  const handleSubmit = async ({ correo, contrasena }) => {
    setError("");
    setIsLoading(true);

    try {
      const resultAction = await dispatch(
        startLoginWithEmailPassword({ correo, contrasena })
      );

      if (startLoginWithEmailPassword.fulfilled.match(resultAction)) {
        navigate("/auth/home", { replace: true });
      } else {
        if (resultAction.payload) {
          setError(resultAction.payload);
        } else {
          setError("Error al iniciar sesión");
        }
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error inesperado al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box position="relative" minH="100vh" w="100vw" overflow="hidden">
      <SEO 
        title="Iniciar Sesión" 
        description="Inicia sesión en el Portal Administrativo de La Carreta. Gestiona tus pedidos, inventarios y reportes de forma segura." 
      />
      <AnimatedBackground />
      <Stack
        direction={{ base: "column", md: "row" }}
        minH="100vh"
        position="relative"
        zIndex={1}
      >
        <BrandingPanel display={{ base: "none", md: "flex" }} />
        <Flex p={1} flex={1} align="center" justify="center" bg="transparent" direction="column">
          <LoginFormFields
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
          {/* SEO Footer Links */}
          <Stack direction="row" spacing={4} mt={8}>
            <Button
              as="a"
              href="https://chat.whatsapp.com/FqaqKawbkrO5yOJUMcvruf"
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FaWhatsapp />}
              colorScheme="green"
              variant="outline"
              size="sm"
              rounded="full"
              px={4}
            >
              Soporte WhatsApp
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </Box>
  );
};
