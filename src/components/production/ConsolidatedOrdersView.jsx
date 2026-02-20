import { useState, Fragment, useMemo, useCallback, useEffect } from "react";
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
  Center,
} from "@chakra-ui/react";
import { useAvanzarMultiEtapaDetalleMutation } from "../../services/pedidoProductionApi";
import { ConsolidatedOrderRow } from "./ConsolidatedOrderRow";

export const ConsolidatedOrdersView = ({
  data,
  actionLabel = "Cargar a SAP",
}) => {
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
    let existingDate = "";
    let existingComment = "";

    for (const group of data) {
      if (selectedItems.has(group.productoNombre)) {
        const firstItem = group.originalItems[0];
        if (firstItem) {
          if (firstItem.fechaOrden) existingDate = firstItem.fechaOrden;
        }
        break;
      }
    }

    setDateSAP(existingDate || new Date().toISOString().split("T")[0]);
    setComment(existingComment);
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

  const allSelected = useMemo(
    () => data.length > 0 && selectedItems.size === data.length,
    [selectedItems, data],
  );

  const deuHeaderBg = useColorModeValue("blue.50", "blue.900");
  const deuHeaderBorderTop = "2px solid";
  const deuHeaderBorderBottom = "2px solid";
  const deuHeaderBorderColor = useColorModeValue("blue.300", "blue.600");

  let currentDeu = null;

  const actionButtonText = actionLabel;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>{actionButtonText}</ModalHeader>
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
              {actionButtonText}
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
        <Table variant="simple" size="sm" tablelayout="fixed" w="100%">
          <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th w="36px" px={2} py={2}>
                <Checkbox
                  isChecked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </Th>
              <Th w="36px" px={2} py={2} />
              <Th px={2} py={2} fontSize="xs">
                Producto
              </Th>
              <Th px={2} py={2} fontSize="xs">
                Trazabilidad
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Solic. ventas
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Completado
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Cantidad Procesada
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Faltante
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Almacén Destino
              </Th>
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
          {actionButtonText} ({selectedItems.size})
        </Button>
      </Flex>
    </>
  );
};

ConsolidatedOrdersView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
