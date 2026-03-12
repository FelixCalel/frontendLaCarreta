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
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedPedido: null,
    detalles: [],
    isLoading: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const { roleId: roleIdRedux, uid } = useSelector((state) => state.auth || {});
  const roleId = roleIdRedux ? parseInt(roleIdRedux, 10) : null;
  const usuarioId = uid ? parseInt(uid, 10) : null;
  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.200");
  const noDataTextColor = useColorModeValue("gray.500", "gray.400");
  const [highlightedPedidoId, setHighlightedPedidoId] = useState(null);

  const [filters, setFilters] = useState({
    tienda: "",
    deudor: "",
    usuario: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (location.state?.highlightedPedidoId) {
      console.log(
        "History Page received highlightedPedidoId:",
        location.state.highlightedPedidoId,
      );
      setHighlightedPedidoId(location.state.highlightedPedidoId);
    }
  }, [location]);

  const handleClearHighlight = useCallback(() => {
    setHighlightedPedidoId(null);
  }, []);

  const {
    data: todosLosPedidosRaw = [],
    status,
    total,
    filterOptions,
  } = useSelector((state) => state.pedidos);
  const tiendas = useSelector((state) => state.tiendas.data);
  const user = useSelector((state) => state.auth.user);

  const filteredPedidos = useMemo(() => {
    if (!todosLosPedidosRaw || !tiendas || !user) return [];

    const rutasUsuario = user.rutas || [];

    const rutasSet = new Set(
      Array.isArray(rutasUsuario)
        ? rutasUsuario.map((r) => (typeof r === "object" ? +r.id : +r))
        : [],
    );
    const tiendaRutaMap = new Map(
      (tiendas || []).map((t) => [t.id, +t.rutaId]),
    );

    const userId =
      user.id || user.uid || (user.usuarioId ? parseInt(user.usuarioId) : null);

    return todosLosPedidosRaw.filter((p) => {
      if (userId && p.usuarioId === userId) return true;

      if (!rutasUsuario.length) return false;

      const rutaTienda = tiendaRutaMap.get(p.tiendaId);
      return rutasSet.has(rutaTienda);
    });
  }, [todosLosPedidosRaw, tiendas, user]);

  const currentPedidos = filteredPedidos;

  useEffect(() => {
    if (highlightedPedidoId && filteredPedidos.length > 0) {
      setTimeout(() => {
        const el = document.getElementById(`pedido-${highlightedPedidoId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      const timer = setTimeout(() => {
        setHighlightedPedidoId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedPedidoId, filteredPedidos]);

  useEffect(() => {
    if (usuarioId && roleId) {
      dispatch(fetchFilterOptions({ userId: usuarioId, roleId }));
    }
  }, [dispatch, usuarioId, roleId]);

  const uniqueValues = useMemo(() => {
    return filterOptions || { tiendas: [], deudores: [], usuarios: [] };
  }, [filterOptions]);

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
        }),
      );
    }
  }, [dispatch, usuarioId, roleId, currentPage, filters]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleVerDetalles = async (pedido) => {
    setModalState(prev => ({ ...prev, isLoading: true, selectedPedido: pedido }));
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id),
      ).unwrap();
      const detallesOrdenados = detalles.slice().sort((a, b) =>
        a.nombreProducto.localeCompare(b.nombreProducto, undefined, {
          sensitivity: "base",
        }),
      );

      setModalState(prev => ({
        ...prev,
        detalles: detallesOrdenados,
        isOpen: true,
        isLoading: false
      }));
    } catch (err) {
      toast({
        title: "Error al cargar detalles",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setModalState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      selectedPedido: null,
      detalles: [],
      isLoading: false,
    });
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
        textAlign="center"
      >
        Historial de Pedidos
      </Heading>

      <HistorialFilters
        filters={filters}
        onFilterChange={handleFilterChange}
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
          <PedidosTable
            pedidos={currentPedidos}
            roleId={roleId}
            onVerDetalles={handleVerDetalles}
            highlightedPedidoId={highlightedPedidoId}
            onClearHighlight={handleClearHighlight}
            showSapInfo={roleId === 1 || roleId === 3}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={
              total > 0
                ? total
                : filteredPedidos.length > 0
                  ? filteredPedidos.length
                  : 0
            }
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
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        pedido={modalState.selectedPedido}
        detalles={modalState.detalles}
        isLoading={modalState.isLoading}
      />
    </Box>
  );
};

export default HistorialPedidosPage;
