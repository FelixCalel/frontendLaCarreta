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
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PedidosTable = ({
  pedidos,
  roleId,
  onVerDetalles,
  highlightedPedidoId = null,
  onClearHighlight = () => {},
}) => {
  const isSeller = roleId === 3;
  const blinkBg = useColorModeValue("orange.100", "orange.700");

  return (
    <>
      <style>
        {`
          @keyframes blink {
            0% { background-color: transparent; }
            50% { background-color: var(--blink-color); }
            100% { background-color: transparent; }
          }
        `}
      </style>
      <Table variant="striped" colorScheme="gray" sx={{ "--blink-color": blinkBg }}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Deudor</Th>
            <Th>Tienda</Th>
            <Th>Estado</Th>
            {isSeller && <Th>DocEntry</Th>}
            {isSeller && <Th>DocNum</Th>}
            <Th>Fecha realización de pedido</Th>
            {(roleId === 1 || roleId === 3) && <Th>Usuario</Th>}
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidos.map((pedido) => {
            const isHighlighted = highlightedPedidoId && Number(highlightedPedidoId) === pedido.id;
            return (
              <Tr 
                key={pedido.id}
                animation={isHighlighted ? "blink 1s infinite" : undefined}
                onClick={isHighlighted ? onClearHighlight : undefined}
                cursor={isHighlighted ? "pointer" : "default"}
              >
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

                {isSeller && <Td>{pedido.docEntry ?? "—"}</Td>}
                {isSeller && <Td>{pedido.docNum ?? "—"}</Td>}

                <Td>
                  {format(new Date(pedido.creadoEl), "dd MMM yyyy, HH:mm", {
                    locale: es,
                  })}
                </Td>

                {(roleId === 1 || roleId === 3) && (
                  <Td>{pedido.nombreUsuario || "N/A"}</Td>
                )}

                <Td>
                  <Tooltip label="Ver Detalles" hasArrow>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVerDetalles(pedido);
                      }}
                    >
                      Ver Detalles
                    </Button>
                  </Tooltip>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};

// PropTypes
PedidosTable.propTypes = {
  pedidos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreCorrelativo: PropTypes.string.isRequired,
      nombreDeu: PropTypes.string,
      nombreTienda: PropTypes.string,
      estadoId: PropTypes.number.isRequired,
      creadoEl: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      nombreUsuario: PropTypes.string,
      // NUEVO (opcionales):
      docNum: PropTypes.number,
      docEntry: PropTypes.number,
    })
  ).isRequired,
  roleId: PropTypes.number.isRequired,
  onVerDetalles: PropTypes.func.isRequired,
  highlightedPedidoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClearHighlight: PropTypes.func,
};

export default PedidosTable;
