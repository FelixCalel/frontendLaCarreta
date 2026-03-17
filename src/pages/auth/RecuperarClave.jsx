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

import { useRecuperarClave } from "./hooks/useRecuperarClave";

export const RecuperarClave = () => {
  const {
    identifier, setIdentifier,
    step, setStep,
    otp, setOtp,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    isLoading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    handleInitialSubmit,
    handleOtpSubmit,
    handlePasswordResetSubmit,
    verifyCode
  } = useRecuperarClave();

  const cardBg = useColorModeValue("whiteAlpha.900", "whiteAlpha.100");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const inputBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const inputBorder = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box position="relative" minH="100vh" w="100vw" overflow="hidden" bg="gray.900">
      <AnimatedBackground />
      <Flex minH="100vh" align="center" justify="center" position="relative" zIndex={1} px={4}>
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

