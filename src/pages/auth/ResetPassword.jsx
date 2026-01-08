import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Icon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset, checkActionCode } from "firebase/auth";
import { auth } from "../../middleware/firebase-config";
import { useDispatch } from "react-redux";
import { resetPasswordWithToken } from "../../store/auth/thunks";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!oobCode) {
      toast({
        title: "Enlace inválido",
        description: "El enlace de recuperación no es válido o ha expirado.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/auth/login");
    }
  }, [oobCode, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get email from the code
      const info = await checkActionCode(auth, oobCode);
      const email = info["data"]["email"];

      // 2. Update Firebase
      await confirmPasswordReset(auth, oobCode, newPassword);

      // 3. Update Backend (Postgres)
      const resultAction = await dispatch(
        resetPasswordWithToken({
          correo_electronico: email,
          token: "firebase-verified", // Backend ignores token for this endpoint, acts as trusted update
          clave: newPassword,
        })
      );

      if (!resetPasswordWithToken.fulfilled.match(resultAction)) {
        throw new Error(
          resultAction.payload || "Error al actualizar en servidor."
        );
      }

      toast({
        title: "Contraseña restablecida",
        description:
          "Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/auth/login");
    } catch (error) {
      let errorMessage = "Hubo un error al restablecer la contraseña.";
      if (error.code === "auth/expired-action-code") {
        errorMessage = "El enlace ha expirado. Por favor solicita uno nuevo.";
      } else if (error.code === "auth/invalid-action-code") {
        errorMessage = "El enlace no es válido.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es muy débil.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos Premium Dark Mode
  const cardBg = useColorModeValue("whiteAlpha.900", "whiteAlpha.100");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const inputBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const inputBorder = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      position="relative"
      minH="100vh"
      w="100vw"
      overflow="hidden"
      bg="gray.900"
    >
      <AnimatedBackground />

      <Flex
        minH="100vh"
        align="center"
        justify="center"
        position="relative"
        zIndex={1}
        px={4}
      >
        <Box
          w="full"
          maxW="md"
          bg={cardBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={borderColor}
          rounded="2xl"
          boxShadow="2xl"
          p={{ base: 8, md: 10 }}
          as="form"
          onSubmit={handleSubmit}
        >
          <VStack spacing={6}>
            <Box
              p={3}
              bgGradient="linear(to-br, green.400, teal.600)"
              rounded="full"
              color="white"
              boxShadow="lg"
            >
              <Icon as={FaLock} w={6} h={6} />
            </Box>

            <VStack spacing={2} textAlign="center">
              <Heading size="lg" color={textColor} fontWeight="bold">
                Nueva Contraseña
              </Heading>
              <Text color={subTextColor} fontSize="md">
                Ingresa tu nueva contraseña para recuperar el acceso a tu
                cuenta.
              </Text>
            </VStack>

            <FormControl isRequired>
              <FormLabel color={textColor}>Nueva Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  bg={inputBg}
                  border="1px solid"
                  borderColor={inputBorder}
                  color={textColor}
                  _hover={{ borderColor: "green.400" }}
                  _focus={{
                    borderColor: "green.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-green-400)",
                  }}
                  rounded="xl"
                  size="lg"
                  placeholder="********"
                />
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    color="gray.500"
                    _hover={{ bg: "transparent", color: "green.400" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Confirmar Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg={inputBg}
                  border="1px solid"
                  borderColor={inputBorder}
                  color={textColor}
                  _hover={{ borderColor: "green.400" }}
                  _focus={{
                    borderColor: "green.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-green-400)",
                  }}
                  rounded="xl"
                  size="lg"
                  placeholder="********"
                />
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              w="full"
              size="lg"
              colorScheme="green"
              bgGradient="linear(to-r, green.400, teal.500)"
              _hover={{
                bgGradient: "linear(to-r, green.500, teal.600)",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              _active={{ transform: "translateY(0)" }}
              rounded="xl"
              isLoading={isLoading}
              loadingText="Actualizando..."
              fontWeight="bold"
            >
              Restablecer Contraseña
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ResetPassword;
