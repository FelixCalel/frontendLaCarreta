import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import AprobadosTable from "../componentes/exportacionFormPedidos/tableAprobados";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";
import {
  togglePedidoStatus,
  tablaPedidos,
  updatePedidoActivacion,
} from "../../../store/Pedidos/thunks";
import { selectPedidosEntrantesPorRuta } from "../pedidosEntrantes/componentes/rutaSelectors";
import { tablaTienda } from "../../../store/Tienda/thunks";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as ExcelJS from "exceljs";

const AprobadosPage = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();
  const pedidos = useSelector((state) => state.pedidos.data);
  const selectAprobadosPorRuta = useMemo(
    () => selectPedidosEntrantesPorRuta([3]),
    []
  );
  const pedidosAprobados = useSelector(selectAprobadosPorRuta);
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    const fetchPedidos = async () => {
      await dispatch(tablaPedidos());
    };
    fetchPedidos();
  }, [dispatch]);

  useEffect(() => {
    dispatch(tablaTienda());
    dispatch(tablaPedidos());
  }, [dispatch]);

  const cargarDetallesPedidos = async (pedidos) => {
    const pedidosConDetalles = await Promise.all(
      pedidos.map(async (pedido) => {
        const detalles = await dispatch(
          getDetalleOrdenByPedidoId(pedido.id)
        ).unwrap();
        return {
          ...pedido,
          detalles: detalles || [],
        };
      })
    );
    return pedidosConDetalles;
  };

  const actualizarEstadoPedidosExportados = async (pedidos) => {
    try {
      await Promise.all(
        pedidos.map(async (pedido) => {
          await dispatch(
            togglePedidoStatus({ id: pedido.id, estadoId: 5 })
          ).unwrap();

          await dispatch(
            updatePedidoActivacion({ id: pedido.id, isActive: true })
          ).unwrap();
        })
      );
      console.log("Pedidos exportados y activados correctamente.");
    } catch (error) {
      console.error("Error al exportar y activar pedidos:", error);
    }
  };

  const handleExportConsolidadoFormato1 = async () => {
    if (pedidosAprobados.length === 0) {
      console.log("No hay pedidos aprobados para exportar.");
      return;
    }

    setIsExporting(true);
    try {
      const pedidosConDetalles = await cargarDetallesPedidos(pedidosAprobados);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pedidos Consolidados");
      const pedidosPorDeudor = agruparPedidosPorDeudor(pedidosConDetalles);
      await addPedidosToWorksheetFormato1(worksheet, pedidosPorDeudor);
      await descargarWorkbook(workbook, "pedidos_consolidados_formato1.xlsx");
      await actualizarEstadoPedidosExportados(pedidosAprobados);
    } catch (error) {
      console.error(
        "Error al exportar pedidos consolidados (formato 1):",
        error
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportConsolidadoFormato2 = async () => {
    if (pedidosAprobados.length === 0) {
      console.log("No hay pedidos aprobados para exportar.");
      return;
    }

    setIsExporting(true);
    try {
      const pedidosConDetalles = await cargarDetallesPedidos(pedidosAprobados);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pedidos Consolidados");
      const pedidosPorDeudor = agruparPedidosPorDeudor(pedidosConDetalles);
      await addPedidosToWorksheetFormato2(worksheet, pedidosPorDeudor);
      await descargarWorkbook(workbook, "pedidos_consolidados_formato2.xlsx");
      await actualizarEstadoPedidosExportados(pedidosAprobados);
    } catch (error) {
      console.error(
        "Error al exportar pedidos consolidados (formato 2):",
        error
      );
    } finally {
      setIsExporting(false);
    }
  };

  const agruparPedidosPorDeudor = (pedidosConDetalles) => {
    return pedidosConDetalles.reduce((acc, pedido) => {
      const deudor = pedido.nombreDeu || "Sin deudor";
      if (!acc[deudor]) {
        acc[deudor] = { pedidos: [] };
      }
      acc[deudor].pedidos.push(pedido);
      return acc;
    }, {});
  };

  const descargarWorkbook = async (workbook, fileName) => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isoToDMY = (iso) => {
    if (!iso) return "Sin fecha";
    const [yyyy, mm, dd] = iso.slice(0, 10).split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const isoToLocalDate = (iso) => {
    if (!iso) return null;
    const [yyyy, mm, dd] = iso.slice(0, 10).split("-").map(Number);
    return new Date(yyyy, mm - 1, dd);
  };

  async function addPedidosToWorksheetFormato1(worksheet, pedidosPorDeudor) {
    worksheet.mergeCells("A1:G1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "PEDIDOS CONSOLIDADOS - FORMATO 1";
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.addRow([]);
    worksheet.columns = [
      { header: "Pedido ID", key: "pedidoId", width: 12 },
      { header: "Tienda", key: "tienda", width: 25 },
      { header: "Código", key: "codigo", width: 15 },
      { header: "Producto", key: "producto", width: 30 },
      { header: "Cantidad", key: "cantidad", width: 12 },
      { header: "Deudor", key: "deudor", width: 20 },
      { header: "Pedido Consolidado", key: "fechaEntrega", width: 15 },
    ];

    const headerRowIndex = worksheet.addRow([
      "Pedido ID",
      "Tienda",
      "Código",
      "Producto",
      "Cantidad",
      "Deudor",
      "Fecha Orden",
    ]).number;
    const headerRow = worksheet.getRow(headerRowIndex);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };

    for (const deudor of Object.keys(pedidosPorDeudor)) {
      const { pedidos } = pedidosPorDeudor[deudor];
      for (const pedido of pedidos) {
        const detalles = Array.isArray(pedido.detalles) ? pedido.detalles : [];
        const fechaEntrega = isoToDMY(pedido.fechaOrden);

        for (const detalle of detalles) {
          worksheet.addRow({
            pedidoId: `P-${pedido.id}`,
            tienda: pedido.nombreTienda || "Sin tienda",
            codigo: detalle.codigo || "Sin código",
            producto: detalle.nombreProducto || "",
            cantidad: detalle.cantidad || 0,
            deudor: `${pedido.nombreCorrelativo || ""}${
              pedido.nombreCorrelativo ? " - " : ""
            }${pedido.nombreDeu || ""}`,
            fechaEntrega,
          });
        }
      }
    }

    worksheet.columns.forEach((col) => {
      let maxLength = col.header.length;
      col.eachCell?.((cell) => {
        const cellValue = cell.value || "";
        const valueLength = cellValue.toString().length;
        if (valueLength > maxLength) {
          maxLength = valueLength;
        }
      });
      col.width = Math.max(col.width, maxLength + 2);
    });
  }

  async function addPedidosToWorksheetFormato2(worksheet, pedidosPorDeudor) {
    worksheet.columns = [
      { header: "Pedido ID", key: "pedidoId", width: 15 },
      { header: "Tienda", key: "tienda", width: 25 },
      { header: "Código", key: "codigo", width: 15 },
      { header: "Producto", key: "producto", width: 30 },
      { header: "Cantidad", key: "cantidad", width: 15 },
    ];

    let firstDeudor = true;

    for (const deudor of Object.keys(pedidosPorDeudor)) {
      const { pedidos } = pedidosPorDeudor[deudor];

      if (!firstDeudor) {
        worksheet.addRow([]);
      }
      firstDeudor = false;

      const deudorRow = worksheet.addRow([
        `${pedidos[0]?.nombreCorrelativo || ""}${
          pedidos[0]?.nombreCorrelativo ? " - " : ""
        }${pedidos[0]?.nombreDeu || ""}`,
      ]);
      deudorRow.font = { bold: true };

      const fechaOrdenObj = isoToLocalDate(pedidos[0]?.fechaOrden);
      const fechaOrden = fechaOrdenObj
        ? format(fechaOrdenObj, "dd 'de' MMMM 'de' yyyy", { locale: es })
        : "Sin fecha";

      worksheet.addRow([`Fecha de entrega: ${fechaOrden}`]);

      const headerRow = worksheet.addRow([
        "Pedido ID",
        "Código",
        "Tienda",
        "Producto",
        "Cantidad",
      ]);
      headerRow.font = { bold: true };

      for (const pedido of pedidos) {
        const detalles = Array.isArray(pedido.detalles) ? pedido.detalles : [];
        for (const detalle of detalles) {
          worksheet.addRow({
            pedidoId: `P-${pedido.id}`,
            tienda: pedido.nombreTienda || "Sin tienda",
            codigo: detalle.codigo || "Sin código",
            producto: detalle.nombreProducto,
            cantidad: detalle.cantidad,
          });
        }
      }

      const nombreTienda = pedidos[0]?.nombreTienda || "Sin tienda";
      const commentRow = worksheet.addRow([
        "Comentario:",
        `Tienda: ${nombreTienda}`,
        `Fecha Orden: ${isoToDMY(pedidos[0]?.fechaOrden)}`,
      ]);
      commentRow.font = { bold: true };
      commentRow.alignment = {
        horizontal: "left",
        vertical: "middle",
        wrapText: true,
      };

      worksheet.addRow([]);
    }

    worksheet.columns.forEach((column) => {
      column.width = Math.max(
        column.header?.length || 10,
        ...worksheet
          .getColumn(column.key)
          .values.filter((value) => value)
          .map((value) => String(value).length)
      );
    });
  }

  const handleVerDetalles = async (pedidoId) => {
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedidoId)
      ).unwrap();
      detalles.sort(
        (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
      );
      setDetallesPedido(detalles);

      const pedido = pedidos.find((p) => p.id === pedidoId);
      if (pedido) {
        setSelectedPedido(pedido);
        onOpen();
      } else {
        toast({
          title: "Error",
          description: "No se encontró el pedido seleccionado.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(
        `Error al obtener los detalles del pedido ${pedidoId}:`,
        error
      );
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} boxShadow="xl" bg={bgColor} color={textColor} rounded="lg">
      <Flex justify="flex-start" mb={6} gap={4}>
        <Button
          colorScheme="blue"
          onClick={handleExportConsolidadoFormato1}
          isLoading={isExporting}
          loadingText="Exportando..."
          disabled={pedidosAprobados.length === 0}
        >
          Exportar Formato 1
        </Button>

        <Button
          colorScheme="teal"
          onClick={handleExportConsolidadoFormato2}
          isLoading={isExporting}
          loadingText="Exportando..."
          disabled={pedidosAprobados.length === 0}
        >
          Exportar Formato 2
        </Button>
      </Flex>

      <AprobadosTable
        pedidosAprobados={pedidosAprobados}
        handleVerDetalles={handleVerDetalles}
      />

      <DetallesModal
        isOpen={isOpen}
        onClose={onClose}
        detalles={detallesPedido}
        pedido={selectedPedido}
      />
    </Box>
  );
};

export default AprobadosPage;
