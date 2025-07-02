import { useState, useMemo } from "react";
import { Box, Spinner, Text, Heading } from "@chakra-ui/react";
import { useGetAllPedidosProduccionQuery } from "../../services/pedidoProductionApi";
import { FilterPanel } from "../../components/production/FilterPanel";
import { OrdersTable } from "../../components/production/OrdersTable";
import { SaveButton } from "../../components/production/SaveButton";

export const ProductionOrdersPage = () => {
  const { data = [], isLoading, error } = useGetAllPedidosProduccionQuery();
  const [itemFilter, setItemFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const countries = useMemo(
    () => Array.from(new Set(data.map((d) => d.pais))),
    [data]
  );
  const clients = useMemo(
    () => Array.from(new Set(data.map((d) => d.tienda))),
    [data]
  );

  const filtered = useMemo(() => {
    return data
      .filter(
        (d) =>
          (!itemFilter ||
            d.productoNombre
              .toLowerCase()
              .includes(itemFilter.toLowerCase())) &&
          (!countryFilter || d.pais === countryFilter) &&
          (!clientFilter || d.tienda === clientFilter) &&
          (!stateFilter ||
            (d.completo ? "Completado" : "Pendiente") === stateFilter)
      )
      .sort((a, b) =>
        a.productoNombre.localeCompare(b.productoNombre, undefined, {
          sensitivity: "base",
        })
      );
  }, [data, itemFilter, countryFilter, clientFilter, stateFilter]);

  const handleSave = () => {
    console.log("Guardar cambios...");
  };

  if (isLoading)
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );
  if (error)
    return (
      <Box textAlign="center" mt="20">
        <Text color="red.500">Error al cargar pedidos.</Text>
      </Box>
    );

  return (
    <Box p={0}>
      <Heading as="h1" size="lg" mb={4} textAlign="center">
        Mesa
      </Heading>
      <FilterPanel
        itemFilter={itemFilter}
        onItemChange={setItemFilter}
        countryFilter={countryFilter}
        onCountryChange={setCountryFilter}
        clientFilter={clientFilter}
        onClientChange={setClientFilter}
        stateFilter={stateFilter}
        onStateChange={setStateFilter}
        countries={countries}
        clients={clients}
      />

      <OrdersTable data={filtered} />

      <SaveButton onSave={handleSave} />
    </Box>
  );
};
export default ProductionOrdersPage;
