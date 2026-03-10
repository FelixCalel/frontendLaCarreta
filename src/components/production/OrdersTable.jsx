import { useState, Fragment } from "react";
import PropTypes from "prop-types";
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  useColorModeValue,
} from "@chakra-ui/react";
import { OrderRow } from "./OrderRow";
import { useGetAlmacenesQuery } from "../../services/pedidoProductionApi";

const EMPTY_ITEMS = [];

export const OrdersTable = ({ data = EMPTY_ITEMS }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const toggleRow = (id) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const { data: almacenes = [] } = useGetAlmacenesQuery();

  const headerBg = useColorModeValue("gray.100", "gray.700");
  const groupHeadBg = useColorModeValue("gray.200", "gray.600");

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
      <Table variant="simple" size="sm" tablelayout="fixed" w="100%">
        <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
          <Tr>
            <Th w="36px" px={2} py={2} />
            <Th px={2} py={2} fontSize="xs">
              Producto
            </Th>
            <Th px={2} py={2} fontSize="xs">
              País
            </Th>
            <Th px={2} py={2} fontSize="xs">
              Cliente
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
            {/* Note: I added textAlign center to match the rows which have center alignment for numbers */}
          </Tr>
        </Thead>

        <Tbody>
          {data.map((order, idx) => (
            <Fragment key={order.id}>
              <Tr bg={groupHeadBg}></Tr>
              <OrderRow
                order={order}
                isExpanded={!!expandedRows[order.id]}
                onToggle={toggleRow}
                almacenes={almacenes}
                index={idx}
              />

              {idx < data.length - 1 && <Tr></Tr>}
            </Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

OrdersTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
