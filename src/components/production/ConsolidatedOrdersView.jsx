import {
  useState,
  Fragment,
  useMemo,
  memo,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Icon,
  Tag,
  Checkbox,
  Button,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  Text,
  Input,
  SimpleGrid,
  FormControl,
  Center,
  Spinner,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { OrderRow } from "./OrderRow";
import {
  useAvanzarMultiEtapaDetalleMutation,
  useGetRecetaByPedidoQuery,
  useGetAlmacenesQuery,
  useUpdatePedidoProduccionMutation,
  useCreateRechazoMutation,
  useUpdateRechazoMutation,
  useUpdateMultiplePedidosProduccionMutation,
} from "../../services/pedidoProductionApi";
import { RecetaTable } from "./RecetaTable";
import { OrderDetailsTable } from "./OrderDetailsTable";
import { skipToken } from "@reduxjs/toolkit/query";
import { debounce } from "lodash";

const FIELD_LABELS = {
  mpUtilizada: "MP Utilizada",
  mpSobrante: "MP Sobrante",
  basura: "Basura",
  trazabilidad_Prod: "Trazabilidad",
};

const FIELD_SPECS = {
  mpUtilizada: { w: "51px", type: "number" },
  mpSobrante: { w: "51px", type: "number" },
  basura: { w: "51px", type: "number" },
  trazabilidad_Prod: { w: "65px", type: "text" },
};

const ROW_1 = ["mpUtilizada", "mpSobrante", "basura", "trazabilidad_Prod"];

const ConsolidatedExpandedRow = memo(({ item, isExpanded }) => {
  const panelBg = useColorModeValue("white", "gray.700");
  const panelBorder = useColorModeValue("gray.200", "gray.600");
  const [updatePedido] = useUpdatePedidoProduccionMutation();
  const toast = useToast();
  const primaryOrder = item.originalItems[0];
  const pedidoId = primaryOrder?.id;
  const recetaArg = isExpanded && pedidoId ? { pedidoId } : skipToken;
  const { data: receta = [], isLoading: loadingReceta } =
    useGetRecetaByPedidoQuery(recetaArg);
  const hasReceta = receta && receta.length > 0;
  const { data: almacenes = [] } = useGetAlmacenesQuery(undefined, {
    skip: !isExpanded,
  });
  const isPTMQ = primaryOrder?.ptmq ?? false;
  const allDetails = item.originalItems.flatMap((o) => o.details || []);

  const handleUpdate = useCallback(
    (field, value) => {
      if (!pedidoId) return;
      let finalValue = field === "trazabilidad_Prod" ? value : Number(value);
      if (
        typeof finalValue === "number" &&
        (isNaN(finalValue) || finalValue < 0)
      ) {
        finalValue = 0;
      }

      updatePedido({
        id: pedidoId,
        data: { [field]: finalValue },
      })
        .unwrap()
        .catch((err) => console.error("Error updating pedido:", err));
    },
    [pedidoId, updatePedido],
  );

  const handlePTMQToggle = useCallback(
    async (checked) => {
      if (!pedidoId) return;
      try {
        await updatePedido({ id: pedidoId, data: { ptmq: checked } }).unwrap();
      } catch (err) {
        console.error("Error updating PTMQ:", err);
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado PTMQ",
          status: "error",
        });
      }
    },
    [pedidoId, updatePedido, toast],
  );

  const debouncedUpdate = useMemo(
    () => debounce(handleUpdate, 500),
    [handleUpdate],
  );

  const inputBg = useColorModeValue("gray.50", "gray.700");

  if (!isExpanded) return null;

  return (
    <Box
      pl={2}
      pr={1}
      py={2}
      bg={useColorModeValue("gray.50", "gray.900")}
      borderBottomWidth="1px"
      borderColor="gray.200"
    >
      <Flex gap={4} direction={{ base: "column", xl: "row" }}>
        <Box width="fit-content">
          {primaryOrder && (
            <Box
              bg={useColorModeValue("white", "gray.800")}
              p={3}
              borderRadius="md"
              shadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
              mb={3}
            >
              <Flex align="center" justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="bold" color="blue.600">
                  Registro
                </Text>
                <Button
                  size="xs"
                  h="24px"
                  colorScheme="red"
                  variant="ghost"
                  leftIcon={<ChevronRightIcon />}
                  fontSize="xs"
                  isDisabled={true}
                  title="Disponible en vista individual"
                >
                  Registrar Rechazo
                </Button>
              </Flex>

              <Flex gap={2} wrap="wrap" mb={2}>
                {ROW_1.map((field) => {
                  const currentValue = item.originalItems[0][field];
                  const spec = FIELD_SPECS[field];
                  return (
                    <Flex key={field} direction="column" align="center">
                      <Text
                        fontSize="10px"
                        fontWeight="bold"
                        color="gray.500"
                        mb={0.5}
                        textTransform="uppercase"
                        textAlign="center"
                      >
                        {FIELD_LABELS[field]}
                      </Text>
                      <Input
                        size="xs"
                        w={spec.w}
                        type={spec.type}
                        defaultValue={
                          currentValue ?? (spec.type === "number" ? 0 : "")
                        }
                        placeholder={spec.type === "number" ? "0" : ""}
                        onChange={(e) => debouncedUpdate(field, e.target.value)}
                        focusBorderColor="blue.400"
                        borderRadius="sm"
                        bg={inputBg}
                        textAlign="center"
                      />
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          )}

          <Box>
            <OrderDetailsTable
              details={allDetails}
              isLoading={false}
              showPTMQ={!hasReceta}
              isPTMQ={isPTMQ}
              onTogglePTMQ={handlePTMQToggle}
            />
          </Box>
        </Box>
        <Box flex="1">
          {loadingReceta ? (
            <Center py={2}>
              <Spinner size="sm" />
            </Center>
          ) : (
            <RecetaTable
              pedidoId={pedidoId}
              receta={receta}
              almacenes={almacenes}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
});

const ConsolidatedOrderRow = memo(
  ({
    item,
    isExpanded,
    onToggleExpand,
    isSelected,
    onToggleSelection,
    summaryRowBg,
    summaryRowHoverBg,
    summaryRowBorderColor,
  }) => {
    const [updatePedido] = useUpdatePedidoProduccionMutation();
    const [updateMultiplePedidos] =
      useUpdateMultiplePedidosProduccionMutation();
    const toast = useToast();

    const primaryOrder = item.originalItems[0];
    const pedidoId = primaryOrder?.id;

    const handleTrazabilidadUpdate = useCallback(
      (value) => {
        if (!pedidoId) return;
        updatePedido({
          id: pedidoId,
          data: { trazabilidad_Prod: value },
        })
          .unwrap()
          .catch((err) => {
            console.error("Error updating trazabilidad:", err);
            toast({
              title: "Error",
              description: "No se pudo actualizar la trazabilidad",
              status: "error",
            });
          });
      },
      [pedidoId, updatePedido, toast],
    );

    const debouncedTrazabilidadUpdate = useMemo(
      () => debounce(handleTrazabilidadUpdate, 500),
      [handleTrazabilidadUpdate],
    );

    const inputBg = useColorModeValue("white", "gray.800");
    const inputBorder = useColorModeValue("gray.300", "gray.600");

    const isGroupComplete =
      item.originalItems.length > 0 &&
      item.originalItems.every((i) => i.completo);

    const handleCheckboxChange = async (e) => {
      const newCheckedState = e.target.checked;
      const idsToUpdate = item.originalItems.map((subItem) => subItem.id);

      try {
        await updateMultiplePedidos({
          ids: idsToUpdate,
          data: { completo: newCheckedState },
        }).unwrap();
      } catch (err) {
        console.error("Error updating completion status:", err);
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de completado",
          status: "error",
        });
      }
    };

    const solicitud = item.cantidadUnidad;
    const procesado = item.cantidad;
    const faltante = solicitud - procesado;

    return (
      <Fragment>
        <Tr
          bg={isExpanded ? summaryRowHoverBg : summaryRowBg}
          _hover={{ bg: summaryRowHoverBg }}
          borderBottom="1px solid"
          borderColor={summaryRowBorderColor}
          transition="background 0.2s"
        >
          <Td w="36px" px={2}>
            <Checkbox
              isChecked={isSelected}
              onChange={() => onToggleSelection(item.productoNombre)}
              size="lg"
              colorScheme="green"
              borderColor="gray.500"
            />
          </Td>
          <Td w="36px" px={2}>
            <Icon
              as={isExpanded ? ChevronDownIcon : ChevronRightIcon}
              boxSize={6}
              cursor="pointer"
              onClick={() => onToggleExpand(item.id)}
              color="gray.500"
            />
          </Td>
          <Td px={2} fontWeight="bold">
            {item.productoNombre}
          </Td>
          <Td px={2}>
            <Input
              size="sm"
              width="80px"
              defaultValue={primaryOrder?.trazabilidad_Prod || ""}
              placeholder="-"
              onChange={(e) => debouncedTrazabilidadUpdate(e.target.value)}
              bg={inputBg}
              borderColor={inputBorder}
            />
          </Td>
          <Td px={2} textAlign="center">
            <Box>
              <Text fontWeight="bold" fontSize="lg" color="blue.500">
                {solicitud ?? "-"}
              </Text>
              <Text fontSize="xs" color="gray.400" textTransform="uppercase">
                Solicita
              </Text>
            </Box>
          </Td>
          <Td px={2} textAlign="center">
            <Checkbox
              isChecked={isGroupComplete}
              onChange={handleCheckboxChange}
              size="lg"
              colorScheme="green"
              cursor="pointer"
              borderColor="gray.500"
            />
          </Td>
          <Td px={2} textAlign="center">
            <Box>
              <Text fontWeight="bold" fontSize="lg" color="green.500">
                {procesado}
              </Text>
              <Text fontSize="xs" color="gray.400" textTransform="uppercase">
                Procesado
              </Text>
            </Box>
          </Td>
          <Td px={2} textAlign="center">
            <Box>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={faltante > 0 ? "red.400" : "gray.400"}
              >
                {faltante}
              </Text>
              <Text fontSize="xs" color="gray.400" textTransform="uppercase">
                Faltante
              </Text>
            </Box>
          </Td>
        </Tr>
        {isExpanded && (
          <Tr>
            <Td colSpan={9} p={0} border="none">
              <ConsolidatedExpandedRow item={item} isExpanded={isExpanded} />
            </Td>
          </Tr>
        )}
      </Fragment>
    );
  },
);

export const ConsolidatedOrdersView = ({ data }) => {
  const [visibleLimit, setVisibleLimit] = useState(20);

  useEffect(() => {
    setVisibleLimit(20);
  }, [data]);

  const visibleData = data.slice(0, visibleLimit);
  const hasMore = visibleData.length < data.length;

  const loadMore = () => {
    setVisibleLimit((prev) => Math.min(prev + 50, data.length));
  };

  const [expandedState, setExpandedState] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [comment, setComment] = useState("");
  const [dateSAP, setDateSAP] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [avanzarMultiDetalle, { isLoading: isSending }] =
    useAvanzarMultiEtapaDetalleMutation();

  const toggleExpansion = useCallback((id) => {
    setExpandedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleSelectAll = useCallback(
    (e) => {
      if (e.target.checked) {
        const allIds = new Set(data.map((item) => item.productoNombre));
        setSelectedItems(allIds);
      } else {
        setSelectedItems(new Set());
      }
    },
    [data],
  );

  const handleSelectItem = useCallback((id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSendToSap = () => {
    if (selectedItems.size === 0) {
      toast({
        title: "No hay items seleccionados",
        description: "Por favor seleccione al menos un item para enviar a SAP.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    onOpen();
  };

  const confirmSendToSap = async () => {
    if (!dateSAP) {
      toast({
        title: "Falta fecha",
        description: "Debe seleccionar una fecha de orden.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const detailsToSend = [];
    data.forEach((group) => {
      if (selectedItems.has(group.productoNombre)) {
        group.originalItems.forEach((item) => {
          if (item.id_detallePedido) {
            detailsToSend.push(item.id_detallePedido);
          }
        });
      }
    });

    if (detailsToSend.length === 0) {
      toast({
        title: "Error",
        description: "No se encontraron detalles para enviar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await avanzarMultiDetalle({
        detalleOrdenIds: detailsToSend,
        usuarioId: Number(localStorage.getItem("usuarioId") ?? 1),
        nuevaEtapaId: 4,
        comentario: comment || null,
        fechaOrden: dateSAP,
      }).unwrap();

      toast({
        title: "Enviado a SAP",
        description: `${selectedItems.size} productos (${detailsToSend.length} items) han sido enviados a SAP.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setSelectedItems(new Set());
      setComment("");
      setDateSAP("");
      onClose();
    } catch (error) {
      console.error("Error sending to SAP:", error);
      toast({
        title: "Error",
        description: "Hubo un error al enviar a SAP.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const headerBg = useColorModeValue("gray.100", "gray.700");
  const summaryRowBg = useColorModeValue("gray.50", "gray.900");
  const summaryRowHoverBg = useColorModeValue("gray.200", "gray.700");
  const modalBg = useColorModeValue("white", "gray.800");
  const summaryRowBorderColor = useColorModeValue("gray.200", "gray.700");
  const detailsTextColor = useColorModeValue("gray.600", "gray.400");

  const allSelected = useMemo(
    () => data.length > 0 && selectedItems.size === data.length,
    [selectedItems, data],
  );

  const deuHeaderBg = useColorModeValue("blue.50", "blue.900");
  const deuHeaderBorderTop = "2px solid";
  const deuHeaderBorderBottom = "2px solid";
  const deuHeaderBorderColor = useColorModeValue("blue.300", "blue.600");

  let currentDeu = null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Cargar a SAP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} fontWeight="bold">
              Fecha de Orden (Obligatorio):
            </Text>
            <Input
              type="date"
              value={dateSAP}
              onChange={(e) => setDateSAP(e.target.value)}
              mb={4}
            />
            <Text mb={2}>Comentario:</Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe un comentario..."
              mb={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={confirmSendToSap}
              isLoading={isSending}
              isDisabled={!dateSAP}
            >
              Cargar a SAP
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TableContainer
        w="100%"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        borderRadius="md"
        shadow="sm"
        overflowX="auto"
        fontSize="md"
        p={2}
      >
        <Table variant="simple" size="md" tablelayout="fixed" w="100%">
          <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th w="36px" px={2}>
                <Checkbox
                  isChecked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </Th>
              <Th w="36px" px={2} />
              <Th px={2}>Producto</Th>
              <Th px={2}>Trazabilidad</Th>
              <Th px={2}>Solic. ventas</Th>
              <Th px={2}>Completado</Th>
              <Th px={2}>Cantidad Procesada</Th>
              <Th px={2}>Faltante</Th>
            </Tr>
          </Thead>
          <Tbody>
            {visibleData.map((item, index) => {
              const deuCode = item.deudorCodigo || "";
              const showDeuHeader = currentDeu !== deuCode;
              if (showDeuHeader) {
                currentDeu = deuCode;
              }

              return (
                <Fragment key={`${deuCode}-${item.productoNombre}`}>
                  {showDeuHeader && (
                    <Tr
                      bg={deuHeaderBg}
                      borderTop={deuHeaderBorderTop}
                      borderBottom={deuHeaderBorderBottom}
                      borderColor={deuHeaderBorderColor}
                    >
                      <Td
                        colSpan={9}
                        px={4}
                        py={3}
                        fontWeight="bold"
                        fontSize="md"
                      >
                        {deuCode} - {item.deudorNombre || item.tienda}
                      </Td>
                    </Tr>
                  )}
                  <ConsolidatedOrderRow
                    item={item}
                    isExpanded={!!expandedState[item.id]}
                    onToggleExpand={toggleExpansion}
                    isSelected={selectedItems.has(item.productoNombre)}
                    onToggleSelection={handleSelectItem}
                    summaryRowBg={summaryRowBg}
                    summaryRowHoverBg={summaryRowHoverBg}
                    summaryRowBorderColor={summaryRowBorderColor}
                  />
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {hasMore && (
        <Center mt={4}>
          <Button onClick={loadMore} size="sm" variant="outline">
            Cargar más ({data.length - visibleLimit} restantes)
          </Button>
        </Center>
      )}

      <Flex justify="flex-end" mt={4}>
        <Button
          colorScheme="blue"
          onClick={handleSendToSap}
          isDisabled={selectedItems.size === 0}
        >
          Cargar a SAP ({selectedItems.size})
        </Button>
      </Flex>
    </>
  );
};

ConsolidatedOrdersView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
