import React, { useState, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  useDisclosure,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  useSteps,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  registerUser,
  sendSMSCode,
  verifyRegistrationPhone,
} from "../../../middleware/api";
import Step1Account from "./component/Step1Account";
import Step2Contact from "./component/Step2Contact";
import Step3Security from "./component/Step3Security";
import ErrorAlerts from "./component/ErrorAlerts";
import AnimatedBlobBackground from "../component/AnimatedBlobBackground";
import { BrandingPanel } from "./component/BrandingPanel";
import OTPVerificationModal from "./component/OTPVerificationModal";
import { RecaptchaStatus } from "../../../components/auth/RecaptchaStatus";

const steps = [
  { title: "Cuenta", description: "Información personal" },
  { title: "Contacto", description: "Correo y teléfono" },
  { title: "Seguridad", description: "Crea tu contraseña" },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { data: paises } = useSelector((state) => state.paises);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    contact: "",
    telefono: "",
    paisId: "",
    contrasena: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [recaptchaStatus, setRecaptchaStatus] = useState("idle");

  useEffect(() => {
    if (auth === "authenticated") navigate("/home", { replace: true });
  }, [auth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!formData.nombre.trim())
        newErrors.nombre = "El nombre es obligatorio";
      if (!formData.apellido.trim())
        newErrors.apellido = "El apellido es obligatorio";
      if (!formData.paisId) newErrors.paisId = "Selecciona un país";
    } else if (activeStep === 1) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      const phoneRegex = /^[\d\s()+-]+$/;
      if (
        !emailRegex.test(formData.contact) &&
        !phoneRegex.test(formData.contact)
      ) {
        newErrors.contact = "Ingresa un correo o teléfono válido";
      }

      if (emailRegex.test(formData.contact) && !formData.telefono) {
        newErrors.telefono = "El teléfono es obligatorio";
      }
    } else if (activeStep === 2) {
      if (!formData.contrasena)
        newErrors.contrasena = "La contraseña es obligatoria";
      if (formData.contrasena.length < 6)
        newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres";
      if (formData.contrasena !== formData.confirmPassword)
        newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        goToNext();
      }
    }
  };

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});
    setRecaptchaStatus("loading");

    if (!executeRecaptcha) {
      setErrors({ general: "Seguridad no disponible. Intente de nuevo." });
      setIsLoading(false);
      setRecaptchaStatus("error");
      return;
    }

    const captchaToken = await executeRecaptcha("register");
    if (!captchaToken) {
      setErrors({ general: "Error de seguridad. Intente de nuevo." });
      setIsLoading(false);
      setRecaptchaStatus("error");
      return;
    }

    setRecaptchaStatus("success");
    await new Promise((r) => setTimeout(r, 500));

    const emailRegex = /^\S+@\S+\.\S+$/;
    const { contact, telefono, ...rest } = formData;
    let payload;
    let phoneE164 = "";

    const pais = paises.find((p) => p.id == formData.paisId);
    let dialCode = "";
    if (pais?.dialCode) {
      dialCode = pais.dialCode.replace(/\s/g, "");
      dialCode = dialCode.startsWith("+") ? dialCode : "+" + dialCode;
    }

    if (emailRegex.test(contact)) {
      const correoNormalizado = contact.trim().toLowerCase();

      let finalPhone = null;
      if (telefono) {
        finalPhone = dialCode + telefono.replace(/\D+/g, "");
      }

      payload = {
        ...rest,
        correo: correoNormalizado,
        telefono: finalPhone,
        captchaToken,
      };

      const res = await registerUser(payload);
      setIsLoading(false);

      if (!res.ok) {
        setErrors({ general: res.errorMessage });
        return;
      }

      toast({
        title: "¡Registro Exitoso!",
        description: "Revisa tu correo para activar tu cuenta.",
        status: "success",
        duration: 5000,
      });
      navigate("/auth/login");
    } else {
      if (dialCode) {
        phoneE164 = dialCode + contact.replace(/\D+/g, "");
        payload = { ...rest, correo: null, telefono: phoneE164, captchaToken };

        const res = await registerUser(payload);
        setIsLoading(false);

        if (!res.ok) {
          setErrors({ general: res.errorMessage });
          setRecaptchaStatus("idle");
          return;
        }

        setRecaptchaStatus("loading");
        const smsCaptchaToken = await executeRecaptcha("register");
        if (!smsCaptchaToken) {
          setErrors({ general: "Error de seguridad al enviar SMS." });
          setIsLoading(false);
          setRecaptchaStatus("error");
          return;
        }
        setRecaptchaStatus("success");
        await new Promise((r) => setTimeout(r, 300));

        const sms = await sendSMSCode(phoneE164, smsCaptchaToken);
        if (!sms.ok) {
          setErrors({ general: sms.errorMessage });
          setRecaptchaStatus("idle");
          return;
        }
        setPendingPhone(phoneE164);
        onOpen();
      } else {
        setErrors({ paisId: "País inválido para registro por teléfono" });
        setIsLoading(false);
        return;
      }
    }
  };

  const handleVerifySMS = async () => {
    setIsLoading(true);
    const res = await verifyRegistrationPhone(pendingPhone, verifyCode.trim());
    setIsLoading(false);

    if (res.ok) {
      toast({
        title: "¡Cuenta Activada!",
        description: "Tu cuenta ha sido verificada con éxito.",
        status: "success",
        duration: 5000,
      });
      onClose();
      navigate("/auth/login");
    } else {
      toast({
        title: "Error de Verificación",
        description: res.errorMessage,
        status: "error",
      });
    }
  };

  return (
    <Box position="relative" minH={"100vh"}>
      <AnimatedBlobBackground />
      <Stack
        direction={{ base: "column", md: "row" }}
        minH={"100vh"}
        position="relative"
        zIndex={1}
      >
        <BrandingPanel display={{ base: "none", md: "flex" }} />
        <Flex p={1} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Stack
              spacing={4}
              bg={useColorModeValue("white", "gray.700")}
              rounded={"xl"}
              boxShadow={"lg"}
              p={4}
            >
              <Heading fontSize={"2xl"} textAlign="center">
                Crea tu Cuenta
              </Heading>
              <Stepper
                index={activeStep}
                colorScheme="green"
                size={{ base: "sm", md: "md" }}
                orientation={{ base: "vertical", md: "horizontal" }}
                my={6}
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box flexShrink="0" textAlign="left" ml={1}>
                      <VStack spacing={1} align="flex-start">
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                      </VStack>
                    </Box>
                  </Step>
                ))}
              </Stepper>

              <Box p={2}>
                <ErrorAlerts errors={errors} />
                {activeStep === 0 && (
                  <Step1Account
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                    errors={errors}
                  />
                )}
                {activeStep === 1 && (
                  <Step2Contact
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                  />
                )}
                {activeStep === 2 && (
                  <Step3Security
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                  />
                )}
              </Box>

              <RecaptchaStatus status={recaptchaStatus} />

              <HStack justify="space-between">
                <Button
                  onClick={goToPrevious}
                  isDisabled={activeStep === 0 || isLoading}
                >
                  Anterior
                </Button>
                {(activeStep !== steps.length - 1 ||
                  recaptchaStatus === "idle" ||
                  recaptchaStatus === "error") && (
                  <Button
                    colorScheme="green"
                    onClick={handleNext}
                    isLoading={isLoading}
                  >
                    {activeStep === steps.length - 1
                      ? "Crear Cuenta"
                      : "Siguiente"}
                  </Button>
                )}
              </HStack>

              <Text align={"center"}>
                ¿Ya tienes una cuenta?{" "}
                <Button
                  variant="link"
                  colorScheme="green"
                  onClick={() => navigate("/auth/login")}
                >
                  Inicia Sesión
                </Button>
              </Text>
            </Stack>
            <BrandingPanel
              display={{ base: "flex", md: "none" }}
              minH="150px"
              rounded="xl"
            />
          </Stack>
        </Flex>

        <OTPVerificationModal
          isOpen={isOpen}
          onClose={onClose}
          pendingPhone={pendingPhone}
          verifyCode={verifyCode}
          setVerifyCode={setVerifyCode}
          handleVerifySMS={handleVerifySMS}
          isLoading={isLoading}
        />
      </Stack>
    </Box>
  );
};

export default RegisterForm;
