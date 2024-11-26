import PropTypes from "prop-types"; // Importa PropTypes
import {
  VStack,
  Box,
  Stack,
  Text,
  Badge,
  HStack,
  Tooltip,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import ProductosTable from "../detallesPedidosTable";

const PedidosTable = ({
  pedidosUsuario,
  isMobile,
  isDetailsOpen,
  handleToggleDetails,
  handleDeletePedido,
  showRealizarPedidoConfirmation,
  deudorId,
  tiendaId,

}) => {
  return pedidosUsuario.length > 0 ? (
    isMobile ? (
      <VStack spacing={4} align="stretch">
        {pedidosUsuario.map((pedido) => (
          <Box
            key={pedido.id}
            p={3}
            borderWidth="1px"
            borderColor="gray.200"
            rounded="md"
            bg="white"
            _hover={{
              boxShadow: "md",
              transition: "0.2s",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Text fontWeight="bold">Pedido ID: {pedido.id}</Text>
              <Badge colorScheme={pedido.estadoId === 1 ? "green" : "gray"}>
                {pedido.estadoId === 1 ? "Creado" : "Realizado"}
              </Badge>
            </Stack>
            <Text>
              <strong>Ciudad:</strong> {pedido.nombreCiudad || "N/A"}
            </Text>
            <Text>
              <strong>Deudor:</strong> {pedido.nombreCorrelativo} -{" "}
              {pedido.nombreDeu || "N/A"}
            </Text>
            <Text>
              <strong>Tienda:</strong> {pedido.nombreTienda || "N/A"}
            </Text>
            <HStack spacing={3} mt={2}>
              <Tooltip label="Ver Detalles" hasArrow>
                <IconButton
                  icon={
                    isDetailsOpen === pedido.id ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )
                  }
                  onClick={() => handleToggleDetails(pedido.id)}
                  colorScheme="blue"
                  size="sm"
                />
              </Tooltip>
              <Tooltip label="Eliminar Pedido" hasArrow>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleDeletePedido(pedido.id)}
                  size="sm"
                />
              </Tooltip>
              <Button
                colorScheme="teal"
                onClick={() => showRealizarPedidoConfirmation(pedido.id)}
                isDisabled={pedido.estadoId === 2}
                size="sm"
              >
                Realizar Pedido
              </Button>
            </HStack>
            {isDetailsOpen === pedido.id && (
              <Box mt={2}>
                <ProductosTable pedidoId={pedido.id} deudorId={deudorId} tiendaId={tiendaId}/>
              </Box>
            )}
          </Box>
        ))}
      </VStack>
    ) : (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Ciudad</Th>
            <Th>Deudor</Th>
            <Th>Tienda</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidosUsuario.map((pedido) => (
            <>
              <Tr key={pedido.id}>
                <Td>{pedido.id}</Td>
                <Td>{pedido.nombreCiudad || "N/A"}</Td>
                <Td>
                  {pedido.nombreCorrelativo} - {pedido.nombreDeu || "N/A"}
                </Td>
                <Td>{pedido.nombreTienda || "N/A"}</Td>
                <Td>
                  <HStack spacing={3}>
                    <Tooltip label="Ver Detalles" hasArrow>
                      <IconButton
                        icon={
                          isDetailsOpen === pedido.id ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )
                        }
                        onClick={() => handleToggleDetails(pedido.id)}
                        colorScheme="blue"
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar Pedido" hasArrow>
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleDeletePedido(pedido.id)}
                        size="sm"
                      />
                    </Tooltip>
                    <Button
                      colorScheme="teal"
                      onClick={() => showRealizarPedidoConfirmation(pedido.id)}
                      isDisabled={pedido.estadoId === 2}
                      size="sm"
                    >
                      Realizar Pedido
                    </Button>
                  </HStack>
                </Td>
              </Tr>
              {isDetailsOpen === pedido.id && (
                <Tr key={`detalle-${pedido.id}`}>
                  <Td colSpan={5}>
                    <ProductosTable
                      pedidoId={pedido.id}
                      deudorId={deudorId}
                      tiendaId={tiendaId}
                    />
                  </Td>
                </Tr>
              )}
            </>
          ))}
        </Tbody>
      </Table>
    )
  ) : (
    <Text>No hay pedidos disponibles</Text>
  );
};

// Validación de las props con PropTypes
PedidosTable.propTypes = {
  pedidosUsuario: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreCiudad: PropTypes.string,
      nombreCorrelativo: PropTypes.string.isRequired,
      nombreDeu: PropTypes.string,
      nombreTienda: PropTypes.string,
      estadoId: PropTypes.number.isRequired,
    })
  ).isRequired,
  isMobile: PropTypes.bool.isRequired,
  isDetailsOpen: PropTypes.number,
  handleToggleDetails: PropTypes.func.isRequired,
  handleDeletePedido: PropTypes.func.isRequired,
  showRealizarPedidoConfirmation: PropTypes.func.isRequired,
  cargarDetalles: PropTypes.func,
  usuarioId: PropTypes.number.isRequired,
  deudorId: PropTypes.number.isRequired,
  tiendaId: PropTypes.number.isRequired,
};

export default PedidosTable;
