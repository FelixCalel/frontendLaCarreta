import { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Heading, useToast, useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
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
  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.200");
  const noDataTextColor = useColorModeValue("gray.500", "gray.400");

  const [highlightedPedidoId, setHighlightedPedidoId] = useState(null);

  useEffect(() => {
    if (location.state?.highlightedPedidoId) {
      setHighlightedPedidoId(location.state.highlightedPedidoId);
      // Clear state to avoid re-highlighting on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleClearHighlight = useCallback(() => {
    setHighlightedPedidoId(null);
  }, []);

  const todosLosPedidos = useSelector((state) => state.pedidos.data || []);

  const selectHistorial = useMemo(
    () => selectPedidosEntrantesPorRuta([2, 3, 4, 5]),
    []
  );
  const pedidosPorRuta = useSelector(selectHistorial);

  const pedidosHistorial =
    roleId === 2
      ? todosLosPedidos.filter(
          (p) => p.usuarioId === usuarioId && [2, 3, 4, 5].includes(p.estadoId)
        )
      : pedidosPorRuta;

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
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleVerDetalles = async (pedido) => {
    setIsLoadingDetalles(true);
    setSelectedPedido(pedido);
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id)
      ).unwrap();
      const detallesOrdenados = detalles.slice().sort((a, b) =>
        a.nombreProducto.localeCompare(b.nombreProducto, undefined, {
          sensitivity: "base",
        })
      );

      setDetallesPedido(detallesOrdenados);
      setIsModalOpen(true);
    } catch (err) {
      toast({
        title: "Error al cargar detalles",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingDetalles(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  return (
    <Box
      p={{ base: 1, sm: 2, md: 6 }}
      boxShadow={{ base: "none", md: "xl" }}
      bg={containerBg}
      rounded={{ base: "none", md: "lg" }}
      mt={{ base: "80px", sm: "85px", md: "0" }}
      mb={{ base: "60px", sm: "65px", md: "0" }}
      minH={{ base: "calc(100vh - 140px)", md: "auto" }}
      maxW="100%"
      w="100%"
    >
      <Heading
        as="h2"
        size={{ base: "md", md: "lg" }}
        mb={{ base: 3, md: 6 }}
        mt={{ base: 0, md: 0 }}
        color={headingColor}
      >
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
              highlightedPedidoId={highlightedPedidoId}
              onClearHighlight={handleClearHighlight}
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
          No hay pedidos para mostrar.
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
