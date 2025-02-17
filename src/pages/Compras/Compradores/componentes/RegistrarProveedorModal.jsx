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
  Flex,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import ProveedorSelector from "./proveedorSelector";
import { useDispatch } from "react-redux";
import {
  asignarProveedor,
  desasignarProveedor,
} from "../../../../store/Compras/thunks";

const RegistrarProveedorModal = ({ isOpen, onClose, item }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [cantidadPactada, setCantidadPactada] = useState(0);
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [cantidadFaltante, setCantidadFaltante] = useState(0);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);
  const [proveedoresAsignados, setProveedoresAsignados] = useState([]);
  const [cantidadTotalAsignada, setCantidadTotalAsignada] = useState(0);

  useEffect(() => {
    if (item) {
      const totalAsignado = item.proveedoresAsignados?.reduce((sum, p) => sum + p.cantidad, 0) || 0;
      setCantidadFaltante(item.cantidad - totalAsignado);
      setCantidadTotalAsignada(totalAsignado);
      setFechaIngreso(new Date().toISOString().substr(0, 10));
      setProveedoresAsignados(item.proveedoresAsignados || []);
    }
  }, [item]);

  if (!item) return null;

  const handleGuardar = async () => {
    if (!selectedProveedorId || cantidadPactada <= 0 || cantidadPactada > cantidadFaltante) {
      toast({
        title: "Error",
        description: "Debe seleccionar un proveedor y asignar una cantidad válida.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(
        asignarProveedor({
          compraId: item.id,
          proveedorId: selectedProveedorId,
          cantidad: cantidadPactada,
        })
      ).unwrap();

      toast({
        title: "Éxito",
        description: "Proveedor asignado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setCantidadFaltante((prev) => prev - cantidadPactada);
      setCantidadTotalAsignada((prev) => prev + cantidadPactada);
      setProveedoresAsignados((prev) => [
        ...prev,
        { proveedorId: selectedProveedorId, nombre: "Proveedor", cantidad: cantidadPactada },
      ]);

      setCantidadPactada(0);
      setSelectedProveedorId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo asignar el proveedor.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDesasignar = async (proveedorId) => {
    try {
      await dispatch(
        desasignarProveedor({
          compraId: item.id,
          proveedorId,
        })
      ).unwrap();

      toast({
        title: "Éxito",
        description: "Proveedor desasignado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const proveedorEliminado = proveedoresAsignados.find(p => p.proveedorId === proveedorId);
      setCantidadFaltante((prev) => prev + (proveedorEliminado?.cantidad || 0));
      setCantidadTotalAsignada((prev) => prev - (proveedorEliminado?.cantidad || 0));
      setProveedoresAsignados((prev) => prev.filter((p) => p.proveedorId !== proveedorId));
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo desasignar el proveedor.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar Proveedor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb={2}>{item.codigo} - {item.nombre}</Text>
          <Text mb={2}>Cantidad solicitada: <b>{item.cantidad || 0}</b></Text>
          <Text mb={2}>Cantidad total asignada: <b>{cantidadTotalAsignada}</b></Text>
          <Text mb={2}>Cantidad faltante: <b>{cantidadFaltante}</b></Text>

          <FormControl mb={3}>
            <ProveedorSelector value={selectedProveedorId} onChange={setSelectedProveedorId} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Cantidad pactada</FormLabel>
            <Input
              type="number"
              min={1}
              max={cantidadFaltante}
              value={cantidadPactada}
              onChange={(e) => setCantidadPactada(Number(e.target.value))}
            />
          </FormControl>

          <Text fontWeight="bold" mt={4}>Proveedores asignados:</Text>
          {proveedoresAsignados.length > 0 ? (
            proveedoresAsignados.map((prov) => (
              <Flex key={prov.proveedorId} justify="space-between" p={2} bg="gray.100" borderRadius="md" mt={2}>
                <Text>{prov.nombre}: {prov.cantidad}</Text>
                <Button colorScheme="red" size="xs" onClick={() => handleDesasignar(prov.proveedorId)}>Eliminar</Button>
              </Flex>
            ))
          ) : (
            <Text color="gray.500">Ningún proveedor asignado</Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleGuardar} mr={3}>Guardar</Button>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
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
    proveedoresAsignados: PropTypes.arrayOf(
      PropTypes.shape({
        proveedorId: PropTypes.number,
        nombre: PropTypes.string,
        cantidad: PropTypes.number,
      })
    ),
  }),
};

export default RegistrarProveedorModal;
