import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tablaItems } from "../../../../store/items/thunks";

const CHUNK_SIZE = 20;

const normalizeText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "");

export const useProductoSelector = (deudorId, onSelect, reset) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const deferredQuery = useDeferredValue(inputValue);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");
  const [visibleItems, setVisibleItems] = useState([]);
  const [renderItems, setRenderItems] = useState([]);

  const itemsAll = useSelector((state) => state.items.items);
  const itemsStatus = useSelector((state) => state.items.status);

  useEffect(() => {
    if (
      itemsStatus === "idle" ||
      (itemsStatus === "failed" && !itemsAll?.length)
    ) {
      dispatch(tablaItems({ pageSize: 10000 }));
    }
  }, [dispatch, itemsAll?.length, itemsStatus]);

  const sourceItems = useMemo(() => {
    const deuId = Number(deudorId) || null;
    if (!deuId) return [];

    return (Array.isArray(itemsAll) ? itemsAll : [])
      .filter((item) => {
        const hasDeudor = item?.deudores?.some(
          (deudor) => Number(deudor?.id) === deuId
        );
        const singleDeudorId = Number(item?.deuId ?? item?.deudor?.id ?? 0);
        return hasDeudor || singleDeudorId === deuId;
      })
      .filter((item) => Boolean(item?.estaActivo));
  }, [itemsAll, deudorId]);

  useEffect(() => {
    setVisibleItems(sourceItems.slice(0, CHUNK_SIZE));
  }, [sourceItems]);

  useEffect(() => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
  }, [reset, deudorId]);

  useEffect(() => {
    const term = normalizeText(deferredQuery.trim());
    if (!term) {
      setRenderItems(visibleItems);
      return;
    }

    const matches = sourceItems.filter(
      (item) =>
        normalizeText(item?.nombre ?? item?.nombreProducto).includes(term) ||
        normalizeText(item?.codigo).includes(term)
    );
    setRenderItems(matches.slice(0, 200));
  }, [deferredQuery, sourceItems, visibleItems]);

  const handleSelectItem = (item) => {
    const nombre = item?.nombre ?? item?.nombreProducto ?? "";
    const codigo = item?.codigo ?? "";
    const cantidadDisponible = Number(item?.cantidadDisponible ?? 0);

    setInputValue(nombre);
    setSelectedItem(item);
    onSelect(item?.id, nombre, cantidadDisponible, codigo);
    setError(cantidadDisponible === 0 ? "Cantidad disponible: 0" : "");
  };

  const loadMoreItems = () => {
    if (visibleItems.length < sourceItems.length) {
      const next = Math.min(
        visibleItems.length + CHUNK_SIZE,
        sourceItems.length
      );
      setVisibleItems(sourceItems.slice(0, next));
    }
  };

  const handleClearInput = () => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
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
