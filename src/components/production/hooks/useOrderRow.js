import { useState, useEffect } from "react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import {
  useGetDetallesYProduccionQuery,
  useUpdatePedidoProduccionMutation,
  useGetRecetaByPedidoQuery,
  useCreateRechazoMutation,
  useUpdateRechazoMutation,
  useGetRechazoByPedidoProduccionIdQuery,
} from "../../../services/pedidoProductionApi";
import { skipToken } from "@reduxjs/toolkit/query";

export const useOrderRow = (order, isExpanded) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const shouldFetch = isExpanded;

  const { data: rechazoData } = useGetRechazoByPedidoProduccionIdQuery(order.id, {
    skip: !order.id,
  });
  const rechazoQty = rechazoData?.cantidadRechazada || 0;

  const recetaArg = shouldFetch ? { pedidoId: Number(order.id) } : skipToken;
  const {
    data: receta = [],
    isLoading: loadingReceta,
    isSuccess,
  } = useGetRecetaByPedidoQuery(recetaArg);

  const [updatePedido] = useUpdatePedidoProduccionMutation();
  const [createRechazo, { isLoading: isCreatingRechazo }] = useCreateRechazoMutation();
  const [updateRechazo, { isLoading: isUpdatingRechazo }] = useUpdateRechazoMutation();

  const [isPTMQ, setIsPTMQ] = useState(order.ptmq ?? false);
  const [cantidadLocal, setCantidadLocal] = useState(Number(order.cantidad) || 0);
  const [faltanteLocal, setFaltanteLocal] = useState(
    (Number(order.cantidadUnidad) || 0) - (Number(order.cantidad) || 0)
  );

  const {
    data: details = [],
    isLoading: loadingDetalles,
    refetch: refetchDetalles,
  } = useGetDetallesYProduccionQuery(shouldFetch ? order.id : skipToken);

  useEffect(() => {
    setCantidadLocal((order.cantidad ?? 0) + rechazoQty);
    setFaltanteLocal((order.cantidadUnidad ?? 0) - ((order.cantidad ?? 0) + rechazoQty));
  }, [order.cantidad, order.cantidadUnidad, rechazoQty]);

  useEffect(() => setIsPTMQ(order.ptmq), [order.ptmq]);

  useEffect(() => {
    if (shouldFetch) refetchDetalles?.();
  }, [shouldFetch, refetchDetalles]);

  useEffect(() => {
    if (isSuccess && receta.length === 0 && !order.ptmq) {
      updatePedido({ id: order.id, data: { ptmq: true } }).catch(() => {});
    }
  }, [isSuccess, receta.length, order.ptmq, order.id, updatePedido]);

  const [completoLocal, setCompletoLocal] = useState(order.completo);
  useEffect(() => setCompletoLocal(order.completo), [order.completo]);

  const handlePTMQToggle = async (checked) => {
    try {
      await updatePedido({ id: order.id, data: { ptmq: checked } }).unwrap();
      setIsPTMQ(checked);
    } catch {
      setIsPTMQ(order.ptmq);
    }
  };

  const handleUpdateStats = (newCantidad, newFaltante) => {
    setCantidadLocal(() => newCantidad + rechazoQty);
    setFaltanteLocal(() => newFaltante);
  };

  const handleCompletoChange = (checked) => {
    setCompletoLocal(checked);
    updatePedido({ id: order.id, data: { completo: checked } })
      .unwrap()
      .catch(() => setCompletoLocal(!checked));
  };

  const handleSaveRechazo = async ({ formData, existingRechazo }) => {
    try {
      if (existingRechazo) {
        await updateRechazo({ id: existingRechazo.id, data: formData, id_pedidoProd: order.id }).unwrap();
      } else {
        await createRechazo({ ...formData, id_pedidoProd: order.id }).unwrap();
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    rechazoQty,
    receta,
    loadingReceta,
    isPTMQ,
    cantidadLocal,
    faltanteLocal,
    details,
    loadingDetalles,
    completoLocal,
    handlePTMQToggle,
    handleUpdateStats,
    handleCompletoChange,
    handleSaveRechazo,
    isOpen, onOpen, onClose,
    isSavingRechazo: isCreatingRechazo || isUpdatingRechazo
  };
};
