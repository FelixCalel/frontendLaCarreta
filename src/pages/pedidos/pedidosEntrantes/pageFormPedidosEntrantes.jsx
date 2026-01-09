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
  Textarea,
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
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";
import { tablaTienda } from "../../../store/Tienda/thunks";
import Pagination from "../../../components/pagination";
import PedidosTable from "../componentes/EntrantesFormPedidos/PedidosTable";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import { useSearch } from "../../../components/component/SearchContext";

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

  // Get User Context
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

  // Selectors
  const {
    data: pedidosEntrantes,
    status,
    total,
  } = useSelector((state) => state.pedidos);
  const isLoading = status === "loading";

  useEffect(() => {
    dispatch(tablaTienda());
    // Dispatch with User Context and Status 2 (Entrantes) + Pagination
    if (usuarioId && roleId) {
      dispatch(
        tablaPedidos({
          userId: usuarioId,
          roleId: roleId,
          status: 2,
          page: currentPage,
          limit: itemsPerPage,
        })
      );
    } else {
      // Fallback for missing user context
      dispatch(
        tablaPedidos({ status: 2, page: currentPage, limit: itemsPerPage })
      );
    }
  }, [dispatch, currentPage, usuarioId, roleId]);

  useEffect(() => {
    if (location.state?.highlightedPedidoId) {
      setHighlightedPedidoId(location.state.highlightedPedidoId);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleClearHighlight = useCallback(() => {
    setHighlightedPedidoId(null);
  }, []);

  const handleVerDetalles = async (pedido) => {
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
            ? new Date(pedido.fechaOrdenDisplay).toISOString().split("T")[0]
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
              : pedido.fechaOrdenDisplay;
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
            })
          ).unwrap();
        })
      );
      toast({ title: "Pedidos aprobados correctamente", status: "success" });
      setSelectedPedidos([]);

      // Refresh list after approval
      dispatch(
        tablaPedidos({
          userId: usuarioId,
          roleId: roleId,
          status: 2,
          page: currentPage,
          limit: itemsPerPage,
        })
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
        selectedPedidos.map((id) =>
          dispatch(
            togglePedidoStatus({
              id,
              estadoId: 4,
              comentario: cancelComment,
            })
          ).unwrap()
        )
      );
      toast({ title: "Pedidos cancelados correctamente", status: "info" });
      setSelectedPedidos([]);
      setCancelComment("");
      onCancelClose();
      // Refresh list
      dispatch(
        tablaPedidos({
          userId: usuarioId,
          roleId: roleId,
          status: 2,
          page: currentPage,
          limit: itemsPerPage,
        })
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

  // removed client side slicing since backend does it
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

      <Modal isOpen={isCancelOpen} onClose={onCancelClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancelar Pedidos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Estás a punto de cancelar {selectedPedidos.length} pedidos. Por
              favor, ingresa el motivo de la cancelación:
            </Text>
            <Textarea
              placeholder="Motivo de cancelación (Comentario de Ventas)"
              value={cancelComment}
              onChange={(e) => setCancelComment(e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
              color={textColor}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCancelClose}>
              Cerrar
            </Button>
            <Button
              colorScheme="red"
              onClick={handleBulkCancel}
              isLoading={isProcessing}
              isDisabled={!cancelComment.trim()}
            >
              Confirmar Cancelación
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isApproveOpen}
        onClose={onApproveClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Pedido</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4} fontWeight="medium">
              ¿Estás seguro de que quieres aprobar{" "}
              {selectedPedidos.length > 1 ? "estos pedidos" : "este pedido"}?
            </Text>

            {selectedPedidos.length === 1 ? (
              <>
                <Text mb={1} fontWeight="bold" fontSize="sm">
                  Fecha de entrega *
                </Text>
                <Box mb={4}>
                  <Input
                    type="date"
                    value={approveData.fechaOrdenDisplay}
                    onChange={(e) =>
                      setApproveData({
                        ...approveData,
                        fechaOrdenDisplay: e.target.value,
                      })
                    }
                    bg={inputBg}
                    borderColor={borderColor}
                    color={textColor}
                    sx={{
                      "&::-webkit-calendar-picker-indicator": {
                        filter: calendarFilter,
                      },
                    }}
                  />
                </Box>

                <Text mb={1} fontWeight="bold" fontSize="sm">
                  Instrucciones de Entrega (Cliente)
                </Text>
                <Textarea
                  placeholder="Instrucciones del cliente..."
                  value={approveData.comentarioDisplay}
                  onChange={(e) =>
                    setApproveData({
                      ...approveData,
                      comentarioDisplay: e.target.value,
                    })
                  }
                  mb={4}
                  bg={inputBg}
                  borderColor={borderColor}
                  color={textColor}
                />

                {/* <Text mb={1} fontWeight="bold" fontSize="sm">Comentario de Ventas (Interno)</Text>
                <Textarea
                  placeholder="Comentario interno de ventas..."
                  value={approveData.comentario}
                  onChange={(e) => setApproveData({ ...approveData, comentario: e.target.value })}
                  mb={4}
                  bg={inputBg}
                  borderColor={borderColor}
                  color={textColor}
                /> */}
              </>
            ) : (
              <Text color="gray.500" mb={4}>
                Se aprobarán {selectedPedidos.length} pedidos con sus fechas y
                comentarios originales.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              bg="red.500"
              color="white"
              _hover={{ bg: "red.600" }}
              mr={3}
              onClick={onApproveClose}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleConfirmApprove}
              isLoading={isProcessing}
            >
              Aprobar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EntrantesPage;
