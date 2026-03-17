import { useState, useEffect, useCallback, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  fetchAsignacionesThunk,
  asignarTipoGrupoThunk,
  fetchClasificacionesThunk,
} from "../../../store/asignacionAM/thunks";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAsignaciones = (areaId) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const usuarioId = Number(localStorage.getItem("usuarioId"));

  const { asignaciones, clasificaciones } = useSelector(
    (state) => state.AsignacionAreaMesa,
  );

  const [state, setState] = useReducer(
    (s, a) => (typeof a === "function" ? a(s) : { ...s, ...a }),
    {
    productOptions: [],
    selectedProducto: null,
    isLoadingProducts: false,
    searchQuery: "",
    currentPage: 1,
    hasMore: true,
    visibleCount: 15,
    filtroTabla: "",
    },
  );

  const {
    productOptions,
    selectedProducto,
    isLoadingProducts,
    searchQuery,
    currentPage,
    hasMore,
    visibleCount,
    filtroTabla,
  } = state;

  const loadProducts = useCallback(async (search = "", page = 1) => {
    setState({ isLoadingProducts: true });
    try {
      const res = await axios.get(
        `${BASE_URL}/items/todos?page=${page}&pageSize=10&nombre=${search}&codigo=${search}`,
      );
      const newItems = res.data.items || res.data;
      const newOptions = newItems.map((item) => ({
        label: `${item.codigo} - ${item.nombre}`,
        value: item.id,
      }));

      setState((prev) => ({
        ...prev,
        productOptions:
          page === 1 ? newOptions : [...prev.productOptions, ...newOptions],
        hasMore: newItems.length >= 10,
      }));
    } catch (err) {
      console.error("Error cargando productos paginados:", err);
    } finally {
      setState({ isLoadingProducts: false });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(searchQuery, 1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, loadProducts]);

  useEffect(() => {
    if (areaId) {
      dispatch(fetchAsignacionesThunk(areaId));
      if (!clasificaciones?.empaques?.length) {
        dispatch(fetchClasificacionesThunk());
      }
    }
  }, [dispatch, areaId, clasificaciones?.empaques?.length]);

  const handleInputChange = (newValue, actionMeta) => {
    if (actionMeta.action === "input-change") {
      setState({ searchQuery: newValue || "", currentPage: 1, hasMore: true });
    }
  };

  const handleScrollToBottom = () => {
    if (!isLoadingProducts && hasMore) {
      const nextPage = currentPage + 1;
      setState({ currentPage: nextPage });
      loadProducts(searchQuery, nextPage);
    }
  };

  const handleAsignar = () => {
    if (!selectedProducto) return;
    dispatch(
      asignarTipoGrupoThunk({
        id_area: areaId,
        productoId: selectedProducto.value,
        create_by: usuarioId,
        state: true,
      }),
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Línea asignada",
          description: "La línea fue asignada exitosamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setState({ selectedProducto: null });
        dispatch(fetchAsignacionesThunk(areaId));
      } else {
        toast({
          title: "Error al asignar",
          description:
            typeof res.payload === "string"
              ? res.payload
              : "No se pudo asignar la línea.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      }
    });
  };

  const handleTableScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
    if (bottom) {
      setState({ visibleCount: state.visibleCount + 15 });
    }
  };

  const filteredAsignaciones = (
    Array.isArray(asignaciones) ? asignaciones : []
  ).filter((a) => {
    if (a?.state === false) return false;
    if (!filtroTabla) return true;
    const searchLower = filtroTabla.toLowerCase();
    const nombre = a.productoNombre?.toLowerCase() || "";
    const codigo = a.productoCodigo?.toLowerCase() || "";
    return nombre.includes(searchLower) || codigo.includes(searchLower);
  });

  return {
    state,
    setState,
    asignaciones,
    clasificaciones,
    filteredAsignaciones,
    handleInputChange,
    handleScrollToBottom,
    handleAsignar,
    handleTableScroll,
    usuarioId,
  };
};
