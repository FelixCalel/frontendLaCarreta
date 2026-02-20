import {
  useState,
  useMemo,
  useEffect,
  useTransition,
  useCallback,
} from "react";
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

  const [isPending, startTransition] = useTransition();

  // Wrapped setters that use startTransition
  const handleCountryFilterChange = (value) => {
    startTransition(() => {
      setCountryFilter(value);
    });
  };

  const handleClientFilterChange = useCallback(
    (value) => {
      startTransition(() => {
        setClientFilter(value);
      });
    },
    [startTransition],
  );

  const handleStateFilterChange = useCallback(
    (value) => {
      startTransition(() => {
        setStateFilter(value);
      });
    },
    [startTransition],
  );

  const handleDeuFilterChange = useCallback(
    (value) => {
      startTransition(() => {
        setDeuFilter(value);
      });
    },
    [startTransition],
  );

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
    return (
      mesaGroups
        // Filtro DEU al inicio para optimizar
        .filter((g) => {
          if (!deuFilter) return true;
          // Si el grupo tiene items con ese DEU, lo mantenemos (y filtramos items despues)
          return g.items.some((i) => i.deudorCodigo === deuFilter);
        })
        .map((g) => {
          const filteredItems = g.items
            .filter((i) => {
              if (deuFilter && i.deudorCodigo !== deuFilter) return false; // Filtro por DEU activo
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
            const anyProgress = g.items.some(
              (i) => Number(i.cantidad ?? 0) > 0,
            );
            const groupStatus =
              doneCount === total
                ? "Completado"
                : anyProgress
                  ? "En Proceso"
                  : "Pendiente";
            if (groupStatus !== stateFilter) return false;
          }

        return {
          ...g,
          items: filteredItems,
        };
      })
      .filter(Boolean)
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

          <Box w={{ base: "100%", lg: "auto" }}>
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
          </Box>
        </Flex>
        {viewMode === "byOrder" ? (
          <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={6} mt={6}>
            {filteredGroups.map((g) => {
              const doneCount = g.items.filter((i) => i.completo).length;
              const allDone = doneCount === g.items.length;
              const statusColor = allDone ? "green.400" : "yellow.400";
              const deudorCode = g.deudorCodigo || "N/A";

              return (
                <Box
                  key={g.pedidoId}
                  position="relative"
                  bg={cardBg}
                  border="1px solid"
                  borderColor={cardBorder}
                  borderRadius="lg"
                  overflow="hidden"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    shadow: cardHoverShadow,
                    transform: "translateY(-2px)",
                  }}
                  onClick={() => navigate(`/mesa/produccion/${g.pedidoId}`)}
                  role="group"
                >
                  <Box h="4px" bg={statusColor} w="100%" />
                  <Box p={4}>
                    <Flex justify="space-between" align="start" mb={2}>
                      <VStack align="start" spacing={0}>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          fontWeight="bold"
                          letterSpacing="wide"
                          textTransform="uppercase"
                        >
                          Pedido #{g.pedidoId}
                        </Text>
                        <Heading size="sm" noOfLines={2} title={g.tienda}>
                          {g.tienda}
                        </Heading>
                      </VStack>
                      <Icon
                        as={CheckCircleIcon}
                        color={statusColor}
                        boxSize={5}
                      />
                    </Flex>

                    <HStack mt={2} mb={3}>
                      <Badge
                        colorScheme="blue"
                        variant="subtle"
                        fontSize="0.7em"
                      >
                        {deudorCode}
                      </Badge>
                      <Badge variant="outline" fontSize="0.7em">
                        {g.pais}
                      </Badge>
                    </HStack>

                    <Divider mb={3} borderColor="gray.100" />

                    <Flex justify="space-between" align="center">
                      <Text fontSize="xs" color="gray.500">
                        {doneCount} / {g.items.length} Completados
                      </Text>
                      <Badge
                        colorScheme={allDone ? "green" : "gray"}
                        variant="solid"
                        borderRadius="full"
                        px={2}
                      >
                        {g.items.length} ÍTEM{g.items.length !== 1 ? "S" : ""}
                      </Badge>
                    </Flex>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        ) : (
          <ConsolidatedOrdersView
            data={consolidatedItems}
            actionLabel="Pasar a Supervisor"
          />
        )}
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
