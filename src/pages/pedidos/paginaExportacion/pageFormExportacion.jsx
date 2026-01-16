import { useEffect, useState, useMemo, useRef } from "react";
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
import ConfirmExportDialog from "./components/confirmDialog";
import {
  togglePedidoStatus,
  tablaPedidos,
  updatePedidoActivacion,
  exportarPedidoSap,
} from "../../../store/Pedidos/thunks";
import { removePedidos } from "../../../store/Pedidos/pedidoSlice";
import { tablaEmpresa } from "../../../store/Empresa/thunks";
import { selectPedidosEntrantesPorRuta } from "../pedidosEntrantes/componentes/rutaSelectors";
import { tablaTienda } from "../../../store/Tienda/thunks";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useWebSocket } from "../../../providers/WebSocketProvider";
import * as ExcelJS from "exceljs";

const AprobadosPage = () => {
  const { socket } = useWebSocket();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPedidosToRevert, setSelectedPedidosToRevert] = useState([]);
  const [isReverting, setIsReverting] = useState(false);
  const toast = useToast();
  const pedidos = useSelector((state) => state.pedidos.data);
  const selectAprobadosPorRuta = useMemo(
    () => selectPedidosEntrantesPorRuta([3]),
    []
  );
  const pedidosAprobados = useSelector(selectAprobadosPorRuta);
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const {
    isOpen: isExportDlgOpen,
    onOpen: openExportDlg,
    onClose: closeExportDlg,
  } = useDisclosure();
  const [exportVariant, setExportVariant] = useState("f1");

  const pedirConfirmacion = (variant) =>
    new Promise((resolve) => {
      setExportVariant(variant);
      confirmExportRef.current = resolve;
      openExportDlg();
    });

  const confirmExportRef = useRef(() => {});

  useEffect(() => {
    const fetchPedidos = async () => {
      await dispatch(tablaPedidos());
    };
    fetchPedidos();
  }, [dispatch]);

  useEffect(() => {
    dispatch(tablaTienda());
    dispatch(tablaEmpresa());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleOrderStatusChange = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'on-order-status-changed') {
                console.log("WebSocket event received:", data.payload);
                dispatch(tablaPedidos());
            }
        } catch (error) {
            console.error("Error processing WebSocket message:", error);
        }
    };

    socket.addEventListener('message', handleOrderStatusChange);

    return () => {
        socket.removeEventListener('message', handleOrderStatusChange);
    };
  }, [socket, dispatch]);

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
            updatePedidoActivacion({ id: pedido.id, isActive: false })
          ).unwrap();
        })
      );
      console.log("Pedidos exportados y desactivados correctamente.");
    } catch (error) {
      console.error("Error al exportar y desactivar pedidos:", error);
    }
  };

  const sinPedidosToast = () =>
    toast({
      title: "Sin pedidos aprobados",
      description: "No hay pedidos en estado 'Aprobado' para exportar.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

  const handleExportConsolidadoFormato2 = async () => {
    if (pedidosAprobados.length === 0) {
      sinPedidosToast();
      return;
    }

    const ok = await pedirConfirmacion("f2");
    if (!ok) return;

    setIsExporting(true);
    
    try {
      const sapResult = await dispatch(exportarPedidoSap()).unwrap();
      
      const results = Array.isArray(sapResult) ? sapResult : [];
      const successfulExports = results.filter(r => r.status === "SUCCESS");
      const failedExports = results.filter(r => r.status === "ERROR");

      if (failedExports.length > 0) {
        failedExports.forEach(fail => {
          toast({
            title: `Error en Pedido #${fail.pedidoId}`,
            description: fail.message || fail.sapResponse || "Error desconocido en SAP",
            status: "warning",
            duration: 6000,
            isClosable: true,
          });
        });
      }

      if (successfulExports.length === 0 && failedExports.length > 0) {
        setIsExporting(false);
        return;
      }

      const successfulIds = successfulExports.map(r => r.pedidoId);
      const successfulPedidos = pedidosAprobados.filter(p => successfulIds.includes(p.id));

      if (successfulPedidos.length > 0) {
        const pedidosConDetalles = await cargarDetallesPedidos(successfulPedidos);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Pedidos Consolidados F2");
        const pedidosPorDeudor = agruparPedidosPorDeudor(pedidosConDetalles);
        await addPedidosToWorksheetFormato2(worksheet, pedidosPorDeudor);
        await descargarWorkbook(workbook, `pedidos_exportados_${new Date().getTime()}.xlsx`);
        await actualizarEstadoPedidosExportados(successfulPedidos);
        dispatch(removePedidos(successfulIds));

        toast({
          title: "Exportación parcial",
          description: `Se exportaron ${successfulPedidos.length} pedidos. ${failedExports.length} fallaron.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error en exportación formato 2:", err);
      toast({
        title: "Error inesperado",
        description:
          err.message || "No se pudo completar la exportación Formato 2.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
        "Tienda",
        "Código",
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

  const handleTogglePedidoSelection = (pedidoId) => {
    setSelectedPedidosToRevert((prev) => {
      if (prev.includes(pedidoId)) {
        return prev.filter((id) => id !== pedidoId);
      } else {
        return [...prev, pedidoId];
      }
    });
  };

  const handleSelectAllPedidos = (selectAll) => {
    if (selectAll) {
      setSelectedPedidosToRevert(pedidosAprobados.map((p) => p.id));
    } else {
      setSelectedPedidosToRevert([]);
    }
  };

  const handleRevertPedidosToEstado2 = async () => {
    if (selectedPedidosToRevert.length === 0) {
      toast({
        title: "Sin selección",
        description:
          "Selecciona al menos un pedido para regresar al estado anterior.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsReverting(true);
    try {
      const results = await Promise.allSettled(
        selectedPedidosToRevert.map((pedidoId) => {
          const pedidoCompleto = pedidosAprobados.find(
            (p) => p.id === pedidoId
          );

          return dispatch(
            togglePedidoStatus({
              id: pedidoId,
              estadoId: 2,
              comentario: pedidoCompleto?.comentario || "",
              comentarioDisplay: pedidoCompleto?.comentarioDisplay || "",
              fechaOrdenDisplay:
                pedidoCompleto?.fechaOrdenDisplay || pedidoCompleto?.fechaOrden,
            })
          ).unwrap();
        })
      );

      const successful = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successful > 0) {
        toast({
          title: "Operación completada",
          description: `${successful} pedido(s) regresado(s) al estado anterior exitosamente.${
            failed > 0 ? ` ${failed} pedido(s) fallaron.` : ""
          }`,
          status:
            successful === selectedPedidosToRevert.length
              ? "success"
              : "warning",
          duration: 4000,
          isClosable: true,
        });

        setSelectedPedidosToRevert([]);

        await dispatch(tablaPedidos());
      } else {
        toast({
          title: "Error",
          description: "No se pudo regresar ningún pedido al estado anterior.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al regresar pedidos al estado 2:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al intentar regresar los pedidos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsReverting(false);
    }
  };

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
      <Flex justify="space-between" mb={6} align="center">
        <Button
          colorScheme="teal"
          onClick={handleExportConsolidadoFormato2}
          isLoading={isExporting}
          loadingText="Exportando..."
          disabled={pedidosAprobados.length === 0}
        >
          Exportar a SAP
        </Button>

        <Button
          colorScheme="orange"
          onClick={handleRevertPedidosToEstado2}
          isLoading={isReverting}
          loadingText="Procesando..."
          disabled={selectedPedidosToRevert.length === 0}
        >
          Regresar seleccionados al estado anterior (
          {selectedPedidosToRevert.length})
        </Button>
      </Flex>
      <ConfirmExportDialog
        isOpen={isExportDlgOpen}
        onClose={() => {
          closeExportDlg();
          confirmExportRef.current(false);
        }}
        onConfirm={() => {
          confirmExportRef.current(true);
          closeExportDlg();
        }}
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
        isOpen={isOpen}
        onClose={onClose}
        detalles={detallesPedido}
        pedido={selectedPedido}
      />
    </Box>
  );
};

export default AprobadosPage;
