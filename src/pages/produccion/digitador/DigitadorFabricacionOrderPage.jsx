import { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Center,
  Spinner,
  Text,
  Flex,
  InputGroup,
  Input,
  InputLeftElement,
  Select,
  useColorModeValue,
  ButtonGroup,
  Button,
  Heading,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaFileUpload } from "react-icons/fa";
import { useGetPedidosAgrupadosQuery } from "../../../services/pedidoProductionApi";
import { GroupCardGrid } from "../../../components/production/digitador/FabricacionCardGrid";
import { ConsolidatedOrdersView } from "../../../components/production/ConsolidatedOrdersView";
import { tablaEmpresa, tablaPais } from "../../../store/Empresa/thunks";

const DigitadorFabricacionOrdersPage = () => {
  const toDateKey = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayKey = toDateKey(new Date());

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(tablaEmpresa());
    dispatch(tablaPais());
  }, [dispatch]);
  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery({
    etapaId: 3,
  });

  const base = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
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
    [groups],
  );

  const [term, setTerm] = useState("");
  const [dateMode, setDateMode] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState("byOrder");
  const bgColor = useColorModeValue("white", "gray.800");

  const filtered = useMemo(() => {
    const selectedDate = dateMode === "today" ? todayKey : dateFilter;
    const txt = term.toLowerCase();
    return base
      .map((g) => {
        const orderLevelMatch =
          !term ||
          g.pedidoId.toString().includes(txt) ||
          (g.deudorCodigo || "").toLowerCase().includes(txt) ||
          (g.deudorNombre || "").toLowerCase().includes(txt) ||
          (g.tienda || "").toLowerCase().includes(txt);

        const filteredItems = g.items.filter((i) => {
          const itemStatus = i.completo ? "Completado" : "Pendiente";
          const matchStatus =
            !status || g.estado === status || itemStatus === status;
          const matchText =
            orderLevelMatch ||
            (i.productoNombre || "").toLowerCase().includes(txt);
          return matchStatus && matchText;
        });

        return {
          ...g,
          items: filteredItems,
        };
      })
      .filter((g) => {
        if (g.items.length === 0) return false;

        let byDate = true;
        if (dateMode !== "all") {
          if (!selectedDate) {
            byDate = true;
          } else {
            const groupDate = toDateKey(g.items?.[0]?.fechaPedido);
            byDate = !!groupDate && groupDate === selectedDate;
          }
        }

        return byDate;
      });
  }, [base, term, status, dateMode, dateFilter, todayKey]);

  const consolidatedItems = useMemo(() => {
    if (viewMode !== "consolidated") return [];

    const allFilteredItems = filtered.flatMap((g) => g.items);
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
  }, [filtered, viewMode]);

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
        <Text color="red.500">Error al cargar órdenes.</Text>
      </Center>
    );
  }

  return (
    <Box p={2}>
      <Heading size="lg" mb={4} textAlign="center">
        {viewMode === "byOrder"
          ? "Orden de Fabricación"
          : "Consolidado de Fabricación"}
      </Heading>

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
        </ButtonGroup>
      </Flex>

      <Flex
        wrap="wrap"
        gap={4}
        mb={6}
        align="center"
        bg={bgColor}
        p={3}
        borderRadius="md"
      >
        <InputGroup maxW="240px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="DEU"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </InputGroup>

        <Select
          value={dateMode}
          onChange={(e) => setDateMode(e.target.value)}
          maxW="210px"
        >
          <option value="today">Fecha: Hoy</option>
          <option value="all">Fecha: Todas</option>
          <option value="custom">Fecha: Personalizada</option>
        </Select>

        {dateMode === "custom" && (
          <Input
            type="date"
            placeholder="Fecha del pedido"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            maxW="200px"
          />
        )}

        <Select
          placeholder="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          maxW="200px"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
        </Select>
      </Flex>

      {viewMode === "byOrder" ? (
        <GroupCardGrid
          groups={filtered}
          IconComponent={FaFileUpload}
          title="Orden de fabricación"
        />
      ) : (
        <ConsolidatedOrdersView
          data={consolidatedItems}
          actionLabel="Cargar a SAP"
        />
      )}
    </Box>
  );
};

export default DigitadorFabricacionOrdersPage;
