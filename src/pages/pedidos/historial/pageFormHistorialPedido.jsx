import { useEffect, useState, useMemo } from "react";
import { Box, Heading, useToast, useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos } from "../../../store/Pedidos/thunks";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";
import Pagination from "../../../components/pagination";
import PedidosTable from "./componente/pedidosTable";
import PedidosCardList from "./componente/pedidoCardList";
import DetallesPedidoModal from "./componente/detallesPedidoModal";
import { selectPedidosEntrantesPorRuta } from "../pedidosEntrantes/componentes/rutaSelectors";
import { tablaTienda } from "../../../store/Tienda/thunks";
const HistorialPedidosPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [isLoadingDetalles, setIsLoadingDetalles] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);
  const roleId = parseInt(localStorage.getItem("roleId"), 10);
  //const pedidos = useSelector((state) => state.pedidos.data);
  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.200");
  const noDataTextColor = useColorModeValue("gray.500", "gray.400");

  const selectHistorial = useMemo(
    () => selectPedidosEntrantesPorRuta([2, 3, 4, 5]),
    []
  );
  const pedidosHistorial = useSelector(selectHistorial);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPedidos = pedidosHistorial.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    dispatch(tablaTienda());
    dispatch(tablaPedidos());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleVerDetalles = async (pedido) => {
    setIsLoadingDetalles(true);
    setSelectedPedido(pedido);
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id)
      ).unwrap();
      setDetallesPedido(detalles);
    } catch (error) {
      console.error(
        `Error al obtener los detalles del pedido ${pedido.id}:`,
        error
      );
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingDetalles(false);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  return (
    <Box p={6} boxShadow="xl" bg={containerBg} rounded="lg">
      <Heading as="h2" size="lg" mb={[4, 6]} mt={[5, 0]} color={headingColor}>
        Historial de Pedidos
      </Heading>

      {pedidosHistorial.length > 0 ? (
        <>
          {isMobile ? (
            <PedidosCardList
              pedidos={currentPedidos}
              roleId={roleId}
              onVerDetalles={handleVerDetalles}
            />
          ) : (
            <PedidosTable
              pedidos={currentPedidos}
              roleId={roleId}
              onVerDetalles={handleVerDetalles}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={pedidosHistorial.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <Box textAlign="center" color={noDataTextColor} mt={6}>
          No hay pedidos aprobados o cancelados para mostrar.
        </Box>
      )}

      <DetallesPedidoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pedido={selectedPedido}
        detalles={detallesPedido}
        isLoading={isLoadingDetalles}
      />
    </Box>
  );
};

export default HistorialPedidosPage;
