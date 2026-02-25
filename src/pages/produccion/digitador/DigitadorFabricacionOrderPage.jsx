import { useState, useMemo } from "react";
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

const DigitadorFabricacionOrdersPage = () => {
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
          })),
        }))
        .filter((g) => g.items.length > 0),
    [groups],
  );

  const [term, setTerm] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState("byOrder");
  const bgColor = useColorModeValue("white", "gray.800");

  const filtered = useMemo(
    () =>
      base.filter((g) => {
        const byText = !term || g.pedidoId.toString().includes(term);
        const byDate =
          !date ||
          (g.fechaEntrega &&
            new Date(g.fechaEntrega).toISOString().slice(0, 10) === date);
        const byStatus = !status || g.estado === status;
        return byText && byDate && byStatus;
      }),
    [base, term, date, status],
  );

  const consolidatedItems = useMemo(() => {
    if (viewMode !== "consolidated") return [];

    const allFilteredItems = filtered.flatMap((g) => g.items);
    const itemsMap = new Map();

    allFilteredItems.forEach((item) => {
      // Agrupar por código DEU Y producto
      const deuCode = item.deudorCodigo || "";
      const key = `${deuCode}|${item.productoNombre}`;
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

    // Ordenar primero por código DEU, luego por producto
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

        <Input
          type="date"
          placeholder="Fecha de entrega"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          maxW="200px"
        />

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
