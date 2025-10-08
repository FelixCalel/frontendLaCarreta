import { useState, useMemo } from "react";
import { Button, useDisclosure, useToast } from "@chakra-ui/react";
import {
  useAvanzarEtapaMutation,
  useAvanzarEtapaDetalleMutation,
  useAvanzarMultiEtapaDetalleMutation,
} from "../../services/pedidoProductionApi";
import FinalizeModal from "../../pages/produccion/supervisor/FinalizeModal";

const AcceptOrderButton = ({ order, onSuccess }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [avanzarEtapa, { isLoading: sendPedido }] = useAvanzarEtapaMutation();
  const [avanzarDetalle, { isLoading: sendOne }] = useAvanzarEtapaDetalleMutation();
  const [avanzarDetallesMultiples, { isLoading: sendMultiple }] =
    useAvanzarMultiEtapaDetalleMutation();
  const isSending = sendPedido || sendOne || sendMultiple;
  const [comment, setComment] = useState("");
  const [noComment, setNoComment] = useState(false);

  const allDone = useMemo(() => {
    if (!order || !order.items) return false;
    return order.items.every((i) => i.completo);
  }, [order]);

  const handleFinalizeClick = () => {
    if (!allDone) {
      toast({
        title: "Productos pendientes",
        description: "Todos los productos deben estar completados antes de finalizar.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setComment("");
    setNoComment(false);
    onOpen();
  };

  const handleAccept = async () => {
    if (!order) return;
    const usuarioId = Number(localStorage.getItem("usuarioId") ?? 1);
    const comentario = noComment ? null : comment.trim();
    const detalleIds = order.items.map((i) => i.id_detallePedido);

    try {
      if (detalleIds.length === 1) {
        await avanzarDetalle({ detalleOrdenId: detalleIds[0], usuarioId }).unwrap();
      } else {
        await avanzarDetallesMultiples({
          detalleOrdenIds: detalleIds,
          usuarioId,
        }).unwrap();
      }

      await avanzarEtapa({ pedidoId: Number(order.pedidoId), usuarioId, comentario }).unwrap();

      toast({
        title: "Pedido avanzado.",
        description: "Se cambió a la siguiente etapa correctamente.",
        status: "success",
        duration: 3500,
        isClosable: true,
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.error || "No se pudo avanzar de etapa.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button colorScheme="green" onClick={handleFinalizeClick}>
        Aceptar Pedido
      </Button>
      <FinalizeModal
        isOpen={isOpen}
        onClose={onClose}
        comment={comment}
        onChangeComment={setComment}
        noComment={noComment}
        onToggleNoComment={() => setNoComment(!noComment)}
        onAccept={handleAccept}
        isSending={isSending}
      />
    </>
  );
};

export default AcceptOrderButton;
