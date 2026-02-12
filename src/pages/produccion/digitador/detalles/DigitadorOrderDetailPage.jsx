import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useGetPedidosAgrupadosQuery } from "../../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../../components/production/FilterPanel";
import { DigitadorItemsTable } from "../../../../components/production/digitador/DigitadorItemsTable";

const DigitadorOrderDetailPage = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();

  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery({
    etapaId: 3,
  });
  const group = useMemo(
    () => groups.find((g) => g.pedidoId === Number(pedidoId)),
    [groups, pedidoId],
  );

  const [term, setTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const items = useMemo(() => (group ? group.items : []), [group]);

  const filtered = useMemo(
    () =>
      items
        .filter((it) => {
          const byText =
            !term ||
            it.productoNombre.toLowerCase().includes(term.toLowerCase()) ||
            it.itemCode.includes(term);
          const byState =
            !stateFilter ||
            (it.completo ? "Completado" : "Pendiente") === stateFilter;
          return byText && byState;
        })
        .sort((a, b) =>
          a.productoNombre.localeCompare(b.productoNombre, undefined, {
            sensitivity: "base",
          }),
        ),
    [items, term, stateFilter],
  );

  if (isLoading)
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  if (error)
    return (
      <Center py={20}>
        <Text color="red.500">Error al cargar pedido.</Text>
      </Center>
    );
  if (!group)
    return (
      <Center py={20}>
        <Text>Pedido no encontrado.</Text>
      </Center>
    );

  return (
    <Box p={4}>
      <Flex mb={6} justify="space-between" align="center">
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
        <Heading size="md">Pedido #{group.pedidoId}</Heading>
        <Box />
      </Flex>

      <FilterPanel
        itemFilter={term}
        onItemChange={setTerm}
        stateFilter={stateFilter}
        onStateChange={setStateFilter}
        countryFilter=""
        onCountryChange={() => {}}
        clientFilter=""
        onClientChange={() => {}}
        countries={[]}
        clients={[]}
      />

      <DigitadorItemsTable items={filtered} />
    </Box>
  );
};

export default DigitadorOrderDetailPage;
