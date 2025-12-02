import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Link,
  InputGroup,
  InputLeftElement,
  Icon,
  Heading,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { sendPasswordResetEmail } from "../../store/auth/thunks";
import { FaEnvelope, FaArrowLeft, FaLock } from "react-icons/fa";
// import axios from "axios"; // Removed axios
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";

export const RecuperarClave = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resultAction = await dispatch(sendPasswordResetEmail(email));

      if (sendPasswordResetEmail.fulfilled.match(resultAction)) {
        toast({
          title: "Correo enviado",
          description: resultAction.payload.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setEmail(""); // Limpiar el campo
      } else {
        toast({
          title: "Error",
          description: resultAction.payload || "Hubo un error al enviar el correo.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error inesperado.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Fondo Animado */}
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
                Recuperar Contraseña
              </Heading>
              <Text color={subTextColor} fontSize="md">
                Ingresa tu correo electrónico y te enviaremos un enlace para
                restablecer tu acceso.
              </Text>
            </VStack>

            <FormControl isRequired>
              <FormLabel color={textColor} fontWeight="medium">
                Correo Electrónico
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaEnvelope} color="gray.500" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg={inputBg}
                  border="1px solid"
                  borderColor={inputBorder}
                  color={textColor}
                  _hover={{ borderColor: "green.400" }}
                  _focus={{
                    borderColor: "green.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-green-400)",
                  }}
                  size="lg"
                  rounded="xl"
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
              loadingText="Enviando..."
              fontWeight="bold"
            >
              Enviar Enlace
            </Button>

            <Link
              href="/auth/login"
              display="flex"
              alignItems="center"
              color="gray.400"
              _hover={{ color: "green.400", textDecoration: "none" }}
              fontSize="sm"
              fontWeight="medium"
              transition="all 0.2s"
            >
              <Icon as={FaArrowLeft} mr={2} />
              Volver al inicio de sesión
            </Link>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default RecuperarClave;
