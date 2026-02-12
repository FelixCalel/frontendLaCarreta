import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tooltip,
  Checkbox,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AprobadosTable = ({
  pedidosAprobados,
  handleVerDetalles,
  selectedPedidosToRevert = [],
  onTogglePedidoSelection,
  onSelectAllPedidos,
}) => {
  const isAllSelected =
    pedidosAprobados.length > 0 &&
    selectedPedidosToRevert.length === pedidosAprobados.length;
  const isIndeterminate =
    selectedPedidosToRevert.length > 0 &&
    selectedPedidosToRevert.length < pedidosAprobados.length;

  return (
    <Table variant="striped" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>
            <Checkbox
              isChecked={isAllSelected}
              isIndeterminate={isIndeterminate}
              onChange={(e) =>
                onSelectAllPedidos && onSelectAllPedidos(e.target.checked)
              }
            >
              Regresar
            </Checkbox>
          </Th>
          <Th>ID</Th>
          <Th>Deudor</Th>
          <Th>Tienda</Th>
          <Th>Fecha orden</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {pedidosAprobados.length > 0 ? (
          pedidosAprobados.map((pedido) => (
            <Tr key={pedido.id}>
              <Td>
                <Checkbox
                  isChecked={selectedPedidosToRevert.includes(pedido.id)}
                  onChange={() =>
                    onTogglePedidoSelection &&
                    onTogglePedidoSelection(pedido.id)
                  }
                />
              </Td>
              <Td>{pedido.id}</Td>
              <Td>{pedido.nombreDeu}</Td>
              <Td>{pedido.nombreTienda}</Td>
              <Td>
                {(() => {
                  const fechaStr = pedido.fechaOrdenDisplay || pedido.fechaOrden;
                  if (!fechaStr) return "Sin fecha";
                  const [yyyy, mm, dd] = fechaStr.slice(0, 10).split("-");
                  return format(new Date(yyyy, mm - 1, dd), "dd 'de' MMMM 'de' yyyy", { locale: es });
                })()}
              </Td>
              <Td>
                <Tooltip label="Ver Detalles" hasArrow>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleVerDetalles(pedido.id)}
                  >
                    Ver Detalles
                  </Button>
                </Tooltip>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan="6" align="center">
              No hay pedidos aprobados.
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

AprobadosTable.propTypes = {
  pedidosAprobados: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreDeu: PropTypes.string.isRequired,
      nombreTienda: PropTypes.string.isRequired,
      creadoEl: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleVerDetalles: PropTypes.func.isRequired,
  selectedPedidosToRevert: PropTypes.arrayOf(PropTypes.number),
  onTogglePedidoSelection: PropTypes.func,
  onSelectAllPedidos: PropTypes.func,
};

export default AprobadosTable;
