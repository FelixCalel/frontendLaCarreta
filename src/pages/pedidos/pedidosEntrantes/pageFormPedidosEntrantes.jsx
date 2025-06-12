import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Spinner,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaPedidos,
  togglePedidoStatus,
  updatePedidoActivacion,
} from "../../../store/Pedidos/thunks";
import PedidosTable from "../componentes/EntrantesFormPedidos/PedidosTable";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import {
  getDetalleOrdenByPedidoId,
  actualizarFechaOrden,
} from "../../../store/Pedidos/DetallePedidos/thunks";
import ApproveOrderDialog from "../componentes/EntrantesFormPedidos/ApproveOrderDialog";
import { selectPedidosEntrantesPorRuta } from "./componentes/rutaSelectors";
import { tablaTienda } from "../../../store/Tienda/thunks";
//import { format } from "date-fns";
const EntrantesPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const pedidos = useSelector((state) => state.pedidos.data);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onClose: onApproveClose,
  } = useDisclosure();
  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();

  useEffect(() => {
    dispatch(tablaTienda());
    dispatch(tablaPedidos());
  }, [dispatch]);

  const todosLosPedidos = useSelector((s) => s.pedidos.data);
  useEffect(() => {
    const candidatos = todosLosPedidos.filter((p) => p.estadoId === 2);
    console.log(
      "Pedidos con estadoId 2:",
      candidatos.map((p) => ({
        id: p.id,
        tiendaId: p.tiendaId,
      }))
    );
  }, [todosLosPedidos]);

  const tiendas = useSelector((s) => s.tiendas.data ?? []);
  useEffect(() => {
    console.log("Tiendas en Redux:", tiendas.slice(0, 5));
  }, [tiendas]);

  useEffect(() => {
    const tienda1 = tiendas.find((t) => t.id === 1);
    const tienda12 = tiendas.find((t) => t.id === 12);
    console.log("Tienda 1:", tienda1);
    console.log("Tienda 12:", tienda12);
  }, [tiendas]);

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [selectedPedidos.length, dispatch]);

  useEffect(() => {
    if (pedidos.length) console.log("Ejemplo de pedido:", pedidos[0]);
  }, [pedidos]);

  const handleConfirmApprove = async ({ fechaOrden, comentario }) => {
    setIsApproving(true);
    try {
      for (const pedidoId of selectedPedidos) {
        await dispatch(
          actualizarFechaOrden({
            pedidoId,
            fechaOrden,
            comentario,
          })
        ).unwrap();
        await dispatch(
          togglePedidoStatus({
            id: pedidoId,
            estadoId: 3,
          })
        ).unwrap();

        const pedido = pedidos.find((p) => p.id === pedidoId);
        if (pedido && !pedido.isActive) {
          await dispatch(
            updatePedidoActivacion({ id: pedidoId, isActive: true })
          ).unwrap();
        }
      }

      await dispatch(tablaPedidos());

      setSelectedPedidos([]);
      toast({
        title: "Pedidos aprobados",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al aprobar pedidos:", error);
      toast({
        title: "Error",
        description: error.message || "Hubo un error al aprobar pedidos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsApproving(false);
      onApproveClose();
    }
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      await handleCancelarPedidos();
    } catch (error) {
      console.error("Error al cancelar pedidos:", error);
    } finally {
      setIsCancelling(false);
      onCancelClose();
    }
  };

  const handleCancelarPedidos = async () => {
    setIsLoading(true);
    try {
      for (const pedidoId of selectedPedidos) {
        await dispatch(togglePedidoStatus({ id: pedidoId, estadoId: 4 }));
      }
      setSelectedPedidos([]);
      toast({
        title: "Pedidos cancelados",
        description: "Los pedidos seleccionados han sido cancelados.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al cancelar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerDetalles = async (pedidoId) => {
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedidoId)
      ).unwrap();

      detalles.sort(
        (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
      );
      setDetallesPedido(detalles);

      const pedido = pedidos.find((p) => p.id === pedidoId);

      if (!pedido) {
        console.error(`No se encontró el pedido con ID ${pedidoId}`);
        toast({
          title: "Error",
          description: `No se encontró el pedido con ID ${pedidoId}.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setSelectedPedido(pedido);
      setIsModalOpen(true);
    } catch (error) {
      console.error(
        `Error al obtener los detalles del pedido ${pedidoId}:`,
        error
      );
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const pedidosFiltrados = useSelector(selectPedidosEntrantesPorRuta());

  const handleCloseApproveDialog = () => {
    onApproveClose();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  return (
    <Box p={6} boxShadow="xl" bg={bgColor} color={textColor} rounded="lg">
      <Flex justify="space-between" mb={3}>
        <Heading as="h2" size="lg">
          Listado de Pedidos Entrantes
        </Heading>
        <Flex>
          <Button
            colorScheme="green"
            mr={4}
            onClick={onApproveOpen}
            isDisabled={
              selectedPedidos.length === 0 || isLoading || isApproving
            }
          >
            {isApproving ? <Spinner size="sm" /> : "Aprobar Pedidos"}
          </Button>
          <Button
            colorScheme="red"
            onClick={onCancelOpen}
            isDisabled={
              selectedPedidos.length === 0 || isLoading || isCancelling
            }
          >
            {isCancelling ? <Spinner size="sm" /> : "Cancelar Pedidos"}
          </Button>
          <ApproveOrderDialog
            isOpen={isApproveOpen}
            onClose={handleCloseApproveDialog}
            onConfirm={handleConfirmApprove}
            selectedPedidos={selectedPedidos}
          />
          <AlertDialog isOpen={isCancelOpen} onClose={onCancelClose} isCentered>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Cancelar Pedidos
                </AlertDialogHeader>
                <AlertDialogBody>
                  ¿Estás seguro de que deseas cancelar los pedidos
                  seleccionados?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={onCancelClose}>
                    Cerrar
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleConfirmCancel}
                    ml={3}
                  >
                    Cancelar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Flex>
      </Flex>
      <PedidosTable
        pedidosEntrantes={pedidosFiltrados}
        selectedPedidos={selectedPedidos}
        setSelectedPedidos={setSelectedPedidos}
        handleVerDetalles={handleVerDetalles}
      />
      <DetallesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        detalles={detallesPedido}
        pedido={selectedPedido}
      />
    </Box>
  );
};

export default EntrantesPage;
