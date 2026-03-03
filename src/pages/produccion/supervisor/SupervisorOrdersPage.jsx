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

const SupervisorOrdersPage = () => {
  const navigate = useNavigate();
  const { pedidoId } = useParams();
  const dispatch = useDispatch();
  const { data: empresas, paises } = useSelector((state) => state.empresas);
  const { lastSync } = useSelector(selectRecetasState);
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
    dispatch(tablaEmpresa());
    dispatch(tablaPais());
  }, [dispatch]);

  const empresaActiva = useMemo(() => {
    if (!countryFilter || !empresas || !paises) return null;
    const paisSeleccionado = paises.find((p) => p.nombre === countryFilter);
    if (!paisSeleccionado) return null;
    return empresas.find((e) => e.paisId === paisSeleccionado.id);
  }, [countryFilter, empresas, paises]);

  const empresaParaMostrar =
    empresaActiva || (empresas && empresas.length > 0 ? empresas[0] : null);

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
  } = useGetPedidosAgrupadosQuery({ etapaId: 2 }, { skip: !syncReady });

  useEffect(() => {
    if (agrupados.length > 0) {
      console.log("🔍 Primer pedido agrupado:", agrupados[0]);
      console.log(
        "🔍 Primer item del primer pedido:",
        agrupados[0]?.items?.[0],
      );
    }
  }, [agrupados]);

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const cardHoverShadow = useColorModeValue("lg", "dark-lg");

  const pedidoGroups = useMemo(
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
            cantidadRechazada: Number(item.cantidadRechazada ?? 0),
          })),
        }))
        .filter((g) => g.items.length > 0),
    [agrupados],
  );

  const allItems = useMemo(
    () => pedidoGroups.flatMap((g) => g.items),
    [pedidoGroups],
  );
  const countries = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.pais))),
    [allItems],
  );
  const clients = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.tienda))),
    [allItems],
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
  }, [pedidoGroups, itemFilter, countryFilter, clientFilter, stateFilter]);

  const consolidatedItems = useMemo(() => {
    if (viewMode !== "consolidated") return [];

    const allFilteredItems = filteredGroups.flatMap((g) => g.items);
    const itemsMap = new Map();

    allFilteredItems.forEach((item) => {
      const deuCode = item.deudorCodigo || "";
      const key = `${deuCode}|${item.productoNombre}`;
      if (itemsMap.has(key)) {
        const existing = itemsMap.get(key);
        existing.cantidadUnidad += Number(item.cantidadUnidad ?? 0);
        existing.cantidad += Number(item.cantidad ?? 0);
        existing.mpUtilizada += Number(item.mpUtilizada ?? 0);
        existing.rechazo += Number(item.rechazo ?? 0);
        existing.cantidadRechazada += Number(item.cantidadRechazada ?? 0);
        existing.originalItems.push(item);
      } else {
        itemsMap.set(key, {
          ...item,
          cantidadUnidad: Number(item.cantidadUnidad ?? 0),
          cantidad: Number(item.cantidad ?? 0),
          mpUtilizada: Number(item.mpUtilizada ?? 0),
          rechazo: Number(item.rechazo ?? 0),
          cantidadRechazada: Number(item.cantidadRechazada ?? 0),
          originalItems: [item],
        });
      }
    });

    return Array.from(itemsMap.values()).sort((a, b) => {
      const deuCompare = (a.deudorCodigo || "").localeCompare(
        b.deudorCodigo || "",
        undefined,
        {
          sensitivity: "base",
        },
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
        <Text color="red.500">Error al cargar pedidos del supervisor.</Text>
      </Box>
    );
  }

  if (!pedidoId) {
    return (
      <Box p={2}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="lg" flex="1" textAlign="center">
            {viewMode === "byOrder"
              ? "Pedidos de Supervisor"
              : "Consolidado de Supervisor"}
          </Heading>
        </Flex>
        <Flex
          direction={{ base: "column", lg: "row" }}
          justifyContent={{ lg: "space-between" }}
          alignItems="center"
          mb={0}
          gap={0}
        >
          <Flex
            alignItems="center"
            gap={4}
            w={{ base: "100%", lg: "auto" }}
            justifyContent={{ base: "space-between", lg: "flex-start" }}
          >
            <ButtonGroup isAttached variant="outline">
              <Tooltip label="Ver pedidos individuales" placement="top">
                <Button
                  onClick={() => setViewMode("byOrder")}
                  isActive={viewMode === "byOrder"}
                  leftIcon={<ViewIcon />}
                  aria-label="Ver por pedido"
                >
                  Pedido
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

            <Flex alignItems="center" gap={2}>
              <Tooltip
                label="Sincronizar información de producción"
                placement="top"
              >
                <Box>
                  <BotonSincronizarReceta
                    empresa={empresaParaMostrar}
                    ultimaSincronizacionRecetas={
                      empresaParaMostrar?.ultimaSincronizacionRecetas
                    }
                    leftIcon={<RepeatClockIcon />}
                  />
                </Box>
              </Tooltip>
              {empresaParaMostrar?.ultimaSincronizacionRecetas && (
                <Text
                  fontSize="xs"
                  color="gray.500"
                  whiteSpace="nowrap"
                  display={{ base: "none", xl: "block" }}
                >
                  Últ. sinc.:{" "}
                  {new Date(
                    empresaParaMostrar.ultimaSincronizacionRecetas,
                  ).toLocaleString()}
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
                  onClick={() => navigate(`/produccion/orden/${g.pedidoId}`)}
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
                        DEU: {deudorCode}
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
            actionLabel="Pasar a Digitador"
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
