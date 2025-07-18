import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  FormControl,
  FormLabel,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";

const CancelOrderDialog = ({ isOpen, onClose, onConfirm, cantidad }) => {
  const toast = useToast();
  const [comentario, setComentario] = useState("");

  const handleConfirm = () => {
    if (!comentario.trim()) {
      toast({
        title: "Campo requerido",
        description: "Escribe un comentario antes de cancelar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onConfirm(comentario.trim());
    setComentario("");
  };

  const handleClose = () => {
    setComentario("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Cancelar {cantidad > 1 ? "pedidos" : "pedido"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Comentario (motivo de cancelación)</FormLabel>
            <Textarea
              placeholder="Escribe aquí tu comentario…"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose}>
            Cerrar
          </Button>
          <Button colorScheme="red" onClick={handleConfirm}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

CancelOrderDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  cantidad: PropTypes.number.isRequired,
};

export default CancelOrderDialog;
