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

export const OrdersTable = ({ data = [] }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const toggleRow = (id) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

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
      <Table variant="simple" size="md" tablelayout="fixed" w="100%">
        <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
          <Tr>
            <Th w="36px" px={2} />
            <Th px={2}>Producto</Th>
            <Th px={2}>País</Th>
            <Th px={2}>Cliente</Th>
            <Th px={2}>Solic. ventas</Th>
            <Th px={2}>Completar</Th>
            <Th px={2}>Cantidad Procesada</Th>
            <Th px={2}>Faltante</Th>
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