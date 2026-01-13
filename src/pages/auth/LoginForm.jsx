import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Flex,
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Text,
  useDisclosure,
  CircularProgress,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { startLogin, startVerifyLogin } from "../../store/auth/thunks";
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

  const {
    isOpen: is2FAOpen,
    onOpen: on2FAOpen,
    onClose: on2FAClose,
  } = useDisclosure();
  const [verifyUserId, setVerifyUserId] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (actualUsuario?.status === "authenticated") {
      navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  useEffect(() => {
    if (is2FAOpen && "OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          if (otp) setVerifyCode(otp.code);
        })
        .catch((err) => {
          console.log("WebOTP not used or aborted", err);
        });

      return () => {
        ac.abort();
      };
    }
  }, [is2FAOpen]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async ({ correo, contrasena }) => {
    setError("");
    setIsLoading(true);

    if (!executeRecaptcha) {
      console.warn("Recaptcha not yet available");
      setError("Verificación de seguridad no disponible. Intente de nuevo.");
      setIsLoading(false);
      return;
    }

    try {
      const captchaToken = await executeRecaptcha("login");
      const action = await dispatch(
        startLogin({ identifier: correo, contrasena, captchaToken })
      );

      if (startLogin.fulfilled.match(action)) {
        const payload = action.payload;
        if (payload.status === "2fa_required") {
          setVerifyUserId(payload.userId);
          setMaskedPhone(payload.maskedPhone || "");
          on2FAOpen();
        } else {
          navigate("/auth/home", { replace: true });
        }
      } else {
        const errMsg = action.payload || "Error al iniciar sesión";
        setError(errMsg);
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error inesperado al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      const action = await dispatch(
        startVerifyLogin({ userId: verifyUserId, code: verifyCode })
      );

      if (startVerifyLogin.fulfilled.match(action)) {
        on2FAClose();
        navigate("/auth/home", { replace: true });
      } else {
        setError(action.payload || "Código incorrecto");
        alert(action.payload || "Código incorrecto");
      }
    } catch (err) {
      console.error(err);
      alert("Error al verificar código");
    } finally {
      setIsVerifying(false);
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
        <Flex
          p={1}
          flex={1}
          align="center"
          justify="center"
          bg="transparent"
          direction="column"
        >
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

      {/* 2FA Modal */}
      <Modal
        isOpen={is2FAOpen}
        onClose={on2FAClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader>Verificación en Dos Pasos</ModalHeader>
          {/* Prevent closing if critical? Allows user to cancel if they want to retry login */}
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Hemos enviado un código de verificación a tu número terminación{" "}
              <b>{maskedPhone}</b>.
            </Text>
            <Input
              placeholder="Código de 6 dígitos"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              maxLength={6}
              type="number"
              autoComplete="one-time-code"
              textAlign="center"
              fontSize="2xl"
              letterSpacing="widest"
            />
            <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
              Detectando código automáticamente...
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              width="full"
              onClick={handleVerifyCode}
              isLoading={isVerifying}
            >
              Verificar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
