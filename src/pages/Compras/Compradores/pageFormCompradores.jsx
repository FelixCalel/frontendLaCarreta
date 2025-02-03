import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CalendarIcon, DownloadIcon } from "@chakra-ui/icons";
import moment from "moment";
import * as ExcelJS from "exceljs";
import {
  fetchCompras,
  consolidateCompras,
} from "../../../store/Compras/thunks";
import FiltrosCompras from "./componentes/FiltroCompras";
import ComprasTable from "./componentes/ComprasTable";
import RegistrarProveedorModal from "./componentes/RegistrarProveedorModal";

const MotionBox = motion(Box);

const CompradoresPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const hasLoadedRef = useRef(false);

  const [filtros, setFiltros] = useState({
    fechaOrden: "",
    palabrasClave: "",
  });

  const { data: comprasData } = useSelector((state) => state.compras);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isOpen: isOpenRegistrar,
    onOpen: onOpenRegistrar,
    onClose: onCloseRegistrar,
  } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (hasLoadedRef.current) return; // Si ya se cargó una vez, no lo hagas otra vez
    hasLoadedRef.current = true;
    const cargarDatos = async () => {
      try {
        await dispatch(consolidateCompras({ estadoId: 5 }));
        await dispatch(fetchCompras());
      } catch (err) {
        toast({
          title: "Error",
          description: "Ocurrió un problema",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const handleAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const comprasFiltradas = comprasData.filter((compra) => {
    const fechaCompra = moment.utc(compra.fecha).format("YYYY-MM-DD");
    const fechaFiltro = filtros.fechaOrden
      ? moment.utc(filtros.fechaOrden).format("YYYY-MM-DD")
      : "";

    const cumpleFecha = !filtros.fechaOrden || fechaCompra === fechaFiltro;
    const cumplePalabras =
      !filtros.palabrasClave ||
      (compra.nombre || "")
        .toLowerCase()
        .includes(filtros.palabrasClave.toLowerCase());

    return cumpleFecha && cumplePalabras;
  });

  const handleExportarExcel = async () => {
    try {
      if (comprasFiltradas.length === 0) {
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
      const worksheet = workbook.addWorksheet("Compras");

      worksheet.columns = [
        { header: "Código", key: "codigo", width: 15 },
        { header: "Nombre", key: "nombre", width: 25 },
        { header: "DEU", key: "deu", width: 20 },
        { header: "Cantidad Solicitada", key: "cantSolicitada", width: 20 },
        { header: "Cantidad Asignada", key: "cantAsignada", width: 20 },
      ];

      comprasFiltradas.forEach((compra) => {
        worksheet.addRow({
          codigo: compra.codigo,
          nombre: compra.nombre,
          deu: compra.deudorNombre,
          cantSolicitada: compra.cantidad,
          cantAsignada: compra.cantidadAsignada ?? 0,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compras.xlsx";
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

  const handleRegistrarProveedor = (item) => {
    setSelectedItem(item);
    onOpenRegistrar();
  };

  return (
    <MotionBox
      bg="white"
      minH="100vh"
      p={6}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Heading mb={4} color="gray.700" fontWeight="extrabold">
        Panel de Compras
      </Heading>
      <Flex justify="space-between" alignItems="center" mb={4}>
        <Stack direction="row" spacing={3}>
          <Button
            colorScheme="teal"
            onClick={handleExportarExcel}
            leftIcon={<DownloadIcon />}
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s"
          >
            Exportar a Excel
          </Button>
          <Button
            colorScheme="orange"
            onClick={() => alert("Ver Planificación")}
            leftIcon={<CalendarIcon />}
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s"
          >
            Ver Planificación
          </Button>
        </Stack>
      </Flex>
      <FiltrosCompras onAplicarFiltros={handleAplicarFiltros} />
      <ComprasTable
        compras={comprasFiltradas}
        onRegistrarProveedor={handleRegistrarProveedor}
      />
      <RegistrarProveedorModal
        isOpen={isOpenRegistrar}
        onClose={onCloseRegistrar}
        item={selectedItem}
      />
    </MotionBox>
  );
};

export default CompradoresPage;
