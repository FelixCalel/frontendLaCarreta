import PropTypes from "prop-types";
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

export const ConsolidatedOrdersTable = ({ data, onRowClick }) => {
  const headerBg = useColorModeValue("gray.100", "gray.700");

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
      <Table variant="simple" size="md">
        <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
          <Tr>
            <Th>Producto</Th>
            <Th isNumeric>Cantidad Total</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.productoNombre}>
              <Td>{item.productoNombre}</Td>
              <Td isNumeric>{item.cantidad}</Td>
              <Td>
                <Button size="sm" onClick={() => onRowClick(item)}>
                  Ver Detalles
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

ConsolidatedOrdersTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClick: PropTypes.func.isRequired,
};

ConsolidatedOrdersTable.defaultProps = {
  data: [],
};
