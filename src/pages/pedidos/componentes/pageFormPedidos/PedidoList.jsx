import { useState } from "react"; // Importa useState
import {
  VStack,
  Box,
  Stack,
  Text,
  Badge,
  HStack,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import PedidoActions from "./actions";
import PropTypes from "prop-types"; // Importa PropTypes

const PedidoList = ({
  pedidos,
  usuarioId,
  onDialogOpen,
  setSelectedPedidoId,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(null);

  const handleToggleDetails = (pedidoId) => {
    setIsDetailsOpen(isDetailsOpen === pedidoId ? null : pedidoId);
  };

  return (
    <VStack spacing={4} align="stretch">
      {pedidos
        .filter((pedido) => pedido.usuarioId === usuarioId)
        .map((pedido) => (
          <Box
            key={pedido.id}
            p={3}
            borderWidth="1px"
            borderColor="gray.200"
            rounded="md"
            bg="white"
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
              <PedidoActions
                pedido={pedido}
                onDialogOpen={onDialogOpen}
                setSelectedPedidoId={setSelectedPedidoId}
              />
            </HStack>
          </Box>
        ))}
    </VStack>
  );
};

// Agrega propTypes para validar las props
PedidoList.propTypes = {
  pedidos: PropTypes.array.isRequired,
  usuarioId: PropTypes.number.isRequired,
  onDialogOpen: PropTypes.func.isRequired,
  setSelectedPedidoId: PropTypes.func.isRequired,
};

export default PedidoList;
