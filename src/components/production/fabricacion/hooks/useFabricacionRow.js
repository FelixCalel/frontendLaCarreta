import { useState, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import {
  useUpdatePedidoProduccionMutation,
  useGetAlmacenesQuery,
} from "../../../../services/pedidoProductionApi";

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

export const useFabricacionRow = (order) => {
  const toast = useToast();
  const maxPedido = order.cantidadUnidad ?? 0;
  
  const [cant, setCant] = useState(order.cantidad ?? 0);
  const [desp, setDesp] = useState(order.despacho ?? 0);
  const [falt, setFalt] = useState(order.faltante ?? maxPedido - (order.cantidad ?? 0));
  
  const { data: almacenes = [] } = useGetAlmacenesQuery();
  const [updatePedido] = useUpdatePedidoProduccionMutation();

  const defaultAlmacenId = useMemo(() => {
    if (order.id_almacen) return String(order.id_almacen);
    if (order.almacen?.id) return String(order.almacen.id);
    if (order.codigoAlmacen && almacenes.length > 0) {
      const code = String(order.codigoAlmacen).trim();
      const match = almacenes.find(
        (a) => String(a.name).trim() === code || String(a.name).includes(code),
      );
      if (match) return String(match.id);
    }
    return "";
  }, [order.id_almacen, order.almacen, order.codigoAlmacen, almacenes]);

  const [almacenId, setAlmacenId] = useState(defaultAlmacenId);

  // Sync state with order changes
  const [prevOrderStats, setPrevOrderStats] = useState({
    cantidad: order.cantidad,
    despacho: order.despacho,
    faltante: order.faltante,
    maxPedido,
    defaultAlmacenId
  });

  if (
    order.cantidad !== prevOrderStats.cantidad ||
    order.despacho !== prevOrderStats.despacho ||
    order.faltante !== prevOrderStats.faltante ||
    maxPedido !== prevOrderStats.maxPedido ||
    defaultAlmacenId !== prevOrderStats.defaultAlmacenId
  ) {
    setPrevOrderStats({
      cantidad: order.cantidad,
      despacho: order.despacho,
      faltante: order.faltante,
      maxPedido,
      defaultAlmacenId
    });
    setCant(order.cantidad ?? 0);
    setDesp(order.despacho ?? 0);
    setFalt(order.faltante ?? maxPedido - (order.cantidad ?? 0));
    setAlmacenId(defaultAlmacenId);
  }

  const persist = (field, value) => {
    updatePedido({ id: order.id, data: { [field]: value } })
      .unwrap()
      .catch((err) => {
        console.error(`Error updating ${field}:`, err);
        toast({ title: "Error", description: `No se pudo actualizar ${field}`, status: "error" });
      });
  };

  const onCantidadChange = (raw) => {
    const v = clamp(Number(raw) || 0, 0, maxPedido);
    const nfalt = maxPedido - v;
    setCant(v);
    setFalt(nfalt);
    persist("cantidad", v);
    persist("faltante", nfalt);
  };

  const onDespachoChange = (raw) => {
    const v = clamp(Number(raw) || 0, 0, maxPedido);
    setDesp(v);
    persist("despacho", v);
  };

  const onFaltanteChange = (raw) => {
    const v = clamp(Number(raw) || 0, 0, maxPedido);
    setFalt(v);
    persist("faltante", v);
  };

  const handleAlmacenChange = async (newId) => {
    setAlmacenId(newId);
    try {
      await updatePedido({
        id: order.id,
        data: { id_almacen: newId ? Number(newId) : null },
      }).unwrap();
    } catch {
      setAlmacenId(order.id_almacen ? String(order.id_almacen) : "");
      toast({ title: "Error", description: "No se pudo actualizar el almacén", status: "error" });
    }
  };

  return {
    cant,
    desp,
    falt,
    almacenId,
    almacenes,
    onCantidadChange,
    onDespachoChange,
    onFaltanteChange,
    handleAlmacenChange,
    maxPedido
  };
};
