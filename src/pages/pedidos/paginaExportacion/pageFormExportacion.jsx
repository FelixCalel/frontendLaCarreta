import { useEffect, useState } from "react";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import AprobadosTable from "../componentes/exportacionFormPedidos/tableAprobados";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";
import { togglePedidoStatus, tablaPedidos } from "../../../store/Pedidos/thunks"; 
import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as ExcelJS from 'exceljs';

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

  const pedidosAprobados = pedidos.filter((pedido) => pedido.estadoId === 3);
  console.log("Pedidos:", pedidosAprobados);
  
  const handleVerDetalles = async (pedidoId) => {
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedidoId)
      ).unwrap();
      setDetallesPedido(detalles);
      setSelectedPedido(pedidoId);
      onOpen();
    } catch (error) {
      console.error(
        `Error al obtener los detalles del pedido ${pedidoId}:`,
        error
      );
    }
  };
  console.log("Pedidos aprobados:", pedidosAprobados);

  // Ejemplo de agregar detalles
  const cargarDetallesPedidos = async (pedidos) => {
    const pedidosConDetalles = await Promise.all(
      pedidos.map(async (pedido) => {
        const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
        return {
          ...pedido,
          detalles: detalles || [],
        };
      })
    );
    return pedidosConDetalles;
  };
  

  const handleExportConsolidado = async () => {
    if (pedidosAprobados.length === 0) {
      console.log("No hay pedidos aprobados para exportar.");
      return;
    }

    setIsExporting(true);
    try {
      // Cargar los detalles de los pedidos antes de exportar
      const pedidosConDetalles = await cargarDetallesPedidos(pedidosAprobados);

      // Crear un nuevo libro de trabajo con ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pedidos Consolidados");
      // Agrupar los pedidos por deudor
      const pedidosPorDeudor = pedidosConDetalles.reduce((acc, pedido) => {
        const deudor = pedido.nombreDeu || "Sin deudor";
        if (!acc[deudor]) acc[deudor] = { pedidos: [], creadoEl: null };
        acc[deudor].pedidos.push(pedido);
        if (!acc[deudor].creadoEl || pedido.creadoEl > acc[deudor].creadoEl) {
          acc[deudor].creadoEl = pedido.creadoEl;
        }
        return acc;
      }, {});

      // Agregar los datos agrupados al archivo Excel
      await addPedidosToWorksheet(worksheet, pedidosPorDeudor);

      // Generar el archivo y descargarlo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pedidos_consolidados.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);

      // Cambiar el estado de los pedidos exportados a 5
      await actualizarEstadoPedidosExportados(pedidosAprobados);
    } catch (error) {
      console.error("Error al exportar pedidos consolidados:", error);
    } finally {
      setIsExporting(false);
    }
  };

async function addPedidosToWorksheet(worksheet, pedidosPorDeudor) {
  // Definir las columnas
  worksheet.columns = [
    { header: 'Pedido ID', key: 'pedidoId', width: 15 },
    { header: 'Código', key: 'codigo', width: 15 },
    { header: 'Producto', key: 'producto', width: 30 },
    { header: 'Cantidad', key: 'cantidad', width: 15 }
  ];

  // Iterar sobre cada deudor
  for (const deudor of Object.keys(pedidosPorDeudor)) {
    const { pedidos, creadoEl } = pedidosPorDeudor[deudor];

    // Agregar encabezado del deudor
    const deudorRow = worksheet.addRow([deudor]);
    deudorRow.font = { bold: true };
      
    // Agregar fecha
    const fechaFormateada = format(new Date(creadoEl), "dd 'de' MMMM 'de' yyyy", { locale: es });
    worksheet.addRow([`Fecha: ${fechaFormateada}`]);
      
    // Agregar encabezados de columnas
    const headerRow = worksheet.addRow(['Pedido ID', 'Código', 'Producto', 'Cantidad']);
    headerRow.font = { bold: true };

    // Agregar detalles de pedidos
    for (const pedido of pedidos) {
      const detalles = Array.isArray(pedido.detalles) ? pedido.detalles : [];
      for (const detalle of detalles) {
        worksheet.addRow({
          pedidoId: `P-${pedido.id}`,
          codigo: detalle.codigo || "Sin código",
          producto: detalle.nombreProducto,
          cantidad: detalle.cantidad
        });
      }
    }

    // Agregar fila en blanco entre deudores
    worksheet.addRow([]);
  }

  // Ajustar el ancho de las columnas automáticamente
  worksheet.columns.forEach(column => {
    column.width = Math.max(
      column.header?.length || 10,
      ...worksheet.getColumn(column.key).values
        .filter(value => value)
        .map(value => String(value).length)
    );
  });
}

  const actualizarEstadoPedidosExportados = async (pedidos) => {
    try {
      await Promise.all(pedidos.map(async (pedido) => {
        // Cambiar el estado a 5
        await dispatch(togglePedidoStatus({ id: pedido.id, estadoId: 5 }));
      }));
      console.log("Estados de los pedidos actualizados correctamente a 5.");
    } catch (error) {
      console.error("Error al actualizar el estado de los pedidos:", error);
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
