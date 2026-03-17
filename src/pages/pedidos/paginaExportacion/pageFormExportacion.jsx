import {
  Box,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import AprobadosTable from "../componentes/exportacionFormPedidos/tableAprobados";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import ConfirmExportDialog from "./components/confirmDialog";
import { useAprobadosPage } from "./hooks/useAprobadosPage";


const AprobadosPage = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const {
    pedidosAprobados,
    selectedPedido, detallesPedido,
    isExporting, isReverting,
    selectedPedidosToRevert, setSelectedPedidosToRevert,
    isOpen, onOpen, onClose,
    isExportDlgOpen, openExportDlg, closeExportDlg,
    exportVariant, confirmExportRef,
    handleExport, handleRevert, handleVerDetalles
  } = useAprobadosPage();

  const handleTogglePedidoSelection = (pedidoId) => {
    setSelectedPedidosToRevert((prev) => 
      prev.includes(pedidoId) ? prev.filter((id) => id !== pedidoId) : [...prev, pedidoId]
    );
  };

  const handleSelectAllPedidos = (selectAll) => {
    setSelectedPedidosToRevert(selectAll ? pedidosAprobados.map((p) => p.id) : []);
  };

  return (
    <Box p={6} boxShadow="xl" bg={bgColor} color={textColor} rounded="lg">
      <Flex justify="space-between" mb={6} align="center">
        <Button
          colorScheme="teal" onClick={handleExport} isLoading={isExporting} loadingText="Exportando..."
          isDisabled={pedidosAprobados.length === 0}
        >
          Exportar a SAP ({selectedPedidosToRevert.length > 0 ? selectedPedidosToRevert.length : pedidosAprobados.length})
        </Button>

        <Button
          colorScheme="orange" onClick={handleRevert} isLoading={isReverting} loadingText="Procesando..."
          isDisabled={selectedPedidosToRevert.length === 0}
        >
          Regresar seleccionados al estado anterior ({selectedPedidosToRevert.length})
        </Button>
      </Flex>

      <ConfirmExportDialog
        isOpen={isExportDlgOpen}
        onClose={() => { closeExportDlg(); confirmExportRef.current(false); }}
        onConfirm={() => { confirmExportRef.current(true); closeExportDlg(); }}
        isLoading={isExporting}
        pedidosCount={pedidosAprobados.length}
        variant={exportVariant}
      />

      <AprobadosTable
        pedidosAprobados={pedidosAprobados}
        handleVerDetalles={handleVerDetalles}
        selectedPedidosToRevert={selectedPedidosToRevert}
        onTogglePedidoSelection={handleTogglePedidoSelection}
        onSelectAllPedidos={handleSelectAllPedidos}
      />

      <DetallesModal
        key={selectedPedido?.id || "detalles-modal"}
        isOpen={isOpen}
        onClose={onClose}
        detalles={detallesPedido}
        pedido={selectedPedido}
      />
    </Box>
  );
};

export default AprobadosPage;
