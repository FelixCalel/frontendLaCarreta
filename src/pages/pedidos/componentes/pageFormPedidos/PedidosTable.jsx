import React from "react";
import PropTypes from "prop-types";
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
  useColorModeValue,
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
}) => {
  const boxBg = useColorModeValue("white", "gray.800");
  const boxBorderColor = useColorModeValue("gray.200", "gray.600");
  const tableBg = useColorModeValue("white", "gray.800");
  const emptyTextColor = useColorModeValue("gray.600", "gray.300");

  const pedidosTableContent = isMobile ? (
    <VStack spacing={4} align="stretch">
      {pedidosUsuario.map((pedido) => (
        <Box
          key={pedido.id}
          p={2.5}
          borderWidth="1px"
          borderColor={boxBorderColor}
          rounded="md"
          bg={boxBg}
          _hover={{
            boxShadow: "md",
            transition: "0.2s",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Text fontWeight="bold">
              Tienda: {pedido.nombreTienda || "N/A"}
            </Text>
            <Badge colorScheme={pedido.estadoId === 1 ? "green" : "gray"}>
              {pedido.estadoId === 1 ? "Creado" : "Realizado"}
            </Badge>
          </Stack>
          <Text></Text>
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
                onClick={() =>
                  handleToggleDetails(
                    pedido.id,
                    pedido.deudorId,
                    pedido.tiendaId,
                  )
                }
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
              <ProductosTable
                pedidoId={pedido.id}
                deudorId={pedido.deudorId}
                tiendaId={pedido.tiendaId}
              />
            </Box>
          )}
        </Box>
      ))}
    </VStack>
  ) : (
    <Table variant="simple" bg={tableBg}>
      <Thead bg={tableBg}>
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
          <React.Fragment key={pedido.id}>
            <Tr>
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
                      onClick={() =>
                        handleToggleDetails(
                          pedido.id,
                          pedido.deudorId,
                          pedido.tiendaId,
                        )
                      }
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
              <Tr>
                <Td colSpan={5}>
                  <ProductosTable
                    pedidoId={pedido.id}
                    deudorId={pedido.deudorId}
                    tiendaId={pedido.tiendaId}
                  />
                </Td>
              </Tr>
            )}
          </React.Fragment>
        ))}
      </Tbody>
    </Table>
  );

  return pedidosUsuario.length > 0 ? (
    pedidosTableContent
  ) : (
    <Text color={emptyTextColor}>No hay pedidos disponibles</Text>
  );
};

PedidosTable.propTypes = {
  pedidosUsuario: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreCiudad: PropTypes.string,
      nombreCorrelativo: PropTypes.string,
      nombreDeu: PropTypes.string,
      nombreTienda: PropTypes.string,
      estadoId: PropTypes.number.isRequired,
      deudorId: PropTypes.number.isRequired,
      tiendaId: PropTypes.number.isRequired,
    }),
  ).isRequired,
  isMobile: PropTypes.bool.isRequired,
  isDetailsOpen: PropTypes.number,
  handleToggleDetails: PropTypes.func.isRequired,
  handleDeletePedido: PropTypes.func.isRequired,
  showRealizarPedidoConfirmation: PropTypes.func.isRequired,
};

export default React.memo(PedidosTable);
