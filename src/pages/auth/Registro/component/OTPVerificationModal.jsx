import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  PinInput,
  PinInputField,
  HStack,
} from "@chakra-ui/react";

const OTPVerificationModal = ({
  isOpen,
  onClose,
  pendingPhone,
  verifyCode,
  setVerifyCode,
  handleVerifySMS,
  isLoading,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const applyOtpCandidate = (value) => {
      const code = String(value || "")
        .replace(/\D/g, "")
        .slice(0, 6);

      if (code.length !== 6) return false;

      setVerifyCode(code);
      setTimeout(() => handleVerifySMS(code), 0);
      return true;
    };

    const ac = new AbortController();

    if ("OTPCredential" in window && navigator.credentials?.get) {
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          if (otp?.code) applyOtpCandidate(otp.code);
        })
        .catch(() => {});
    }

    return () => {
      ac.abort();
    };
  }, [isOpen, setVerifyCode, handleVerifySMS]);

  return (
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
          <HStack justify="center" spacing={2} mb={3}>
            <PinInput
              otp
              type="number"
              size="lg"
              value={verifyCode}
              onChange={(value) => setVerifyCode(value)}
              onComplete={(value) => handleVerifySMS(value)}
            >
              <PinInputField
                w={12}
                h={14}
                fontSize="2xl"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
                rounded="lg"
                _focus={{ borderColor: "green.400", boxShadow: "outline" }}
              />
              <PinInputField
                w={12}
                h={14}
                fontSize="2xl"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
                rounded="lg"
                _focus={{ borderColor: "green.400", boxShadow: "outline" }}
              />
              <PinInputField
                w={12}
                h={14}
                fontSize="2xl"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
                rounded="lg"
                _focus={{ borderColor: "green.400", boxShadow: "outline" }}
              />
              <PinInputField
                w={12}
                h={14}
                fontSize="2xl"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
                rounded="lg"
                _focus={{ borderColor: "green.400", boxShadow: "outline" }}
              />
              <PinInputField
                w={12}
                h={14}
                fontSize="2xl"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
                rounded="lg"
                _focus={{ borderColor: "green.400", boxShadow: "outline" }}
              />
              <PinInputField
                w={12}
                h={14}
                fontSize="2xl"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
                rounded="lg"
                _focus={{ borderColor: "green.400", boxShadow: "outline" }}
              />
            </PinInput>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            Autodetección disponible en móviles compatibles.
          </Text>
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
  );
};

export default OTPVerificationModal;
