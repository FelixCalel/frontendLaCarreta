import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import PedidoList from "./componentes/pageFormPedidos/PedidoList";
import NuevoPedidoModal from "./componentes/pageFormPedidos/crearPedidoModal";
import ConfirmarPedidoDialog from "./componentes/pageFormPedidos/ConfirmarPedidoDialog";
import { tablaPedidos } from "../../store/Pedidos/thunks";

const PageFormPedidos = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();

  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = Number(localStorage.getItem("usuarioId"));

  const [isPedidoFinalizado, setIsPedidoFinalizado] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  return (
    <Box mt={-8} p={-4}>
      <Button
        onClick={onOpen}
        colorScheme="green"
        mb={4}
        leftIcon={<AddIcon />}
        _hover={{
          transform: "scale(1.1)",
          transition: "0.2s",
          boxShadow: "lg",
        }}
        _active={{ transform: "scale(0.95)", transition: "0.1s" }}
        shadow="md"
      >
        Crear Pedido
      </Button>

      <PedidoList
        pedidos={pedidos}
        usuarioId={usuarioId}
        onDialogOpen={onDialogOpen}
        setSelectedPedidoId={setSelectedPedidoId}
      />

      <NuevoPedidoModal
        isOpen={isOpen}
        onClose={onClose}
        isPedidoFinalizado={isPedidoFinalizado}
        setIsPedidoFinalizado={setIsPedidoFinalizado}
      />

      <ConfirmarPedidoDialog
        isOpen={isDialogOpen}
        onClose={onDialogClose}
        cancelRef={cancelRef}
        pedidoId={selectedPedidoId}
        toast={toast}
      />
    </Box>
  );
};

export default PageFormPedidos;
