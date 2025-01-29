import { useEffect, useState } from "react";
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
import { fetchCompras, consolidateCompras } from "../../../store/Compras/thunks";
import FiltrosPedidos from "./componentes/FiltrosPedidos";
import PedidosTable from "./componentes/PedidosTable";
import DetallesModal from "./componentes/DetallesModal";
import * as ExcelJS from "exceljs";
import moment from "moment";

const PedidosEntrantesPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [filtros, setFiltros] = useState({
    fechaOrden: "",
    palabrasClave: "",
  });

  const { data: comprasData } = useSelector((state) => state.compras);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hacerConsolidacionYObtener = async () => {
      try {
        // 1) Consolidar (p.ej. estadoId=5)
        await dispatch(consolidateCompras({ estadoId: 5 }));
        // 2) Luego fetch de la tabla de compras
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
  }, [dispatch, toast]);

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  // **Aplicar Filtros a los pedidos**
  const comprasFiltradas = comprasData.filter((compras) => {
    const cumpleFecha =
      !filtros.fechaOrden ||
      moment(compras.fecha).isSame(moment(filtros.fechaOrden), "day");
    const cumplePalabras =
      !filtros.palabrasClave ||
      (compras.nombre || "").toLowerCase().includes(filtros.palabrasClave.toLowerCase());
    return cumpleFecha && cumplePalabras;
  });

  // **Agrupar los items de los pedidos filtrados por deudor**
  const itemsAgrupadosPorDeudor = {};
  comprasFiltradas.forEach((compras) => {
    // Asume que tienes un 'deudorNombre' o algo similar
    const deudor = compras.deudorNombre || `${compras.nombreDeu} - ${compras.deudorId}`;
    if (!itemsAgrupadosPorDeudor[deudor]) {
      itemsAgrupadosPorDeudor[deudor] = [];
    }
    itemsAgrupadosPorDeudor[deudor].push({
      codigo: compras.codigo,
      nombre: compras.nombre,
      cantidad: compras.cantidad,
    });
  });

  const itemsAgrupadosPorDeudorArray = {};
  for (const deudor in itemsAgrupadosPorDeudor) {
    itemsAgrupadosPorDeudorArray[deudor] = Object.values(
      itemsAgrupadosPorDeudor[deudor]
    );
  }

  const handleAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const handleVerDetalles = (compra) => {
    setSelectedCompra(compra);
    onOpen();
  };

  const handleExportarExcel = async () => {
    try {
      const comprasFiltrados = comprasFiltradas.filter((compras) => {
        const cumpleFecha =
          !filtros.fechaOrden ||
          compras.fechaOrden.startsWith(filtros.fechaOrden);
        const cumplePalabras =
          !filtros.palabrasClave ||
          compras.items.some((item) =>
            item.nombre
              .toLowerCase()
              .includes(filtros.palabrasClave.toLowerCase())
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

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pedidos Entrantes");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Deudor", key: "nombreDeu", width: 30 },
        { header: "Tienda", key: "nombreTienda", width: 30 },
        { header: "Fecha de Entrega", key: "fechaOrden", width: 20 },
      ];

      // Agregar filas
      comprasFiltrados.forEach((item) => {
        worksheet.addRow({
          codigo: item.codigo,
          nombre: item.nombre,
          cantidad: item.cantidad,
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
      <FiltrosPedidos onAplicarFiltros={handleAplicarFiltros} />
      <PedidosTable
        itemsAgrupadosPorDeudor={itemsAgrupadosPorDeudorArray}
        filtros={filtros}
        handleVerDetalles={handleVerDetalles}
      />
      <DetallesModal
        isOpen={isOpen}
        onClose={onClose}
        pedido={selectedCompra}
      />
    </Box>
  );
};

export default PedidosEntrantesPage;
