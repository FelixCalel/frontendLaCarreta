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
  fetchCompras,
} from "../../../../store/Compras/thunks";

const RegistrarProveedorModal = ({ isOpen, onClose, item }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [cantidadPactada, setCantidadPactada] = useState(0);
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [cantidadFaltante, setCantidadFaltante] = useState(0);
  const [proveedoresAsignados, setProveedoresAsignados] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);
  const [selectedProveedorName, setSelectedProveedorName] = useState(""); // Agregamos este estado

  useEffect(() => {
    if (item) {
      const totalAsignado =
        item.proveedoresAsignados?.reduce(
          (acc, prov) => acc + prov.cantidad,
          0
        ) || 0;

      const faltante = Math.max(0, (item.cantidad || 0) - totalAsignado);

      setCantidadFaltante(faltante);
      setFechaIngreso(new Date().toISOString().substr(0, 10));
      setProveedoresAsignados(item.proveedoresAsignados || []);
    }
  }, [item]);

  const showErrorToast = (toast, description) => {
    toast({
      title: "Error",
      description,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const showSuccessToast = (toast, description) => {
    toast({
      title: "Éxito",
      description,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!item) return null;

  const handleGuardar = async () => {
    if (!selectedProveedorId || cantidadPactada <= 0) {
      showErrorToast(
        toast,
        "Debes seleccionar un proveedor y asignar una cantidad válida."
      );
      return;
    }

    if (cantidadPactada > cantidadFaltante) {
      showErrorToast(toast, "La cantidad pactada excede la cantidad faltante.");
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

      showSuccessToast(toast, "Proveedor asignado correctamente.");

      setProveedoresAsignados((prev) => {
        const existingIndex = prev.findIndex(
          (p) => p.proveedorId === selectedProveedorId
        );
        if (existingIndex !== -1) {
          const updatedProveedores = [...prev];
          updatedProveedores[existingIndex].cantidad += cantidadPactada;
          return updatedProveedores;
        }
        return [
          ...prev,
          {
            proveedorId: selectedProveedorId,
            nombre: selectedProveedorName,
            cantidad: cantidadPactada,
          },
        ];
      });

      setCantidadFaltante((prev) => prev - cantidadPactada);
      setCantidadPactada(0);
      setSelectedProveedorId(null);
      setSelectedProveedorName("");
      dispatch(fetchCompras());
    } catch (error) {
      showErrorToast(toast, "No se pudo asignar el proveedor.");
    }
  };

  const handleDesasignar = async (proveedorId) => {
    try {
      await dispatch(
        desasignarProveedor({ compraId: item.id, proveedorId })
      ).unwrap();

      showSuccessToast(toast, "Proveedor desasignado correctamente.");

      const eliminado = proveedoresAsignados.find(
        (p) => p.proveedorId === proveedorId
      );
      const cantidadEliminada = eliminado?.cantidad || 0;

      setProveedoresAsignados((prev) =>
        prev.filter((p) => p.proveedorId !== proveedorId)
      );
      setCantidadFaltante((prev) => prev + cantidadEliminada);

      dispatch(fetchCompras());
    } catch (error) {
      showErrorToast(toast, "No se pudo desasignar el proveedor.");
    }
  };

  const handleClose = () => {
    setCantidadPactada(0);
    setSelectedProveedorId(null);
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
            <ProveedorSelector
              value={selectedProveedorId}
              onChange={(id, name) => {
                setSelectedProveedorId(id);
                setSelectedProveedorName(name);
              }}
            />
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

          <Text fontWeight="semibold">
            Cantidad faltante: {cantidadFaltante}
          </Text>

          <Text fontWeight="bold" mt={4}>
            Proveedores asignados:
          </Text>
          {proveedoresAsignados.length > 0 ? (
            proveedoresAsignados.map((prov) => (
              <Flex
                key={prov.proveedorId}
                justify="space-between"
                p={2}
                bg="gray.100"
                borderRadius="md"
                mt={2}
              >
                <Text>
                  {prov.nombre}: {prov.cantidad}
                </Text>
                <Button
                  colorScheme="red"
                  size="xs"
                  onClick={() => handleDesasignar(prov.proveedorId)}
                >
                  Eliminar
                </Button>
              </Flex>
            ))
          ) : (
            <Text color="gray.500">Ningún proveedor asignado</Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleGuardar} mr={3}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Cerrar
          </Button>
        </ModalFooter>
        <FormControl mb={3}>
          <FormLabel>Fecha de ingreso</FormLabel>
          <Input
            type="date"
            value={fechaIngreso}
            onChange={(e) => setFechaIngreso(e.target.value)}
          />
        </FormControl>
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
