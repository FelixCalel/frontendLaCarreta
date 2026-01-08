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
  Input,
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
          <Input
            placeholder="Código SMS"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            textAlign="center"
            fontSize="2xl"
            letterSpacing="widest"
            maxLength={6}
            autoComplete="one-time-code"
          />
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
