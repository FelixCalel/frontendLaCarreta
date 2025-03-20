// ControlCalidadTable.jsx
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ControlCalidadTable = ({
  itemsAgrupadosPorDeudor,
  filtros,
  onEditar,
}) => {
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
            <Th>Acciones</Th> {/* Nueva columna */}
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(itemsFiltrados).length > 0 ? (
            Object.entries(itemsFiltrados).map(([deudor, items]) =>
              items.map((item, idx) => (
                <Tr key={`${deudor}-${idx}`}>
                  <Td>{item.codigo || "Sin código"}</Td>
                  <Td>{item.nombre || "Sin nombre"}</Td>
                  <Td>{item.nombreTienda}</Td>
                  <Td>{item.nombreProveedor || "null"}</Td>
                  <Td>{item.cantidad || 0}</Td>
                  <Td>{item.pedido_compra || 0}</Td>
                  <Td>
                    {/* Botón para abrir modal de edición */}
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => onEditar(item)}
                    >
                      Editar
                    </Button>
                  </Td>
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
  onEditar: PropTypes.func.isRequired, // Agregamos la prop
};

export default ControlCalidadTable;
