import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import {
  addNewDetalleOrden,
  deleteDetalleOrden,
  getPedidoModeloByUsuarioId,
  getDetalleOrdenByPedidoId,
  updateDetalleOrden,
} from "../../../../store/Pedidos/DetallePedidos/thunks";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeDetalle = (detalle) => ({
  ...detalle,
  detallePedidoId: detalle?.detallePedidoId ?? detalle?.id,
});

const parseCacheList = (cache) => {
  if (!cache) return null;
  try {
    const parsed = JSON.parse(cache);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const ordenarPorNombre = (arr) =>
  arr.slice().sort((a, b) =>
    (a?.nombreProducto || "").localeCompare(b?.nombreProducto || "", "es", {
      sensitivity: "base",
    })
  );

const getErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }
  if (typeof error?.error === "string" && error.error.trim()) {
    return error.error;
  }
  return fallback;
};

export const useProductosTable = (pedidoId, deudorId, tiendaId) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [dataState, setDataState] = useState({
    productos: [],
    isLoading: false,
  });
  const [resetFields, setResetFields] = useState(false);
  const [newProducto, setNewProducto] = useState({
    productoId: "",
    nombreProducto: "",
    cantidad: 0,
    cantidadDisponible: 0,
    codigo: "",
  });

  // Refs para evitar stale closures sin crear nuevas referencias en cada render
  const isMountedRef = useRef(true);
  const activeLoadRef = useRef(0);
  const isAddingRef = useRef(false);
  const pendingUpdatesRef = useRef(new Set());
  const pendingDeletesRef = useRef(new Set());
  // Refs estables hacia dispatch/toast para no incluirlos en deps de efectos
  const dispatchRef = useRef(dispatch);
  const toastRef = useRef(toast);
  useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ─── Carga de datos ────────────────────────────────────────────────────────
  // El efecto SOLO reacciona al cambio de IDs primitivos, no a callbacks
  useEffect(() => {
    const pid = Number(pedidoId);
    const did = Number(deudorId);
    const tid = Number(tiendaId);

    if (pid <= 0 || did <= 0 || tid <= 0) {
      setDataState({ productos: [], isLoading: false });
      return;
    }

    const loadId = ++activeLoadRef.current;
    setDataState((prev) => ({ ...prev, isLoading: true }));

    const run = async () => {
      try {
        const detallesRaw = await dispatchRef
          .current(getDetalleOrdenByPedidoId(pid))
          .unwrap();
        if (!isMountedRef.current || loadId !== activeLoadRef.current) return;

        const detalles = Array.isArray(detallesRaw)
          ? detallesRaw.map(normalizeDetalle)
          : [];

        let finalProductos = ordenarPorNombre(detalles);

        if (finalProductos.length === 0) {
          try {
            const modeloRaw = await dispatchRef
              .current(
                getPedidoModeloByUsuarioId({
                  deudorId: did,
                  pedidoId: pid,
                  tiendaId: tid,
                })
              )
              .unwrap();
            if (!isMountedRef.current || loadId !== activeLoadRef.current)
              return;
            finalProductos = ordenarPorNombre(
              Array.isArray(modeloRaw) ? modeloRaw.map(normalizeDetalle) : []
            );
          } catch (err_) {
            console.error("Error al cargar pedido modelo:", err_);
          }
        }

        if (!isMountedRef.current || loadId !== activeLoadRef.current) return;
        setDataState({ productos: finalProductos, isLoading: false });
        try {
          sessionStorage.setItem(
            `productos_${pid}`,
            JSON.stringify(finalProductos)
          );
        } catch {
          /* cache opcional */
        }
      } catch (error) {
        if (!isMountedRef.current || loadId !== activeLoadRef.current) return;
        console.error("Error al obtener detalles:", error);
        const cached = parseCacheList(
          sessionStorage.getItem(`productos_${pid}`)
        );
        setDataState({ productos: cached ?? [], isLoading: false });
      }
    };

    run();
    // Solo los IDs primitivos como dependencias — evita re-disparar por cambio de referencia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidoId, deudorId, tiendaId]);

  // ─── CRUD ──────────────────────────────────────────────────────────────────
  const reloadProductos = useCallback(() => {
    // Incrementar loadId para cancelar la carga anterior y forzar re-fetch
    activeLoadRef.current += 1;
    const pid = Number(pedidoId);
    const did = Number(deudorId);
    const tid = Number(tiendaId);
    if (pid <= 0 || did <= 0 || tid <= 0) return;

    const loadId = ++activeLoadRef.current;
    setDataState((prev) => ({ ...prev, isLoading: true }));

    const run = async () => {
      try {
        const raw = await dispatchRef
          .current(getDetalleOrdenByPedidoId(pid))
          .unwrap();
        if (!isMountedRef.current || loadId !== activeLoadRef.current) return;
        const lista = ordenarPorNombre(
          Array.isArray(raw) ? raw.map(normalizeDetalle) : []
        );
        setDataState({ productos: lista, isLoading: false });
        try {
          sessionStorage.setItem(`productos_${pid}`, JSON.stringify(lista));
        } catch {
          /* */
        }
      } catch {
        if (!isMountedRef.current || loadId !== activeLoadRef.current) return;
        setDataState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    run();
  }, [pedidoId, deudorId, tiendaId]);

  const onAddProducto = useCallback(async () => {
    if (!pedidoId || !newProducto.productoId || isAddingRef.current) return;

    const productoIdNuevo = Number(newProducto.productoId);
    const productoYaExiste = dataState.productos.some(
      (p) => Number(p?.productoId) === productoIdNuevo
    );
    if (productoYaExiste) {
      toastRef.current({
        title: "Producto duplicado",
        description: "Este producto ya está agregado al pedido.",
        status: "warning",
      });
      return;
    }

    const cantidad = toNumber(newProducto.cantidad);
    if (cantidad <= 0) {
      toastRef.current({
        title: "Cantidad inválida",
        description: "Debe ingresar una cantidad mayor a cero.",
        status: "warning",
      });
      return;
    }

    try {
      isAddingRef.current = true;
      const result = await dispatchRef
        .current(addNewDetalleOrden({ pedidoId, ...newProducto, cantidad }))
        .unwrap();

      // Fusionar nombre/código del selector si el backend no los devuelve al nivel raíz
      const upgraded = normalizeDetalle({
        ...result,
        nombreProducto: result.nombreProducto || newProducto.nombreProducto,
        codigo: result.codigo || newProducto.codigo,
      });
      setDataState((prev) => {
        const newList = ordenarPorNombre([...prev.productos, upgraded]);
        try {
          sessionStorage.setItem(
            `productos_${pedidoId}`,
            JSON.stringify(newList)
          );
        } catch {
          /* */
        }
        return { ...prev, productos: newList };
      });

      setResetFields((prev) => !prev);
      setNewProducto({
        productoId: "",
        nombreProducto: "",
        cantidad: 0,
        cantidadDisponible: 0,
        codigo: "",
      });
      toastRef.current({
        title: "Producto agregado",
        status: "success",
        duration: 1800,
      });
    } catch (error) {
      toastRef.current({
        title: "Error",
        description: getErrorMessage(error, "No se pudo agregar el producto."),
        status: "error",
      });
    } finally {
      isAddingRef.current = false;
    }
  }, [pedidoId, newProducto, dataState.productos]);

  const onUpdateCantidad = useCallback(
    async (item, newQuantity) => {
      const detallePedidoId = item?.detallePedidoId;
      if (!detallePedidoId || pendingUpdatesRef.current.has(detallePedidoId))
        return;

      const cantidadAnterior = toNumber(item?.cantidad);
      const cantidadActualizada = toNumber(newQuantity);
      pendingUpdatesRef.current.add(detallePedidoId);

      setDataState((prev) => {
        const newList = prev.productos.map((p) =>
          p.detallePedidoId === detallePedidoId
            ? { ...p, cantidad: cantidadActualizada }
            : p
        );
        try {
          sessionStorage.setItem(
            `productos_${pedidoId}`,
            JSON.stringify(newList)
          );
        } catch {
          /* */
        }
        return { ...prev, productos: newList };
      });

      try {
        await dispatchRef
          .current(
            updateDetalleOrden({
              id: detallePedidoId,
              pedidoId: Number(pedidoId),
              cantidad: cantidadActualizada,
            })
          )
          .unwrap();
        toastRef.current({
          title: "✓ Actualizado",
          status: "success",
          duration: 1200,
          isClosable: false,
          position: "bottom",
        });
      } catch (error) {
        setDataState((prev) => {
          const rollback = prev.productos.map((p) =>
            p.detallePedidoId === detallePedidoId
              ? { ...p, cantidad: cantidadAnterior }
              : p
          );
          return { ...prev, productos: rollback };
        });
        toastRef.current({
          title: "Error al actualizar",
          description: getErrorMessage(
            error,
            "No se pudo actualizar la cantidad."
          ),
          status: "error",
        });
      } finally {
        pendingUpdatesRef.current.delete(detallePedidoId);
      }
    },
    [pedidoId]
  );

  const onDeleteProducto = useCallback(
    async (item) => {
      const detallePedidoId = item?.detallePedidoId;
      if (!detallePedidoId || pendingDeletesRef.current.has(detallePedidoId))
        return;

      pendingDeletesRef.current.add(detallePedidoId);

      setDataState((prev) => {
        const newList = prev.productos.filter(
          (p) => p.detallePedidoId !== detallePedidoId
        );
        try {
          sessionStorage.setItem(
            `productos_${pedidoId}`,
            JSON.stringify(newList)
          );
        } catch {
          /* */
        }
        return { ...prev, productos: newList };
      });

      try {
        await dispatchRef.current(deleteDetalleOrden(detallePedidoId)).unwrap();
        toastRef.current({
          title: "Producto eliminado",
          status: "info",
          duration: 1600,
        });
      } catch (error) {
        setDataState((prev) => ({
          ...prev,
          productos: ordenarPorNombre([...prev.productos, item]),
        }));
        toastRef.current({
          title: "Error al eliminar",
          description: getErrorMessage(
            error,
            "No se pudo eliminar el producto."
          ),
          status: "error",
        });
      } finally {
        pendingDeletesRef.current.delete(detallePedidoId);
      }
    },
    [pedidoId]
  );

  return {
    dataState,
    newProducto,
    setNewProducto,
    resetFields,
    setResetFields,
    onAddProducto,
    onUpdateCantidad,
    onDeleteProducto,
    reloadProductos,
  };
};
