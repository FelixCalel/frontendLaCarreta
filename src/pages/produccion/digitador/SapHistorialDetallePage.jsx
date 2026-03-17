import { useMemo, useEffect, useReducer } from "react";
import {
  Box,
  Center,
  Spinner,
  Text,
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetPedidosAgrupadosQuery,
  useGetRecetaByPedidoQuery,
  useGetAlmacenesQuery,
} from "../../../services/pedidoProductionApi";
import FilterPanelFabricacion from "../../../components/production/fabricacion/FilterPanelFabricacion";
import {
  HistorialItemsTable,
  RecetaReadonlyTable,
} from "./components/SapHistorialTables";

const initialState = {
  term: "",
  estado: "",
  mesa: "",
  selectedProdId: null,
  expandedItems: new Set(),
};

const reducer = (state, action) => {
  switch (action.type) {
  case "SET_TERM":
    return { ...state, term: action.payload };
  case "SET_ESTADO":
    return { ...state, estado: action.payload };
  case "SET_MESA":
    return { ...state, mesa: action.payload };
  case "SET_SELECTED_PROD_ID":
    return { ...state, selectedProdId: action.payload };
  case "TOGGLE_ITEM_DETAILS": {
    const next = new Set(state.expandedItems);
    if (next.has(action.payload)) {
      next.delete(action.payload);
    } else {
      next.add(action.payload);
    }
    return { ...state, expandedItems: next };
  }
  default:
    return state;
  }
};

const SapHistorialDetallePage = () => {
  const { pedidoId: raw } = useParams();
  const pedidoId = Number(raw);
  const navigate = useNavigate();

  const handleBackToHistory = () => {
    if (globalThis.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/digitador/orden/pedido");
  };

  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery(undefined, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const headBg = useColorModeValue("gray.50", "gray.800");
  const tableBorder = useColorModeValue("gray.200", "gray.700");
  const tableBg = useColorModeValue("white", "gray.800");
  const detailsRowBg = useColorModeValue("gray.50", "gray.900");

  const [state, dispatchState] = useReducer(reducer, initialState);
  const { term, estado, mesa, selectedProdId, expandedItems } = state;

  const group = useMemo(
    () => groups.find((g) => Number(g.pedidoId) === pedidoId),
    [groups, pedidoId],
  );

  const historyItems = useMemo(() => {
    if (!group) return [];
    const sapItems = group.items.filter(
      (it) =>
        Number(it?.etapaId) === 4 ||
        Boolean(it?.docNum) ||
        Boolean(it?.docEntry),
    );
    return sapItems.length ? sapItems : group.items;
  }, [group]);

  const filteredItems = useMemo(() => {
    if (!historyItems.length) return [];
    const txt = term.toLowerCase();
    return historyItems.filter((it) => {
      const byText =
        !term ||
        (it.itemCode || "").toLowerCase().includes(txt) ||
        (it.productoNombre || "").toLowerCase().includes(txt);
      const byEstado =
        !estado || (it.completo ? "Completado" : "Pendiente") === estado;
      return byText && byEstado;
    });
  }, [historyItems, term, estado]);

  useEffect(() => {
    if (!historyItems.length) {
      dispatchState({ type: "SET_SELECTED_PROD_ID", payload: null });
      return;
    }

    const stillExists = historyItems.some(
      (item) => Number(item.id) === Number(selectedProdId),
    );

    if (!stillExists) {
      dispatchState({
        type: "SET_SELECTED_PROD_ID",
        payload: Number(historyItems[0].id),
      });
    }
  }, [historyItems, selectedProdId]);

  const recetaArg = selectedProdId
    ? { pedidoId: Number(selectedProdId) }
    : skipToken;
  const { data: receta = [], isLoading: loadingReceta } =
    useGetRecetaByPedidoQuery(recetaArg, {
      pollingInterval: 5000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });
  const { data: almacenes = [] } = useGetAlmacenesQuery();

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !group) {
    return (
      <Center py={20} flexDirection="column" gap={4}>
        <Text color="red.500">
          {error
            ? "Error al cargar el historial."
            : `No se encontró historial para el Pedido #${pedidoId}.`}
        </Text>
        <Button leftIcon={<ArrowBackIcon />} onClick={handleBackToHistory}>
          Volver al historial
        </Button>
      </Center>
    );
  }

  const getMaterialParts = (linea) => {
    const rawItem = String(linea?.item || "").trim();
    const rawDesc = String(linea?.descripcion || "").trim();

    if (!rawItem && !rawDesc) {
      return { code: "-", name: "" };
    }

    if (rawItem.includes(" - ")) {
      const [code, ...nameParts] = rawItem.split(" - ");
      const nameFromItem = nameParts.join(" - ").trim();
      const finalName = rawDesc || nameFromItem;
      return {
        code: code?.trim() || rawItem,
        name: finalName && finalName !== code?.trim() ? finalName : "",
      };
    }

    return {
      code: rawItem || "-",
      name: rawDesc && rawDesc !== rawItem ? rawDesc : "",
    };
  };

  const toggleItemDetails = (itemId) =>
    dispatchState({ type: "TOGGLE_ITEM_DETAILS", payload: itemId });

  const getAlmacenName = (linea) =>
    linea.almacen?.name ||
    linea.almacen?.nombre ||
    almacenes.find((a) => Number(a.id) === Number(linea.id_almacen))?.nombre ||
    almacenes.find((a) => Number(a.id) === Number(linea.id_almacen))?.name ||
    "-";

  return (
    <Box p={6}>
      <Flex
        mb={4}
        align="center"
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Button leftIcon={<ArrowBackIcon />} onClick={handleBackToHistory}>
          Volver al Historial
        </Button>
        <Heading size="md" textAlign="center">
          Historial SAP — Pedido #{pedidoId}
        </Heading>
        <Box />
      </Flex>

      <FilterPanelFabricacion
        term={term}
        onTermChange={(value) =>
          dispatchState({ type: "SET_TERM", payload: value })
        }
        estado={estado}
        onEstadoChange={(value) =>
          dispatchState({ type: "SET_ESTADO", payload: value })
        }
        mesa={mesa}
        onMesaChange={(value) =>
          dispatchState({ type: "SET_MESA", payload: value })
        }
      />

      <HistorialItemsTable
        filteredItems={filteredItems}
        headBg={headBg}
        tableBorder={tableBorder}
        tableBg={tableBg}
        detailsRowBg={detailsRowBg}
        expandedItems={expandedItems}
        toggleItemDetails={toggleItemDetails}
        group={group}
      />

      <RecetaReadonlyTable
        tableBorder={tableBorder}
        tableBg={tableBg}
        headBg={headBg}
        selectedProdId={selectedProdId}
        setSelectedProdId={(value) =>
          dispatchState({ type: "SET_SELECTED_PROD_ID", payload: value })
        }
        historyItems={historyItems}
        loadingReceta={loadingReceta}
        receta={receta}
        getMaterialParts={getMaterialParts}
        getAlmacenName={getAlmacenName}
      />
    </Box>
  );
};

export default SapHistorialDetallePage;
