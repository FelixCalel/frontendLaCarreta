import { useState } from "react";
import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import ProductoSelector from "./ProductoSelector";
import CantidadInput from "./CantidadInput";
import PrecioInput from "./PrecioInput";

const DetallePedidoForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [detallePedido, setDetallePedido] = useState({
    productoId: "",
    cantidad: 0,
    precio: 0,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetallePedido((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductoSelect = (productoId) => {
    setDetallePedido((prev) => ({
      ...prev,
      productoId,
    }));
  };

  const validateFields = () => {
    let formErrors = {};
    if (!detallePedido.productoId) formErrors.productoId = "El producto es obligatorio";
    if (detallePedido.cantidad <= 0) formErrors.cantidad = "La cantidad debe ser mayor a 0";
    if (detallePedido.precio <= 0) formErrors.precio = "El precio debe ser mayor a 0";
    return formErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Aquí iría el código para enviar los datos al backend.
    console.log("Detalle del pedido enviado:", detallePedido);
    onClose();
  };

  return (
    <Box>
      <Button onClick={onOpen} colorScheme="blue">
        Crear Detalle de Pedido
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Detalle del Pedido</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductoSelector onSelect={handleProductoSelect} />
            <CantidadInput
              value={detallePedido.cantidad}
              onChange={handleInputChange}
              error={errors.cantidad}
            />
            <PrecioInput
              value={detallePedido.precio}
              onChange={handleInputChange}
              error={errors.precio}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DetallePedidoForm;
