import React from "react";
import PropTypes from "prop-types";
import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";

const DetallesProductosTable = ({
  detallesLocal,
  editCantidad,
  handleCantidadChange,
  handleCantidadConfirm,
  handleRemoveProducto,
  loading,
  isEditable,
}) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Código</Th>
        <Th>Producto</Th>
        <Th w="70px">Cantidad</Th>
        <Th w="70px">Acciones</Th>
      </Tr>
    </Thead>
    <Tbody>
      {detallesLocal.map((producto) => (
        <Tr key={producto.id}>
          <Td>{producto.codigo || "Sin código"}</Td>
          <Td>{producto.nombreProducto}</Td>
          <Td>
            {isEditable ? (
              <input
                type="number"
                min={1}
                value={
                  editCantidad[producto.id] !== undefined
                    ? editCantidad[producto.id]
                    : producto.cantidad
                }
                onChange={(e) =>
                  handleCantidadChange(producto.id, e.target.value)
                }
                onBlur={() => handleCantidadConfirm(producto.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCantidadConfirm(producto.id);
                }}
                style={{
                  width: "50px",
                  padding: "6px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
            ) : (
              producto.cantidad
            )}
          </Td>
          <Td>
            {isEditable ? (
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => handleRemoveProducto(producto.id)}
                isLoading={loading}
                fontSize="1rem"
                py={2}
                maxWidth="60px"
              >
                Eliminar
              </Button>
            ) : null}
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export default DetallesProductosTable;

DetallesProductosTable.propTypes = {
  detallesLocal: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      codigo: PropTypes.string,
      nombreProducto: PropTypes.string,
      cantidad: PropTypes.number.isRequired,
    })
  ).isRequired,
  editCantidad: PropTypes.object.isRequired,
  handleCantidadChange: PropTypes.func.isRequired,
  handleCantidadConfirm: PropTypes.func.isRequired,
  handleRemoveProducto: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool.isRequired,
};
