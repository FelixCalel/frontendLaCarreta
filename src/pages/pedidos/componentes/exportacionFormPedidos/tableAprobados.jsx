import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AprobadosTable = ({ pedidosAprobados, handleVerDetalles }) => {


  return (
    <Table variant="striped" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Deudor</Th>
          <Th>Tienda</Th>
          <Th>Fecha</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {pedidosAprobados.length > 0 ? (
          pedidosAprobados.map((pedido) => (
            <Tr key={pedido.id}>
              <Td>{pedido.id}</Td>
              <Td>{pedido.nombreDeu}</Td>
              <Td>{pedido.nombreTienda}</Td>
              <Td>
                {format(new Date(pedido.fechaOrden), "dd 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
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
            <Td colSpan="5" align="center">
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
      fechaOrden: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleVerDetalles: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default AprobadosTable;
