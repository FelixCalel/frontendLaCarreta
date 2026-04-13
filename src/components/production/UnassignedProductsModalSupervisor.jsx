import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Box,
  Select,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAreas } from "../../store/areas/thunks";
import {
  useAssignProductToAreaMutation,
  useGetActiveMesaAssignmentsQuery,
  useGetPedidosAgrupadosQuery,
  useGetUnassignedOrdersQuery,
  useUnassignProductFromAreaMutation,
} from "../../services/pedidoProductionApi";

export const UnassignedProductsModalSupervisor = ({ isOpen, onClose }) => {
  const PAGE_SIZE = 40;
  const dispatch = useDispatch();
  const toast = useToast();
  const { areas = [] } = useSelector((state) => state.areas || {});
  const authRoleId = useSelector((state) => state.auth?.roleId);
  const roleId = Number(authRoleId ?? localStorage.getItem("roleId") ?? 0);
  const supervisorRoleIds = [1, 6, 9];
  const canAssign = supervisorRoleIds.includes(roleId);

  const usuarioId = Number(localStorage.getItem("usuarioId") || 0);
  const [selectedAreaByItem, setSelectedAreaByItem] = useState({});
  const [assigningItemId, setAssigningItemId] = useState(null);
  const [unassigningItemId, setUnassigningItemId] = useState(null);
  const [optimisticUnassignedIds, setOptimisticUnassignedIds] = useState([]);
  const [visibleUnassignedCount, setVisibleUnassignedCount] = useState(PAGE_SIZE);
  const [visibleAssignedCount, setVisibleAssignedCount] = useState(PAGE_SIZE);

  const { data: unassignedGroups = [], isLoading } =
    useGetUnassignedOrdersQuery();
  const { data: pedidosEtapa1 = [], isLoading: isLoadingEtapa1 } =
    useGetPedidosAgrupadosQuery({ etapaId: 1 });
  const { data: pedidosEtapa2 = [], isLoading: isLoadingEtapa2 } =
    useGetPedidosAgrupadosQuery({ etapaId: 2 });
  const [assignProductToArea] = useAssignProductToAreaMutation();
  const [unassignProductFromArea] = useUnassignProductFromAreaMutation();
  const {
    data: activeMesaAssignments = [],
    isError: activeMesasError,
  } = useGetActiveMesaAssignmentsQuery();

  useEffect(() => {
    if (!areas.length) {
      dispatch(fetchAreas());
    }
  }, [areas.length, dispatch]);

  const mesaOptions = useMemo(() => {
    if (activeMesaAssignments.length > 0) {
      return activeMesaAssignments.map((mesa) => ({
        value: String(mesa.mesaId),
        areaId: mesa.areaId,
        label: `${mesa.mesaNombre} - ${mesa.encargadoNombre}`,
      }));
    }

    return areas.map((area) => ({
      value: `area-${area.id}`,
      areaId: area.id,
      label: `${area.nombre} (sin mesa configurada)`,
    }));
  }, [activeMesaAssignments, areas]);

  const theadBg = useColorModeValue("gray.50", "gray.700");

  const unassignedItems = unassignedGroups.flatMap((g) =>
    g.items.map((item) => ({
      ...item,
      pedidoId: g.pedidoId,
      tienda: g.tienda,
      deudorCodigo: g.deudorCodigo,
      deudorNombre: g.deudorNombre,
    })),
  );

  const assignedItems = useMemo(() => {
    const fromStage = (groups, etapaLabel) =>
      groups.flatMap((g) =>
        g.items
          .filter((item) => !!item.id_asigArea && !item.despacho)
          .map((item) => ({
            ...item,
            pedidoId: g.pedidoId,
            tienda: g.tienda,
            deudorCodigo: g.deudorCodigo,
            deudorNombre: g.deudorNombre,
            etapaLabel,
          })),
      );

    return [
      ...fromStage(pedidosEtapa1, "Pedido"),
      ...fromStage(pedidosEtapa2, "Produccion"),
    ]
      .slice()
      .sort((a, b) => Number(a.pedidoId) - Number(b.pedidoId));
  }, [pedidosEtapa1, pedidosEtapa2]);

  const visibleAssignedItems = useMemo(
    () => {
      const areaIdsWithMesa = new Set(
        activeMesaAssignments.map((row) => Number(row.areaId)).filter(Boolean),
      );

      return assignedItems
        .filter((item) => !optimisticUnassignedIds.includes(item.id))
        .filter((item) => areaIdsWithMesa.has(Number(item.id_asigArea)));
    },
    [assignedItems, optimisticUnassignedIds, activeMesaAssignments],
  );

  const visibleUnassignedItems = useMemo(
    () => unassignedItems.slice(0, visibleUnassignedCount),
    [unassignedItems, visibleUnassignedCount],
  );

  const visibleAssignedPagedItems = useMemo(
    () => visibleAssignedItems.slice(0, visibleAssignedCount),
    [visibleAssignedItems, visibleAssignedCount],
  );

  useEffect(() => {
    if (isOpen) {
      setVisibleUnassignedCount(PAGE_SIZE);
      setVisibleAssignedCount(PAGE_SIZE);
    }
  }, [isOpen]);

  useEffect(() => {
    setVisibleUnassignedCount((prev) => Math.min(Math.max(PAGE_SIZE, prev), unassignedItems.length || PAGE_SIZE));
  }, [unassignedItems.length]);

  useEffect(() => {
    setVisibleAssignedCount((prev) => Math.min(Math.max(PAGE_SIZE, prev), visibleAssignedItems.length || PAGE_SIZE));
  }, [visibleAssignedItems.length]);

  const areaAssignmentMap = useMemo(() => {
    const map = new Map();

    activeMesaAssignments.forEach((row) => {
      const key = Number(row.areaId);
      const current = map.get(key) || {
        areaNombre: row.areaNombre || "Area",
        mesas: new Set(),
        encargados: new Set(),
      };

      if (row.mesaNombre) current.mesas.add(row.mesaNombre);
      if (row.encargadoNombre) current.encargados.add(row.encargadoNombre);

      map.set(key, current);
    });

    return map;
  }, [activeMesaAssignments]);

  const getMesaAreaInfo = (idAsigArea) => {
    const areaId = Number(idAsigArea || 0);
    const group = areaAssignmentMap.get(areaId);
    if (group) {
      const mesas = Array.from(group.mesas);
      const encargados = Array.from(group.encargados);
      return {
        mesaArea: mesas.length > 0
          ? `${mesas.join(", ")} / ${group.areaNombre}`
          : group.areaNombre,
        encargado: encargados.length > 0 ? encargados.join(", ") : "Sin encargado",
      };
    }

    const area = areas.find((a) => Number(a.id) === areaId);
    return {
      mesaArea: area?.nombre || "Sin mesa/area",
      encargado: "Sin encargado",
    };
  };

  const handleAssign = async (item) => {
    const selectedMesa = selectedAreaByItem[item.id];
    const selectedOption = mesaOptions.find(
      (mesa) => String(mesa.value) === String(selectedMesa),
    );

    if (!selectedOption?.areaId) {
      toast({
        title: "Selecciona una mesa",
        description: "Debes elegir la mesa a la que se asignara el producto.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!item.productoId) {
      toast({
        title: "Producto no asignable",
        description: "No se encontro el identificador interno del producto.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!usuarioId) {
      toast({
        title: "Usuario invalido",
        description: "No se pudo identificar el usuario autenticado.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      setAssigningItemId(item.id);
      await assignProductToArea({
        id_area: Number(selectedOption.areaId),
        productoId: Number(item.productoId),
        create_by: usuarioId,
        state: true,
      }).unwrap();

      toast({
        title: "Producto asignado",
        description: "El producto se asigno correctamente a la mesa/area.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      setSelectedAreaByItem((prev) => ({ ...prev, [item.id]: "" }));
    } catch (error) {
      toast({
        title: "No se pudo asignar",
        description:
          error?.data?.error || "Ocurrio un error al asignar el producto.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setAssigningItemId(null);
    }
  };

  const handleUnassign = async (item) => {
    const asignacionId = Number(item.id_asigArea || 0);
    if (!asignacionId || !usuarioId) {
      toast({
        title: "No se puede desasignar",
        description: "No se encontro la asignacion o el usuario actual.",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
      return;
    }

    try {
      setUnassigningItemId(item.id);
      await unassignProductFromArea({
        id: asignacionId,
        update_by: usuarioId,
        state: false,
      }).unwrap();

      toast({
        title: "Producto desasignado",
        description: "Ya no aparecera para trabajo en mesa hasta reasignarlo.",
        status: "info",
        duration: 2800,
        isClosable: true,
        id: `unassign-${item.id}`,
      });
      setOptimisticUnassignedIds((prev) =>
        prev.includes(item.id) ? prev : [...prev, item.id],
      );
    } catch (error) {
      toast({
        title: "No se pudo desasignar",
        description:
          error?.data?.error || "Ocurrio un error al desasignar el producto.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setUnassigningItemId(null);
    }
  };

  const handleInfiniteScroll = (event, tab) => {
    const el = event.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    if (!nearBottom) return;

    if (tab === "unassigned") {
      setVisibleUnassignedCount((prev) =>
        Math.min(prev + PAGE_SIZE, unassignedItems.length),
      );
      return;
    }

    setVisibleAssignedCount((prev) =>
      Math.min(prev + PAGE_SIZE, visibleAssignedItems.length),
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="orange.500" color="white">
          <Text fontWeight="bold">Productos Sin Asignar en Mesa (Supervisor)</Text>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody p={0}>
          <Tabs variant="enclosed" isFitted>
            <TabList>
              <Tab>Sin Asignar ({unassignedItems.length})</Tab>
              <Tab>Asignados Actuales ({visibleAssignedItems.length})</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0} py={0}>
                {isLoading ? (
                  <Text p={6} textAlign="center">
                    Cargando productos huerfanos...
                  </Text>
                ) : unassignedItems.length === 0 ? (
                  <Text p={6} textAlign="center">
                    No hay productos sin asignar en esta etapa.
                  </Text>
                ) : (
                  <Box
                    maxH="60vh"
                    overflowY="auto"
                    onScroll={(e) => handleInfiniteScroll(e, "unassigned")}
                  >
                    <Table variant="simple" size="sm">
                      <Thead bg={theadBg} position="sticky" top={0} zIndex={1}>
                        <Tr>
                          <Th>Pedido</Th>
                          <Th>Cliente</Th>
                          <Th>Item</Th>
                          <Th>DEU</Th>
                          {canAssign && <Th>Mesa</Th>}
                          {canAssign && <Th>Accion</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {visibleUnassignedItems.map((item) => (
                          <Tr key={item.id}>
                            <Td fontWeight="bold">#{item.pedidoId}</Td>
                            <Td>
                              {item.deudorCodigo
                                ? `${item.deudorCodigo} - ${item.deudorNombre}`
                                : item.tienda}
                            </Td>
                            <Td>
                              <Text fontWeight="semibold">{item.itemCode || "N/A"}</Text>
                              <Text fontSize="xs" color="gray.500">
                                {item.productoNombre || "N/A"}
                              </Text>
                            </Td>
                            <Td>
                              {item.deudorCodigo ? (
                                <Badge colorScheme="blue" variant="subtle">
                                  {item.deudorCodigo}
                                </Badge>
                              ) : (
                                <Text color="gray.400" fontSize="xs">
                                  Sin DEU
                                </Text>
                              )}
                            </Td>
                            {canAssign && (
                              <Td minW="220px">
                                <Select
                                  size="sm"
                                  placeholder="Selecciona mesa"
                                  value={selectedAreaByItem[item.id] ?? ""}
                                  onChange={(e) =>
                                    setSelectedAreaByItem((prev) => ({
                                      ...prev,
                                      [item.id]: e.target.value,
                                    }))
                                  }
                                >
                                  {mesaOptions.map((mesa) => (
                                    <option key={mesa.value} value={mesa.value}>
                                      {mesa.label}
                                    </option>
                                  ))}
                                </Select>
                                {activeMesasError && (
                                  <Text mt={1} fontSize="xs" color="orange.300">
                                    No se pudieron cargar mesas activas. Mostrando areas como respaldo.
                                  </Text>
                                )}
                              </Td>
                            )}
                            {canAssign && (
                              <Td>
                                <Button
                                  colorScheme="green"
                                  size="sm"
                                  onClick={() => handleAssign(item)}
                                  isLoading={assigningItemId === item.id}
                                  isDisabled={!item.productoId}
                                >
                                  Asignar
                                </Button>
                              </Td>
                            )}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    {visibleUnassignedCount < unassignedItems.length && (
                      <Text p={3} textAlign="center" fontSize="sm" color="gray.400">
                        Desliza para cargar mas productos ({visibleUnassignedCount}/{unassignedItems.length})
                      </Text>
                    )}
                  </Box>
                )}
              </TabPanel>

              <TabPanel px={0} py={0}>
                {isLoadingEtapa1 || isLoadingEtapa2 ? (
                  <Text p={6} textAlign="center">
                    Cargando asignados actuales...
                  </Text>
                ) : visibleAssignedItems.length === 0 ? (
                  <Text p={6} textAlign="center">
                    No hay productos con mesa/area asignada actualmente.
                  </Text>
                ) : (
                  <Box
                    maxH="60vh"
                    overflowY="auto"
                    onScroll={(e) => handleInfiniteScroll(e, "assigned")}
                  >
                    <Table variant="simple" size="sm">
                      <Thead bg={theadBg} position="sticky" top={0} zIndex={1}>
                        <Tr>
                          <Th>Pedido</Th>
                          <Th>Cliente</Th>
                          <Th>Item</Th>
                          <Th>DEU</Th>
                          <Th>Mesa/Area</Th>
                          <Th>Encargado</Th>
                          {canAssign && <Th>Accion</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {visibleAssignedPagedItems.map((item) => {
                          const info = getMesaAreaInfo(item.id_asigArea);
                          return (
                          <Tr key={`${item.etapaLabel}-${item.id}`}>
                            <Td fontWeight="bold">#{item.pedidoId}</Td>
                            <Td>
                              {item.deudorCodigo
                                ? `${item.deudorCodigo} - ${item.deudorNombre}`
                                : item.tienda}
                            </Td>
                            <Td>
                              <Text fontWeight="semibold">{item.itemCode || "N/A"}</Text>
                              <Text fontSize="xs" color="gray.500">
                                {item.productoNombre || "N/A"}
                              </Text>
                            </Td>
                            <Td>
                              {item.deudorCodigo ? (
                                <Badge colorScheme="blue" variant="subtle">
                                  {item.deudorCodigo}
                                </Badge>
                              ) : (
                                <Text color="gray.400" fontSize="xs">
                                  Sin DEU
                                </Text>
                              )}
                            </Td>
                            <Td>
                              <Text fontSize="sm">{info.mesaArea}</Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm">{info.encargado}</Text>
                            </Td>
                            {canAssign && (
                              <Td>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  onClick={() => handleUnassign(item)}
                                  isLoading={unassigningItemId === item.id}
                                  isDisabled={!item.id_asigArea}
                                >
                                  Desasignar
                                </Button>
                              </Td>
                            )}
                          </Tr>
                        )})}
                      </Tbody>
                    </Table>
                    {visibleAssignedCount < visibleAssignedItems.length && (
                      <Text p={3} textAlign="center" fontSize="sm" color="gray.400">
                        Desliza para cargar mas productos ({visibleAssignedCount}/{visibleAssignedItems.length})
                      </Text>
                    )}
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
