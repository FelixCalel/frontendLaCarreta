import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Heading,
  useToast,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  tablaPedidos,
  fetchFilterOptions,
} from "../../../store/Pedidos/thunks";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";
import Pagination from "../../../components/pagination";
import PedidosTable from "./componente/pedidosTable";
import PedidosCardList from "./componente/pedidoCardList";
import DetallesPedidoModal from "./componente/detallesPedidoModal";
import HistorialFilters from "./componente/HistorialFilters";

import { useSearch } from "../../../components/component/SearchContext";
import { tablaTienda } from "../../../store/Tienda/thunks";

const HistorialPedidosPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useToast();
  const { query } = useSearch();
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

  const [filters, setFilters] = useState({
    tienda: "",
    deudor: "",
    usuario: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
  });

  useEffect(() => {
    if (location.state?.highlightedPedidoId) {
      setHighlightedPedidoId(location.state.highlightedPedidoId);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [highlightedPedidoId, setHighlightedPedidoId] = useState(null);

  useEffect(() => {
    if (highlightedPedidoId) {
      const element = document.getElementById(`pedido-${highlightedPedidoId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const timer = setTimeout(() => {
        setHighlightedPedidoId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedPedidoId]);

  const handleClearHighlight = useCallback(() => {
    setHighlightedPedidoId(null);
  }, []);

  const {
    data: todosLosPedidos = [],
    status,
    total,
    filterOptions,
  } = useSelector((state) => state.pedidos);

  const filteredPedidos = todosLosPedidos.filter((p) => p.estadoId !== 1);
  const currentPedidos = filteredPedidos;

  useEffect(() => {
    if (usuarioId && roleId) {
      dispatch(fetchFilterOptions({ userId: usuarioId, roleId }));
    }
  }, [dispatch, usuarioId, roleId]);

  const uniqueValues = useMemo(() => {
    return filterOptions || { tiendas: [], deudores: [], usuarios: [] };
  }, [filterOptions]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    dispatch(tablaTienda());
    if (usuarioId && roleId) {
      dispatch(
        tablaPedidos({
          userId: usuarioId,
          roleId: roleId,
          page: currentPage,
          limit: itemsPerPage,
          filters: filters,
        })
      );
    }
  }, [dispatch, usuarioId, roleId, currentPage, filters]);

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
      p={{ base: 1, sm: 2, md: 2 }}
      boxShadow={{ base: "none", md: "xl" }}
      bg={containerBg}
      rounded={{ base: "none", md: "lg" }}
      mt={{ base: "35px", sm: "35px", md: "0" }}
      mb={{ base: "60px", sm: "65px", md: "0" }}
      minH={{ base: "calc(100vh - 140px)", md: "auto" }}
      maxW="100%"
      w="100%"
    >
      <Heading
        as="h2"
        size={{ base: "md", md: "lg" }}
        mb={{ base: 3, md: 2 }}
        mt={{ base: 0, md: 0 }}
        color={headingColor}
      >
        Historial de Pedidos
      </Heading>

      <HistorialFilters
        filters={filters}
        onFilterChange={setFilters}
        uniqueValues={uniqueValues}
        roleId={roleId}
      />

      {status === "loading" ? (
        <Box textAlign="center" mt={10}>
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
          />
          <Box mt={4} fontWeight="medium" color={headingColor}>
            Cargando historial...
          </Box>
        </Box>
      ) : filteredPedidos.length > 0 ? (
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
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <Box textAlign="center" color={noDataTextColor} mt={6}>
          No hay pedidos que coincidan con los filtros.
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
