import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { startLoginWithEmailPassword } from "../../store/auth/thunks";
import { BrandingPanel } from "../../components/auth/BrandingPanel";
import { LoginFormFields } from "../../components/auth/LoginFormFields";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";



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
      <AnimatedBackground />
      <Stack
        direction={{ base: "column", md: "row" }}
        minH="100vh"
        position="relative"
        zIndex={1}
      >
        <BrandingPanel display={{ base: "none", md: "flex" }} />
        <Flex p={1} flex={1} align="center" justify="center" bg="transparent">
          <LoginFormFields
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Flex>
      </Stack>
    </Box>
  );
};
