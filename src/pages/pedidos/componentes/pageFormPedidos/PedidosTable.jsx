// PedidosTable.jsx

import React from 'react';
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
}) => {
  const pedidosTableContent = isMobile ? ( 
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
                onClick={() => handleToggleDetails(pedido.id, pedido.deudorId, pedido.tiendaId)}
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
                      icon={isDetailsOpen === pedido.id ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                      onClick={() => handleToggleDetails(pedido.id, pedido.deudorId, pedido.tiendaId)}
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

  return pedidosUsuario.length > 0 ? pedidosTableContent : <Text>No hay pedidos disponibles</Text>;
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
      deudorId: PropTypes.number.isRequired, // Asegurado que está presente
      tiendaId: PropTypes.number.isRequired,
    })
  ).isRequired,
  isMobile: PropTypes.bool.isRequired,
  isDetailsOpen: PropTypes.number,  // Asegúrate de que sea un número o undefined
  handleToggleDetails: PropTypes.func.isRequired,
  handleDeletePedido: PropTypes.func.isRequired,
  showRealizarPedidoConfirmation: PropTypes.func.isRequired,
};

export default PedidosTable;
