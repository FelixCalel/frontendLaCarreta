import { useMemo } from "react";
import {
  Box,
  Heading,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import Pagination from "../../../components/pagination";
import PedidosTable from "./componente/pedidosTable";
import DetallesPedidoModal from "./componente/detallesPedidoModal";
import HistorialFilters from "./componente/HistorialFilters";

import { useHistorialPedidos } from "./hooks/useHistorialPedidos";

const HistorialPedidosPage = () => {
  const {
    modalState,
    currentPage,
    setCurrentPage,
    roleId,
    highlightedPedidoId,
    setHighlightedPedidoId,
    filters,
    handleFilterChange,
    filteredPedidos,
    status,
    total,
    filterOptions,
    handleVerDetalles,
    handleCloseModal,
    itemsPerPage,
  } = useHistorialPedidos();

  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.200");
  const noDataTextColor = useColorModeValue("gray.500", "gray.400");

  const uniqueValues = useMemo(() => {
    return filterOptions || { tiendas: [], deudores: [], usuarios: [] };
  }, [filterOptions]);

  const handleClearHighlight = () => setHighlightedPedidoId(null);

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
            pedidos={filteredPedidos}
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
