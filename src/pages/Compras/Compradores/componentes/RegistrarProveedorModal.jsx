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
  Divider,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import ProveedorSelector from "./proveedorSelector";
import { useDispatch } from "react-redux";
import {
  asignarProveedor,
  desasignarProveedor,
  fetchCompras,
  actualizarFechaIngreso,
} from "../../../../store/Compras/thunks";

const RegistrarProveedorModal = ({ isOpen, onClose, item }) => {
  const [selectedProveedorName, setSelectedProveedorName] = useState("");
  const [proveedoresAsignados, setProveedoresAsignados] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);
  const [cantidadFaltante, setCantidadFaltante] = useState(0);
  const [cantidadPactada, setCantidadPactada] = useState(0);
  const [fechaIngreso, setFechaIngreso] = useState("");
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    if (item) {
      const totalAsignado =
        item.proveedoresAsignados?.reduce(
          (acc, prov) => acc + prov.cantidad,
          0
        ) || 0;
      const faltante = Math.max(0, (item.cantidad || 0) - totalAsignado);
      setCantidadFaltante(faltante);

      if (item.fechaIngreso) {
        const [dd, mm, yyyy] = item.fechaIngreso.split("/");
        if (dd && mm && yyyy) {
          const fechaISO = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(
            2,
            "0"
          )}`;
          setFechaIngreso(fechaISO);
        } else {
          setFechaIngreso(
            new Date(item.fechaIngreso).toISOString().slice(0, 10)
          );
        }
      } else {
        setFechaIngreso(new Date().toISOString().slice(0, 10));
      }

      setProveedoresAsignados(item.proveedoresAsignados || []);
    }
  }, [item]);

  const showErrorToast = (description) => {
    toast({
      title: "Error",
      description,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const showSuccessToast = (description) => {
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
        "Debes seleccionar un proveedor y asignar una cantidad válida."
      );
      return;
    }

    if (cantidadPactada > cantidadFaltante) {
      showErrorToast("La cantidad pactada excede la cantidad faltante.");
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

      showSuccessToast("Proveedor asignado correctamente.");

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
      showErrorToast("No se pudo asignar el proveedor.");
    }
  };

  const handleDesasignar = async (proveedorId) => {
    try {
      await dispatch(
        desasignarProveedor({ compraId: item.id, proveedorId })
      ).unwrap();

      showSuccessToast("Proveedor desasignado correctamente.");

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
      showErrorToast("No se pudo desasignar el proveedor.");
    }
  };

  const handleClose = () => {
    setCantidadPactada(0);
    setSelectedProveedorId(null);
    onClose();
  };

  const handleFechaIngresoChange = async (e) => {
    const isoValue = e.target.value;
    setFechaIngreso(isoValue);

    const [yyyy, mm, dd] = isoValue.split("-");
    const ddMmYyyy = `${dd}/${mm}/${yyyy}`;

    try {
      await dispatch(
        actualizarFechaIngreso({
          pedidoId: item.id,
          fechaIngreso: ddMmYyyy,
        })
      ).unwrap();

      showSuccessToast("La fecha de ingreso se actualizó correctamente.");
    } catch (error) {
      showErrorToast("No se pudo actualizar la fecha de ingreso.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar Proveedor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Text fontWeight="bold" fontSize="lg">
              {item.codigo} - {item.nombre}
            </Text>
            <Text color="gray.600" fontSize="sm">
              Cantidad solicitada: {item.cantidad || 0}
            </Text>
          </Box>

          <SimpleGrid columns={[1, 2]} spacing={4} mb={4}>
            <FormControl>
              <FormLabel>Fecha de ingreso</FormLabel>
              <Input
                type="date"
                value={fechaIngreso}
                onChange={handleFechaIngresoChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Proveedor</FormLabel>
              <ProveedorSelector
                value={selectedProveedorId}
                onChange={(id, name) => {
                  setSelectedProveedorId(id);
                  setSelectedProveedorName(name);
                }}
              />
            </FormControl>
          </SimpleGrid>

          <FormControl mb={2}>
            <FormLabel>Cantidad pactada</FormLabel>
            <Input
              type="number"
              min={1}
              max={cantidadFaltante}
              value={cantidadPactada}
              onChange={(e) => setCantidadPactada(Number(e.target.value))}
            />
          </FormControl>
          <Text fontWeight="semibold" fontSize="sm" mb={4}>
            Cantidad faltante: {cantidadFaltante}
          </Text>

          <Divider mb={4} />

          <Text fontWeight="bold" mb={2}>
            Proveedores asignados:
          </Text>
          {proveedoresAsignados.length > 0 ? (
            proveedoresAsignados.map((prov) => (
              <Flex
                key={prov.proveedorId}
                justify="space-between"
                p={2}
                bg="gray.50"
                borderRadius="md"
                mt={2}
                alignItems="center"
              >
                <Text fontSize="sm">
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
            <Text color="gray.500" fontSize="sm">
              Ningún proveedor asignado
            </Text>
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
    fechaIngreso: PropTypes.string,
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
