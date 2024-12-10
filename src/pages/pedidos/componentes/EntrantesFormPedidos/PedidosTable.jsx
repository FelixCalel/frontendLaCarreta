import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";

const PedidosTable = ({
  pedidosEntrantes,
  selectedPedidos,
  setSelectedPedidos,
  handleVerDetalles,
}) => {

  const handleSelectPedido = (pedidoId) => {
    if (selectedPedidos.includes(pedidoId)) {
      setSelectedPedidos(selectedPedidos.filter((id) => id !== pedidoId));
    } else {
      setSelectedPedidos([...selectedPedidos, pedidoId]);
    }
  };



  return (
    <Table variant="striped" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>Seleccionar</Th>
          <Th>ID</Th>
          <Th>Deudor</Th>
          <Th>Tienda</Th>
          <Th>Usuario</Th>
          <Th>Fecha</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {pedidosEntrantes.length > 0 ? (
          pedidosEntrantes.map((pedido) => (
            <Tr key={pedido.id}>
              <Td style={{ width: "50px" }}>
                <Checkbox
                  isChecked={selectedPedidos.includes(pedido.id)}
                  onChange={() => handleSelectPedido(pedido.id)}
                />
              </Td>

              <Td>{pedido.id}</Td>
              <Td>{pedido.nombreDeu}</Td>
              <Td>{pedido.nombreTienda}</Td>
              <Td>{pedido.nombreUsuario}</Td>
              <Td>
                {format(new Date(pedido.fechaOrden), "dd MMMM yyyy HH:mm", {
                  locale: es,
                })}
              </Td>
              <Td>
                <Tooltip label="Ver Detalles" hasArrow>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() =>
                      handleVerDetalles(pedido.id, pedido.detalles)
                    }
                  >
                    Ver Detalles
                  </Button>
                </Tooltip>
                {/* <Tooltip label="Exportar a Excel" hasArrow>
                  <IconButton
                    ml={2}
                    colorScheme="teal"
                    size="sm"
                    icon={<SiMicrosoftexcel />}
                    onClick={() => handleExportarExcel(pedido)}
                  />
                </Tooltip> */}
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan="8" align="center">
              No hay pedidos en estado 2
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

PedidosTable.propTypes = {
  pedidosEntrantes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreDeu: PropTypes.string,
      nombreTienda: PropTypes.string,
      nombreUsuario: PropTypes.string.isRequired,
      fechaOrden: PropTypes.string.isRequired,
      detalles: PropTypes.arrayOf(
        PropTypes.shape({
          codigo: PropTypes.string,
          nombreProducto: PropTypes.string.isRequired,
          cantidad: PropTypes.number.isRequired,
        })
      ),
    })
  ).isRequired,
  selectedPedidos: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedPedidos: PropTypes.func.isRequired,
  handleVerDetalles: PropTypes.func.isRequired,
};

export default PedidosTable;
