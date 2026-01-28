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
    if (isOpen && "OTPCredential" in window) {
      const ac = new AbortController();

      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          if (otp) {
            setVerifyCode(otp.code);
            setTimeout(() => handleVerifySMS(otp.code), 0);
          }
        })
        .catch((err) => {
          console.log("WebOTP Error or Timeout:", err);
        });

      return () => {
        ac.abort();
      };
    }
  }, [isOpen, setVerifyCode]);

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
          <Text fontSize="xs" color="gray.500">
            Detectando código automáticamente...
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
