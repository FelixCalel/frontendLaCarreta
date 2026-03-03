import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { DownloadIcon } from "@chakra-ui/icons";
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

  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.700", "white");

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const roleId = parseInt(localStorage.getItem("roleId") || 0);

    if (isNaN(roleId)) {
      console.error("RoleId inválido:", roleId);
      toast({
        title: "Error",
        description: "Rol no identificado",
        status: "error",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        await dispatch(consolidateCompras({ estadoId: 5 }));
        await dispatch(fetchCompras(roleId));
      } catch (err) {
        // ...
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [dispatch, toast, setIsLoading]);

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
      p={4}
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="calc(100vh - 100px)"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Box
        w="100%"
        bg={useColorModeValue("white", "gray.800")}
        rounded="xl"
        boxShadow="md"
        p={4}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Flex
          justify="space-between"
          alignItems="center"
          mb={4}
          borderBottomWidth="1px"
          pb={4}
          borderColor={useColorModeValue("gray.100", "gray.700")}
        >
          <Heading
            size="lg"
            color={useColorModeValue("green.700", "green.300")}
            fontWeight="bold"
          >
            Panel de Compras
          </Heading>
          <Button
            colorScheme="green"
            onClick={handleExportarExcel}
            leftIcon={<DownloadIcon />}
            _hover={{ transform: "scale(1.02)", bg: "green.600" }}
            transition="all 0.2s"
          >
            Exportar a Excel
          </Button>
        </Flex>

        <Box
          mb={6}
          p={3}
          bg={useColorModeValue("green.50", "gray.700")}
          border="1px solid"
          borderColor={useColorModeValue("green.100", "gray.600")}
          rounded="md"
        >
          <FiltrosCompras onAplicarFiltros={handleAplicarFiltros} />
        </Box>

        <ComprasTable
          compras={comprasFiltradas}
          onRegistrarProveedor={handleRegistrarProveedor}
        />
        <RegistrarProveedorModal
          isOpen={isOpenRegistrar}
          onClose={onCloseRegistrar}
          item={selectedItem}
        />
      </Box>
    </MotionBox>
  );
};

export default CompradoresPage;
