import { Box } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import HeaderButtons from "./componentes/pageFormPedidos/HeadersButtons";
import PedidosTable from "./componentes/pageFormPedidos/PedidosTable";
import PedidoModal from "./componentes/pageFormPedidos/crearPedidoModal";
import ConfirmDialog from "./componentes/pageFormPedidos/ConfirmarPedidoDialog";
import { deletePedido } from "../../store/Pedidos/thunks";
import { usePageFormPedidos } from "./hooks/usePageFormPedidos";

const PageFormPedidos = () => {
  const {
    isMobile,
    paisId,
    usuarioRutas,
    currentPedido,
    setCurrentPedido,
    dialogState,
    setDialogState,
    isLoading,
    isTienda1Disabled,
    setIsTienda1Disabled,
    isTienda2Disabled,
    setIsTienda2Disabled,
    isOpen,
    onOpen,
    onClose,
    isDialogOpen,
    onDialogOpen,
    onDialogClose,
    pedidosUsuario,
    usuarioId,
    handleSubmit,
    resetForm,
    copiarUltimoPedido,
    handleRealizarPedido,
  } = usePageFormPedidos();

  const dispatch = useDispatch();

  return (
    <Box mt={0} p={2}>
      <HeaderButtons onOpen={onOpen} />

      <PedidosTable
        pedidosUsuario={pedidosUsuario}
        isMobile={isMobile}
        isDetailsOpen={dialogState.isDetailsOpen}
        handleToggleDetails={(pedidoId) => {
          setDialogState((prev) => ({
            ...prev,
            isDetailsOpen: prev.isDetailsOpen === pedidoId ? null : pedidoId,
          }));
        }}
        handleDeletePedido={(pedidoId) => dispatch(deletePedido(pedidoId))}
        showRealizarPedidoConfirmation={(pedidoId) => {
          setDialogState((prev) => ({
            ...prev,
            selectedPedidoId: pedidoId,
            comentarioDialog: "",
            fechaDialog: "",
          }));
          onDialogOpen();
        }}
        deudorId={currentPedido.deudorId}
        tiendaId={currentPedido.tiendaId}
        usuarioId={usuarioId}
      />

      <PedidoModal
        isOpen={isOpen}
        onClose={onClose}
        isPedidoFinalizado={false}
        isLoading={isLoading}
        currentPedido={currentPedido}
        setCurrentPedido={setCurrentPedido}
        handleSubmit={handleSubmit}
        usuarioRutas={usuarioRutas}
        paisId={paisId || 0}
        usuarioId={usuarioId || 0}
        pedidoIdGuardado={dialogState.pedidoIdGuardado}
        isTienda1Disabled={isTienda1Disabled}
        isTienda2Disabled={isTienda2Disabled}
        setIsTienda1Disabled={setIsTienda1Disabled}
        setIsTienda2Disabled={setIsTienda2Disabled}
        resetForm={resetForm}
        copiarUltimoPedido={copiarUltimoPedido}
      />

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={onDialogClose}
        onConfirm={handleRealizarPedido}
        fecha={dialogState.fechaDialog}
        setFecha={(val) =>
          setDialogState((prev) => ({ ...prev, fechaDialog: val }))
        }
        comentario={dialogState.comentarioDialog}
        setComentario={(val) =>
          setDialogState((prev) => ({ ...prev, comentarioDialog: val }))
        }
      />
    </Box>
  );
};

export default PageFormPedidos;
