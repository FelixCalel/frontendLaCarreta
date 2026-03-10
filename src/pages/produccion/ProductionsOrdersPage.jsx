import { useState, useMemo, useEffect, useTransition } from "react";
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
} from "@chakra-ui/react";
import { CheckCircleIcon, ViewIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPedidosAgrupadosQuery,
  useProcesarEstado5Mutation,
} from "../../services/pedidoProductionApi";
import { FilterPanel } from "../../components/production/FilterPanel";
import { OrdersTable } from "../../components/production/OrdersTable";
import { ConsolidatedOrdersView } from "../../components/production/ConsolidatedOrdersView";
import AdvanceOrderButton from "../../components/production/AdvanceOrderButton";
import { UnassignedProductsModal } from "../../components/production/UnassignedProductsModal";
import EmptyState from "../../components/production/components/EmptyState";
import ProductionOrderCard from "../../components/production/components/ProductionOrderCard";
import { useGetUnassignedOrdersQuery } from "../../services/pedidoProductionApi";
import { useDisclosure } from "@chakra-ui/react";

const ProductionOrdersPage = () => {
  const navigate = useNavigate();
  const { pedidoId } = useParams();
  const [countryFilter, setCountryFilter] = useState("");
  const [itemFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [syncReady, setSyncReady] = useState(false);
  const [procesarEstado5] = useProcesarEstado5Mutation();
  const [viewMode, setViewMode] = useState("byOrder");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: unassignedData = [] } = useGetUnassignedOrdersQuery(undefined, {
    skip: !syncReady,
  });
  const unassignedCount = unassignedData.reduce(
    (acc, g) => acc + g.items.length,
    0,
  );

  useEffect(() => {
    const runProcess = async () => {
      try {
        const result = await procesarEstado5(undefined).unwrap();
        if (result && result.procesados === 0) {
          console.log("No hay pedidos en estado 5 para procesar.");
        }
      } catch (error) {
        console.error("Error al intentar procesar el estado 5:", error);
      } finally {
        setSyncReady(true);
      }
    };

    runProcess();
  }, [procesarEstado5]);

  const {
    data: agrupados = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery({ etapaId: 1 }, { skip: !syncReady });

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const cardHoverShadow = useColorModeValue("lg", "dark-lg");

  const mesaGroups = useMemo(
    () =>
      agrupados
        .map((g) => ({
          pedidoId: g.pedidoId,
          tienda: g.tienda,
          pais: g.pais,
          deudorCodigo: g.deudorCodigo,
          deudorNombre: g.deudorNombre,
          items: g.items.map((item) => ({
            ...item,
            pedidoId: g.pedidoId,
            tienda: g.tienda,
            deudorCodigo: g.deudorCodigo,
            deudorNombre: g.deudorNombre,
            cantidadUnidad: Number(item.cantidadUnidad) || 0,
          })),
        }))
        .filter((g) => g.items.length > 0),
    [agrupados],
  );

  const allItems = useMemo(
    () => mesaGroups.flatMap((g) => g.items),
    [mesaGroups],
  );
  const [deuFilter, setDeuFilter] = useState("");

  // Use transition to make filter updates non-blocking
  const [isPending, startTransition] = useTransition();

  // Wrapped setters that use startTransition
  const handleCountryFilterChange = (value) => {
    startTransition(() => {
      setCountryFilter(value);
    });
  };

  const handleClientFilterChange = (value) => {
    startTransition(() => {
      setClientFilter(value);
    });
  };

  const handleStateFilterChange = (value) => {
    startTransition(() => {
      setStateFilter(value);
    });
  };

  const handleDeuFilterChange = (value) => {
    startTransition(() => {
      setDeuFilter(value);
    });
  };

  const countries = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.pais))),
    [allItems],
  );
  const clients = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.tienda))),
    [allItems],
  );

  const deudores = useMemo(
    () =>
      Array.from(new Set(allItems.map((i) => i.deudorCodigo)))
        .filter(Boolean)
        .sort(),
    [allItems],
  );

  const filteredGroups = useMemo(() => {
    return mesaGroups
      .filter((g) => {
        if (!deuFilter) return true;
        return g.items.some((i) => i.deudorCodigo === deuFilter);
      })
      .map((g) => {
        const filteredItems = g.items
          .filter((i) => {
            if (deuFilter && i.deudorCodigo !== deuFilter) return false;
            if (!itemFilter) return true;
            return i.productoNombre
              .toLowerCase()
              .includes(itemFilter.toLowerCase());
          })
          .slice()
          .sort((a, b) =>
            a.productoNombre.localeCompare(b.productoNombre, undefined, {
              sensitivity: "base",
            }),
          );

        return {
          ...g,
          items: filteredItems,
        };
      })
      .filter((g) => g.items.length > 0)
      .filter((g) => {
        if (countryFilter && g.pais !== countryFilter) return false;
        if (clientFilter && g.tienda !== clientFilter) return false;

        if (stateFilter) {
          const total = g.items.length;
          const doneCount = g.items.filter((i) => i.completo).length;
          const anyProgress = g.items.some((i) => Number(i.cantidad ?? 0) > 0);
          const groupStatus =
            doneCount === total
              ? "Completado"
              : anyProgress
                ? "En Proceso"
                : "Pendiente";
          if (groupStatus !== stateFilter) return false;
        }

        return true;
      })
      .slice()
      .sort((a, b) => a.pedidoId - b.pedidoId);
  }, [
    mesaGroups,
    itemFilter,
    countryFilter,
    clientFilter,
    stateFilter,
    deuFilter,
  ]);

  const consolidatedItems = useMemo(() => {
    if (viewMode !== "consolidated") return [];

    const itemsMap = new Map();

    filteredGroups.forEach((g) => {
      g.items.forEach((item) => {
        const deuCode = item.deudorCodigo || "";
        const key = `${deuCode}|${item.productoNombre}`;

        if (itemsMap.has(key)) {
          const existing = itemsMap.get(key);
          existing.cantidadUnidad += Number(item.cantidadUnidad || 0);
          existing.cantidad += Number(item.cantidad || 0);
          existing.mpUtilizada =
            (existing.mpUtilizada || 0) + Number(item.mpUtilizada || 0);
          existing.mpSobrante =
            (existing.mpSobrante || 0) + Number(item.mpSobrante || 0);
          existing.basura = (existing.basura || 0) + Number(item.basura || 0);
          existing.cantidadRechazada =
            (existing.cantidadRechazada || 0) +
            Number(item.cantidadRechazada || 0);
          existing.originalItems.push(item);
        } else {
          itemsMap.set(key, {
            ...item,
            cantidadUnidad: Number(item.cantidadUnidad || 0),
            cantidad: Number(item.cantidad || 0),
            mpUtilizada: Number(item.mpUtilizada || 0),
            mpSobrante: Number(item.mpSobrante || 0),
            basura: Number(item.basura || 0),
            cantidadRechazada: Number(item.cantidadRechazada || 0),
            originalItems: [item],
          });
        }
      });
    });

    return Array.from(itemsMap.values()).sort((a, b) => {
      const deuCompare = (a.deudorCodigo || "").localeCompare(
        b.deudorCodigo || "",
        undefined,
        { sensitivity: "base" },
      );
      if (deuCompare !== 0) return deuCompare;
      return a.productoNombre.localeCompare(b.productoNombre, undefined, {
        sensitivity: "base",
      });
    });
  }, [filteredGroups, viewMode]);

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
              <Button
                colorScheme="orange"
                variant="solid"
                onClick={onOpen}
                size="sm"
              >
                ⚠️ {unassignedCount} Sin Asignar
              </Button>
            </Tooltip>
          )}

          <HStack w={{ base: "full", lg: "auto" }}>
            <FilterPanel
              countryFilter={countryFilter}
              onCountryChange={handleCountryFilterChange}
              clientFilter={clientFilter}
              onClientChange={handleClientFilterChange}
              stateFilter={stateFilter}
              onStateChange={handleStateFilterChange}
              countries={countries}
              clients={clients}
              deuFilter={deuFilter}
              onDeuChange={handleDeuFilterChange}
              deudores={deudores}
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
