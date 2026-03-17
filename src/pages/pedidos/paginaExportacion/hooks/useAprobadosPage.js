import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast, useDisclosure } from "@chakra-ui/react";
import { useWebSocket } from "../../../../providers/WebSocketProvider";
import {
  togglePedidoStatus,
  tablaPedidos,
  updatePedidoActivacion,
  exportarPedidoSap,
} from "../../../../store/Pedidos/thunks";
import { removePedidos } from "../../../../store/Pedidos/pedidoSlice";
import { tablaEmpresa } from "../../../../store/Empresa/thunks";
import { tablaTienda } from "../../../../store/Tienda/thunks";
import { getDetalleOrdenByPedidoId } from "../../../../store/Pedidos/DetallePedidos/thunks";
import { generarYDescargarExcelFormato2 } from "../utils/exportExcelService";

export const useAprobadosPage = () => {
  const { socket } = useWebSocket();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isExportDlgOpen, onOpen: openExportDlg, onClose: closeExportDlg } = useDisclosure();

  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPedidosToRevert, setSelectedPedidosToRevert] = useState([]);
  const [isReverting, setIsReverting] = useState(false);
  const [exportVariant, setExportVariant] = useState("f1");

  const pedidos = useSelector((state) => state.pedidos.data);
  const tiendas = useSelector((state) => state.tiendas.data);
  const user = useSelector((state) => state.auth.user);

  const confirmExportRef = useRef(() => {});

  const pedidosAprobados = useMemo(() => {
    if (!pedidos || !tiendas || !user) return [];
    const rutasUsuario = user.rutas || [];
    const rutasSet = new Set(Array.isArray(rutasUsuario) ? rutasUsuario.map((r) => +r.id || +r) : []);
    const tiendaRutaMap = new Map(tiendas.map((t) => [t.id, +t.rutaId]));
    const userId = user.id || user.uid || (user.usuarioId ? parseInt(user.usuarioId) : null);

    return pedidos.filter((p) => {
      if (p.estadoId !== 3) return false;
      if (userId && p.usuarioId === userId) return true;
      if (!rutasUsuario.length) return false;
      return rutasSet.has(tiendaRutaMap.get(p.tiendaId));
    }).sort((a, b) => b.id - a.id);
  }, [pedidos, tiendas, user]);

  useEffect(() => {
    dispatch(tablaPedidos({ status: 3, limit: 20 }));
    dispatch(tablaTienda());
    dispatch(tablaEmpresa());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;
    const handleMsg = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "on-order-status-changed") dispatch(tablaPedidos({ status: 3, limit: 20 }));
      } catch (err) { console.error(err); }
    };
    socket.addEventListener("message", handleMsg);
    return () => socket.removeEventListener("message", handleMsg);
  }, [socket, dispatch]);

  const pedirConfirmacion = (variant) => new Promise((res) => {
    setExportVariant(variant);
    confirmExportRef.current = res;
    openExportDlg();
  });

  const handleExport = async () => {
    if (pedidosAprobados.length === 0) {
      toast({ title: "Sin pedidos aprobados", status: "info" });
      return;
    }
    if (!(await pedirConfirmacion("f2"))) return;
    setIsExporting(true);
    try {
      const ids = selectedPedidosToRevert.length > 0 ? selectedPedidosToRevert : undefined;
      const sapResult = await dispatch(exportarPedidoSap(ids)).unwrap();
      const results = Array.isArray(sapResult) ? sapResult : [];
      const successfulExports = results.filter((r) => r.status === "SUCCESS");
      
      results.filter(r => r.status === "ERROR").forEach(fail => {
        toast({ title: `Error en Pedido #${fail.pedidoId}`, description: fail.message || "Error SAP", status: "warning" });
      });

      if (successfulExports.length > 0) {
        const successfulIds = successfulExports.map(r => r.pedidoId);
        const successfulPedidos = pedidosAprobados.filter(p => successfulIds.includes(p.id));
        const conDetalles = await Promise.all(successfulPedidos.map(async p => ({
          ...p, detalles: (await dispatch(getDetalleOrdenByPedidoId(p.id)).unwrap()) || []
        })));
        await generarYDescargarExcelFormato2(conDetalles);
        await Promise.all(successfulPedidos.map(p => dispatch(updatePedidoActivacion({ id: p.id, isActive: false })).unwrap()));
        dispatch(removePedidos(successfulIds));
        toast({ title: "Exportación completada", description: `Se exportaron ${successfulPedidos.length} pedidos.`, status: "success" });
      }
    } catch (err) {
      toast({ title: "Error inesperado", description: err.message, status: "error" });
    } finally { setIsExporting(false); }
  };

  const handleRevert = async () => {
    if (selectedPedidosToRevert.length === 0) {
      toast({ title: "Sin selección", status: "warning" });
      return;
    }
    setIsReverting(true);
    try {
      const results = await Promise.allSettled(selectedPedidosToRevert.map(id => {
        const p = pedidosAprobados.find(x => x.id === id);
        return dispatch(togglePedidoStatus({ id, estadoId: 2, comentario: p?.comentario || "", comentarioDisplay: p?.comentarioDisplay || "", fechaOrdenDisplay: p?.fechaOrdenDisplay || p?.fechaOrden })).unwrap();
      }));
      const successCount = results.filter(r => r.status === "fulfilled").length;
      if (successCount > 0) {
        toast({ title: "Operación completada", description: `${successCount} pedidos regresados.`, status: "success" });
        setSelectedPedidosToRevert([]);
        dispatch(tablaPedidos({ status: 3, limit: 20 }));
      }
    } finally { setIsReverting(false); }
  };

  const handleVerDetalles = async (id) => {
    try {
      const deta = await dispatch(getDetalleOrdenByPedidoId(id)).unwrap();
      setDetallesPedido(deta.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)));
      const p = pedidos.find(x => x.id === id);
      if (p) { setSelectedPedido(p); onOpen(); }
    } catch (err) { toast({ title: "Error", description: "No se pudieron cargar los detalles", status: "error" }); }
  };

  return {
    pedidosAprobados,
    selectedPedido, detallesPedido,
    isExporting, isReverting,
    selectedPedidosToRevert, setSelectedPedidosToRevert,
    isOpen, onOpen, onClose,
    isExportDlgOpen, openExportDlg, closeExportDlg,
    exportVariant, confirmExportRef,
    handleExport, handleRevert, handleVerDetalles
  };
};
