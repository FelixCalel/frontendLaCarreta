import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Text,
  Button,
} from "@chakra-ui/react";

const CancelOrdersModal = ({
  isOpen,
  onClose,
  selectedCount,
  cancelComment,
  setCancelComment,
  handleBulkCancel,
  isProcessing,
  inputBg,
  borderColor,
  textColor,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Cancelar Pedidos</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text mb={4}>
          Estás a punto de cancelar {selectedCount} pedidos. Por favor,
          ingresa el motivo de la cancelación:
        </Text>
        <Textarea
          placeholder="Motivo de cancelación (Comentario de Ventas)"
          value={cancelComment}
          onChange={(e) => setCancelComment(e.target.value)}
          bg={inputBg}
          borderColor={borderColor}
          color={textColor}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose}>
          Cerrar
        </Button>
        <Button
          colorScheme="red"
          onClick={handleBulkCancel}
          isLoading={isProcessing}
          isDisabled={!cancelComment.trim()}
        >
          Confirmar Cancelación
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

CancelOrdersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCount: PropTypes.number.isRequired,
  cancelComment: PropTypes.string.isRequired,
  setCancelComment: PropTypes.func.isRequired,
  handleBulkCancel: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  inputBg: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
};

export default CancelOrdersModal;
