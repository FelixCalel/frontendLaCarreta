import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PedidosTable = ({ pedidos, roleId, onVerDetalles }) => (
  <Table variant="striped" colorScheme="gray">
    <Thead>
      <Tr>
        <Th>ID</Th>
        <Th>Deudor</Th>
        <Th>Tienda</Th>
        <Th>Estado</Th>
        <Th>Fecha realización de pedido</Th>
        {roleId === 1 || roleId === 3 ? <Th>Usuario</Th> : null}
        <Th>Acciones</Th>
      </Tr>
    </Thead>
    <Tbody>
      {pedidos.map((pedido) => (
        <Tr key={pedido.id}>
          <Td>{pedido.id}</Td>
          <Td>{`${pedido.nombreCorrelativo} - ${
            pedido.nombreDeu || "N/A"
          }`}</Td>
          <Td>{pedido.nombreTienda || "N/A"}</Td>
          <Td>
            <Box
              color={
                pedido.estadoId === 5
                  ? "blue.600"
                  : pedido.estadoId === 3
                  ? "green.600"
                  : pedido.estadoId === 2
                  ? "yellow.600"
                  : "red.600"
              }
              fontWeight="bold"
            >
              {pedido.estadoId === 5
                ? "Exportado"
                : pedido.estadoId === 3
                ? "Aprobado"
                : pedido.estadoId === 2
                ? "Pendiente"
                : "Cancelado"}
            </Box>
          </Td>

          <Td>
            {format(new Date(pedido.creadoEl), "dd MMM yyyy, HH:mm", {
              locale: es,
            })}
          </Td>
          {roleId === 1 || roleId === 3 ? (
            <Td>{pedido.nombreUsuario || "N/A"}</Td>
          ) : null}
          <Td>
            <Tooltip label="Ver Detalles" hasArrow>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => onVerDetalles(pedido)}
              >
                Ver Detalles
              </Button>
            </Tooltip>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

// Validación de PropTypes
PedidosTable.propTypes = {
  pedidos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreCorrelativo: PropTypes.string.isRequired,
      nombreDeu: PropTypes.string,
      nombreTienda: PropTypes.string,
      estadoId: PropTypes.number.isRequired,
      creadoEl: PropTypes.string.isRequired,
      nombreUsuario: PropTypes.string,
    })
  ).isRequired,
  roleId: PropTypes.number.isRequired,
  onVerDetalles: PropTypes.func.isRequired,
};

export default PedidosTable;
