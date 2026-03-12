import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  HStack,
  VStack,
} from "@chakra-ui/react";
import Step1Account from "./component/Step1Account";
import Step2Contact from "./component/Step2Contact";
import Step3Security from "./component/Step3Security";
import ErrorAlerts from "./component/ErrorAlerts";
import AnimatedBlobBackground from "../component/AnimatedBlobBackground";
import { BrandingPanel } from "./component/BrandingPanel";
import OTPVerificationModal from "./component/OTPVerificationModal";
import { RecaptchaStatus } from "../../../components/auth/RecaptchaStatus";
import { useRegisterForm } from "./hooks/useRegisterForm";

const steps = [
  { title: "Cuenta", description: "Información personal" },
  { title: "Contacto", description: "Correo y teléfono" },
  { title: "Seguridad", description: "Crea tu contraseña" },
];

const RegisterForm = () => {
  const {
    navigate, activeStep, goToPrevious, handleNext,
    formData, setFormData, handleChange,
    errors, isLoading, recaptchaStatus,
    isOpen, onClose, pendingPhone, verifyCode, setVerifyCode, handleVerifySMS
  } = useRegisterForm();

  return (
    <Box position="relative" minH={"100vh"}>
      <AnimatedBlobBackground />
      <Stack direction={{ base: "column", md: "row" }} minH={"100vh"} position="relative" zIndex={1}>
        <BrandingPanel display={{ base: "none", md: "flex" }} />
        <Flex p={1} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Stack
              spacing={4} bg={useColorModeValue("white", "gray.700")} rounded={"xl"} boxShadow={"lg"} p={4}
            >
              <Heading fontSize={"2xl"} textAlign="center">Crea tu Cuenta</Heading>
              <Stepper
                index={activeStep} colorScheme="green" size={{ base: "sm", md: "md" }}
                orientation={{ base: "vertical", md: "horizontal" }} my={6}
              >
                {steps.map((step) => (
                  <Step key={step.title}>
                    <StepIndicator>
                      <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
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
                  <Step1Account formData={formData} handleChange={handleChange} setFormData={setFormData} errors={errors} />
                )}
                {activeStep === 1 && (
                  <Step2Contact formData={formData} handleChange={handleChange} errors={errors} />
                )}
                {activeStep === 2 && (
                  <Step3Security formData={formData} handleChange={handleChange} errors={errors} />
                )}
              </Box>

              <RecaptchaStatus status={recaptchaStatus} />

              <HStack justify="space-between">
                <Button onClick={goToPrevious} isDisabled={activeStep === 0 || isLoading}>Anterior</Button>
                {(activeStep !== steps.length - 1 || recaptchaStatus === "idle" || recaptchaStatus === "error") && (
                  <Button colorScheme="green" onClick={handleNext} isLoading={isLoading}>
                    {activeStep === steps.length - 1 ? "Crear Cuenta" : "Siguiente"}
                  </Button>
                )}
              </HStack>

              <Text align={"center"}>
                ¿Ya tienes una cuenta?{" "}
                <Button variant="link" colorScheme="green" onClick={() => navigate("/auth/login")}>Inicia Sesión</Button>
              </Text>
            </Stack>
            <BrandingPanel display={{ base: "flex", md: "none" }} minH="150px" rounded="xl" />
          </Stack>
        </Flex>

        <OTPVerificationModal
          isOpen={isOpen} onClose={onClose} pendingPhone={pendingPhone}
          verifyCode={verifyCode} setVerifyCode={setVerifyCode}
          handleVerifySMS={handleVerifySMS} isLoading={isLoading}
        />
      </Stack>
    </Box>
  );
};
export default RegisterForm;
