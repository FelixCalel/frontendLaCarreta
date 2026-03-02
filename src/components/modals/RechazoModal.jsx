import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Box,
  Select,
  SimpleGrid,
  Flex,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  useGetRechazoByPedidoProduccionIdQuery,
  useGetAlmacenesQuery,
  useGetMotivosSalidaQuery,
} from "../../services/pedidoProductionApi";
import PropTypes from "prop-types";

export const RechazoModal = ({
  isOpen,
  onClose,
  pedidoProduccionId,
  onSave,
  isLoading,
  trazabilidadPadre,
  maxQuantity,
  currentMpUtilizada,
  initialQuantity,
}) => {
  const [formData, setFormData] = useState({
    fechaRechazo: "",
    cantidadRechazada: "",
    comentario: "",
    trazabilidad: trazabilidadPadre || "",
    usuarioId: 1,
    almacenId: "",
    motivoId: "",
  });
  const [error, setError] = useState(null);

  const { data: almacenes = [] } = useGetAlmacenesQuery();
  const { data: motivosSalida = [] } = useGetMotivosSalidaQuery();

  const {
    data: rechazoData,
    isFetching,
    refetch,
  } = useGetRechazoByPedidoProduccionIdQuery(pedidoProduccionId, {
    skip: !pedidoProduccionId,
  });

  useEffect(() => {
    if (rechazoData) {
      setFormData({
        fechaRechazo: rechazoData.fechaRechazo
          ? new Date(rechazoData.fechaRechazo).toISOString().split("T")[0]
          : "",
        cantidadRechazada:
          initialQuantity !== undefined
            ? initialQuantity
            : rechazoData.cantidadRechazada || "",
        comentario: rechazoData.comentario || "",
        trazabilidad: trazabilidadPadre || rechazoData.trazabilidad || "",
        usuarioId: rechazoData.usuarioId || 1,
        almacenId: rechazoData.almacenId || "",
        motivoId: rechazoData.motivoId || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        trazabilidad: trazabilidadPadre || "",
        ...(initialQuantity !== undefined && initialQuantity > 0
          ? { cantidadRechazada: initialQuantity }
          : {}),
      }));
    }
  }, [rechazoData, trazabilidadPadre, initialQuantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.fechaRechazo ||
      !formData.cantidadRechazada ||
      !formData.almacenId ||
      !formData.motivoId
    ) {
      setError(
        "Fecha, Motivo, Cantidad y Almacén son obligatorios. Por favor completa todos los campos requeridos.",
      );
      return;
    }

    const totalProcesado =
      Number(currentMpUtilizada || 0) + Number(formData.cantidadRechazada);

    console.log("[SalidaInventarioModal] Validation:", {
      currentMpUtilizada,
      cantidadRechazada: formData.cantidadRechazada,
      totalProcesado,
      maxQuantity,
    });

    if (
      maxQuantity !== undefined &&
      maxQuantity !== null &&
      totalProcesado > maxQuantity
    ) {
      setError(
        `No se puede guardar: La cantidad total procesada (MP Utilizada: ${
          currentMpUtilizada || 0
        } + Salida: ${
          formData.cantidadRechazada
        } = ${totalProcesado}) excede la cantidad solicitada (${maxQuantity}).`,
      );
      return;
    }

    try {
      await onSave({ formData, existingRechazo: rechazoData });
      refetch();
    } catch (error) {
      console.error("Failed to save:", error);
      setError("Error al guardar la salida de inventario.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const boxBg = useColorModeValue("gray.50", "gray.700");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const valueColor = useColorModeValue("gray.800", "white");
  const alertBg = useColorModeValue("yellow.50", "yellow.900");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader>
          <Flex align="center" gap={2}>
            {rechazoData
              ? "Editar Salida de Inventario"
              : "Registrar Salida de Inventario"}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {isFetching ? (
            <Flex justify="center" align="center" py={10}>
              <Spinner color="blue.500" thickness="4px" size="xl" />
            </Flex>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box bg={boxBg} p={3} borderRadius="md" mb={4}>
                <Text fontSize="sm" color={labelColor} mb={1}>
                  Trazabilidad ID
                </Text>
                <Text fontWeight="bold" fontSize="md" color={valueColor}>
                  {formData.trazabilidad || "N/A"}
                </Text>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel>Fecha de Salida</FormLabel>
                  <Input
                    type="date"
                    name="fechaRechazo"
                    onChange={handleChange}
                    value={formData.fechaRechazo}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Almacén Destino</FormLabel>
                  <Select
                    placeholder="-- Seleccionar --"
                    name="almacenId"
                    onChange={handleChange}
                    value={formData.almacenId}
                  >
                    {almacenes.map((almacen) => (
                      <option key={almacen.id} value={almacen.id}>
                        {almacen.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel>Motivo</FormLabel>
                  <Select
                    placeholder="-- Seleccionar --"
                    name="motivoId"
                    onChange={handleChange}
                    value={formData.motivoId}
                  >
                    {motivosSalida.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Cantidad de Salida</FormLabel>
                  <Input
                    type="number"
                    name="cantidadRechazada"
                    onChange={handleChange}
                    value={formData.cantidadRechazada}
                    placeholder="0"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl mb={6}>
                <FormLabel>Comentario</FormLabel>
                <Textarea
                  name="comentario"
                  onChange={handleChange}
                  value={formData.comentario}
                  placeholder="Opcional..."
                  rows={3}
                />
              </FormControl>

              {error && (
                <Box width="full" pb={4}>
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                </Box>
              )}

              <Flex justify="end" gap={3}>
                <Button onClick={onClose} variant="ghost">
                  Cancelar
                </Button>
                <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                  Guardar
                </Button>
              </Flex>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

RechazoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedidoProduccionId: PropTypes.number,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  trazabilidadPadre: PropTypes.string,
  maxQuantity: PropTypes.number,
  currentMpUtilizada: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
