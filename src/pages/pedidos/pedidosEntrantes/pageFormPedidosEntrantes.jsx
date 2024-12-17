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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaPedidos,
  togglePedidoStatus,
} from "../../../store/Pedidos/thunks";
import PedidosTable from "../componentes/EntrantesFormPedidos/PedidosTable";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";
import ApproveOrderDialog from "../componentes/EntrantesFormPedidos/ApproveOrderDialog";
const EntrantesPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Estados globales y locales
  const pedidos = useSelector((state) => state.pedidos.data);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pedidosEntrantes = pedidos.filter((pedido) => pedido.estadoId === 2);
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

  // Carga inicial de datos
  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  const handleConfirmApprove = async (orderDate) => {
    setIsApproving(true);
    try {
      await handleAprobarPedidos(orderDate);
      onApproveClose(); 
    } catch (error) {
      console.error("Error al aprobar pedidos:", error);
    } finally {
      setIsApproving(false);
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

  // Funciones para manejar la aprobación y cancelación de pedidos
  const handleAprobarPedidos = async (orderDate) => {
    setIsLoading(true);
    try {
      for (const pedidoId of selectedPedidos) {
        await dispatch(
          togglePedidoStatus({ id: pedidoId, estadoId: 3, orderDate })
        );
      }
      setSelectedPedidos([]);
      toast({
        title: "Pedidos aprobados",
        description: "Los pedidos seleccionados han sido aprobados.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al aprobar pedidos:", error);
    } finally {
      setIsLoading(false);
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

  // Funciones para manejar el modal de detalles
  const handleVerDetalles = async (pedidoId) => {
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedidoId)
      ).unwrap();
      // Ordenar los detalles por fecha de creación
      detalles.sort(
        (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
      );
      setDetallesPedido(detalles);
      setSelectedPedido(pedidoId);
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

  const handleCloseApproveDialog = () => {
    onApproveClose();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  return (
    <Box p={6} boxShadow="xl" bg="white" rounded="lg">
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

          {/* <AlertDialog
            isOpen={isApproveOpen}
            onClose={onApproveClose}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Aprobar Pedidos
                </AlertDialogHeader>
                <AlertDialogBody>
                  ¿Estás seguro de que deseas aprobar los pedidos seleccionados?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={onApproveClose}>
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={handleConfirmApprove}
                    ml={3}
                  >
                    Aprobar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog> */}
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
                    Cancelar
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

      {/* Tabla de pedidos */}
      <PedidosTable
        pedidosEntrantes={pedidosEntrantes}
        selectedPedidos={selectedPedidos}
        setSelectedPedidos={setSelectedPedidos}
        handleVerDetalles={handleVerDetalles}
      />

      {/* Modal de detalles */}
      <DetallesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        detalles={detallesPedido}
        pedidoId={selectedPedido}
      />
    </Box>
  );
};

export default EntrantesPage;
