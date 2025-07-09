import { useState, useMemo } from "react";
import { Box, Heading, Center, Spinner, Text } from "@chakra-ui/react";
import { useGetAllPedidosProduccionQuery } from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { CardGrid } from "../../../components/production/PedidoCard";

const SupervisorOrdersPage = () => {
  const {
    data: pedidos = [],
    isLoading,
    error,
  } = useGetAllPedidosProduccionQuery();

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("");
  const [client, setClient] = useState("");
  const [stateF, setStateF] = useState("");

  const countries = useMemo(
    () => Array.from(new Set(pedidos.map((p) => p.pais))),
    [pedidos]
  );
  const clients = useMemo(
    () => Array.from(new Set(pedidos.map((p) => p.tienda))),
    [pedidos]
  );
  // const states = useMemo(
  //   () =>
  //     Array.from(
  //       new Set(pedidos.map((p) => (p.completo ? "Completado" : "Pendiente")))
  //     ),
  //   [pedidos]
  // );

  const filtered = useMemo(() => {
    return pedidos
      .filter(
        (d) =>
          !term || d.productoNombre.toLowerCase().includes(term.toLowerCase())
      )
      .filter((d) => !country || d.pais === country)
      .filter((d) => !client || d.tienda === client)
      .filter(
        (d) => !stateF || (d.completo ? "Completado" : "Pendiente") === stateF
      );
  }, [pedidos, term, country, client, stateF]);

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
        stateFilter={stateF}
        onStateChange={setStateF}
        countries={countries}
        clients={clients}
      />

      <CardGrid pedidos={filtered} />
    </Box>
  );
};

export default SupervisorOrdersPage;
