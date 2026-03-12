import { useState, useEffect, useMemo, useCallback, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useToast, useDisclosure } from "@chakra-ui/react";
import {
  tablaPedidos,
  togglePedidoStatus,
} from "../../../../store/Pedidos/thunks";
import { fetchCurrentUser } from "../../../../store/auth/thunks";
import { getDetalleOrdenByPedidoId } from "../../../../store/Pedidos/DetallePedidos/thunks";
import { tablaTienda } from "../../../../store/Tienda/thunks";
import { useWebSocket } from "../../../../providers/WebSocketProvider";

export const usePedidosEntrantes = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useToast();

  const { roleId: roleIdRedux, uid } = useSelector((state) => state.auth || {});
  const roleId = roleIdRedux ? parseInt(roleIdRedux, 10) : null;
  const usuarioId = uid ? parseInt(uid, 10) : null;

  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [highlightState, setHighlightState] = useReducer(
    (s, a) => ({ ...s, ...a }),
    { highlightedPedidoId: null }
  );

  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();
  const [cancelComment, setCancelComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onClose: onApproveClose,
  } = useDisclosure();
  const [approveData, setApproveData] = useState({
    fechaOrdenDisplay: "",
    comentarioDisplay: "",
    comentario: "",
  });

  const {
    data: pedidosEntrantesRaw,
    status,
    total,
  } = useSelector((state) => state.pedidos);
  const tiendas = useSelector((state) => state.tiendas.data);
  const user = useSelector((state) => state.auth.user);

  const pedidosEntrantes = useMemo(() => {
    if (!pedidosEntrantesRaw || !tiendas || !user) return [];
    const rutasUsuario = user.rutas || [];
    const rutasSet = new Set(
      Array.isArray(rutasUsuario)
        ? rutasUsuario.map((r) => (typeof r === "object" ? +r.id : +r))
        : []
    );
    const tiendaRutaMap = new Map(tiendas.map((t) => [t.id, +t.rutaId]));
    const userId = user.id || user.uid || (user.usuarioId ? parseInt(user.usuarioId) : null);

    return pedidosEntrantesRaw.filter((p) => {
      if (userId && p.usuarioId === userId) return true;
      if (!rutasUsuario.length) return false;
      const rutaTienda = tiendaRutaMap.get(p.tiendaId);
      return rutasSet.has(rutaTienda);
    });
  }, [pedidosEntrantesRaw, tiendas, user]);

  const isLoading = status === "loading";

  const refreshPedidos = useCallback(() => {
    dispatch(
      tablaPedidos({
        userId: usuarioId,
        roleId: roleId,
        status: 2,
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, usuarioId, roleId, currentPage]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(tablaTienda());
    refreshPedidos();
  }, [dispatch, currentPage, usuarioId, roleId, refreshPedidos]);

  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;
    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "notification" || data.type === "on-order-status-changed") {
          refreshPedidos();
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    socket.addEventListener("message", handleSocketMessage);
    return () => socket.removeEventListener("message", handleSocketMessage);
  }, [socket, refreshPedidos]);

  useEffect(() => {
    if (location.state?.highlightedPedidoId) {
      setHighlightState({ highlightedPedidoId: location.state.highlightedPedidoId });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (highlightState.highlightedPedidoId && pedidosEntrantes.length > 0) {
      const timerScroll = setTimeout(() => {
        const element = document.getElementById(`pedido-${highlightState.highlightedPedidoId}`);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      const timerClear = setTimeout(() => {
        setHighlightState({ highlightedPedidoId: null });
      }, 5000);
      return () => {
        clearTimeout(timerScroll);
        clearTimeout(timerClear);
      };
    }
  }, [highlightState.highlightedPedidoId, pedidosEntrantes]);

  const [modalState, dispatchModal] = useReducer(
    (s, a) => ({ ...s, ...a }),
    { isOpen: false, selectedPedido: null, detalles: [] }
  );

  const handleVerDetalles = async (pedido) => {
    dispatchModal({ selectedPedido: pedido });
    try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
      const detallesOrdenados = detalles.slice().sort((a, b) =>
        a.nombreProducto.localeCompare(b.nombreProducto, undefined, { sensitivity: "base" })
      );
      dispatchModal({ detalles: detallesOrdenados, isOpen: true });
    } catch (err) {
      toast({ title: "Error al cargar detalles", description: err.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleConfirmApprove = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedPedidos.map((id) => {
          const pedido = pedidosEntrantes.find((p) => p.id === id);
          if (!pedido) return Promise.resolve();
          const fecha = selectedPedidos.length === 1 ? approveData.fechaOrdenDisplay : (pedido.fechaOrdenDisplay?.split("T")[0]);
          return dispatch(
            togglePedidoStatus({
              id,
              estadoId: 3,
              comentarioDisplay: selectedPedidos.length === 1 ? approveData.comentarioDisplay : pedido.comentarioDisplay,
              comentario: selectedPedidos.length === 1 ? approveData.comentario : pedido.comentario,
              fechaOrdenDisplay: fecha,
            })
          ).unwrap();
        })
      );
      toast({ title: "Pedidos aprobados correctamente", status: "success" });
      setSelectedPedidos([]);
      refreshPedidos();
      onApproveClose();
    } catch (err) {
      toast({ title: "Error al aprobar pedidos", description: err.message, status: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkCancel = async () => {
    if (!cancelComment.trim()) return;
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedPedidos.map((id) => {
          const pedido = pedidosEntrantes.find((p) => p.id === id);
          return dispatch(
            togglePedidoStatus({
              id,
              estadoId: 4,
              comentario: cancelComment,
              comentarioDisplay: pedido?.comentarioDisplay,
              fechaOrdenDisplay: pedido?.fechaOrdenDisplay?.split("T")[0],
            })
          ).unwrap();
        })
      );
      toast({ title: "Pedidos cancelados correctamente", status: "info" });
      setSelectedPedidos([]);
      setCancelComment("");
      onCancelClose();
      refreshPedidos();
    } catch (err) {
      toast({ title: "Error al cancelar pedidos", description: err.message, status: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    pedidosEntrantes,
    total,
    currentPage,
    setCurrentPage,
    isLoading,
    selectedPedidos,
    setSelectedPedidos,
    highlightedPedidoId: highlightState.highlightedPedidoId,
    isCancelOpen,
    onCancelOpen,
    onCancelClose,
    cancelComment,
    setCancelComment,
    isProcessing,
    isApproveOpen,
    onApproveOpen,
    onApproveClose,
    approveData,
    setApproveData,
    modalState,
    dispatchModal,
    handleVerDetalles,
    handleConfirmApprove,
    handleBulkCancel,
  };
};
