import { Box, Grid, GridItem, Spinner, Text, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useGetAllPedidosProduccionQuery } from "../../../services/pedidoProductionApi";
import { PedidoCard } from "./PedidoCard";

export const PedidosProduccionCardsPage = () => {
  const {
    data: pedidos = [],
    isLoading,
    error,
  } = useGetAllPedidosProduccionQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={20}>
        <Text color="red.500">Error al cargar pedidos de producción.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={6} textAlign="center">
        Órdenes de pedido
      </Heading>

      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {pedidos.map((pedido) => (
          <GridItem key={pedido.id}>
            <PedidoCard
              pedido={pedido}
              onClick={() => navigate(`/produccion/${pedido.id}`)}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};
