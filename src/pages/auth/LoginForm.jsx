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
  HStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { startLogin, startVerifyLogin } from "../../store/auth/thunks";
import { BrandingPanel } from "../../components/auth/BrandingPanel";
import { LoginFormFields } from "../../components/auth/LoginFormFields";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";
import { RecaptchaStatus } from "../../components/auth/RecaptchaStatus";
import SEO from "../../components/SEO";

export const LoginForm = () => {
  const actualUsuario = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [recaptchaStatus, setRecaptchaStatus] = useState("idle");
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
          if (otp) {
            setVerifyCode(otp.code);
            setTimeout(() => handleVerifyCode(otp.code), 0);
          }
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
    setRecaptchaStatus("loading");

    if (!executeRecaptcha) {
      console.warn("Recaptcha not yet available");
      setError("Verificación de seguridad no disponible. Intente de nuevo.");
      setIsLoading(false);
      setRecaptchaStatus("error");
      return;
    }

    try {
      const captchaToken = await executeRecaptcha("login");
      setRecaptchaStatus("success");
      await new Promise((r) => setTimeout(r, 500));

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
        setRecaptchaStatus("idle");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error inesperado al iniciar sesión.");
      setRecaptchaStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (codeToVerify) => {
    const code = typeof codeToVerify === "string" ? codeToVerify : verifyCode;
    setIsVerifying(true);
    try {
      const action = await dispatch(
        startVerifyLogin({ userId: verifyUserId, code })
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
            recaptchaStatus={recaptchaStatus}
          />
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

      <Modal
        isOpen={is2FAOpen}
        onClose={on2FAClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader>Verificación en Dos Pasos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Hemos enviado un código de verificación a tu número terminación{" "}
              <b>{maskedPhone}</b>.
            </Text>
            <HStack justify="center" spacing={2} mb={4}>
              <PinInput
                otp
                type="number"
                size="lg"
                value={verifyCode}
                onChange={(value) => setVerifyCode(value)}
                onComplete={(value) => handleVerifyCode(value)}
                autoFocus
              >
                <PinInputField
                  w={12}
                  h={14}
                  fontSize="2xl"
                  rounded="lg"
                  _focus={{ borderColor: "green.400", boxShadow: "outline" }}
                />
                <PinInputField
                  w={12}
                  h={14}
                  fontSize="2xl"
                  rounded="lg"
                  _focus={{ borderColor: "green.400", boxShadow: "outline" }}
                />
                <PinInputField
                  w={12}
                  h={14}
                  fontSize="2xl"
                  rounded="lg"
                  _focus={{ borderColor: "green.400", boxShadow: "outline" }}
                />
                <PinInputField
                  w={12}
                  h={14}
                  fontSize="2xl"
                  rounded="lg"
                  _focus={{ borderColor: "green.400", boxShadow: "outline" }}
                />
                <PinInputField
                  w={12}
                  h={14}
                  fontSize="2xl"
                  rounded="lg"
                  _focus={{ borderColor: "green.400", boxShadow: "outline" }}
                />
                <PinInputField
                  w={12}
                  h={14}
                  fontSize="2xl"
                  rounded="lg"
                  _focus={{ borderColor: "green.400", boxShadow: "outline" }}
                />
              </PinInput>
            </HStack>
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
