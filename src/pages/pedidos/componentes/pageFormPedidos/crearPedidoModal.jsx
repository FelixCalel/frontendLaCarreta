import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner, VStack, FormControl, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types"; // Importa PropTypes
import CiudadSelector from "./CiudadSelector";
import DeuSelector from "./DeuSelector";
import TiendaSelector from "./tiendaSelector";
import ProductosTable from "../";

const NuevoPedidoModal = ({ isOpen, onClose, isPedidoFinalizado }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Lógica para manejar el submit
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isPedidoFinalizado ? "Agregar Productos" : "Agregar Pedido"}</ModalHeader>
        <ModalBody bg="gray.50" borderRadius="md">
          {!isPedidoFinalizado ? (
            <VStack spacing={4}>
              <CiudadSelector />
              <DeuSelector />
              <FormControl>
                <FormLabel>Tiendas asignadas</FormLabel>
                <TiendaSelector />
              </FormControl>
            </VStack>
          ) : (
            <ProductosTable />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isLoading}
            spinner={<Spinner size="sm" color="white" />}
          >
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

// Define propTypes para validar las props
NuevoPedidoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPedidoFinalizado: PropTypes.bool.isRequired,
};

export default NuevoPedidoModal;
