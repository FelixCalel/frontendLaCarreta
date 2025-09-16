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
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { OrderRow } from "./OrderRow";

export const ConsolidatedOrdersView = ({ data }) => {
  const [expandedState, setExpandedState] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [comment, setComment] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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

  const confirmSendToSap = () => {
    // Lógica para enviar a SAP
    console.log(
      "Enviando a SAP:",
      Array.from(selectedItems),
      "Comentario:",
      comment
    );
    toast({
      title: "Enviado a SAP",
      description: `${selectedItems.size} items han sido enviados a SAP.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setSelectedItems(new Set());
    setComment("");
    onClose();
  };

  const headerBg = useColorModeValue("gray.100", "gray.700");
  const summaryRowBg = useColorModeValue("gray.50", "gray.900");
  const summaryRowHoverBg = useColorModeValue("gray.200", "gray.700");
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
    [selectedItems, data]
  );

  return (
    <>
      <Flex justify="flex-end" mb={4}>
        <Button
          colorScheme="blue"
          onClick={handleSendToSap}
          disabled={selectedItems.size === 0}
        >
          Enviar a SAP ({selectedItems.size})
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Envío a SAP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Se enviarán {selectedItems.size} items a SAP. ¿Desea continuar?
            </Text>
            <Textarea
              placeholder="Agregar un comentario (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={confirmSendToSap}>
              Confirmar Envío
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
                item.originalItems.map((i) => i.tienda)
              ).size;
              const isSelected = selectedItems.has(item.productoNombre);

              return (
                <Fragment key={item.productoNombre}>
                  <Tr
                    bg={summaryRowBg}
                    _hover={{ bg: summaryRowHoverBg }}
                    fontWeight="bold"
                    borderBottom="2px solid"
                    borderColor={useColorModeValue("gray.200", "gray.700")}
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
                      color={useColorModeValue("gray.600", "gray.400")}
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
                    item.originalItems.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        isExpanded={!!expandedState[order.id]}
                        onToggle={() => toggleExpansion(order.id)}
                        sx={childRowOptions}
                      />
                    ))}
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

ConsolidatedOrdersView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
