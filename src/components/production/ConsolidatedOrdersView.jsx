import {
  useState,
  Fragment,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSelector } from "react-redux";
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
import {
  useAvanzarMultiEtapaDetalleMutation,
  useExportarOrdenFabricacionSAPMutation,
} from "../../services/pedidoProductionApi";
import { ConsolidatedOrderRow } from "./ConsolidatedOrderRow";

export const ConsolidatedOrdersView = ({
  data,
  actionLabel = "Cargar a SAP",
}) => {
  const [visibleLimit, setVisibleLimit] = useState(20);

  const prevData = useRef(data);
  if (data !== prevData.current) {
    prevData.current = data;
    setVisibleLimit(20);
  }

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
  const [exportarSAP, { isLoading: isExportingSAP }] =
    useExportarOrdenFabricacionSAPMutation();

  const empresas = useSelector((state) => state.empresas?.data || []);
  const authState = useSelector((state) => state.auth || {});

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
          if (firstItem.fecha_orden_sap) {
            existingDate = new Date(firstItem.fecha_orden_sap)
              .toISOString()
              .split("T")[0];
          } else if (firstItem.fechaOrden) {
            existingDate = new Date(firstItem.fechaOrden)
              .toISOString()
              .split("T")[0];
          }

          if (firstItem.comentario_sap) {
            existingComment = firstItem.comentario_sap;
          } else if (firstItem.comentario) {
            existingComment = firstItem.comentario;
          }
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

    const isDigitadorToSAP = actionLabel.toLowerCase().includes("sap");
    if (isDigitadorToSAP && !comment.trim()) {
      toast({
        title: "Comentario obligatorio",
        description: "Debe ingresar un comentario para el registro en SAP.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const detailsToSend = [];
    const pedidoIds = new Set();
    data.forEach((group) => {
      if (selectedItems.has(group.productoNombre)) {
        group.originalItems.forEach((item) => {
          if (item.id_detallePedido) {
            detailsToSend.push(item.id_detallePedido);
          }
          if (item.id) {
            pedidoIds.add(item.id);
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
      if (isDigitadorToSAP) {
        let paisId =
          localStorage.getItem("paisId") ||
          authState.paisId ||
          authState.user?.paisId;
        if (!paisId) {
          try {
            const userData = JSON.parse(
              localStorage.getItem("userData") || "{}",
            );
            paisId = userData.paisId;
          } catch (e) {}
        }

        const emp = empresas.find((e) => e.paisId == paisId && e.estaActivo);
        if (!emp) {
          toast({
            title: "Error de configuración",
            description: "No hay configuración SAP para tu país",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        const resultSAP = await exportarSAP({
          dbsap: emp.baseDatos,
          ipsap: emp.ipBaseDatos,
          ids: Array.from(pedidoIds),
          fecha: dateSAP,
          comentario: comment,
        }).unwrap();

        const successfulPedidoIds = new Set(
          resultSAP.enviados
            ?.filter((r) => r.status === "SUCCESS")
            .map((r) => r.pedidoId) || []
        );

        const successfulDetailsToSend = [];
        data.forEach((group) => {
          if (selectedItems.has(group.productoNombre)) {
            group.originalItems.forEach((item) => {
              if (item.id_detallePedido && successfulPedidoIds.has(item.id)) {
                successfulDetailsToSend.push(item.id_detallePedido);
              }
            });
          }
        });

        if (successfulDetailsToSend.length > 0) {
          try {
            await avanzarMultiDetalle({
              detalleOrdenIds: successfulDetailsToSend,
              usuarioId: Number(localStorage.getItem("usuarioId") ?? 1),
              nuevaEtapaId: 4,
              comentario: comment || null,
              fechaOrden: dateSAP,
              avanzar: true,
            }).unwrap();
          } catch (e) {
            console.error("Error al avanzar a etapa 4 tras SAP:", e);
          }
        }

        const hasErrors = resultSAP.enviados?.some((r) => r.status === "ERROR");

        if (hasErrors) {
          toast({
            title: "Resultados con advertencias",
            description:
              "Algunas órdenes no pudieron enviarse correctamente a SAP.",
            status: "warning",
            duration: 7000,
            isClosable: true,
          });
          console.error("Resultados SAP:", resultSAP);
          // If partial, maybe unselect successful ones so user can retry failed ones
          if (successfulDetailsToSend.length > 0) {
            setSelectedItems(new Set());
            onClose();
          }
        } else {
          toast({
            title: "Órdenes enviadas a SAP",
            description: `Se enviaron exitosamente las órdenes de fabricación a SAP.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setSelectedItems(new Set());
          setComment("");
          setDateSAP("");
          onClose();
        }
      } else {
        await avanzarMultiDetalle({
          detalleOrdenIds: detailsToSend,
          usuarioId: Number(localStorage.getItem("usuarioId") ?? 1),
          nuevaEtapaId: 4,
          comentario: comment || null,
          fechaOrden: dateSAP,
          avanzar: true,
        }).unwrap();

        toast({
          title: "Movimiento exitoso",
          description: `${selectedItems.size} productos (${detailsToSend.length} items) han avanzado a la siguiente etapa.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setSelectedItems(new Set());
        setComment("");
        setDateSAP("");
        onClose();
      }
    } catch (error) {
      console.error("Error sending to SAP:", error);
      toast({
        title: "Error",
        description:
          error?.data?.msg ||
          error?.data?.error ||
          "Hubo un error al procesar la solicitud.",
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
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDateSAP(e.target.value)}
              mb={4}
            />
            <Text mb={2}>
              Comentario{" "}
              {actionLabel.toLowerCase().includes("sap")
                ? "(Obligatorio para SAP)"
                : ""}
              :
            </Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                actionLabel.toLowerCase().includes("sap")
                  ? "Ingrese el comentario obligatorio para SAP"
                  : "Escribe un comentario..."
              }
              borderColor={
                actionLabel.toLowerCase().includes("sap") && !comment.trim()
                  ? "red.400"
                  : undefined
              }
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
