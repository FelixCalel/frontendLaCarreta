import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  Textarea,
} from "@chakra-ui/react";

export const ConsolidatedActionModal = ({
  isOpen,
  onClose,
  actionButtonText,
  dateSAP,
  setDateSAP,
  comment,
  setComment,
  confirmSendToSap,
  isProcessing,
  modalBg,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader>{actionButtonText}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2} fontWeight="bold">
            Fecha de Orden (Obligatorio):
          </Text>
          <Input
            type="date"
            value={dateSAP}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDateSAP(e.target.value)}
            mb={4}
          />
          <Text mb={2}>
            Comentario{" "}
            {actionButtonText.toLowerCase().includes("sap")
              ? "(Obligatorio para SAP)"
              : ""}
            :
          </Text>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              actionButtonText.toLowerCase().includes("sap")
                ? "Ingrese el comentario obligatorio para SAP"
                : "Escribe un comentario..."
            }
            borderColor={
              actionButtonText.toLowerCase().includes("sap") && !comment.trim()
                ? "red.400"
                : undefined
            }
            mb={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            onClick={confirmSendToSap}
            isLoading={isProcessing}
            isDisabled={!dateSAP}
          >
            {actionButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
