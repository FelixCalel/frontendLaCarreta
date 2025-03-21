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

const DetallesModal = ({
  isOpen,
  onClose,
  pedido,
  actualizarCantidadRecibida,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [cantidadRecibida, setCantidadRecibida] = useState(
    pedido?.pedido_compra || 0
  );

  useEffect(() => {
    if (pedido) {
      setCantidadRecibida(pedido.pedido_compra || 0);
    }
  }, [pedido, isOpen]);

  if (!pedido) {
    return null;
  }

  const handleGuardar = async () => {
    try {
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

      actualizarCantidadRecibida(pedido.id, cantidadRecibida);
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
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Información de producto Recibido</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Item</FormLabel>
            <Input
              isReadOnly
              value={
                pedido?.codigo && pedido?.nombre
                  ? `${pedido.codigo} - ${pedido.nombre}`
                  : "Sin datos"
              }
              borderRadius="md"
              boxShadow="sm"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Subcliente</FormLabel>
            <Input
              isReadOnly
              value={pedido?.nombreTienda || "Sin Subcliente"}
              borderRadius="md"
              boxShadow="sm"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Proveedor</FormLabel>
            <Input
              isReadOnly
              value={pedido?.nombreProveedor || "Sin Proveedor"}
              borderRadius="md"
              boxShadow="sm"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Cantidad a recibir</FormLabel>
            <Input isReadOnly value={pedido?.cantidadAsignada || 0} />
          </FormControl>
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
  actualizarCantidadRecibida: PropTypes.func.isRequired,
};

export default DetallesModal;
