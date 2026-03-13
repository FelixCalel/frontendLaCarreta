import { useState, useMemo } from "react";
import {
  Box,
  Center,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFileExport } from "react-icons/fa";
import { useGetPedidosAgrupadosQuery } from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { GroupCardGrid } from "../../../components/production/digitador/DigitadorCardGrid";

const DigitadorOrdersPage = () => {
  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery(undefined, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("");
  const [client, setClient] = useState("");
  const panelBg = useColorModeValue("white", "gray.800");

  const historyGroups = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          items: (g.items || []).filter(
            (it) =>
              Number(it?.etapaId) === 4 ||
              Boolean(it?.docNum) ||
              Boolean(it?.docEntry),
          ),
        }))
        .filter((g) => g.items.length > 0),
    [groups],
  );

  const countries = useMemo(
    () => [...new Set(historyGroups.map((g) => g.pais).filter(Boolean))],
    [historyGroups],
  );
  const clients = useMemo(
    () => [...new Set(historyGroups.map((g) => g.tienda).filter(Boolean))],
    [historyGroups],
  );

  const filtered = useMemo(
    () =>
      historyGroups.filter((g) => {
        const byText =
          !term ||
          g.pedidoId.toString().includes(term) ||
          g.tienda.toLowerCase().includes(term.toLowerCase());
        const byCountry = !country || g.pais === country;
        const byClient = !client || g.tienda === client;
        return byText && byCountry && byClient;
      }),
    [historyGroups, term, country, client],
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
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        color="blue.600"
      >
        Historial de Exportaciones SAP
      </Text>

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

      <Box bg={panelBg} borderRadius="md" p={2}>
        <GroupCardGrid
          groups={filtered}
          IconComponent={FaFileExport}
          forceHistory
        />
      </Box>
    </Box>
  );
};

export default DigitadorOrdersPage;
