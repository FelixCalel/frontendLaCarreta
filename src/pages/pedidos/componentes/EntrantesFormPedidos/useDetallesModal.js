import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import {
  addNewDetalleOrden,
  deleteDetalleOrden,
  getDetalleOrdenByPedidoId,
  updateDetalleOrden,
} from "../../../../store/Pedidos/DetallePedidos/thunks";

export const useDetallesModal = (pedido, detallesInput, onClose) => {
  const detalles = useMemo(() => detallesInput ?? [], [detallesInput]);
  const dispatch = useDispatch();
  const toast = useToast();

  const [newProducto, setNewProducto] = useState({
    productoId: "",
    nombreProducto: "",
    cantidadDisponible: "",
    codigo: "",
  });
  const [cantidadAgregar, setCantidadAgregar] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState({});
  const [resetFields, setResetFields] = useState(false);
  const [detallesLocal, setDetallesLocal] = useState(detalles);
  const [editCantidad, setEditCantidad] = useState({});

  useEffect(() => {
    setDetallesLocal(Array.isArray(detalles) ? detalles : []);
  }, [detalles]);

  useEffect(() => {
    if (!pedido || !onClose) return;

    const originalOnClose = onClose;
    return () => {
      if (!originalOnClose) return;
      setEditCantidad({});
      setCantidadAgregar("");
    };
  }, [pedido, onClose]);

  const refreshDetalles = async () => {
    if (!pedido?.id) return;
    const data = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
    const ordenados = (Array.isArray(data) ? data : [])
      .slice()
      .sort((a, b) => a.id - b.id);
    setDetallesLocal(ordenados);
  };

  const handleAddProducto = async () => {
    if (!pedido?.id || !newProducto?.productoId || !cantidadAgregar) return;

    setLoading(true);
    try {
      await dispatch(
        addNewDetalleOrden({
          pedidoId: pedido.id,
          productoId: Number(newProducto.productoId),
          cantidad: Number(cantidadAgregar),
        }),
      ).unwrap();

      await refreshDetalles();

      setCantidadAgregar("");
      setNewProducto({
        productoId: "",
        nombreProducto: "",
        cantidadDisponible: "",
        codigo: "",
      });
      setResetFields((prev) => !prev);

      toast({
        title: "Producto agregado",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "No se pudo agregar el producto",
        description: error?.message || "Error inesperado",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCantidadConfirm = async (detalleId) => {
    if (!pedido?.id) return;

    const cantidad = editCantidad[detalleId];
    if (cantidad === undefined || cantidad === null || cantidad === "") return;

    setLoadingDetalle((prev) => ({ ...prev, [detalleId]: true }));
    try {
      await dispatch(
        updateDetalleOrden({
          id: detalleId,
          pedidoId: pedido.id,
          cantidad: Number(cantidad),
        }),
      ).unwrap();

      setDetallesLocal((prev) =>
        prev.map((item) =>
          item.id === detalleId
            ? { ...item, cantidad: Number(cantidad) }
            : item,
        ),
      );

      setEditCantidad((prev) => {
        const next = { ...prev };
        delete next[detalleId];
        return next;
      });
    } catch (error) {
      toast({
        title: "No se pudo actualizar la cantidad",
        description: error?.message || "Error inesperado",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingDetalle((prev) => ({ ...prev, [detalleId]: false }));
    }
  };

  const handleRemoveProducto = async (detalleId) => {
    setLoadingDetalle((prev) => ({ ...prev, [detalleId]: true }));
    try {
      await dispatch(deleteDetalleOrden(detalleId)).unwrap();
      setDetallesLocal((prev) => prev.filter((item) => item.id !== detalleId));

      toast({
        title: "Producto eliminado",
        status: "info",
        duration: 2500,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "No se pudo eliminar el producto",
        description: error?.message || "Error inesperado",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingDetalle((prev) => ({ ...prev, [detalleId]: false }));
    }
  };

  return {
    newProducto,
    setNewProducto,
    cantidadAgregar,
    setCantidadAgregar,
    loading,
    loadingDetalle,
    resetFields,
    detallesLocal,
    editCantidad,
    setEditCantidad,
    handleAddProducto,
    handleCantidadConfirm,
    handleRemoveProducto,
  };
};
