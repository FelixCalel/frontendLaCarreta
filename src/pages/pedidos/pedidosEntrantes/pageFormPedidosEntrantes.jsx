import { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Heading, useToast, useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { tablaPedidos } from "../../../store/Pedidos/thunks";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";
import { tablaTienda } from "../../../store/Tienda/thunks";
import Pagination from "../../../components/pagination";
import PedidosTable from "../componentes/EntrantesFormPedidos/PedidosTable";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import { selectPedidosEntrantesPorRuta } from "./componentes/rutaSelectors";
import { useSearch } from "../../../components/component/SearchContext";

const EntrantesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useToast();
  const { query } = useSearch(); // Use global search query
  
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [highlightedPedidoId, setHighlightedPedidoId] = useState(null);

  // Colors
  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.200");

  // Selectors
  const selectEntrantes = useMemo(() => selectPedidosEntrantesPorRuta([2]), []);
  const pedidosEntrantes = useSelector(selectEntrantes);
  const { isLoading } = useSelector((state) => state.pedidos);

  // Effects
  useEffect(() => {
    dispatch(tablaTienda());
    dispatch(tablaPedidos());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.highlightedPedidoId) {
      setHighlightedPedidoId(location.state.highlightedPedidoId);
      // Clear state to avoid re-highlighting on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handlers
  const handleClearHighlight = useCallback(() => {
    setHighlightedPedidoId(null);
  }, []);

  const handleVerDetalles = async (pedido) => {
    setSelectedPedido(pedido);
    try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
      const detallesOrdenados = detalles.slice().sort((a, b) =>
        a.nombreProducto.localeCompare(b.nombreProducto, undefined, { sensitivity: "base" })
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
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filtering
  const filteredPedidos = useMemo(() => {
    if (!query) return pedidosEntrantes;
    const lowerQuery = query.toLowerCase();
    return pedidosEntrantes.filter((pedido) => {
      const nombreCorrelativo = pedido.nombreCorrelativo?.toLowerCase() || "";
      const nombreDeu = pedido.nombreDeu?.toLowerCase() || "";
      const nombreTienda = pedido.nombreTienda?.toLowerCase() || "";
      const nombreUsuario = pedido.nombreUsuario?.toLowerCase() || "";
      const apellidoUsuario = pedido.apellidoUsuario?.toLowerCase() || "";
      
      return (
        nombreCorrelativo.includes(lowerQuery) ||
        nombreDeu.includes(lowerQuery) ||
        nombreTienda.includes(lowerQuery) ||
        nombreUsuario.includes(lowerQuery) ||
        apellidoUsuario.includes(lowerQuery)
      );
    });
  }, [pedidosEntrantes, query]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const pedidosPaginados = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);

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
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={{ base: 3, md: 6 }}
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
      >
        <Heading
          as="h2"
          size={{ base: "md", md: "lg" }}
          color={headingColor}
        >
          Pedidos Entrantes
        </Heading>
      </Box>

      <PedidosTable
        pedidosEntrantes={pedidosPaginados}
        highlight={query}
        selectedPedidos={selectedPedidos}
        setSelectedPedidos={setSelectedPedidos}
        handleVerDetalles={handleVerDetalles}
        highlightedPedidoId={highlightedPedidoId}
        onClearHighlight={handleClearHighlight}
      />
      
      <Pagination
        currentPage={currentPage}
        totalItems={filteredPedidos.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
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
