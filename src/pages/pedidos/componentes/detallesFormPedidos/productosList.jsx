import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Tooltip } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import CantidadInput from "../pageFormPedidos/cantidadInput";
import PropTypes from "prop-types";

const ProductosList = ({ productos, onRemove, onCantidadChange }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Código</Th>
          <Th>Producto</Th>
          <Th>Cantidad Máxima</Th>
          <Th>Cantidad</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {productos.map((producto) => (
          <Tr key={producto.detallePedidoId}>
            <Td>{producto.codigo || "Sin código"}</Td>
            <Td>{producto.nombreProducto}</Td>
            <Td>{producto.cantidadDisponible}</Td>
            <Td>
              <CantidadInput
                value={producto.cantidad}
                onChange={(e) =>
                  onCantidadChange(producto.detallePedidoId, parseFloat(e.target.value) || 0)
                }
                placeholder="Cantidad"
                size="sm"
                width="50px"
                maxWidth="50px"
                max={producto.cantidadDisponible}
              />
            </Td>
            <Td>
              <Tooltip label="Eliminar producto" hasArrow>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => onRemove(producto.detallePedidoId)}
                  size="xs"
                />
              </Tooltip>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

ProductosList.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      detallePedidoId: PropTypes.number.isRequired,
      codigo: PropTypes.string,
      nombreProducto: PropTypes.string.isRequired,
      cantidadDisponible: PropTypes.number.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  onCantidadChange: PropTypes.func.isRequired,
  usuarioId: PropTypes.number.isRequired,
};

export default ProductosList;
