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
  const showSapInfo = roleId === 1 || roleId === 3;
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
      <Table
        variant="striped"
        colorScheme="gray"
        style={{ "--blink-color": blinkBg }}
        display={{ base: "none", md: "table" }}
      >
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Deudor</Th>
            <Th>Tienda</Th>
            <Th>Estado</Th>
            {showSapInfo && <Th>DocEntry</Th>}
            {showSapInfo && <Th>DocNum</Th>}
            <Th>Fecha realización de pedido</Th>
            {(roleId === 1 || roleId === 3) && <Th>Usuario</Th>}
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidos.map((pedido) => {
            const isHighlighted =
              highlightedPedidoId && Number(highlightedPedidoId) === pedido.id;
            return (
              <Tr
                id={`pedido-${pedido.id}`}
                key={pedido.id}
                animation={isHighlighted ? "blink 1s infinite" : undefined}
                bg={isHighlighted ? blinkBg : undefined}
                border={isHighlighted ? "2px solid teal" : undefined}
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
                      pedido.estadoId === 5 || pedido.estadoId === 6
                        ? "blue.600"
                        : pedido.estadoId === 3
                          ? "green.600"
                          : pedido.estadoId === 2
                            ? "yellow.600"
                            : pedido.estadoId === 4
                              ? "red.600"
                              : "gray.600"
                    }
                    fontWeight="bold"
                  >
                    {pedido.estadoId === 5 || pedido.estadoId === 6
                      ? "Exportado"
                      : pedido.estadoId === 4
                        ? "Cancelado"
                        : pedido.estadoId === 3
                          ? "Aprobado"
                          : pedido.estadoId === 2
                            ? "Pendiente"
                            : pedido.estadoId === 1
                              ? "Creado"
                              : "Desconocido"}
                  </Box>
                </Td>

                {showSapInfo && <Td>{pedido.docEntry ?? "—"}</Td>}
                {showSapInfo && <Td>{pedido.docNum ?? "—"}</Td>}

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

      <Box
        display={{ base: "flex", md: "none" }}
        flexDirection="column"
        gap={4}
        width="100%"
        maxW="100%"
        overflowX="hidden"
        px={1}
      >
        {pedidos.map((pedido) => {
          const isHighlighted =
            highlightedPedidoId && Number(highlightedPedidoId) === pedido.id;
          return (
            <Box
              key={pedido.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="md"
              id={`pedido-mobile-${pedido.id}`}
              animation={isHighlighted ? "blink 1s infinite" : undefined}
              onClick={isHighlighted ? onClearHighlight : undefined}
              sx={{ "--blink-color": blinkBg }}
              width="100%"
              maxW="100%"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                mb={2}
                alignItems="flex-start"
              >
                <Box fontWeight="bold" fontSize="lg">
                  ID: {pedido.id}
                </Box>
                <Box
                  fontWeight="bold"
                  color={
                    pedido.estadoId === 5 || pedido.estadoId === 6
                      ? "blue.600"
                      : pedido.estadoId === 3
                        ? "green.600"
                        : pedido.estadoId === 2
                          ? "yellow.600"
                          : pedido.estadoId === 4
                            ? "red.600"
                            : "gray.600"
                  }
                >
                  {pedido.estadoId === 5 || pedido.estadoId === 6
                    ? "Exportado"
                    : pedido.estadoId === 4
                      ? "Cancelado"
                      : pedido.estadoId === 3
                        ? "Aprobado"
                        : pedido.estadoId === 2
                          ? "Pendiente"
                          : pedido.estadoId === 1
                            ? "Creado"
                            : "Desconocido"}
                </Box>
              </Box>

              <Box mb={2}>
                <strong>Deudor:</strong> {pedido.nombreCorrelativo} -{" "}
                {pedido.nombreDeu || "N/A"}
              </Box>
              <Box mb={2}>
                <strong>Tienda:</strong> {pedido.nombreTienda || "N/A"}
              </Box>
              {showSapInfo && (
                <>
                  <Box mb={2}>
                    <strong>DocEntry:</strong> {pedido.docEntry ?? "—"}
                  </Box>
                  <Box mb={2}>
                    <strong>DocNum:</strong> {pedido.docNum ?? "—"}
                  </Box>
                </>
              )}
              <Box mb={2}>
                <strong>Fecha:</strong>{" "}
                {format(new Date(pedido.creadoEl), "dd MMM yyyy, HH:mm", {
                  locale: es,
                })}
              </Box>
              {(roleId === 1 || roleId === 3) && (
                <Box mb={4}>
                  <strong>Usuario:</strong> {pedido.nombreUsuario || "N/A"}
                </Box>
              )}

              <Button
                colorScheme="green"
                width="100%"
                mt={2}
                onClick={(e) => {
                  e.stopPropagation();
                  onVerDetalles(pedido);
                }}
              >
                Ver Detalles
              </Button>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

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
      docNum: PropTypes.number,
      docEntry: PropTypes.number,
    }),
  ).isRequired,
  roleId: PropTypes.number.isRequired,
  onVerDetalles: PropTypes.func.isRequired,
  highlightedPedidoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClearHighlight: PropTypes.func,
};

export default PedidosTable;
