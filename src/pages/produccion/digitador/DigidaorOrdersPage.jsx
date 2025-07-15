import { useState, useMemo } from "react";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import { useGetPedidosAgrupadosQuery } from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { GroupCardGrid } from "../../../components/production/digitador/DigitadorCardGrid";

const DigitadorOrdersPage = () => {
  const { data: groups = [], isLoading, error } = useGetPedidosAgrupadosQuery();

  const base = useMemo(
    () => groups.filter((g) => g.items.some((it) => it.etapaId === 2)),
    [groups]
  );

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("");
  const [client, setClient] = useState("");

  const countries = useMemo(
    () => [...new Set(base.map((g) => g.pais).filter(Boolean))],
    [base]
  );
  const clients = useMemo(
    () => [...new Set(base.map((g) => g.tienda).filter(Boolean))],
    [base]
  );

  const filtered = useMemo(
    () =>
      base.filter((g) => {
        const byText =
          !term ||
          g.pedidoId.toString().includes(term) ||
          g.tienda.toLowerCase().includes(term.toLowerCase());
        const byCountry = !country || g.pais === country;
        const byClient = !client || g.tienda === client;
        return byText && byCountry && byClient;
      }),
    [base, term, country, client]
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
      <FilterPanel
        itemFilter={term}
        onItemChange={setTerm}
        countryFilter={country}
        onCountryChange={setCountry}
        clientFilter={client}
        onClientChange={setClient}
        onStateChange={() => {}}
        countries={countries}
        clients={clients}
      />

      <GroupCardGrid groups={filtered} />
    </Box>
  );
};

export default DigitadorOrdersPage;
