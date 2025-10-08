import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Center,
  Spinner,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useGetPedidosAgrupadosQuery } from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { OrdersTable } from "../../../components/production/OrdersTable";
import AcceptOrderButton from "../../../components/production/AcceptOrderButton";

const ProductionOrderDetailPage = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();

  const { data: agrupados = [], isLoading, error } = useGetPedidosAgrupadosQuery();

  const group = useMemo(
    () => agrupados.find((g) => g.pedidoId === Number(pedidoId)),
    [agrupados, pedidoId]
  );

  const items = useMemo(() => (group ? group.items : []), [group]);

  const countries = useMemo(
    () => [...new Set(items.map((i) => i.pais))],
    [items]
  );
  const clients = useMemo(
    () => [...new Set(items.map((i) => i.tienda))],
    [items]
  );
  const states = useMemo(
    () => [
      ...new Set(items.map((i) => (i.completo ? "Completado" : "Pendiente"))),
    ],
    [items]
  );

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={20}>
        <Text color="red.500">Error al cargar el pedido.</Text>
      </Center>
    );
  }

  if (!group) {
    return (
      <Center py={20}>
        <Text color="gray.600">Pedido no encontrado.</Text>
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Flex align="center" mb={6}>
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
        <Flex flex={1} justify="center" align="center" gap={4}>
          <Heading size="md">Detalle Pedido #{group.pedidoId}</Heading>
          <AcceptOrderButton order={group} onSuccess={() => navigate(-1)} />
        </Flex>
      </Flex>

      <FilterPanel
        countries={countries}
        clients={clients}
        states={states}
      />

      <OrdersTable data={items} />
    </Box>
  );
};

export default ProductionOrderDetailPage;