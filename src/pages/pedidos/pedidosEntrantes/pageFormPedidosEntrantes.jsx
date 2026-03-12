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

import { usePedidosEntrantes } from "./hooks/usePedidosEntrantes";

const EntrantesPage = () => {
  const {
    pedidosEntrantes,
    total,
    currentPage,
    setCurrentPage,
    isLoading,
    selectedPedidos,
    setSelectedPedidos,
    highlightedPedidoId,
    isCancelOpen,
    onCancelOpen,
    onCancelClose,
    cancelComment,
    setCancelComment,
    isProcessing,
    isApproveOpen,
    onApproveOpen,
    onApproveClose,
    approveData,
    setApproveData,
    modalState,
    dispatchModal,
    handleVerDetalles,
    handleConfirmApprove,
    handleBulkCancel,
  } = usePedidosEntrantes();

  const { query } = useSearch();

  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.200");

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
            onClick={onApproveOpen}
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
            pedidosEntrantes={filteredPedidos}
            highlight={query}
            selectedPedidos={selectedPedidos}
            setSelectedPedidos={setSelectedPedidos}
            handleVerDetalles={handleVerDetalles}
            highlightedPedidoId={highlightedPedidoId}
            onClearHighlight={() => {}}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={total}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <DetallesModal
        isOpen={modalState.isOpen}
        onClose={() => dispatchModal({ isOpen: false })}
        selectedPedido={modalState.selectedPedido}
        detalles={modalState.detalles}
      />

      <CancelOrdersModal
        isOpen={isCancelOpen}
        onClose={onCancelClose}
        cancelComment={cancelComment}
        setCancelComment={setCancelComment}
        handleBulkCancel={handleBulkCancel}
        isProcessing={isProcessing}
        selectedCount={selectedPedidos.length}
      />

      <ApproveOrdersModal
        isOpen={isApproveOpen}
        onClose={onApproveClose}
        approveData={approveData}
        setApproveData={setApproveData}
        handleConfirmApprove={handleConfirmApprove}
        isProcessing={isProcessing}
        selectedCount={selectedPedidos.length}
      />
    </Box>
  );
};

export default EntrantesPage;
