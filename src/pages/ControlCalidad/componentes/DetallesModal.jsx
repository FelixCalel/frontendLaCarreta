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
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCompra } from "../../../store/Compras/thunks";

const DetallesModal = ({ isOpen, onClose, pedido }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Estado para la cantidad recibida
  const [cantidadRecibida, setCantidadRecibida] = useState(
    pedido?.pedido_compra || 0
  );

  // Aseguramos que cuando el modal se abra, se actualice el valor de cantidadRecibida
  useEffect(() => {
    if (pedido) {
      setCantidadRecibida(pedido.pedido_compra || 0);
    }
  }, [pedido, isOpen]); // Se vuelve a ejecutar cuando 'pedido' o 'isOpen' cambian

  const handleGuardar = async () => {
    try {
      // Actualización de la cantidad recibida en la base de datos
      await dispatch(
        updateCompra({
          id: pedido.id,
          pedido_compra: Number(cantidadRecibida),
        })
      ).unwrap();

      toast({
        title: "Actualizado",
        description: "La cantidad recibida se ha actualizado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad recibida.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Información de producto Recibido</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Item Info */}
          <FormControl mb={4}>
            <FormLabel>Item</FormLabel>
            <Input
              isReadOnly
              value={
                pedido.codigo && pedido.nombre
                  ? `${pedido.codigo} - ${pedido.nombre}`
                  : "Sin datos"
              }
            />
          </FormControl>

          {/* Subcliente Info */}
          <FormControl mb={4}>
            <FormLabel>Subcliente</FormLabel>
            <Input isReadOnly value={pedido.nombreTienda || "Sin Subcliente"} />
          </FormControl>

          {/* Proveedor Info */}
          <FormControl mb={4}>
            <FormLabel>Proveedor</FormLabel>
            <Input
              isReadOnly
              value={pedido.nombreProveedor || "Sin Proveedor"}
            />
          </FormControl>

          {/* Cantidad a recibir */}
          <FormControl mb={4}>
            <FormLabel>Cantidad a recibir</FormLabel>
            <Input isReadOnly value={pedido.cantidad || 0} />
          </FormControl>

          {/* Editable field: Cantidad recibida */}
          <FormControl mb={4}>
            <FormLabel>Cantidad recibida</FormLabel>
            <Input
              type="number"
              value={cantidadRecibida}
              onChange={(e) => setCantidadRecibida(e.target.value)}
              borderColor="teal.500"
              _hover={{ borderColor: "teal.600" }}
              _focus={{ borderColor: "teal.600" }}
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
