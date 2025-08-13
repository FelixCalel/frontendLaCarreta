import PropTypes from "prop-types";
import {
  Box,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";

export default function QaProductTable({ items, onMuestreoClick }) {
  const border = useColorModeValue("gray.200", "gray.700");
  const headBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        Productos
      </Text>
      <TableContainer
        border="1px solid"
        borderColor={border}
        rounded="md"
        overflowX="auto"
      >
        <Table size="sm" variant="simple">
          <Thead bg={headBg} position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th>ID</Th>
              <Th>Código</Th>
              <Th>Producto</Th>
              <Th>Características</Th>
              <Th isNumeric>Cantidad</Th>
              <Th>Unidad</Th>
              <Th>Observaciones</Th>
              <Th>Acción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(items || []).map((it) => (
              <Tr key={it.qaId}>
                <Td>{it.qaId}</Td>
                <Td>{it.productoCodigo}</Td>
                <Td maxW="260px" isTruncated>
                  {it.productoNombre}
                </Td>
                <Td maxW="320px" isTruncated>
                  {it.caracteristicas}
                </Td>
                <Td isNumeric>{it.cantidad}</Td>
                <Td>{it.unidadMedida || ""}</Td>
                <Td maxW="300px" isTruncated>
                  {it.observaciones || ""}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => onMuestreoClick(it.qaId, it.muestreoId)}
                  >
                    Muestreo
                  </Button>
                </Td>
              </Tr>
            ))}

            {(!items || items.length === 0) && (
              <Tr>
                <Td colSpan={8} textAlign="center" py={10} opacity={0.7}>
                  Sin productos.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
QaProductTable.propTypes = {
  items: PropTypes.array.isRequired,
  onMuestreoClick: PropTypes.func.isRequired,
};
