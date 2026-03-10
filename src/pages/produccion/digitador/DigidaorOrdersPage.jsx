import { useState, useMemo } from "react";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import { FaFileExport } from "react-icons/fa";
import { useGetPedidosAgrupadosQuery } from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { GroupCardGrid } from "../../../components/production/digitador/DigitadorCardGrid";

const DigitadorOrdersPage = () => {
  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery({
    etapaId: 5,
  });

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("");
  const [client, setClient] = useState("");

  const countries = useMemo(
    () => [...new Set(groups.map((g) => g.pais).filter(Boolean))],
    [groups],
  );
  const clients = useMemo(
    () => [...new Set(groups.map((g) => g.tienda).filter(Boolean))],
    [groups],
  );

  const filtered = useMemo(
    () =>
      groups.filter((g) => {
        const byText =
          !term ||
          g.pedidoId.toString().includes(term) ||
          g.tienda.toLowerCase().includes(term.toLowerCase());
        const byCountry = !country || g.pais === country;
        const byClient = !client || g.tienda === client;
        return byText && byCountry && byClient;
      }),
    [groups, term, country, client],
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
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="blue.600">
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

      <GroupCardGrid 
        groups={filtered} 
        IconComponent={FaFileExport}
      />
    </Box>
  );
};

export default DigitadorOrdersPage;
