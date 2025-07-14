import { useState, useMemo } from "react";
import { Box, Heading, Center, Spinner, Text } from "@chakra-ui/react";
import { useGetPedidosAgrupadosQuery } from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { GroupCardGrid } from "../../../components/production/GroupCardGrid";

const SupervisorOrdersPage = () => {
  const {
    data: agrupados = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery();
  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("");
  const [client, setClient] = useState("");

  const countries = useMemo(
    () => Array.from(new Set(agrupados.map((g) => g.pais))),
    [agrupados]
  );
  const clients = useMemo(
    () => Array.from(new Set(agrupados.map((g) => g.tienda))),
    [agrupados]
  );

  const filtered = useMemo(
    () =>
      agrupados.filter((g) => {
        const tienePendientes = g.items.some((it) => it.etapaId === 1);

        const fTerm =
          !term ||
          g.pedidoId.toString().includes(term) ||
          g.tienda.toLowerCase().includes(term.toLowerCase());

        const fPais = !country || g.pais === country;
        const fCli = !client || g.tienda === client;

        return tienePendientes && fTerm && fPais && fCli;
      }),
    [agrupados, term, country, client]
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
        <Text color="red.500">Error al cargar pedidos.</Text>
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading mb={6} textAlign="center">
        Supervisor – Pedidos de Producción
      </Heading>

      <FilterPanel
        itemFilter={term}
        onItemChange={setTerm}
        countryFilter={country}
        onCountryChange={setCountry}
        clientFilter={client}
        onClientChange={setClient}
        countries={countries}
        clients={clients}
        onStateChange={() => {}}
      />

      <GroupCardGrid pedidos={filtered} />
    </Box>
  );
};

export default SupervisorOrdersPage;
