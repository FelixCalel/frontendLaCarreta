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
  HStack,
  PinInput,
  PinInputField,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

import { BrandingPanel } from "../../components/auth/BrandingPanel";
import { LoginFormFields } from "../../components/auth/LoginFormFields";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";
import { RecaptchaStatus } from "../../components/auth/RecaptchaStatus";
import SEO from "../../components/SEO";

import { useLoginForm } from "./hooks/useLoginForm";

export const LoginForm = () => {
  const {
    error, recaptchaStatus, isLoading,
    is2FAOpen, on2FAClose,
    verifyCode, setVerifyCode, maskedPhone, isVerifying,
    handleSubmit, handleVerifyCode
  } = useLoginForm();

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
