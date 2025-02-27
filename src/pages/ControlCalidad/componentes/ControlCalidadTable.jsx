import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ControlCalidadTable = ({ itemsAgrupadosPorDeudor, filtros }) => {
  const itemsFiltrados = {};

  Object.keys(itemsAgrupadosPorDeudor).forEach((deudor) => {
    const items = itemsAgrupadosPorDeudor[deudor].filter((item) => {
      const cumplePalabras =
        !filtros.palabrasClave ||
        (item.nombre || item.nombreProducto || "")
          .toLowerCase()
          .includes(filtros.palabrasClave.toLowerCase());
      return cumplePalabras;
    });
    if (items.length > 0) {
      itemsFiltrados[deudor] = items;
    }
  });

  return (
    <Box overflowX="auto">
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Código</Th>
            <Th>Nombre Item</Th>
            <Th>Subcliente</Th>
            <Th>Proveedor</Th>
            <Th>Cantidad a recibir</Th>
            <Th>Cantidad Recibida</Th>
            <Th> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(itemsFiltrados).length > 0 ? (
            Object.entries(itemsFiltrados).map(([deudor, items]) =>
              items.map((item, idx) => (
                <Tr key={`${deudor}-${idx}`}>
                  <Td>{item.codigo || "Sin código"}</Td>
                  <Td>{item.nombre || "Sin nombre"}</Td>
                  <Td>{deudor}</Td>
                  <Td>{item.cantidad}</Td>
                  <Td>{item.cantidadAsignada || 0}</Td>
                  <Td>{item.recibido || 0}</Td>
                </Tr>
              ))
            )
          ) : (
            <Tr>
              <Td colSpan="7" align="center">
                No hay items para mostrar.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

ControlCalidadTable.propTypes = {
  itemsAgrupadosPorDeudor: PropTypes.object.isRequired,
  filtros: PropTypes.shape({
    palabrasClave: PropTypes.string,
  }).isRequired,
};

export default ControlCalidadTable;
