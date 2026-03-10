import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Heading,
  useToast,
  useColorModeValue,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  useDisclosure,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  tablaPedidos,
  togglePedidoStatus,
} from "../../../store/Pedidos/thunks";
import { fetchCurrentUser } from "../../../store/auth/thunks";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";
import { tablaTienda } from "../../../store/Tienda/thunks";
import Pagination from "../../../components/pagination";
import PedidosTable from "../componentes/EntrantesFormPedidos/PedidosTable";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import CancelOrdersModal from "../componentes/EntrantesFormPedidos/CancelOrdersModal";
import ApproveOrdersModal from "../componentes/EntrantesFormPedidos/ApproveOrdersModal";
import { useSearch } from "../../../components/component/SearchContext";
import { useWebSocket } from "../../../providers/WebSocketProvider";

const EntrantesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useToast();
  const { query } = useSearch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [highlightedPedidoId, setHighlightedPedidoId] = useState(null);
  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);
  const roleId = parseInt(localStorage.getItem("roleId"), 10);

  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();
  const [cancelComment, setCancelComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onClose: onApproveClose,
  } = useDisclosure();
  const [approveData, setApproveData] = useState({
    fechaOrdenDisplay: "",
    comentarioDisplay: "",
    comentario: "",
  });

  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.200");
  const inputBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const calendarFilter = useColorModeValue("none", "invert(1)");

  const {
    data: pedidosEntrantesRaw,
    status,
    total,
  } = useSelector((state) => state.pedidos);
  const tiendas = useSelector((state) => state.tiendas.data);
  const user = useSelector((state) => state.auth.user);

  const pedidosEntrantes = useMemo(() => {
    if (!pedidosEntrantesRaw || !tiendas || !user) return [];

    const rutasUsuario = user.rutas || [];
    const rutasSet = new Set(
      Array.isArray(rutasUsuario)
        ? rutasUsuario.map((r) => (typeof r === "object" ? +r.id : +r))
        : [],
    );
    const tiendaRutaMap = new Map(tiendas.map((t) => [t.id, +t.rutaId]));

    const userId =
      user.id || user.uid || (user.usuarioId ? parseInt(user.usuarioId) : null);

    return pedidosEntrantesRaw.filter((p) => {
      if (userId && p.usuarioId === userId) return true;

      if (!rutasUsuario.length) return false;

      const rutaTienda = tiendaRutaMap.get(p.tiendaId);
      return rutasSet.has(rutaTienda);
    });
  }, [pedidosEntrantesRaw, tiendas, user]);

  const isLoading = status === "loading";

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(tablaTienda());
    if (usuarioId && roleId) {
      dispatch(
        tablaPedidos({
          userId: usuarioId,
          roleId: roleId,
          status: 2,
          page: currentPage,
          limit: itemsPerPage,
        }),
      );
    } else {
      dispatch(
        tablaPedidos({
          status: 2,
          page: currentPage,
          limit: itemsPerPage,
        }),
      );
    }
  }, [dispatch, currentPage, usuarioId, roleId]);

  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.type === "notification" ||
          data.type === "on-order-status-changed"
        ) {
          console.log("WebSocket event received:", data.payload);
          dispatch(
            tablaPedidos({
              userId: usuarioId,
              roleId: roleId,
              status: 2,
              page: currentPage,
              limit: itemsPerPage,
            }),
          );
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.addEventListener("message", handleSocketMessage);

    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, [socket, dispatch, currentPage, usuarioId, roleId]);

  useEffect(() => {
    if (location.state?.highlightedPedidoId) {
      setHighlightedPedidoId(location.state.highlightedPedidoId);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (highlightedPedidoId && pedidosEntrantes.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(
          `pedido-${highlightedPedidoId}`,
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      const timer = setTimeout(() => {
        setHighlightedPedidoId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedPedidoId, pedidosEntrantes]);

  const handleClearHighlight = useCallback(() => {
    setHighlightedPedidoId(null);
  }, []);

  const handleVerDetalles = async (pedido) => {
    setSelectedPedido(pedido);
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id),
      ).unwrap();
      const detallesOrdenados = detalles.slice().sort((a, b) =>
        a.nombreProducto.localeCompare(b.nombreProducto, undefined, {
          sensitivity: "base",
        }),
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

  const handleBulkApproveClick = () => {
    if (selectedPedidos.length === 0) return;

    if (selectedPedidos.length === 1) {
      const pedido = pedidosEntrantes.find((p) => p.id === selectedPedidos[0]);
      if (pedido) {
        setApproveData({
          fechaOrdenDisplay: pedido.fechaOrdenDisplay
            ? pedido.fechaOrdenDisplay.split("T")[0]
            : "",
          comentarioDisplay: pedido.comentarioDisplay || "",
          comentario: pedido.comentario || "",
        });
      }
    } else {
      setApproveData({
        fechaOrdenDisplay: "",
        comentarioDisplay: "",
        comentario: "",
      });
    }
    onApproveOpen();
  };

  const handleConfirmApprove = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedPedidos.map((id) => {
          const pedido = pedidosEntrantes.find((p) => p.id === id);
          if (!pedido) return Promise.resolve();

          const fecha =
            selectedPedidos.length === 1
              ? approveData.fechaOrdenDisplay
              : pedido.fechaOrdenDisplay
                ? pedido.fechaOrdenDisplay.split("T")[0]
                : undefined;
          const comentarioDisplay =
            selectedPedidos.length === 1
              ? approveData.comentarioDisplay
              : pedido.comentarioDisplay;
          const comentario =
            selectedPedidos.length === 1
              ? approveData.comentario
              : pedido.comentario;

          return dispatch(
            togglePedidoStatus({
              id,
              estadoId: 3,
              comentarioDisplay: comentarioDisplay,
              comentario: comentario,
              fechaOrdenDisplay: fecha,
            }),
          ).unwrap();
        }),
      );
      toast({ title: "Pedidos aprobados correctamente", status: "success" });
      setSelectedPedidos([]);

      dispatch(
        tablaPedidos({
          userId: usuarioId,
          roleId: roleId,
          status: 2,
          page: currentPage,
          limit: itemsPerPage,
        }),
      );

      onApproveClose();
    } catch (err) {
      toast({
        title: "Error al aprobar pedidos",
        description: err.message || "Ocurrió un error",
        status: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkCancel = async () => {
    if (selectedPedidos.length === 0) return;
    if (!cancelComment.trim()) {
      toast({
        title: "Debes ingresar un motivo de cancelación",
        status: "warning",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await Promise.all(
        selectedPedidos.map((id) => {
          const pedido = pedidosEntrantes.find((p) => p.id === id);
          return dispatch(
            togglePedidoStatus({
              id,
              estadoId: 4,
              comentario: cancelComment,
              comentarioDisplay: pedido ? pedido.comentarioDisplay : undefined,
              fechaOrdenDisplay:
                pedido && pedido.fechaOrdenDisplay
                  ? pedido.fechaOrdenDisplay.split("T")[0]
                  : undefined,
            }),
          ).unwrap();
        }),
      );
      toast({ title: "Pedidos cancelados correctamente", status: "info" });
      setSelectedPedidos([]);
      setCancelComment("");
      onCancelClose();
      dispatch(
        tablaPedidos({
          userId: usuarioId,
          roleId: roleId,
          status: 2,
          page: currentPage,
          limit: itemsPerPage,
        }),
      );
    } catch (err) {
      toast({
        title: "Error al cancelar pedidos",
        description: err.message || "Ocurrió un error",
        status: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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

  const pedidosPaginados = filteredPedidos;

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
        <Heading as="h2" size={{ base: "md", md: "lg" }} color={headingColor}>
          Pedidos Entrantes
        </Heading>

        <HStack spacing={4}>
          <Button
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
            isDisabled={selectedPedidos.length === 0 || isProcessing}
            onClick={onCancelOpen}
          >
            Cancelar ({selectedPedidos.length})
          </Button>
          <Button
            colorScheme="green"
            isDisabled={selectedPedidos.length === 0 || isProcessing}
            onClick={handleBulkApproveClick}
            isLoading={isProcessing}
          >
            Aprobar ({selectedPedidos.length})
          </Button>
        </HStack>
      </Box>

      {isLoading ? (
        <Box textAlign="center" py={10}>
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
          />
          <Box mt={4} fontWeight="medium" color={headingColor}>
            Cargando pedidos entrantes...
          </Box>
        </Box>
      ) : (
        <>
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
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <DetallesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        detalles={detallesPedido}
        pedido={selectedPedido}
      />

      <CancelOrdersModal
        isOpen={isCancelOpen}
        onClose={onCancelClose}
        selectedCount={selectedPedidos.length}
        cancelComment={cancelComment}
        setCancelComment={setCancelComment}
        handleBulkCancel={handleBulkCancel}
        isProcessing={isProcessing}
        inputBg={inputBg}
        borderColor={borderColor}
        textColor={textColor}
      />

      <ApproveOrdersModal
        isOpen={isApproveOpen}
        onClose={onApproveClose}
        selectedCount={selectedPedidos.length}
        approveData={approveData}
        setApproveData={setApproveData}
        handleConfirmApprove={handleConfirmApprove}
        isProcessing={isProcessing}
        inputBg={inputBg}
        borderColor={borderColor}
        textColor={textColor}
        calendarFilter={calendarFilter}
      />
    </Box>
  );
};

export default EntrantesPage;
