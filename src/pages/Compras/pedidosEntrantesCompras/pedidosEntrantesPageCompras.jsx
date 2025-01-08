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
import { tablaPedidosConDetalles  } from "../../../store/Pedidos/thunks";
import FiltrosPedidos from "./componentes/FiltrosPedidos";
import PedidosTable from "./componentes/PedidosTable";
import DetallesModal from "./componentes/DetallesModal";
import * as ExcelJS from "exceljs";
import moment from "moment";

const PedidosEntrantesPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [filtros, setFiltros] = useState({
    fechaEntrega: "",
    palabrasClave: "",
  });

  // const pedidosEntrantes = useSelector((state) => state.pedidos.data) || [];
  const pedidosEntrantes = useSelector((state) => state.pedidos.pedidosConDetalles) || [];
  const { isOpen, onClose } = useDisclosure();
  const [selectedPedido] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        await dispatch(tablaPedidosConDetalles());
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los pedidos entrantes.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    obtenerPedidos();
  }, [dispatch, toast]);

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  // **Aplicar Filtros a los pedidos**
  const pedidosFiltrados = pedidosEntrantes.filter((pedido) => {
    const cumpleFecha =
      !filtros.fechaEntrega ||
      moment(pedido.fechaEntrega).isSame(moment(filtros.fechaEntrega), 'day');
    const cumplePalabras =
      !filtros.palabrasClave ||
      pedido.items.some((item) =>
        (item.nombreProducto || item.nombre || '')
          .toLowerCase()
          .includes(filtros.palabrasClave.toLowerCase())
      );
    return cumpleFecha && cumplePalabras;
  });

  // **Agrupar los items de los pedidos filtrados por deudor**
  const itemsAgrupadosPorDeudor = {};

  pedidosFiltrados.forEach((pedido) => {
    const deudor = pedido.nombreDeu;
    if (!itemsAgrupadosPorDeudor[deudor]) {
      itemsAgrupadosPorDeudor[deudor] = [];
    }
    const items = pedido.items || []; // Asegúrate de que 'items' está presente
    items.forEach((item) => {
      itemsAgrupadosPorDeudor[deudor].push({
        ...item,
        deudor,
        fechaEntrega: pedido.fechaEntrega, // Añadimos fecha de entrega al item
      });
    });
  });

  const handleAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };


  const handleExportarExcel = async () => {
    try {
      const pedidosFiltrados = pedidosEntrantes.filter((pedido) => {
        const cumpleFecha =
          !filtros.fechaEntrega ||
          pedido.fechaEntrega.startsWith(filtros.fechaEntrega);
        const cumplePalabras =
          !filtros.palabrasClave ||
          pedido.items.some((item) =>
            item.nombre
              .toLowerCase()
              .includes(filtros.palabrasClave.toLowerCase())
          );
        return cumpleFecha && cumplePalabras;
      });

      if (pedidosFiltrados.length === 0) {
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
        { header: "Fecha de Entrega", key: "fechaEntrega", width: 20 },
      ];

      // Agregar filas
      pedidosFiltrados.forEach((pedido) => {
        worksheet.addRow({
          id: pedido.id,
          nombreDeu: pedido.nombreDeu,
          nombreTienda: pedido.nombreTienda,
          fechaEntrega: pedido.fechaEntrega,
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
      a.download = "pedidos_entrantes.xlsx";
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

      {/* Formulario de Filtros */}
      <FiltrosPedidos onAplicarFiltros={handleAplicarFiltros} />

      {/* Tabla de Pedidos */}
      <PedidosTable
        itemsAgrupadosPorDeudor={itemsAgrupadosPorDeudor}
        filtros={filtros}
      />

      {/* Modal de Detalles */}
      <DetallesModal
        isOpen={isOpen}
        onClose={onClose}
        pedido={selectedPedido}
      />
    </Box>
  );
};

export default PedidosEntrantesPage;
