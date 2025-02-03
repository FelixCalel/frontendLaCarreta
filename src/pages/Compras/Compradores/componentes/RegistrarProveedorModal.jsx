import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import ProveedorSelector from "./proveedorSelector";
import CompraVentaInput from "./compraVentaInput";

const RegistrarProveedorModal = ({ isOpen, onClose, item }) => {
  const [cantidadPactada, setCantidadPactada] = useState(0);
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [cantidadFaltante, setCantidadFaltante] = useState(0);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);
  const [proveedores] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (item) {
      setCantidadPactada(item.pedido_venta || 0);
      setSelectedProveedorId(item.proveedorId || null);
      setCantidadFaltante((item.cantidad || 0) - (item.pedido_venta || 0));
      setFechaIngreso(new Date().toISOString().substr(0, 10));
    }
  }, [item]);

  if (!item) return null;

  const handleGuardar = () => {
    const proveedorSeleccionado = proveedores.find(
      (p) => p.id === selectedProveedorId
    );

    alert(
      `Se registró proveedor para ítem: ${item.codigo}\n` +
        `Proveedor: ${proveedorSeleccionado?.nombre || "No seleccionado"}\n` +
        `Cant. pactada: ${cantidadPactada}\n` +
        `Fecha ingreso: ${fechaIngreso}\n` +
        `Faltante: ${cantidadFaltante}\n`
    );
    onClose();
    window.location.reload();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar Proveedor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb={1}>
            Item: {item.codigo} - {item.nombre}
          </Text>
          <Text mb={3}>Cantidad solicitada: {item.cantidad || 0}</Text>
          <FormControl mb={3}>
            <Input
              isDisabled
              value={`${item.nombreCorrelativo} - ${item.nombreDeu} `}
            />
          </FormControl>
          <FormControl mb={3}>
            <ProveedorSelector
              value={selectedProveedorId}
              onChange={setSelectedProveedorId}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Cantidad pactada</FormLabel>
            <CompraVentaInput
              compra={{
                id: item.id,
                pedido_venta: item.pedido_venta || 0,
              }}
              maxCantidad={item.cantidad || 0}
              onCantidadChange={(nuevoValor) => {
                setCantidadPactada(nuevoValor);
                setCantidadFaltante((item.cantidad || 0) - nuevoValor);

                if (nuevoValor > item.cantidad) {
                  toast({
                    title: "Cantidad no permitida",
                    description: `No puedes pactar más de ${item.cantidad} unidades.`,
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Fecha de ingreso a planta</FormLabel>
            <Input
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
            />
          </FormControl>
          <Text fontWeight="semibold">
            Cantidad faltante: {cantidadFaltante}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleGuardar} mr={3}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

RegistrarProveedorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    codigo: PropTypes.string,
    nombre: PropTypes.string,
    cantidad: PropTypes.number,
    nombreDeu: PropTypes.string,
    nombreCorrelativo: PropTypes.string,
    proveedorNombre: PropTypes.string,
    pedido_venta: PropTypes.number,
    proveedorId: PropTypes.number,
  }),
};

export default RegistrarProveedorModal;
