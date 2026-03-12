import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Spinner,
  Text,
  Heading,
  SimpleGrid,
  Flex,
  Button,
  Icon,
  useColorModeValue,
  ButtonGroup,
  Tooltip,
  VStack,
  Badge,
  Divider,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  ViewIcon,
  HamburgerIcon,
  RepeatClockIcon,
} from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPedidosAgrupadosQuery,
  useProcesarEstado5Mutation,
  useGetUnassignedOrdersQuery,
} from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { OrdersTable } from "../../../components/production/OrdersTable";
import { ConsolidatedOrdersView } from "../../../components/production/ConsolidatedOrdersView";
import BotonSincronizarReceta from "../../../components/empresa/BotonSincronizarReceta";
import { useSelector, useDispatch } from "react-redux";
import { tablaEmpresa, tablaPais } from "../../../store/Empresa/thunks";
import { selectRecetasState } from "../../../store/Empresa";
import AdvanceOrderButton from "../../../components/production/AdvanceOrderButton";
import { UnassignedProductsModal } from "../../../components/production/UnassignedProductsModal";
import { useSupervisorOrdersLogic } from "./hooks/useSupervisorOrdersLogic";

import { useSupervisorOrders } from "./hooks/useSupervisorOrders";
import { SupervisorOrderCard } from "./componentes/SupervisorOrderCard";

const SupervisorOrdersPage = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const {
    countryFilter, setCountryFilter,
    clientFilter, setClientFilter,
    stateFilter, setStateFilter,
    viewMode, setViewMode,
    isOpen, onOpen, onClose,
    unassignedCount,
    empresaParaMostrar,
    filteredGroups, consolidatedItems, countries, clients,
    isLoading,
    error,
    selectedGroup
  } = useSupervisorOrders(pedidoId);

  // Call hooks at the top level to avoid conditional calling errors
  useColorModeValue("white", "gray.700"); 

  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="red.500">Error al cargar pedidos del supervisor.</Text>
      </Box>
    );
  }

  if (!pedidoId) {
    return (
      <Box p={2}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="lg" flex="1" textAlign="center">
            {viewMode === "byOrder" ? "Pedidos de Supervisor" : "Consolidado de Supervisor"}
          </Heading>
        </Flex>
        <Flex direction={{ base: "column", lg: "row" }} justifyContent={{ lg: "space-between" }} alignItems="center" gap={0}>
          <Flex alignItems="center" gap={4} w={{ base: "100%", lg: "auto" }} justifyContent={{ base: "space-between", lg: "flex-start" }}>
            <ButtonGroup isAttached variant="outline">
              <Tooltip label="Ver pedidos individuales" placement="top">
                <Button onClick={() => setViewMode("byOrder")} isActive={viewMode === "byOrder"} leftIcon={<ViewIcon />} aria-label="Ver por pedido">
                  Pedido
                </Button>
              </Tooltip>
              <Tooltip label="Ver resumen de productos consolidados" placement="top">
                <Button onClick={() => setViewMode("consolidated")} isActive={viewMode === "consolidated"} leftIcon={<HamburgerIcon />} aria-label="Ver consolidado">
                  Consolidado
                </Button>
              </Tooltip>
            </ButtonGroup>

            {unassignedCount > 0 && (
              <Tooltip label="Ver productos que no tienen área asignada" placement="top">
                <Button colorScheme="orange" variant="solid" onClick={onOpen} size="sm">
                  ⚠️ {unassignedCount} Sin Asignar
                </Button>
              </Tooltip>
            )}

            <Flex alignItems="center" gap={2}>
              <BotonSincronizarReceta
                empresa={empresaParaMostrar}
                ultimaSincronizacionRecetas={empresaParaMostrar?.ultimaSincronizacionRecetas}
                leftIcon={<RepeatClockIcon />}
              />
              {empresaParaMostrar?.ultimaSincronizacionRecetas && (
                <Text fontSize="xs" color="gray.500" whiteSpace="nowrap" display={{ base: "none", xl: "block" }}>
                  Últ. sinc.: {new Date(empresaParaMostrar.ultimaSincronizacionRecetas).toLocaleString()}
                </Text>
              )}
            </Flex>
          </Flex>

          <Box w={{ base: "100%", lg: "auto" }}>
            <FilterPanel
              countryFilter={countryFilter}
              onCountryChange={setCountryFilter}
              clientFilter={clientFilter}
              onClientChange={setClientFilter}
              stateFilter={stateFilter}
              onStateChange={setStateFilter}
              countries={countries}
              clients={clients}
            />
          </Box>
        </Flex>

        {viewMode === "byOrder" ? (
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} mt={6}>
            {filteredGroups.map((g) => (
              <SupervisorOrderCard 
                key={g.pedidoId} 
                g={g} 
                onClick={() => navigate(`/produccion/orden/${g.pedidoId}`)} 
              />
            ))}
          </SimpleGrid>
        ) : (
          <ConsolidatedOrdersView data={consolidatedItems} actionLabel="Pasar a Digitador" />
        )}
        <UnassignedProductsModal isOpen={isOpen} onClose={onClose} />
      </Box>
    );
  }

  if (!selectedGroup) {
    navigate("/produccion/orden");
    return null;
  }

  return (
    <Box p={6}>
      <Flex mb={4} align="center" justify="space-between">
        <Button onClick={() => navigate("/produccion/orden")}>← Volver</Button>
        <Box flex="1" display="flex" justifyContent="center">
          <Heading size="md">
            Pedido #{selectedGroup.pedidoId} – {selectedGroup.tienda}
          </Heading>
        </Box>
        <Box>
          <AdvanceOrderButton
            order={selectedGroup}
            onSuccess={() => navigate("/produccion/orden")}
            label="Pasar a Digitador"
          />
        </Box>
      </Flex>
      <OrdersTable data={selectedGroup.items} />
    </Box>
  );
};

export default SupervisorOrdersPage;
