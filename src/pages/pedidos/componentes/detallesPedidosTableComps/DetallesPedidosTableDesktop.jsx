import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import CantidadInput from "../pageFormPedidos/cantidadInput";

export const DetallesPedidosTableDesktop = ({
  productos,
  getUniqueKey,
  setProductos,
  handleCantidadChange,
  handleRemoveProducto,
}) => {
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
          <Tr
            key={getUniqueKey(producto)}
            style={{ padding: "0px", height: "10px" }}
          >
            <Td style={{ padding: "2px 4px", fontSize: "0.85rem" }}>
              {producto.codigo || "Sin código"}
            </Td>
            <Td style={{ padding: "2px 4px", fontSize: "0.85rem" }}>
              {producto.nombreProducto}
            </Td>
            <Td style={{ padding: "2px 4px", fontSize: "0.85rem" }}>
              {producto.cantidadDisponible}
            </Td>
            <Td style={{ padding: "2px 4px", fontSize: "0.85rem" }}>
              <CantidadInput
                value={producto.cantidad}
                onChange={(e) =>
                  setProductos((prevProductos) =>
                    prevProductos.map((prod) =>
                      prod.detallePedidoId === producto.detallePedidoId
                        ? {
                            ...prod,
                            cantidad: parseFloat(e.target.value) || 0,
                          }
                        : prod,
                    ),
                  )
                }
                onBlur={() => {
                  handleCantidadChange(
                    producto.detallePedidoId,
                    producto.cantidad,
                  );
                }}
                placeholder="0"
                size="sm"
                width="50px"
                maxWidth="50px"
                style={{
                  margin: "0",
                  padding: "1px",
                  fontSize: "0.85rem",
                }}
              />
            </Td>
            <Td style={{ padding: "2px 4px" }}>
              <Tooltip label="Eliminar producto" hasArrow>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleRemoveProducto(producto.detallePedidoId)}
                  size="xs"
                  style={{ margin: "0", padding: "0" }}
                />
              </Tooltip>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

DetallesPedidosTableDesktop.propTypes = {
  productos: PropTypes.array.isRequired,
  getUniqueKey: PropTypes.func.isRequired,
  setProductos: PropTypes.func.isRequired,
  handleCantidadChange: PropTypes.func.isRequired,
  handleRemoveProducto: PropTypes.func.isRequired,
};

