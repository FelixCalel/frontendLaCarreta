import { useState, useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useToast, useDisclosure } from "@chakra-ui/react";
import {
  useAvanzarMultiEtapaDetalleMutation,
  useExportarOrdenFabricacionSAPMutation,
} from "../../../services/pedidoProductionApi";

export const useConsolidatedOrders = (data, actionLabel) => {
  const [visibleLimit, setVisibleLimit] = useState(20);
  const prevData = useRef(data);
  
  if (data !== prevData.current) {
    prevData.current = data;
    setVisibleLimit(20);
  }

  const loadMore = () => {
    setVisibleLimit((prev) => Math.min(prev + 50, data.length));
  };

  const [expandedState, setExpandedState] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [comment, setComment] = useState("");
  const [dateSAP, setDateSAP] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [avanzarMultiDetalle, { isLoading: isSending }] = useAvanzarMultiEtapaDetalleMutation();
  const [exportarSAP, { isLoading: isExportingSAP }] = useExportarOrdenFabricacionSAPMutation();

  const empresas = useSelector((state) => state.empresas?.data || []);
  const authState = useSelector((state) => state.auth || {});

  const toggleExpansion = useCallback((id) => {
    setExpandedState((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      setSelectedItems(new Set(data.map((item) => item.productoNombre)));
    } else {
      setSelectedItems(new Set());
    }
  }, [data]);

  const handleSelectItem = useCallback((id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const handleSendToSap = () => {
    if (selectedItems.size === 0) return;
    let existingDate = "";
    let existingComment = "";

    for (const group of data) {
      if (selectedItems.has(group.productoNombre)) {
        const firstItem = group.originalItems[0];
        if (firstItem) {
          existingDate = (firstItem.fecha_orden_sap || firstItem.fechaOrden)?.split("T")[0] || "";
          existingComment = firstItem.comentario_sap || firstItem.comentario || "";
        }
        break;
      }
    }
    setDateSAP(existingDate || new Date().toISOString().split("T")[0]);
    setComment(existingComment);
    onOpen();
  };

  const confirmSendToSap = async () => {
    if (!dateSAP) return;
    const isDigitadorToSAP = actionLabel.toLowerCase().includes("sap");
    if (isDigitadorToSAP && !comment.trim()) return;

    const detailsToSend = [];
    const pedidoIds = new Set();
    data.forEach((group) => {
      if (selectedItems.has(group.productoNombre)) {
        group.originalItems.forEach((item) => {
          if (item.id_detallePedido) detailsToSend.push(item.id_detallePedido);
          if (item.id) pedidoIds.add(item.id);
        });
      }
    });

    try {
      if (isDigitadorToSAP) {
        let paisId = localStorage.getItem("paisId") || authState.paisId || authState.user?.paisId;
        const emp = empresas.find((e) => e.paisId == paisId && e.estaActivo);
        if (!emp) return;

        const resultSAP = await exportarSAP({
          dbsap: emp.baseDatos,
          ipsap: emp.ipBaseDatos,
          ids: Array.from(pedidoIds),
          fecha: dateSAP,
          comentario: comment,
        }).unwrap();

        const successfulPedidoIds = new Set(resultSAP.enviados?.filter((r) => r.status === "SUCCESS").map((r) => r.pedidoId) || []);
        if (successfulPedidoIds.size > 0) {
          setSelectedItems(new Set());
          onClose();
        }
      } else {
        await avanzarMultiDetalle({
          detalleOrdenIds: detailsToSend,
          usuarioId: Number(localStorage.getItem("usuarioId") ?? 1),
          nuevaEtapaId: 4,
          comentario: comment || null,
          fechaOrden: dateSAP,
          avanzar: true,
        }).unwrap();
        setSelectedItems(new Set());
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    visibleData: data.slice(0, visibleLimit),
    hasMore: visibleLimit < data.length,
    loadMore,
    expandedState,
    toggleExpansion,
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    isOpen,
    onClose,
    comment,
    setComment,
    dateSAP,
    setDateSAP,
    handleSendToSap,
    confirmSendToSap,
    isProcessing: isSending || isExportingSAP,
  };
};
