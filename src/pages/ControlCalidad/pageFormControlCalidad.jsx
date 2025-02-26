import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompras,
  consolidateCompras,
} from "../../../store/Compras/thunks";
import FiltrosPedidos from "./componentes/FiltrosPedidos";
import ControlCalidadTable from "./componentes/ControlCalidadTable";
import DetallesModal from "./componentes/DetallesModal";
import * as ExcelJS from "exceljs";
import moment from "moment";

const ControlCalidadPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  // Para evitar doble ejecución de useEffect en StrictMode
  const effectRan = useRef(false);

  // Filtros locales
  const [filtros, setFiltros] = useState({
    fechaOrden: "",       // puede ser "YYYY-MM-DD"
    palabrasClave: "",    // texto a buscar
  });

  // Obtenemos los datos de Redux
  const { data: comprasData } = useSelector((state) => state.compras);

  // Modal de detalles
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCompra, setSelectedCompra] = useState(null);

  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // 1) Efecto inicial: consolida + fetch
  useEffect(() => {
    if (effectRan.current) return;

    const hacerConsolidacionYObtener = async () => {
      try {
        await dispatch(consolidateCompras({ estadoId: 5 }));
        await dispatch(fetchCompras());
      } catch (err) {
        toast({
          title: "Error",
          description: "No se pudieron cargar/actualizar las compras.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    hacerConsolidacionYObtener();
    effectRan.current = true;
  }, [dispatch, toast]);

  // Mientras carga, Spinner
  if (isLoading) {
    return <Spinner size="xl" />;
  }

  // 2) Filtro en memoria
  const comprasFiltradas = comprasData.filter((compras) => {
    // Compara fecha si existe en los filtros
    const fechaCompra = moment.utc(compras.fecha).format("YYYY-MM-DD");
    const fechaFiltro = filtros.fechaOrden; // asumo que ya viene "YYYY-MM-DD"
    
    const cumpleFecha =
      !fechaFiltro || fechaCompra === fechaFiltro;

    // Compara palabras clave en el nombre
    const cumplePalabras =
      !filtros.palabrasClave ||
      (compras.nombre || "").toLowerCase().includes(
        filtros.palabrasClave.toLowerCase()
      );

    return cumpleFecha && cumplePalabras;
  });

  // 3) Agrupar por "deudor"
  const itemsAgrupadosPorDeudor = {};
  comprasFiltradas.forEach((compras) => {
    const deudor = compras.deudorNombre || `${compras.nombreDeu} - ${compras.nombreCorrelativo}`;
    if (!itemsAgrupadosPorDeudor[deudor]) {
      itemsAgrupadosPorDeudor[deudor] = [];
    }
    itemsAgrupadosPorDeudor[deudor].push({
      id: compras.id,
      codigo: compras.codigo,
      nombre: compras.nombre,
      cantidad: compras.cantidad,
      pedido_venta: compras.pedido_venta,
      cantidadAsignada: compras.cantidadAsignada,
      // etc...
    });
  });

  // Convertimos a arrays, si lo necesitas
  const itemsAgrupadosPorDeudorArray = {};
  for (const deudor in itemsAgrupadosPorDeudor) {
    itemsAgrupadosPorDeudorArray[deudor] = Object.values(
      itemsAgrupadosPorDeudor[deudor]
    );
  }

  // 4) Manejar filtros (desde FiltrosPedidos)
  const handleAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  // 5) Ver detalles (abre el modal)
  const handleVerDetalles = (compra) => {
    setSelectedCompra(compra);
    onOpen();
  };

  // 6) Exportar a Excel
  const handleExportarExcel = async () => {
    try {
      // Filtramos de nuevo para Excel, si es necesario
      const comprasFiltrados = comprasFiltradas.filter((compra) => {
        // Ajustar si usas "fechaOrden" vs "fecha"
        const cumpleFecha =
          !filtros.fechaOrden ||
          moment.utc(compra.fecha).format("YYYY-MM-DD") === filtros.fechaOrden;

        const cumplePalabras =
          !filtros.palabrasClave ||
          (compra.nombre || "").toLowerCase().includes(
            filtros.palabrasClave.toLowerCase()
          );

        return cumpleFecha && cumplePalabras;
      });

      if (comprasFiltrados.length === 0) {
        toast({
          title: "Aviso",
          description: "No hay datos para exportar.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Creamos workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pedidos Entrantes");

      // Definimos columnas
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Deudor", key: "nombreDeu", width: 30 },
        { header: "Tienda", key: "nombreTienda", width: 30 },
        { header: "Fecha de Entrega", key: "fechaOrden", width: 20 },
      ];

      // Llenamos filas
      comprasFiltrados.forEach((item) => {
        worksheet.addRow({
          id: item.id,
          nombreDeu: item.nombreDeu,
          nombreTienda: item.nombreTienda,
          fechaOrden: moment.utc(item.fecha).format("DD/MM/YYYY"),
        });
      });

      // Convertimos a buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Descargamos
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pedidos_agrupados.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      toast({
        title: "Error",
        description: "No se pudo exportar a Excel.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Render final
  return (
    <Box p={6} boxShadow="xl" bg="white" rounded="lg">
      <Heading mb={4}>Pedidos Entrantes Compras</Heading>
      <Flex justify="space-between" alignItems="center" mb={4}>
        <Stack direction="row" spacing={2}>
          <Button colorScheme="teal" onClick={handleExportarExcel}>
            Exportar a Excel
          </Button>
        </Stack>
      </Flex>

      {/* Componente de filtros */}
      <FiltrosPedidos onAplicarFiltros={handleAplicarFiltros} />

      {/* Tabla de resultados */}
      <ControlCalidadTable
        itemsAgrupadosPorDeudor={itemsAgrupadosPorDeudorArray}
        filtros={filtros}
        handleVerDetalles={handleVerDetalles}
      />

      {/* Modal de detalles */}
      <DetallesModal
        isOpen={isOpen}
        onClose={onClose}
        pedido={selectedCompra}
      />
    </Box>
  );
};

export default ControlCalidadPage;
