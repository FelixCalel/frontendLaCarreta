import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Spinner,
} from "@chakra-ui/react";

const DetallesProductosTable = ({
  detallesLocal,
  editCantidad,
  handleCantidadChange,
  handleCantidadConfirm,
  handleRemoveProducto,
  loadingDetalle,
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
              <Flex align="center" gap={2}>
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
                  disabled={loadingDetalle[producto.id]}
                  style={{
                    width: "50px",
                    padding: "6px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    opacity: loadingDetalle[producto.id] ? 0.6 : 1,
                  }}
                />
                {loadingDetalle[producto.id] && (
                  <Spinner size="xs" color="green.500" />
                )}
              </Flex>
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
                isLoading={loadingDetalle[producto.id]}
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
  loadingDetalle: PropTypes.object.isRequired,
  isEditable: PropTypes.bool.isRequired,
};
