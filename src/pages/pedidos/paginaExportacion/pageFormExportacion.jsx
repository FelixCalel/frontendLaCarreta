import { useEffect, useState } from "react"; 
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react"; 
import { useDispatch, useSelector } from "react-redux"; 
import AprobadosTable from "../componentes/exportacionFormPedidos/tableAprobados"; 
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal"; 
import { tablaPedidos } from "../../../store/Pedidos/thunks"; 
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";


const AprobadosPage = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const pedidos = useSelector((state) => state.pedidos.data);

  useEffect(() => {
    const fetchPedidos = async () => {
      await dispatch(tablaPedidos());
    };
    fetchPedidos();
  }, [dispatch]);

  const pedidosAprobados = pedidos.filter(
    (pedido) => pedido.estadoId === 3
  );

  const handleVerDetalles = async (pedidoId) => {
    try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
      setDetallesPedido(detalles);
      setSelectedPedido(pedidoId);
      onOpen();
    } catch (error) {
      console.error(`Error al obtener los detalles del pedido ${pedidoId}:`, error);
    }
  };

  const handleExportConsolidado = async () => {
    if (pedidosAprobados.length === 0) return;

    setIsExporting(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pedidos Consolidados");

      // Definir las columnas
      worksheet.columns = [
        { header: "Deudor", key: "deudor", width: 30 },
        { header: "Pedido ID", key: "pedidoId", width: 15 },
        { header: "Item", key: "item", width: 40 },
        { header: "Cantidad", key: "cantidad", width: 15 },
        { header: "Fecha", key: "fecha", width: 25 },
      ];

      // Agrupar los pedidos por deudor
      const pedidosPorDeudor = pedidosAprobados.reduce((acc, pedido) => {
        const deudor = pedido.nombreDeu || "Sin deudor";
        if (!acc[deudor]) acc[deudor] = [];
        acc[deudor].push(pedido);
        return acc;
      }, {});
      

      // Agregar los datos agrupados al archivo Excel
      Object.entries(pedidosPorDeudor).forEach(([deudor, pedidos]) => {
        pedidos.forEach((pedido) => {
          const detalles = pedido.detalles || [];
          detalles.forEach((detalle) => {
            worksheet.addRow({
              deudor,
              pedidoId: `P-${pedido.id}`,
              item: `${detalle.codigo || "Sin código"} - ${detalle.nombreProducto}`,
              cantidad: detalle.cantidad,
              fecha: pedido.fechaOrden,
            });
          });
        });
      });

      // Generar el archivo y descargarlo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pedidos_consolidados.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar pedidos consolidados:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box p={6} boxShadow="xl" bg="white" rounded="lg">
      <Flex justify="space-between" mb={6}>
        <Button
          colorScheme="teal"
          onClick={handleExportConsolidado}
          isLoading={isExporting}
          loadingText="Exportando..."
          disabled={pedidosAprobados.length === 0}
        >
          Exportar Consolidado por Deudor
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
