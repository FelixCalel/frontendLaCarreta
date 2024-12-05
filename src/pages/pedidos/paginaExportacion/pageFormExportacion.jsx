import { useEffect, useState } from "react";
import { Box, useDisclosure, Button, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import AprobadosTable from "../componentes/exportacionFormPedidos/tableAprobados";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import { tablaPedidos } from "../../../store/Pedidos/thunks";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks"

const AprobadosPage = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = Number(localStorage.getItem("usuarioId")) || 0; // Valor predeterminado

  useEffect(() => {
    const fetchPedidos = async () => {
      await dispatch(tablaPedidos());
    };
    fetchPedidos();
  }, [dispatch]);

  // Filtrar solo los pedidos aprobados (estadoId === 4)
  const pedidosAprobados = pedidos.filter(
    (pedido) => pedido.estadoId === 4 && pedido.usuarioId === usuarioId
  );

  const handleVerDetalles = async (pedidoId) => {
    try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
      setDetallesPedido(detalles);
      setSelectedPedido(pedidoId);
      onOpen();
    } catch (error) {
      console.error(`Error al obtener los detalles del pedido ${pedidoId}:`, error);
      // Aquí podrías agregar un toast o algún tipo de notificación de error
    }
  };

  const handleExportAll = async () => {
    if (pedidosAprobados.length === 0) return;

    setIsExporting(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();

      pedidosAprobados.forEach((pedido) => {
        const worksheet = workbook.addWorksheet(`Pedido_${pedido.id}`);

        // Definir las columnas
        worksheet.columns = [
          { header: "ID Pedido", key: "id", width: 15 },
          { header: "Deudor", key: "deudor", width: 30 },
          { header: "Item", key: "item", width: 40 },
          { header: "Cantidad", key: "cantidad", width: 15 },
          { header: "Fecha", key: "fecha", width: 25 },
        ];

        // Suponiendo que cada pedido tiene un campo 'detalles' con los productos
        // Si no, necesitarás ajustar esta parte para obtener los detalles
        const detalles = pedido.detalles || [];

        detalles.forEach((detalle) => {
          worksheet.addRow({
            id: `P-${pedido.id}`,
            deudor: pedido.nombreDeu || "N/A",
            item: `${detalle.codigo || "Sin código"} - ${detalle.nombreProducto}`,
            cantidad: detalle.cantidad,
            fecha: pedido.fechaOrden,
          });
        });
      });

      // Generar el buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pedidos_aprobados.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar pedidos aprobados:", error);
      // Aquí podrías agregar un toast o notificación de error
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box p={6} boxShadow="xl" bg="white" rounded="lg">
      <Flex justify="space-between" mb={6}>
        <Button
          colorScheme="teal"
          onClick={handleExportAll}
          isLoading={isExporting}
          loadingText="Exportando..."
          disabled={pedidosAprobados.length === 0}
        >
          Exportar Todos a Excel
        </Button>
      </Flex>

      {/* Tabla de pedidos aprobados */}
      <AprobadosTable
        pedidosAprobados={pedidosAprobados}
        handleVerDetalles={handleVerDetalles}
      />

      {/* Modal de detalles */}
      <DetallesModal
        isOpen={isOpen}
        onClose={onClose}
        detalles={detallesPedido}
        pedidoId={selectedPedido}
      />
    </Box>
  );
};

export default AprobadosPage;
