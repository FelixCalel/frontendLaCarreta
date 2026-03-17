import {
  useState,
  useEffect,
  useDeferredValue,
  useRef,
} from "react";
import axios from "axios";

const CHUNK_SIZE = 20;
const PAGE_SIZE = 100;
const BASE_URL = import.meta.env.VITE_API_URL;

const normalizeText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "");

export const useProductoSelector = (
  deudorId,
  pedidoId,
  tiendaId,
  onSelect,
  reset
) => {
  const [inputValue, setInputValue] = useState("");
  const deferredQuery = useDeferredValue(inputValue);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");
  const [sourceItems, setSourceItems] = useState([]);
  const [renderItems, setRenderItems] = useState([]);
  const [pageState, setPageState] = useState({ page: 1, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const onSelectRef = useRef(onSelect);
  const requestIdRef = useRef(0);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const fetchItemsByDeudor = async ({ page, append }) => {
    const deuId = Number(deudorId) || null;
    if (!deuId) {
      setSourceItems([]);
      setRenderItems([]);
      setPageState({ page: 1, totalItems: 0 });
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      let items = [];
      let totalItems = 0;
      let usedNewEndpoint = false;

      try {
        const response = await axios.get(
          `${BASE_URL}/items/activos/deudor/${deuId}`,
          {
            params: {
              search: deferredQuery.trim(),
              page,
              pageSize: PAGE_SIZE,
            },
          }
        );

        usedNewEndpoint = true;
        items = Array.isArray(response?.data?.items) ? response.data.items : [];
        totalItems = Number(response?.data?.totalItems ?? 0);
      } catch {
        usedNewEndpoint = false;
      }

      const canUseLegacyFallback =
        !append &&
        page === 1 &&
        !deferredQuery.trim() &&
        Number(pedidoId) > 0 &&
        Number(tiendaId) > 0;

      if (
        canUseLegacyFallback &&
        (!usedNewEndpoint || (usedNewEndpoint && items.length === 0))
      ) {
        const legacyResponse = await axios.get(
          `${BASE_URL}/detalle/pedido/pedidoModelo/${deuId}/${Number(
            pedidoId
          )}/${Number(tiendaId)}`
        );

        const legacyItems = Array.isArray(legacyResponse?.data)
          ? legacyResponse.data
          : [];

        items = legacyItems.map((item) => ({
          id: item?.productoId ?? item?.id,
          nombre: item?.nombreProducto ?? item?.nombre ?? "",
          codigo: item?.codigo ?? "",
          cantidadDisponible: Number(item?.cantidadDisponible ?? 0),
        }));
        totalItems = items.length;
      }

      if (requestId !== requestIdRef.current) return;

      setPageState({ page, totalItems });
      setSourceItems((prev) => {
        if (!append) return items;

        const existingIds = new Set(prev.map((item) => item.id));
        const merged = [...prev];
        items.forEach((item) => {
          if (!existingIds.has(item.id)) {
            merged.push(item);
          }
        });
        return merged;
      });
    } catch {
      if (requestId !== requestIdRef.current) return;
      if (!append) {
        setSourceItems([]);
        setPageState({ page: 1, totalItems: 0 });
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchItemsByDeudor({ page: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deudorId, deferredQuery, pedidoId, tiendaId]);

  useEffect(() => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
    onSelectRef.current("", "", 0, "");
  }, [reset, deudorId]);

  useEffect(() => {
    const term = normalizeText(deferredQuery.trim());
    if (!term) {
      setRenderItems(sourceItems.slice(0, CHUNK_SIZE * pageState.page));
      return;
    }

    setRenderItems(sourceItems.slice(0, CHUNK_SIZE * pageState.page));
  }, [deferredQuery, sourceItems, pageState.page]);

  const handleSelectItem = (item) => {
    const nombre = item?.nombre ?? item?.nombreProducto ?? "";
    const codigo = item?.codigo ?? "";
    const cantidadDisponible = Number(item?.cantidadDisponible ?? 0);

    setInputValue(nombre);
    setSelectedItem(item);
    onSelectRef.current(item?.id, nombre, cantidadDisponible, codigo);
    setError(cantidadDisponible === 0 ? "Cantidad disponible: 0" : "");
  };

  const loadMoreItems = () => {
    if (isLoading) return;
    if (sourceItems.length >= pageState.totalItems) return;

    const nextPage = pageState.page + 1;
    fetchItemsByDeudor({ page: nextPage, append: true });
  };

  const handleClearInput = () => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
    onSelectRef.current("", "", 0, "");
  };

  return {
    inputValue,
    setInputValue,
    selectedItem,
    setSelectedItem,
    error,
    setError,
    renderItems,
    handleSelectItem,
    loadMoreItems,
    handleClearInput,
  };
};
