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
  useToast
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const RegistrarProveedorModal = ({ isOpen, onClose, item }) => {
  const [cantidadPactada, setCantidadPactada] = useState(0);
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [cantidadFaltante, setCantidadFaltante] = useState(0);
  const [proveedor, setProveedor] = useState("");
  const toast = useToast();  

  useEffect(() => {
    if (item) {
      setCantidadPactada(item.cantidadAsignada || 0);
      setProveedor(item.proveedorNombre || "");
      setCantidadFaltante((item.cantidad || 0) - (item.cantidadAsignada || 0));
      setFechaIngreso(new Date().toISOString().substr(0, 10));
    }
  }, [item]);

  if (!item) return null;

  const handleGuardar = () => {
    alert(
      `Se registró proveedor para ítem: ${item.codigo}\n` +
        `Proveedor: ${proveedor}\n` +
        `Cant. pactada: ${cantidadPactada}\n` +
        `Fecha ingreso: ${fechaIngreso}\n` +
        `Faltante: ${cantidadFaltante}\n`
    );
    onClose();
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
            <FormLabel>Proveedor</FormLabel>
            <Input
              placeholder="Ej: PRO-0102"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Cantidad pactada</FormLabel>
            <Input
              type="number"
              min={0}
              max={item.cantidad} // Evita que el usuario introduzca más que "cantidad"
              value={cantidadPactada}
              onChange={(e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 0) {
                  val = 0;
                }
                if (val > item.cantidad) {
                  toast({
                    title: "Cantidad no permitida",
                    description: `No puedes pactar más de ${item.cantidad} unidades.`,
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                  val = item.cantidad;
                }
              
                setCantidadPactada(val);
                setCantidadFaltante(item.cantidad - val);
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
    cantidadAsignada: PropTypes.number,
    nombreDeu: PropTypes.string,
    nombreCorrelativo: PropTypes.string,
    proveedorNombre: PropTypes.string,
  }),
};

export default RegistrarProveedorModal;
