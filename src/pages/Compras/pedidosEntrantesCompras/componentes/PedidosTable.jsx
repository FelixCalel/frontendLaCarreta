import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const PedidosTable = ({ itemsAgrupadosPorDeudor, filtros }) => {
  const itemsFiltrados = {};

  Object.keys(itemsAgrupadosPorDeudor).forEach((deudor) => {
    const items = itemsAgrupadosPorDeudor[deudor].filter((item) => {
      const cumplePalabras =
        !filtros.palabrasClave ||
        (item.nombreProducto || item.nombre)
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
            <Th>ID</Th>
            <Th>Código</Th>
            <Th>Nombre Item</Th>
            <Th>DEU</Th>
            <Th>Cantidad</Th>
            <Th>Compras OC</Th>
            <Th>Recibido</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(itemsFiltrados).length > 0 ? (
            Object.entries(itemsFiltrados).map(
              ([deudor, items], index) => (
                <React.Fragment key={index}>
                  <Tr>
                  </Tr>
                  {items.map((item, idx) => (
                    <Tr key={idx}>
                      <Td>{item.id || "null"}</Td>
                      <Td>{item.codigo || "Sin código"}</Td>
                      <Td>{item.nombreProducto || item.nombre || "Sin nombre"}</Td>
                      <Td>{deudor}</Td>
                      <Td>{item.cantidad}</Td>
                      <Td>{item.pedidoComprasOC || 0}</Td>
                      <Td>{item.recibido || 0}</Td>
                    </Tr>
                  ))}
                </React.Fragment>
              )
            )
          ) : (
            <Tr>
              <Td colSpan="6" align="center">
                No hay items para mostrar.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

PedidosTable.propTypes = {
  itemsAgrupadosPorDeudor: PropTypes.object.isRequired,
  filtros: PropTypes.shape({
    palabrasClave: PropTypes.string,
  }).isRequired,
};

export default PedidosTable;