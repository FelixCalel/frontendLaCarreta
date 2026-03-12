import { useState, useEffect } from "react";
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
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";
import { RecuperarPaso1 } from "./componentes/recuperar/RecuperarPaso1";
import { RecuperarPaso2 } from "./componentes/recuperar/RecuperarPaso2";
import { RecuperarPaso3 } from "./componentes/recuperar/RecuperarPaso3";

export const RecuperarClave = () => {
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState(1); // 1: Input, 2: OTP, 3: New Password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2 && "OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          if (otp) {
            setOtp(otp.code);
            setTimeout(() => verifyCode(otp.code), 0);
          }
        })
        .catch((err) => {
          console.log("WebOTP Error or Timeout:", err);
        });

      return () => {
        ac.abort();
      };
    }
  }, [step]);

  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEmail(identifier)) {
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
          setStep(2);
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

  const verifyCode = async (code) => {
    setIsLoading(true);
    try {
      const resultAction = await dispatch(
        verifySmsRecovery({ telefono: identifier, code }),
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
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      verifyCode(otp);
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
        resetPasswordSms({ token: resetToken, nuevaClave: newPassword }),
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

            {step === 1 && (
              <RecuperarPaso1
                handleInitialSubmit={handleInitialSubmit}
                identifier={identifier}
                setIdentifier={setIdentifier}
                isLoading={isLoading}
                textColor={textColor}
                subTextColor={subTextColor}
                inputBg={inputBg}
                inputBorder={inputBorder}
              />
            )}
            {step === 2 && (
              <RecuperarPaso2
                handleOtpSubmit={handleOtpSubmit}
                otp={otp}
                setOtp={setOtp}
                verifyCode={verifyCode}
                isLoading={isLoading}
                setStep={setStep}
                textColor={textColor}
                subTextColor={subTextColor}
                inputBg={inputBg}
                inputBorder={inputBorder}
              />
            )}
            {step === 3 && (
              <RecuperarPaso3
                handlePasswordResetSubmit={handlePasswordResetSubmit}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                isLoading={isLoading}
                textColor={textColor}
                subTextColor={subTextColor}
                inputBg={inputBg}
                inputBorder={inputBorder}
              />
            )}

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

