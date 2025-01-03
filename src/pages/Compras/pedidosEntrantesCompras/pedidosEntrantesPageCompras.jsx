// src/pages/pedidosEntrantes/PedidosEntrantesPage.jsx

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
  Stack,
  Spinner 
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos } from "../../../store/Pedidos/thunks";
import FiltrosPedidos from "./componentes/FiltrosPedidos";
import PedidosTable from "./componentes/PedidosTable";
import DetallesModal from "./componentes/DetallesModal";
import * as ExcelJS from 'exceljs';


const PedidosEntrantesPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [filtros, setFiltros] = useState({
    fechaEntrega: "",
    palabrasClave: "",
  });

  const pedidosEntrantes = useSelector((state) => state.pedidos.data) || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        await dispatch(tablaPedidos());
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

  const handleAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    // Aquí puedes filtrar los pedidos según los filtros aplicados
  };

  const handleVerDetalles = (pedidoId) => {
    const pedido = pedidosEntrantes.find((p) => p.id === pedidoId);
    if (pedido) {
      setSelectedPedido(pedido);
      onOpen();
    }
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
              item.nombre.toLowerCase().includes(filtros.palabrasClave.toLowerCase())
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
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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

  const handleCerrarFecha = () => {
    // Implementa la lógica para cerrar fecha
  };

  const handleAgruparPorDeudor = () => {
    // Implementa la lógica para agrupar por DEU
  };

  return (
    <Box p={6} boxShadow="xl" bg="white" rounded="lg">
      <Heading mb={4}>Pedidos Entrantes Compras</Heading>
      <Flex justify="space-between" alignItems="center" mb={4}>
        <Stack direction="row" spacing={2}>
          <Button colorScheme="teal" onClick={handleCerrarFecha}>
            Cerrar Fecha
          </Button>
          <Button colorScheme="teal" onClick={handleExportarExcel}>
            Exportar a Excel
          </Button>
          <Button colorScheme="teal" onClick={handleAgruparPorDeudor}>
            Agrupar por DEU
          </Button>
        </Stack>
      </Flex>

      {/* Formulario de Filtros */}
      <FiltrosPedidos onAplicarFiltros={handleAplicarFiltros} />

      {/* Tabla de Pedidos */}
      <PedidosTable
        pedidos={pedidosEntrantes}
        filtros={filtros}
        onVerDetalles={handleVerDetalles}
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
