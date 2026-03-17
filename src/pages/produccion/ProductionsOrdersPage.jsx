import {
  Box,
  Spinner,
  Text,
  Heading,
  SimpleGrid,
  Flex,
  Button,
  useColorModeValue,
  ButtonGroup,
  Tooltip,
  HStack,
} from "@chakra-ui/react";
import { ViewIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { FilterPanel } from "../../components/production/FilterPanel";
import { OrdersTable } from "../../components/production/OrdersTable";
import { ConsolidatedOrdersView } from "../../components/production/ConsolidatedOrdersView";
import AdvanceOrderButton from "../../components/production/AdvanceOrderButton";
import { UnassignedProductsModal } from "../../components/production/UnassignedProductsModal";
import { EmptyState } from "../../components/production/components/EmptyState";
import { ProductionOrderCard } from "../../components/production/components/ProductionOrderCard";


import { useProductionOrders } from "./hooks/useProductionOrders";

const ProductionOrdersPage = () => {
  const {
    navigate, pedidoId,
    countryFilter, setCountryFilter,
    clientFilter, setClientFilter,
    stateFilter, setStateFilter,
    deuFilter, setDeuFilter,
    viewMode, setViewMode,
    isOpen, onOpen, onClose,
    isLoading, error, syncReady,
    unassignedCount,
    filters, filteredGroups, consolidatedItems
  } = useProductionOrders();

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const cardHoverShadow = useColorModeValue("lg", "dark-lg");

  if (isLoading || !syncReady) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="red.500">Error al cargar pedidos.</Text>
      </Box>
    );
  }

  if (!pedidoId) {
    return (
      <Box p={0} m={0}>
        <Heading size="lg" mb={4} textAlign="center">
          {viewMode === "byOrder" ? "Mesa" : "Pedidos Consolidados"}
        </Heading>
        <Flex
          direction={{ base: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "center", lg: "baseline" }}
          mb={4}
          gap={4}
        >
          <ButtonGroup isAttached variant="outline">
            <Tooltip label="Ver pedidos individuales" placement="top">
              <Button
                onClick={() => setViewMode("byOrder")}
                isActive={viewMode === "byOrder"}
                leftIcon={<ViewIcon />}
                aria-label="Ver por pedido"
              >
                Por Pedido
              </Button>
            </Tooltip>
            <Tooltip
              label="Ver resumen de productos consolidados"
              placement="top"
            >
              <Button
                onClick={() => setViewMode("consolidated")}
                isActive={viewMode === "consolidated"}
                leftIcon={<HamburgerIcon />}
                aria-label="Ver consolidado"
              >
                Consolidado
              </Button>
            </Tooltip>
          </ButtonGroup>

          {unassignedCount > 0 && (
            <Tooltip
              label="Ver productos que no tienen área asignada"
              placement="top"
            >
              <Button colorScheme="orange" variant="solid" onClick={onOpen} size="sm">
                ⚠️ {unassignedCount} Sin Asignar
              </Button>
            </Tooltip>
          )}

          <HStack w={{ base: "full", lg: "auto" }}>
            <FilterPanel
              countryFilter={countryFilter}
              onCountryChange={setCountryFilter}
              clientFilter={clientFilter}
              onClientChange={setClientFilter}
              stateFilter={stateFilter}
              onStateChange={setStateFilter}
              countries={filters.countries}
              clients={filters.clients}
              deuFilter={deuFilter}
              onDeuChange={setDeuFilter}
              deudores={filters.deudores}
            />
          </HStack>
        </Flex>
        {viewMode === "byOrder" ? (
          filteredGroups.length > 0 ? (
            <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={6} mt={6}>
              {filteredGroups.map((g) => (
                <ProductionOrderCard
                  key={g.pedidoId}
                  group={g}
                  cardBg={cardBg}
                  cardBorder={cardBorder}
                  cardHoverShadow={cardHoverShadow}
                />
              ))}
            </SimpleGrid>
          ) : (
            <EmptyState
              cardBg={cardBg}
              cardBorder={cardBorder}
              heading="Sin resultados"
              message="No hay pedidos pendientes o no están asignados a tu área en este momento."
            />
          )
        ) : consolidatedItems.length > 0 ? (
          <ConsolidatedOrdersView
            data={consolidatedItems}
            actionLabel="Pasar a Supervisor"
          />
        ) : (
          <EmptyState
            cardBg={cardBg}
            cardBorder={cardBorder}
            heading="Sin resultados"
            message="No hay productos consolidados pendientes o asignados a tu área en este momento."
          />
        )}
        <UnassignedProductsModal isOpen={isOpen} onClose={onClose} />
      </Box>
    );
  }

  const selectedGroup = filteredGroups.find(
    (g) => g.pedidoId === Number(pedidoId),
  );
  if (!selectedGroup) {
    navigate("/mesa/produccion");
    return null;
  }
  return (
    <Box p={6}>
      <Flex mb={4} align="center" justify="space-between">
        <Button onClick={() => navigate("/mesa/produccion")}>← Volver</Button>
        <Heading size="md">
          Pedido #{selectedGroup.pedidoId} – {selectedGroup.tienda}
        </Heading>
        <Box>
          <AdvanceOrderButton
            order={selectedGroup}
            onSuccess={() => navigate("/mesa/produccion")}
            label="Pasar a Supervisor"
          />
        </Box>
      </Flex>
      <OrdersTable data={selectedGroup.items} />
    </Box>
  );
};


export default ProductionOrdersPage;
