import { useState, useEffect, useMemo, useCallback, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  tablaPedidos,
  fetchFilterOptions,
} from "../../../../store/Pedidos/thunks";
import { getDetalleOrdenByPedidoId } from "../../../../store/Pedidos/DetallePedidos/thunks";
import { tablaTienda } from "../../../../store/Tienda/thunks";

export const useHistorialPedidos = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [modalState, dispatchModal] = useReducer((s, a) => ({ ...s, ...a }), {
    isOpen: false,
    selectedPedido: null,
    detalles: [],
    isLoading: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const { roleId: roleIdRedux, uid } = useSelector((state) => state.auth || {});
  const roleId = roleIdRedux ? parseInt(roleIdRedux, 10) : null;
  const usuarioId = uid ? parseInt(uid, 10) : null;
  const [highlightedPedidoId, setHighlightedPedidoId] = useState(null);

  const [filters, setFilters] = useState({
    tienda: "",
    deudor: "",
    usuario: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (location.state?.highlightedPedidoId) {
      setHighlightedPedidoId(location.state.highlightedPedidoId);
    }
  }, [location]);

  const {
    data: todosLosPedidosRaw = [],
    status,
    total,
    filterOptions,
  } = useSelector((state) => state.pedidos);

  const filteredPedidos = useMemo(() => {
    if (Array.isArray(todosLosPedidosRaw)) return todosLosPedidosRaw;
    if (todosLosPedidosRaw && Array.isArray(todosLosPedidosRaw.data))
      return todosLosPedidosRaw.data;
    return [];
  }, [todosLosPedidosRaw]);

  useEffect(() => {
    if (highlightedPedidoId && filteredPedidos.length > 0) {
      const timer = setTimeout(() => setHighlightedPedidoId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedPedidoId, filteredPedidos]);

  useEffect(() => {
    if (usuarioId && roleId)
      dispatch(fetchFilterOptions({ userId: usuarioId, roleId }));
  }, [dispatch, usuarioId, roleId]);

  useEffect(() => {
    dispatch(tablaTienda());
    if (usuarioId && roleId) {
      dispatch(
        tablaPedidos({
          userId: usuarioId,
          roleId,
          page: currentPage,
          limit: itemsPerPage,
          filters,
        }),
      );
    }
  }, [dispatch, usuarioId, roleId, currentPage, filters]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleVerDetalles = async (pedido) => {
    dispatchModal({ isLoading: true, selectedPedido: pedido });
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id),
      ).unwrap();
      dispatchModal({
        detalles: detalles
          .slice()
          .sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto)),
        isOpen: true,
        isLoading: false,
      });
    } catch (err) {
      dispatchModal({ isLoading: false });
    }
  };

  const handleCloseModal = () =>
    dispatchModal({ isOpen: false, selectedPedido: null, detalles: [] });

  return {
    modalState,
    currentPage,
    setCurrentPage,
    isMobile,
    roleId,
    highlightedPedidoId,
    setHighlightedPedidoId,
    filters,
    handleFilterChange,
    filteredPedidos,
    status,
    total,
    filterOptions,
    handleVerDetalles,
    handleCloseModal,
    itemsPerPage,
  };
};
