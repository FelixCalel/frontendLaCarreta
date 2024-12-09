import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos, togglePedidoStatus } from "../../../store/Pedidos/thunks";
import PedidosTable from "../componentes/EntrantesFormPedidos/PedidosTable";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import {getDetalleOrdenByPedidoId} from "../../../store/Pedidos/DetallePedidos/thunks"

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

  // Filtro de pedidos entrantes
  const pedidosEntrantes = pedidos.filter((pedido) => pedido.estadoId === 2);

  // Carga inicial de datos
  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  // Funciones para manejar la aprobación y cancelación de pedidos
  const handleAprobarPedidos = async () => {
    setIsLoading(true);
    try {
      for (const pedidoId of selectedPedidos) {
        await dispatch(togglePedidoStatus({ id: pedidoId, estadoId: 3 }));
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
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
      console.log(detalles);
      setDetallesPedido(detalles);
      setSelectedPedido(pedidoId);
      setIsModalOpen(true);
    } catch (error) {
      console.error(`Error al obtener los detalles del pedido ${pedidoId}:`, error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
            onClick={handleAprobarPedidos}
            isDisabled={selectedPedidos.length === 0 || isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "Aprobar Pedidos"}
          </Button>
          <Button
            colorScheme="red"
            onClick={handleCancelarPedidos}
            isDisabled={selectedPedidos.length === 0 || isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "Cancelar Pedidos"}
          </Button>
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
