import { useState, Fragment } from "react";
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
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { OrderRow } from "./OrderRow";

export const ConsolidatedOrdersView = ({ data }) => {
  const [expandedState, setExpandedState] = useState({});

  const toggleExpansion = (id) => {
    setExpandedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  return (
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
            <Th w="36px" px={2} />
            <Th px={2}>Producto</Th>
            <Th px={2} colSpan={2}>
              Detalles Pedidos
            </Th>
            <Th px={2}>Solic. ventas</Th>
            <Th px={2}>Completar</Th>
            <Th px={2}>Cantidad Procesada</Th>
            <Th px={2}>Faltante</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => {
            const isProductExpanded = !!expandedState[item.productoNombre];
            const isComplete =
              item.cantidad >= item.cantidadUnidad && item.cantidadUnidad > 0;
            const uniqueClients = new Set(
              item.originalItems.map((i) => i.tienda)
            ).size;

            return (
              <Fragment key={item.productoNombre}>
                <Tr
                  onClick={() => toggleExpansion(item.productoNombre)}
                  cursor="pointer"
                  bg={summaryRowBg}
                  _hover={{ bg: summaryRowHoverBg }}
                  fontWeight="bold"
                  borderBottom="2px solid"
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                >
                  <Td px={2} py={2}>
                    <Icon
                      as={isProductExpanded ? ChevronDownIcon : ChevronRightIcon}
                    />
                  </Td>
                  <Td px={2} py={2}>
                    {item.productoNombre}
                  </Td>
                  <Td
                    px={2}
                    py={2}
                    colSpan={2}
                    color={useColorModeValue("gray.600", "gray.400")}
                    fontSize="sm"
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
                    {isComplete ? "Sí" : "No"}
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
  );
};

ConsolidatedOrdersView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
