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
  InputRightElement,
  Icon,
  Heading,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  requestSmsRecovery,
  verifySmsRecovery,
  resetPasswordSms,
} from "../../store/auth/thunks";
import { FaEnvelope, FaArrowLeft, FaLock } from "react-icons/fa";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";

export const RecuperarClave = () => {
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState(1); // 1: Input, 2: OTP, 3: New Password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEmail(identifier)) {
      // --- EMAIL FLOW (Existing) ---
      try {
        const resultAction = await dispatch(sendPasswordResetEmail(identifier));
        if (sendPasswordResetEmail.fulfilled.match(resultAction)) {
          toast({
            title: "Correo enviado",
            description: resultAction.payload.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          navigate("/auth/login");
        } else {
          throw new Error(resultAction.payload || "Error al enviar correo.");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // --- SMS FLOW (New) ---
      // Basic phone validation logic could be improved here or rely on backend
      try {
        const resultAction = await dispatch(requestSmsRecovery(identifier));
        if (requestSmsRecovery.fulfilled.match(resultAction)) {
          toast({
            title: "Código enviado",
            description: `Se envió un código a tu número ${resultAction.payload.maskedPhone}`,
            status: "success",
            duration: 3000,
            position: "top-right",
          });
          setStep(2); // Move to OTP step
        } else {
          throw new Error(resultAction.payload || "Error al enviar SMS.");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resultAction = await dispatch(
        verifySmsRecovery({ telefono: identifier, code: otp })
      );
      if (verifySmsRecovery.fulfilled.match(resultAction)) {
        setResetToken(resultAction.payload.token);
        setStep(3); // Move to Reset Password step
        toast({
          title: "Código verificado",
          status: "success",
          duration: 2000,
          position: "top-right",
        });
      } else {
        throw new Error(resultAction.payload || "Código inválido.");
      }
    } catch (error) {
      toast({
        title: "Error de Verificación",
        description: error.message,
        status: "error",
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        status: "error",
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres.",
        status: "error",
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    try {
      const resultAction = await dispatch(
        resetPasswordSms({ token: resetToken, nuevaClave: newPassword })
      );
      if (resetPasswordSms.fulfilled.match(resultAction)) {
        toast({
          title: "Contraseña Restablecida",
          description: "Tu contraseña ha sido actualizada exitosamente.",
          status: "success",
          duration: 5000,
          position: "top-right",
        });
        navigate("/auth/login");
      } else {
        throw new Error(resultAction.payload || "Error al cambiar contraseña.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
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

  // --- RENDER HELPERS ---

  const renderStep1 = () => (
    <VStack spacing={6} as="form" onSubmit={handleInitialSubmit} w="full">
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={textColor} fontWeight="bold">
          Recuperar Contraseña
        </Heading>
        <Text color={subTextColor} fontSize="md">
          Ingresa tu correo o teléfono para recibir un código de recuperación.
        </Text>
      </VStack>

      <FormControl isRequired>
        <FormLabel
          color={textColor}
          fontWeight="medium"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Icon as={FaEnvelope} color="gray.500" /> Correo Electrónico o
          Teléfono
        </FormLabel>
        <InputGroup>
          <Input
            type="text"
            placeholder="ejemplo@correo.com o 3210..."
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
        rounded="xl"
        isLoading={isLoading}
        loadingText="Verificando..."
        fontWeight="bold"
      >
        Continuar
      </Button>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={6} as="form" onSubmit={handleOtpSubmit} w="full">
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={textColor} fontWeight="bold">
          Verificar Código
        </Heading>
        <Text color={subTextColor} fontSize="md">
          Ingresa el código de 6 dígitos que enviamos a tu teléfono.
        </Text>
      </VStack>

      <FormControl isRequired>
        <FormLabel color={textColor} fontWeight="medium">
          Código PIN
        </FormLabel>
        <Input
          type="text"
          placeholder="123456"
          maxLength={6}
          textAlign="center"
          letterSpacing="0.5em"
          fontSize="2xl"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
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
          autoComplete="one-time-code"
        />
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
        rounded="xl"
        isLoading={isLoading}
        loadingText="Verificando..."
        fontWeight="bold"
      >
        Verificar Código
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setStep(1)}
        isDisabled={isLoading}
      >
        Cambiar número de teléfono
      </Button>
    </VStack>
  );

  const renderStep3 = () => (
    <VStack spacing={6} as="form" onSubmit={handlePasswordResetSubmit} w="full">
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={textColor} fontWeight="bold">
          Nueva Contraseña
        </Heading>
        <Text color={subTextColor} fontSize="md">
          Ingresa y confirma tu nueva contraseña segura.
        </Text>
      </VStack>

      <FormControl isRequired>
        <FormLabel color={textColor} fontWeight="medium">
          Nueva Contraseña
        </FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="********"
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
            size="lg"
            rounded="xl"
          />
          <InputLeftElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </Button>
          </InputLeftElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel color={textColor} fontWeight="medium">
          Confirmar Contraseña
        </FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
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
            size="lg"
            rounded="xl"
          />
          <InputLeftElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              variant="ghost"
            >
              {showConfirmPassword ? "Ocultar" : "Mostrar"}
            </Button>
          </InputLeftElement>
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
        rounded="xl"
        isLoading={isLoading}
        loadingText="Actualizando..."
        fontWeight="bold"
      >
        Restablecer Contraseña
      </Button>
    </VStack>
  );

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

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

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
