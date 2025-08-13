import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

export default function QaFinalizeModal({ open, onCancel, onAccept }) {
  const bg = useColorModeValue("white", "gray.800");
  return (
    <Modal isOpen={open} onClose={onCancel} isCentered>
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader>¿Desea finalizar?</ModalHeader>
        <ModalBody />
        <ModalFooter gap={3}>
          <Button onClick={onCancel} variant="ghost">
            Cancelar
          </Button>
          <Button colorScheme="green" onClick={onAccept}>
            Aceptar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
QaFinalizeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};
