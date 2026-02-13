import { useState } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Badge,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { useGetPedidosAgrupadosQuery } from "../../services/pedidoProductionApi";
import { OrdersTable } from "../../components/production/OrdersTable";
import AcceptOrderButton from "./AcceptOrderButton";

export const MesaPage = () => {
  const { data: agrupados = [], isLoading } = useGetPedidosAgrupadosQuery();
  const [selectedPedido, setSelectedPedido] = useState(null);

  const bgCard = useColorModeValue("white", "gray.700");
  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} textAlign="center">
        Mesa
      </Heading>

      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} mb={8}>
        {agrupados.map(({ pedidoId, tienda, pais, items }) => (
          <Box
            key={pedidoId}
            p={4}
            bg={bgCard}
            borderRadius="md"
            shadow="md"
            cursor="pointer"
            onClick={() => setSelectedPedido(pedidoId)}
          >
            <Text fontSize="lg" fontWeight="bold">
              Pedido #{pedidoId}
            </Text>
            <Text>{tienda}</Text>
            <Text color="gray.500">{pais}</Text>
            <Badge mt={2} colorScheme="green">
              {items.length} ÍTEMS
            </Badge>
          </Box>
        ))}
      </SimpleGrid>

      {selectedPedido && (
        <Box>
          <Box mb={4} display="flex" justifyContent="flex-end">
            <AcceptOrderButton
              order={agrupados.find((g) => g.pedidoId === selectedPedido)}
              onSuccess={() => setSelectedPedido(null)}
            />
          </Box>
          <OrdersTable
            data={
              agrupados.find((g) => g.pedidoId === selectedPedido)?.items ?? []
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default MesaPage;
