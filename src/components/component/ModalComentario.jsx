import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const ModalComentario = ({
  isOpen,
  onClose,
  comentario,
  setComentario,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Comentario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Ingrese un comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="red" variant="outline" mr={3}>
            Cancelar
          </Button>
          <Button colorScheme="green" onClick={onConfirm}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ModalComentario.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  comentario: PropTypes.string.isRequired,
  setComentario: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ModalComentario;
