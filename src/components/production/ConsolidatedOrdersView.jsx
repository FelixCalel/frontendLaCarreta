import { useState, Fragment, useMemo } from "react";
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
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { OrderRow } from "./OrderRow";
import { useAvanzarMultiEtapaDetalleMutation } from "../../services/pedidoProductionApi";

export const ConsolidatedOrdersView = ({ data }) => {
  const [expandedState, setExpandedState] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [comment, setComment] = useState("");
  const [dateSAP, setDateSAP] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [avanzarMultiDetalle, { isLoading: isSending }] =
    useAvanzarMultiEtapaDetalleMutation();

  const toggleExpansion = (id) => {
    setExpandedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(data.map((item) => item.productoNombre));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
  const rowHoverBg = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const modalBg = useColorModeValue("white", "gray.800");
  // Modal background color
  const summaryRowBorderColor = useColorModeValue("gray.200", "gray.700");
  const detailsTextColor = useColorModeValue("gray.600", "gray.400");
  const childRowOptions = {
    bg: useColorModeValue("white", "gray.800"),
    _hover: {
      bg: useColorModeValue("blackAlpha.50", "whiteAlpha.50"),
    },
    borderLeft: "4px solid",
    borderColor: useColorModeValue("blue.400", "blue.600"),
  };

  const allSelected = useMemo(
    () => data.length > 0 && selectedItems.size === data.length,
    [selectedItems, data],
  );

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
              <Th px={2} colSpan={2}>
                Detalles Pedidos
              </Th>
              <Th px={2}>Solic. ventas</Th>
              <Th px={2}>Completado</Th>
              <Th px={2}>Cantidad Procesada</Th>
              <Th px={2}>Faltante</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => {
              const isProductExpanded = !!expandedState[item.productoNombre];
              const allSubItemsComplete =
                item.originalItems.length > 0 &&
                item.originalItems.every((order) => order.completo);
              const uniqueClients = new Set(
                item.originalItems.map((i) => i.tienda),
              ).size;
              const isSelected = selectedItems.has(item.productoNombre);

              return (
                <Fragment key={item.productoNombre}>
                  <Tr
                    bg={summaryRowBg}
                    _hover={{ bg: summaryRowHoverBg }}
                    fontWeight="bold"
                    borderBottom="2px solid"
                    borderColor={summaryRowBorderColor}
                  >
                    <Td px={2} py={2}>
                      <Checkbox
                        isChecked={isSelected}
                        onChange={() => handleSelectItem(item.productoNombre)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Td>
                    <Td
                      px={2}
                      py={2}
                      onClick={() => toggleExpansion(item.productoNombre)}
                      cursor="pointer"
                    >
                      <Icon
                        as={
                          isProductExpanded ? ChevronDownIcon : ChevronRightIcon
                        }
                      />
                    </Td>
                    <Td
                      px={2}
                      py={2}
                      onClick={() => toggleExpansion(item.productoNombre)}
                      cursor="pointer"
                    >
                      {item.productoNombre}
                    </Td>
                    <Td
                      px={2}
                      py={2}
                      colSpan={2}
                      color={detailsTextColor}
                      fontSize="sm"
                      onClick={() => toggleExpansion(item.productoNombre)}
                      cursor="pointer"
                    >
                      <Tag colorScheme="blue" size="sm" mr={2}>
                        {item.originalItems.length}
                      </Tag>
                      pedidos de {uniqueClients} cliente(s)
                    </Td>
                    <Td px={2} py={2} textAlign="center">
                      {item.cantidadUnidad}
                    </Td>
                    <Td px={2} py={2} textAlign="center">
                      {allSubItemsComplete ? "Si" : "No"}
                    </Td>
                    <Td px={2} py={2} textAlign="center">
                      {item.cantidad}
                    </Td>
                    <Td px={2} py={2} textAlign="center">
                      {item.cantidadUnidad - item.cantidad}
                    </Td>
                  </Tr>

                  {isProductExpanded &&
                    item.originalItems.map((order, i) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        isExpanded={!!expandedState[order.id]}
                        onToggle={() => toggleExpansion(order.id)}
                        sx={childRowOptions}
                        index={i}
                      />
                    ))}
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justify="flex-end" mt={4}>
        <Button
          colorScheme="blue"
          onClick={handleSendToSap}
          disabled={selectedItems.size === 0}
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
