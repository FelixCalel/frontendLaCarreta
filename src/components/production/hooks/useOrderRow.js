import { useState, useEffect, useMemo } from "react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import {
  useGetDetallesYProduccionQuery,
  useUpdatePedidoProduccionMutation,
  useGetRecetaByPedidoQuery,
  useGetPedidosAgrupadosQuery,
  useCreateRechazoMutation,
  useUpdateRechazoMutation,
  useGetRechazoByPedidoProduccionIdQuery,
} from "../../../services/pedidoProductionApi";
import { skipToken } from "@reduxjs/toolkit/query";

export const useOrderRow = (order, isExpanded) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const shouldFetch = isExpanded;

  const { data: rechazoData } = useGetRechazoByPedidoProduccionIdQuery(
    order.id,
    {
      skip: !order.id,
    },
  );
  const rechazoQty = rechazoData?.cantidadRechazada || 0;

  const recetaArg = shouldFetch ? { pedidoId: Number(order.id) } : skipToken;
  const {
    data: receta = [],
    isLoading: loadingReceta,
    isSuccess,
  } = useGetRecetaByPedidoQuery(recetaArg);

  const [updatePedido] = useUpdatePedidoProduccionMutation();
  const [createRechazo, { isLoading: isCreatingRechazo }] =
    useCreateRechazoMutation();
  const [updateRechazo, { isLoading: isUpdatingRechazo }] =
    useUpdateRechazoMutation();
  const { data: groupedOrders = [] } = useGetPedidosAgrupadosQuery();

  const consolidatedKey = `${order.deudorCodigo || ""}|${order.productoNombre || ""}`;
  const siblingOrders = useMemo(() => {
    const allOrders = groupedOrders.flatMap((group) => group.items || []);
    const matches = allOrders.filter(
      (item) =>
        `${item.deudorCodigo || ""}|${item.productoNombre || ""}` ===
        consolidatedKey,
    );

    if (!matches.some((item) => Number(item.id) === Number(order.id))) {
      matches.push(order);
    }

    const dedup = new Map();
    matches.forEach((item) => {
      dedup.set(Number(item.id), item);
    });

    return Array.from(dedup.values());
  }, [groupedOrders, consolidatedKey, order]);

  const modalAnchorOrder = useMemo(() => {
    return (
      siblingOrders.find(
        (item) =>
          Number(item?.cantidadRechazada) > 0 || Number(item?.rechazoId) > 0,
      ) || order
    );
  }, [siblingOrders, order]);

  const consolidatedMaxQuantity = useMemo(
    () =>
      siblingOrders.reduce(
        (sum, item) => sum + (Number(item?.cantidadUnidad) || 0),
        0,
      ),
    [siblingOrders],
  );

  const consolidatedMpUtilizada = useMemo(
    () =>
      siblingOrders.reduce(
        (sum, item) => sum + (Number(item?.mpUtilizada) || 0),
        0,
      ),
    [siblingOrders],
  );

  const [isPTMQ, setIsPTMQ] = useState(order.ptmq ?? false);
  const [cantidadLocal, setCantidadLocal] = useState(
    Number(order.cantidad) || 0,
  );
  const [faltanteLocal, setFaltanteLocal] = useState(
    (Number(order.cantidadUnidad) || 0) - (Number(order.cantidad) || 0),
  );

  const {
    data: details = [],
    isLoading: loadingDetalles,
    refetch: refetchDetalles,
  } = useGetDetallesYProduccionQuery(shouldFetch ? order.id : skipToken);

  useEffect(() => {
    setCantidadLocal((order.cantidad ?? 0) + rechazoQty);
    setFaltanteLocal(
      (order.cantidadUnidad ?? 0) - ((order.cantidad ?? 0) + rechazoQty),
    );
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
      const totalRejection = Number(formData.cantidadRechazada) || 0;
      let remainingRejection = totalRejection;

      for (const sibling of siblingOrders) {
        const siblingCapacity = Math.max(
          0,
          (Number(sibling.cantidadUnidad) || 0) -
            (Number(sibling.mpUtilizada) || 0),
        );
        const amount = Math.min(remainingRejection, siblingCapacity);

        const payload = {
          ...formData,
          cantidadRechazada: amount,
        };

        if (Number(sibling.rechazoId) > 0) {
          await updateRechazo({
            id: Number(sibling.rechazoId),
            data: payload,
            id_pedidoProd: Number(sibling.id),
          }).unwrap();
        } else if (amount > 0) {
          await createRechazo({
            ...payload,
            id_pedidoProd: Number(sibling.id),
          }).unwrap();
        }

        remainingRejection -= amount;
      }

      if (remainingRejection > 0) {
        toast({
          title: "Cantidad parcial aplicada",
          description:
            "La salida excede la capacidad disponible del consolidado.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
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
    modalPedidoProduccionId: Number(modalAnchorOrder?.id) || Number(order.id),
    modalMaxQuantity:
      consolidatedMaxQuantity || Number(order.cantidadUnidad) || 0,
    modalCurrentMpUtilizada: consolidatedMpUtilizada,
    isOpen,
    onOpen,
    onClose,
    isSavingRechazo: isCreatingRechazo || isUpdatingRechazo,
  };
};
