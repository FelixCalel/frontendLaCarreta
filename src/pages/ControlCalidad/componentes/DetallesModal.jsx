import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

const DetallesModal = ({ isOpen, onClose, pedido }) => {
  const [cantidadRecibida, setCantidadRecibida] = useState(
    pedido?.cantidadAsignada || 0
  );

  if (!pedido) {
    return null;
  }

  const handleGuardar = () => {
    console.log("Guardando nueva cantidad:", cantidadRecibida);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Información de producto Recibido</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Código</FormLabel>
            <Input
              isReadOnly
              value={
                pedido.codigo && pedido.nombre
                  ? `${pedido.codigo} - ${pedido.nombre}`
                  : "Sin datos"
              }
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Subcliente</FormLabel>
            <Input isReadOnly value={pedido.nombreTienda || "Sin Subcliente"} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Proveedor</FormLabel>
            <Input
              isReadOnly
              value={pedido.nombreProveedor || "Sin Proveedor"}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Cantidad a recibir</FormLabel>
            <Input isReadOnly value={pedido.cantidad || 0} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Cantidad Recibida</FormLabel>
            <Input
              type="number"
              value={cantidadRecibida}
              onChange={(e) => setCantidadRecibida(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleGuardar}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DetallesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedido: PropTypes.object,
};

export default DetallesModal;
