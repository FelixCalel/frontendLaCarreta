import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmailCode } from "../../store/auth/thunks";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    status: "verifying",
    message: "Verificando tu correo electrónico...",
  });

  const oobCode = searchParams.get("oobCode");

  const effectRan = useRef(false);


  useEffect(() => {
    if (effectRan.current === true || !oobCode) return;

    const verifyCode = async () => {
      effectRan.current = true;

      try {
        const resultAction = await dispatch(verifyEmailCode(oobCode));

        if (verifyEmailCode.fulfilled.match(resultAction)) {
          setState({
            status: "success",
            message: resultAction.payload.message,
          });

          setTimeout(() => {
            navigate("/auth/login", { replace: true });
          }, 3000);
        } else {
          setState({
            status: "error",
            message: resultAction.payload || "Hubo un error al verificar el correo.",
          });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setState({
          status: "error",
          message: "Hubo un error inesperado al verificar el correo.",
        });
      }
    };

    verifyCode();
  }, [oobCode]);

  const cardBg = useColorModeValue("whiteAlpha.900", "whiteAlpha.100");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
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
          textAlign="center"
        >
          <VStack spacing={6}>
            {state.status === "verifying" && (
              <>
                <Spinner size="xl" color="green.400" thickness="4px" />
                <Heading size="md" color={textColor}>
                  Verificando...
                </Heading>
              </>
            )}

            {state.status === "success" && (
              <>
                <Box
                  p={3}
                  bgGradient="linear(to-br, green.400, teal.600)"
                  rounded="full"
                  color="white"
                  boxShadow="lg"
                >
                  <Icon as={FaCheckCircle} w={8} h={8} />
                </Box>
                <Heading size="lg" color={textColor} fontWeight="bold">
                  ¡Verificado!
                </Heading>
                <Text color={subTextColor} fontSize="md">
                  {state.message}
                </Text>
                <Text color={subTextColor} fontSize="sm" mt={2}>
                  Redirigiendo al inicio de sesión en unos segundos...
                </Text>
                <Button
                  w="full"
                  size="lg"
                  colorScheme="green"
                  bgGradient="linear(to-r, green.400, teal.500)"
                  _hover={{
                    bgGradient: "linear(to-r, green.500, teal.600)",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  rounded="xl"
                  onClick={() => navigate("/auth/login", { replace: true })}
                >
                  Ir al Inicio de Sesión
                </Button>
              </>
            )}

            {state.status === "error" && (
              <>
                <Box
                  p={3}
                  bgGradient="linear(to-br, red.400, pink.600)"
                  rounded="full"
                  color="white"
                  boxShadow="lg"
                >
                  <Icon as={FaTimesCircle} w={8} h={8} />
                </Box>
                <Heading size="lg" color={textColor} fontWeight="bold">
                  Error
                </Heading>
                <Text color={subTextColor} fontSize="md">
                  {state.message}
                </Text>
                <Button
                  w="full"
                  size="lg"
                  variant="outline"
                  colorScheme="whiteAlpha"
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ bg: "whiteAlpha.100" }}
                  rounded="xl"
                  onClick={() => navigate("/auth/login")}
                >
                  Volver al Inicio
                </Button>
              </>
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default VerifyEmail;
