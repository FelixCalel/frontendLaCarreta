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
  Stack,
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
  const [initialFechaIngreso, setInitialFechaIngreso] = useState("");
  const dispatch = useDispatch();
  const toast = useToast();
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (item && isOpen) {
      const totalAsignado =
        item.proveedoresAsignados?.reduce(
          (acc, prov) => acc + prov.cantidad,
          0,
        ) || 0;
      const faltante = Math.max(0, (item.cantidad || 0) - totalAsignado);
      setCantidadFaltante(faltante);

      let isoDate = new Date().toISOString().slice(0, 10);
      if (item.fechaIngreso) {
        const [dd, mm, yyyy] = item.fechaIngreso.split("/");
        if (dd && mm && yyyy) {
          isoDate = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        } else {
          isoDate = new Date(item.fechaIngreso).toISOString().slice(0, 10);
        }
      }
      setFechaIngreso(isoDate);
      setInitialFechaIngreso(isoDate);

      setProveedoresAsignados(item.proveedoresAsignados || []);
    }
  }, [item, isOpen]);

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
    const hasDateChanged = fechaIngreso !== initialFechaIngreso;
    const hasProviderAssignment = selectedProveedorId && cantidadPactada > 0;

    if (!hasDateChanged && !hasProviderAssignment) {
      showErrorToast(
        "No se detectaron cambios (ni de fecha ni de nuevo proveedor).",
      );
      return;
    }

    if (hasProviderAssignment && cantidadPactada > cantidadFaltante) {
      showErrorToast("La cantidad pactada excede la cantidad faltante.");
      return;
    }

    setAssigning(true);

    let operationsSucceeded = 0;

    try {
      if (hasDateChanged) {
        const [yyyy, mm, dd] = fechaIngreso.split("-");
        const ddMmYyyy = `${dd}/${mm}/${yyyy}`;
        await dispatch(
          actualizarFechaIngreso({
            pedidoId: item.id,
            fechaIngreso: ddMmYyyy,
          }),
        ).unwrap();
        setInitialFechaIngreso(fechaIngreso);
        operationsSucceeded++;
      }

      if (hasProviderAssignment) {
        await dispatch(
          asignarProveedor({
            compraId: item.id,
            proveedorId: selectedProveedorId,
            cantidad: cantidadPactada,
          }),
        ).unwrap();

        setProveedoresAsignados((prev) => {
          const existingIndex = prev.findIndex(
            (p) => p.proveedorId === selectedProveedorId,
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
        operationsSucceeded++;
      }

      if (operationsSucceeded > 0) {
        showSuccessToast("Cambios guardados correctamente.");
        dispatch(fetchCompras());
        const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);
        await dispatch(fetchCompras(roleId));
      }
    } catch (error) {
      showErrorToast(
        error?.message || "Ocurrió un error al guardar los cambios.",
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleDesasignar = async (proveedorId) => {
    try {
      await dispatch(
        desasignarProveedor({ compraId: item.id, proveedorId }),
      ).unwrap();

      showSuccessToast("Proveedor desasignado correctamente.");

      const eliminado = proveedoresAsignados.find(
        (p) => p.proveedorId === proveedorId,
      );
      const cantidadEliminada = eliminado?.cantidad || 0;

      setProveedoresAsignados((prev) =>
        prev.filter((p) => p.proveedorId !== proveedorId),
      );
      setCantidadFaltante((prev) => prev + cantidadEliminada);

      dispatch(fetchCompras());
      const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);
      await dispatch(fetchCompras(roleId));
    } catch (error) {
      showErrorToast("No se pudo desasignar el proveedor.");
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
      onClose={handleClose}
      size="xl"
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent bg="gray.50">
        <ModalHeader borderBottom="1px solid" borderColor="gray.200" pb={3}>
          <Text color="green.700" fontWeight="bold">
            Planificar Ingreso
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          {/* Header Info */}
          <Box
            bg="white"
            p={4}
            rounded="md"
            shadow="sm"
            mb={5}
            borderLeft="4px solid"
            borderColor="green.400"
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold" fontSize="lg" color="gray.700">
                  {item.codigo}
                </Text>
                <Text color="gray.600">{item.nombre}</Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="sm" color="gray.500">
                  Cantidad Total Solicitada
                </Text>
                <Text fontSize="2xl" fontWeight="black" color="green.600">
                  {item.cantidad || 0}
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Configuration Grid */}
          <SimpleGrid columns={[1, 2]} spacing={5} mb={5}>
            {/* Fecha Box */}
            <Box
              bg="white"
              p={4}
              rounded="md"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.700" fontSize="sm">
                  Ajustar Fecha Estimada de Ingreso
                </FormLabel>
                <Input
                  type="date"
                  focusBorderColor="green.400"
                  size="sm"
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                />
              </FormControl>
              <Text fontSize="xs" color="gray.500" mt={2}>
                Modifica la fecha para posponer la llegada general del producto.
              </Text>
            </Box>

            {/* Asignación Box */}
            <Box
              bg="white"
              p={4}
              rounded="md"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontWeight="semibold" color="gray.700" fontSize="sm" mb={2}>
                Asignar Nuevo Proveedor
              </Text>
              <FormControl mb={3}>
                <ProveedorSelector
                  value={selectedProveedorId}
                  onChange={(id, name) => {
                    setSelectedProveedorId(id);
                    setSelectedProveedorName(name);
                  }}
                />
              </FormControl>
              <FormControl>
                <Flex justify="space-between" align="center" mb={1}>
                  <FormLabel m={0} fontSize="sm">
                    Cantidad Pactada
                  </FormLabel>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color={cantidadFaltante > 0 ? "orange.500" : "green.500"}
                  >
                    Faltante: {cantidadFaltante}
                  </Text>
                </Flex>
                <Input
                  type="number"
                  size="sm"
                  focusBorderColor="green.400"
                  min={1}
                  max={cantidadFaltante}
                  disabled={cantidadFaltante === 0}
                  value={cantidadPactada}
                  onChange={(e) => setCantidadPactada(Number(e.target.value))}
                />
              </FormControl>
            </Box>
          </SimpleGrid>

          <Divider mb={5} />

          {/* Current Assignments */}
          <Box>
            <Text fontWeight="bold" color="gray.700" mb={3}>
              Desglose de Proveedores Actuales
            </Text>
            {proveedoresAsignados.length > 0 ? (
              <Stack spacing={2}>
                {proveedoresAsignados.map((prov) => (
                  <Flex
                    key={prov.proveedorId}
                    justify="space-between"
                    p={3}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    alignItems="center"
                    shadow="sm"
                  >
                    <Box>
                      <Text fontWeight="medium" color="gray.800">
                        {prov.nombre}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Cantidad abastecida:{" "}
                        <Text as="span" fontWeight="bold" color="green.600">
                          {prov.cantidad}
                        </Text>
                      </Text>
                    </Box>
                    <Button
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDesasignar(prov.proveedorId)}
                    >
                      Remover
                    </Button>
                  </Flex>
                ))}
              </Stack>
            ) : (
              <Box
                p={4}
                textAlign="center"
                bg="white"
                border="1px dashed"
                borderColor="gray.300"
                borderRadius="md"
              >
                <Text color="gray.400" fontSize="sm" fontStyle="italic">
                  Aún no hay proveedores asignados para abastecer este producto.
                </Text>
              </Box>
            )}
          </Box>
        </ModalBody>

        <ModalFooter
          borderTop="1px solid"
          borderColor="gray.200"
          bg="white"
          borderBottomRadius="md"
        >
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            onClick={handleGuardar}
            isLoading={assigning}
          >
            Guardar Cambios
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
      }),
    ),
  }),
};

export default RegistrarProveedorModal;
