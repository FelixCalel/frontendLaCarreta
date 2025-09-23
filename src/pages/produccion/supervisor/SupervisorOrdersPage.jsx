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
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  useGetPedidosAgrupadosQuery,
  useProcesarEstado5Mutation,
} from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { OrdersTable } from "../../../components/production/OrdersTable";
import { ConsolidatedOrdersView } from "../../../components/production/ConsolidatedOrdersView";
import BotonSincronizarReceta from "../../../components/empresa/BotonSincronizarReceta";
import { useSelector, useDispatch } from "react-redux";
import { tablaEmpresa, tablaPais } from "../../../store/Empresa/thunks";

const SupervisorOrdersPage = () => {
  const dispatch = useDispatch();
  const { data: empresas, paises } = useSelector((state) => state.empresas);
  const [countryFilter, setCountryFilter] = useState("");
  const [itemFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [syncReady, setSyncReady] = useState(false);
  const [procesarEstado5] = useProcesarEstado5Mutation();
  const [viewMode, setViewMode] = useState("byOrder");

  useEffect(() => {
    dispatch(tablaEmpresa());
    dispatch(tablaPais());
  }, [dispatch]);

  const empresaActiva = useMemo(() => {
    if (!countryFilter || !empresas || !paises) return null;
    const paisSeleccionado = paises.find((p) => p.nombre === countryFilter);
    if (!paisSeleccionado) return null;
    return empresas.find((e) => e.paisId === paisSeleccionado.id);
  }, [countryFilter, empresas, paises]);

  useEffect(() => {
    const runProcess = async () => {
      try {
        const result = await procesarEstado5(undefined).unwrap();
        if (result && result.procesados === 0) {
          console.log("No hay pedidos en estado 5 para procesar.");
        }
      } catch (error) {
        // El error 400 del backend ya no debería ocurrir para este caso,
        // pero mantenemos el catch para otros posibles errores (red, etc.)
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
  } = useGetPedidosAgrupadosQuery(undefined, { skip: !syncReady });

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");

  const pedidoGroups = useMemo(
    () =>
      agrupados
        .map((g) => ({
          pedidoId: g.pedidoId,
          tienda: g.tienda,
          pais: g.pais,
          items: g.items.map((item) => ({
            ...item,
            pedidoId: g.pedidoId,
            tienda: g.tienda,
            // Ensure all numeric fields are numbers
            cantidadUnidad: Number(item.cantidadUnidad ?? 0),
            cantidad: Number(item.cantidad ?? 0),
            faltante: Number(item.faltante ?? 0),
            mpUtilizada: Number(item.mpUtilizada ?? 0),
            mp1ra: Number(item.mp1ra ?? 0),
            mp2da: Number(item.mp2da ?? 0),
            mp3ra: Number(item.mp3ra ?? 0),
            mpSobrante: Number(item.mpSobrante ?? 0),
            rechazo: Number(item.rechazo ?? 0),
            basura: Number(item.basura ?? 0),
          })),
        }))
        .filter((g) => g.items.length > 0),
    [agrupados]
  );

  const allItems = useMemo(
    () => pedidoGroups.flatMap((g) => g.items),
    [pedidoGroups]
  );
  const countries = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.pais))),
    [allItems]
  );
  const clients = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.tienda))),
    [allItems]
  );

  const filteredGroups = useMemo(() => {
    return pedidoGroups
      .map((g) => {
        const filteredItems = g.items
          .filter((i) => {
            if (!itemFilter) return true;
            return i.productoNombre
              .toLowerCase()
              .includes(itemFilter.toLowerCase());
          })
          .slice()
          .sort((a, b) =>
            a.productoNombre.localeCompare(b.productoNombre, undefined, {
              sensitivity: "base",
            })
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
  }, [pedidoGroups, itemFilter, countryFilter, clientFilter, stateFilter]);

  const consolidatedItems = useMemo(() => {
    if (viewMode !== "consolidated") return [];

    const allFilteredItems = filteredGroups.flatMap((g) => g.items);
    const itemsMap = new Map();

    allFilteredItems.forEach((item) => {
      const key = item.productoNombre;
      if (itemsMap.has(key)) {
        const existing = itemsMap.get(key);
        existing.cantidadUnidad += Number(item.cantidadUnidad ?? 0);
        existing.cantidad += Number(item.cantidad ?? 0);
        existing.originalItems.push(item);
      } else {
        itemsMap.set(key, {
          ...item,
          cantidadUnidad: Number(item.cantidadUnidad ?? 0),
          cantidad: Number(item.cantidad ?? 0),
          originalItems: [item],
        });
      }
    });

    return Array.from(itemsMap.values()).sort((a, b) =>
      a.productoNombre.localeCompare(b.productoNombre, undefined, {
        sensitivity: "base",
      })
    );
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
        <Text color="red.500">Error al cargar pedidos del supervisor.</Text>
      </Box>
    );
  }

  if (selectedPedidoId === null) {
    return (
      <Box p={2}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="lg" flex="1" textAlign="center">
            {viewMode === "byOrder"
              ? "Pedidos de Supervisor"
              : "Consolidado de Supervisor"}
          </Heading>
        </Flex>
        <Flex justify="center" mb={4}>
          <ButtonGroup isAttached variant="outline">
            <Button
              onClick={() => setViewMode("byOrder")}
              isActive={viewMode === "byOrder"}
            >
              Por Pedido
            </Button>
            <Button
              onClick={() => setViewMode("consolidated")}
              isActive={viewMode === "consolidated"}
            >
              Consolidado
            </Button>
            <BotonSincronizarReceta
              empresa={empresaActiva}
              ultimaSincronizacionRecetas={empresaActiva?.ultimaSincronizacionRecetas}
            />
          </ButtonGroup>
        </Flex>
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
        {viewMode === "byOrder" ? (
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} mt={6}>
            {filteredGroups.map((g) => {
              const doneCount = g.items.filter((i) => i.completo).length;
              const allDone = doneCount === g.items.length;
              return (
                <Box
                  key={g.pedidoId}
                  position="relative"
                  p={4}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={cardBorder}
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ shadow: "md" }}
                  onClick={() => setSelectedPedidoId(g.pedidoId)}
                >
                  <Icon
                    as={CheckCircleIcon}
                    position="absolute"
                    top="4px"
                    right="4px"
                    boxSize={6}
                    color={allDone ? "green.400" : "yellow.400"}
                  />
                  <Text fontWeight="bold">Pedido #{g.pedidoId}</Text>
                  <Text fontSize="sm">{g.tienda}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {g.pais}
                  </Text>
                  <Box
                    mt={2}
                    px={2}
                    py={1}
                    bg="blue.500"
                    color="white"
                    fontSize="xs"
                    borderRadius="sm"
                    display="inline-block"
                  >
                    {g.items.length} ÍTEM{g.items.length > 1 ? "S" : ""}
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        ) : (
          <ConsolidatedOrdersView data={consolidatedItems} />
        )}
      </Box>
    );
  }

  const selectedGroup = filteredGroups.find(
    (g) => g.pedidoId === selectedPedidoId
  );
  if (!selectedGroup) {
    setSelectedPedidoId(null);
    return null;
  }
  return (
    <Box p={6}>
      <Flex mb={4} align="center" justify="space-between">
        <Button onClick={() => setSelectedPedidoId(null)}>← Volver</Button>
        <Heading size="md">
          Pedido #{selectedGroup.pedidoId} – {selectedGroup.tienda}
        </Heading>
        <Box />
      </Flex>
      <OrdersTable data={selectedGroup.items} />
    </Box>
  );
};

export default SupervisorOrdersPage;
