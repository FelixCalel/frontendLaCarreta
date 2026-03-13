import { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import CantidadInput from "../pageFormPedidos/cantidadInput";

const EMPTY_DETALLES = [];

export const DetallesPedidosTableDesktop = ({
  detalles = EMPTY_DETALLES,
  onUpdateCantidad = () => {},
  onDelete = () => {},
}) => {
  const [cantidadesEditadas, setCantidadesEditadas] = useState({});
  const productos = Array.isArray(detalles) ? detalles : [];
  const thStyle = {
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "4px 8px",
  };
  const tdStyle = { padding: "3px 8px", fontSize: "0.83rem" };
  const headerBg = useColorModeValue("gray.50", "gray.700");

  const getUniqueKey = (producto, index) =>
    producto?.detallePedidoId ??
    producto?.id ??
    `${producto?.productoId ?? "p"}-${index}`;

  return (
    <Table variant="simple" size="sm">
      <Thead bg={headerBg}>
        <Tr>
          <Th style={thStyle}>Código</Th>
          <Th style={thStyle}>Producto</Th>
          <Th style={{ ...thStyle, textAlign: "right" }}>Cant. Máx.</Th>
          <Th style={{ ...thStyle, textAlign: "center" }}>Cantidad</Th>
          <Th style={{ ...thStyle, textAlign: "center" }}>Acción</Th>
        </Tr>
      </Thead>
      <Tbody>
        {productos.map((producto, index) => {
          const productoKey = getUniqueKey(producto, index);
          const cantidadActual =
            cantidadesEditadas[productoKey] ?? producto?.cantidad ?? 0;

          return (
            <Tr key={productoKey}>
              <Td style={tdStyle}>{producto?.codigo || "—"}</Td>
              <Td style={tdStyle}>{producto?.nombreProducto}</Td>
              <Td style={{ ...tdStyle, textAlign: "right" }}>
                {producto?.cantidadDisponible ?? 0}
              </Td>
              <Td style={{ ...tdStyle, textAlign: "center" }}>
                <CantidadInput
                  value={cantidadActual}
                  onChange={(e) => {
                    const v = Number.parseFloat(e.target.value) || 0;
                    setCantidadesEditadas((prev) => ({
                      ...prev,
                      [productoKey]: v,
                    }));
                  }}
                  onBlur={() =>
                    onUpdateCantidad(
                      producto,
                      Number.parseFloat(cantidadActual) || 0
                    )
                  }
                  placeholder="0"
                  size="sm"
                  width="56px"
                  maxWidth="56px"
                />
              </Td>
              <Td style={{ ...tdStyle, textAlign: "center" }}>
                <IconButton
                  aria-label="Eliminar"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  size="xs"
                  onClick={() => onDelete(producto)}
                />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

DetallesPedidosTableDesktop.propTypes = {
  detalles: PropTypes.array,
  onUpdateCantidad: PropTypes.func,
  onDelete: PropTypes.func,
};
