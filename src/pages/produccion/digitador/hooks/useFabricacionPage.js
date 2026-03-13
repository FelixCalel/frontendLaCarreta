import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetPedidosAgrupadosQuery,
  useAvanzarEtapaMutation,
  useAvanzarMultiEtapaDetalleMutation,
  useGetRecetaByPedidoQuery,
} from "../../../../services/pedidoProductionApi";

export const useFabricacionPage = () => {
  const { pedidoId: raw } = useParams();
  const pedidoId = Number(raw);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [term, setTerm] = useState("");
  const [estado, setEstado] = useState("");
  const [mesa, setMesa] = useState("");
  const [comment, setComment] = useState("");
  const [noComment, setNoComment] = useState(false);
  const [dateSAP, setDateSAP] = useState("");

  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery(undefined, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [avanzarEtapa, { isLoading: sendingPedido }] =
    useAvanzarEtapaMutation();
  const [avanzarMultiDetalle, { isLoading: sendingDetalles }] =
    useAvanzarMultiEtapaDetalleMutation();

  const group = useMemo(
    () => groups.find((g) => g.pedidoId === pedidoId),
    [groups, pedidoId],
  );
  const recipeOrderId = group?.items?.[0]?.id;
  const recetaArg = recipeOrderId
    ? { pedidoId: Number(recipeOrderId) }
    : skipToken;
  const { data: receta = [], isLoading: cargandoReceta } =
    useGetRecetaByPedidoQuery(recetaArg);

  const baseItems = useMemo(() => group?.items ?? [], [group]);
  const isSending = sendingPedido || sendingDetalles;

  const filtered = useMemo(() => {
    const txt = term.toLowerCase();
    return baseItems
      .filter((it) => {
        const byText =
          !term ||
          it.itemCode.toLowerCase().includes(txt) ||
          it.productoNombre.toLowerCase().includes(txt);
        const byEstado =
          !estado || (it.completo ? "Completado" : "Pendiente") === estado;
        const byMesa = !mesa || String(it.id_asigArea) === mesa;
        return byText && byEstado && byMesa;
      })
      .sort((a, b) =>
        a.productoNombre.localeCompare(b.productoNombre, "es", {
          sensitivity: "base",
        }),
      );
  }, [baseItems, term, estado, mesa]);

  const handleCargarSAP = async () => {
    if (!dateSAP) {
      toast({
        title: "Falta fecha",
        description: "Debe seleccionar una fecha de orden.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const usuarioId = Number(localStorage.getItem("usuarioId") ?? 1);
    const comentario = noComment ? null : comment.trim();
    const detalleIds = filtered.map((o) => o.id_detallePedido);
    const pId = Number(filtered[0]?.pedidoId ?? 0);
    const nuevaEtapaId = 4;

    try {
      if (detalleIds.length) {
        await avanzarMultiDetalle({
          detalleOrdenIds: detalleIds,
          usuarioId,
          nuevaEtapaId,
          comentario,
          fechaOrden: dateSAP,
        }).unwrap();
      }
      await avanzarEtapa({
        pedidoId: pId,
        usuarioId,
        nuevaEtapaId,
        comentario,
        fechaOrden: dateSAP,
      }).unwrap();

      toast({
        title: "Pedido enviado a SAP",
        status: "success",
        duration: 3500,
      });
      onClose();
      navigate(-1);
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.error || "No se pudo cargar a SAP.",
        status: "error",
        duration: 4000,
      });
    }
  };

  return {
    pedidoId,
    navigate,
    toast,
    term,
    setTerm,
    estado,
    setEstado,
    mesa,
    setMesa,
    comment,
    setComment,
    noComment,
    setNoComment,
    dateSAP,
    setDateSAP,
    isLoading,
    error,
    isSending,
    filtered,
    receta,
    cargandoReceta,
    isOpen,
    onOpen,
    onClose,
    handleCargarSAP,
  };
};
