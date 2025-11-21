import React, { useState, useEffect } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
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
  keyframes,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  registerUser,
  sendSMSCode,
  verifySMSCode,
} from "../../../middleware/api";
import Step1Account from "./component/Step1Account";
import Step2Contact from "./component/Step2Contact";
import Step3Security from "./component/Step3Security";
import ErrorAlerts from "./component/ErrorAlerts";
import AnimatedBlobBackground from "../component/AnimatedBlobBackground";

const steps = [
  { title: "Cuenta", description: "Información personal" },
  { title: "Contacto", description: "Correo y teléfono" },
  { title: "Seguridad", description: "Crea tu contraseña" },
];

const float = keyframes`
  0% { transform: translateY(10vh); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-120vh); opacity: 0; }
`;

const AnimatedBackground = React.memo(() => {
  const icons = React.useMemo(
    () => ["🍍", "🍎", "🛒", "🛍️", "🥦", "🥖", "🧀", "🍇"],
    []
  );
  const bg = useColorModeValue("green.50", "gray.900");

  const animatedElements = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, index) => {
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 15;
      const animation = `${float} ${duration}s linear ${delay}s infinite`;
      return (
        <Text
          key={index}
          position="absolute"
          bottom="-20%"
          left={`${Math.random() * 95}%`}
          fontSize={`${Math.random() * 1.5 + 0.75}rem`}
          animation={animation}
          opacity={0}
        >
          {icons[Math.floor(Math.random() * icons.length)]}
        </Text>
      );
    });
  }, [icons]);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      bg={bg}
      zIndex={0}
    >
      {animatedElements}
    </Box>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";

const BrandingPanel = React.memo(({ ...props }) => (
  <Flex
    flex={1}
    align={"center"}
    justify={"center"}
    position="relative"
    {...props}
  >
    <AnimatedBackground />
    <Stack spacing={4} w={"full"} maxW={"md"} p={8} zIndex={1}>
      <Heading
        fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
        color={useColorModeValue("green.700", "green.200")}
      >
        Gestiona tus Pedidos con La Carreta
      </Heading>
      <Text
        fontSize={{ base: "md", lg: "lg" }}
        color={useColorModeValue("gray.600", "gray.300")}
      >
        Regístrate para acceder a nuestro sistema y optimizar tus pedidos de
        forma rápida, fácil y segura.
      </Text>
    </Stack>
  </Flex>
));

BrandingPanel.displayName = "BrandingPanel";

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

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    const emailRegex = /^\S+@\S+\.\S+$/;
    const { contact, telefono, ...rest } = formData;
    let payload;
    let phoneE164 = "";

    if (emailRegex.test(contact)) {
      const correoNormalizado = contact.trim().toLowerCase();
      payload = {
        ...rest,
        correo: correoNormalizado,
        telefono: telefono ? telefono.replace(/\D+/g, "") : null,
      };
    } else {
      const pais = paises.find((p) => p.id == formData.paisId);
      if (pais?.dialCode) {
        phoneE164 =
          pais.dialCode.replace(/\s/g, "") + contact.replace(/\D+/g, "");
        payload = { ...rest, correo: null, telefono: phoneE164 };
      } else {
        setErrors({ paisId: "País inválido para registro por teléfono" });
        setIsLoading(false);
        return;
      }
    }

    const res = await registerUser(payload);
    setIsLoading(false);

    if (!res.ok) {
      setErrors({ general: res.errorMessage });
      return;
    }

    if (phoneE164 && !emailRegex.test(contact)) {
      const sms = await sendSMSCode(phoneE164);
      if (!sms.ok) {
        setErrors({ general: sms.errorMessage });
        return;
      }
      setPendingPhone(phoneE164);
      onOpen();
      toast({
        title: "Código enviado",
        description: "Revisa tu SMS para verificar tu cuenta.",
        status: "info",
      });
    } else {
      toast({
        title: "¡Registro Exitoso!",
        description: "Revisa tu correo para activar tu cuenta.",
        status: "success",
      });
      navigate("/auth/login");
    }
  };

  const handleVerifySMS = async () => {
    setIsLoading(true);
    const res = await verifySMSCode(pendingPhone, verifyCode.trim());
    setIsLoading(false);

    if (res.ok) {
      toast({
        title: "¡Cuenta Activada!",
        description: "Tu cuenta ha sido verificada con éxito.",
        status: "success",
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

              <HStack justify="space-between">
                <Button
                  onClick={goToPrevious}
                  isDisabled={activeStep === 0 || isLoading}
                >
                  Anterior
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleNext}
                  isLoading={isLoading}
                >
                  {activeStep === steps.length - 1
                    ? "Crear Cuenta"
                    : "Siguiente"}
                </Button>
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

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Verificar Teléfono</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={3}>
                Hemos enviado un SMS al <b>{pendingPhone}</b>. Ingresa el código
                para activar tu cuenta.
              </Text>
              <Input
                placeholder="Código SMS"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                maxLength={6}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="green"
                mr={3}
                onClick={handleVerifySMS}
                isLoading={isLoading}
              >
                Verificar
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </Box>
  );
};

export default RegisterForm;
