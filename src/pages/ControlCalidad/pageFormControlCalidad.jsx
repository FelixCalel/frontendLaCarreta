import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompras, consolidateCompras } from "../../store/Compras/thunks";
import ControlCalidadTable from "./componentes/ControlCalidadTable";
import DetallesModal from "./componentes/DetallesModal";
import * as ExcelJS from "exceljs";
import FiltrosCompras from "./componentes/FiltrosCompras";
import { FaFileExport } from "react-icons/fa";
import SEO from "../../components/SEO";

const toYMD = (dateString) =>
  dateString ? new Date(dateString).toISOString().split("T")[0] : "";
const toDMY = (dateString) => {
  if (!dateString) return "";
  const [y, m, d] = new Date(dateString).toISOString().split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};

const ControlCalidadPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const effectRan = useRef(false);

  const { data: comprasData } = useSelector((state) => state.compras);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comprasState, setComprasState] = useState(comprasData);

  const pageBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "white");
  const [filtros, setFiltros] = useState({
    fechaIngreso: "",
    palabrasClave: "",
  });

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const roleId = parseInt(localStorage.getItem("roleId") || 0);
    if (isNaN(roleId) || roleId === 0) {
      console.error("RoleId inválido:", roleId);
      setIsLoading(false);
      return;
    }

    const hacerConsolidacionYObtener = async () => {
      try {
        await dispatch(consolidateCompras({ estadoId: 5 }));
        await dispatch(fetchCompras(roleId));
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

  const comprasFiltradas = comprasData.filter((compras) => {
    const fechaCompra = toYMD(compras.fechaIngreso);
    const fechaFiltro = filtros.fechaIngreso;

    const cumpleFecha = !fechaFiltro || fechaCompra === fechaFiltro;

    const cumplePalabras =
      !filtros.palabrasClave ||
      (compras.nombre || "")
        .toLowerCase()
        .includes(filtros.palabrasClave.toLowerCase());
    const tieneProveedor =
      compras.nombreProveedor && compras.nombreProveedor !== "Sin proveedores";

    return cumpleFecha && cumplePalabras && tieneProveedor;
  });

  const itemsAgrupadosPorDeudor = {};
  comprasFiltradas.forEach((compras) => {
    const deudor =
      compras.deudorNombre ||
      `${compras.nombreDeu} - ${compras.nombreCorrelativo}`;
    if (!itemsAgrupadosPorDeudor[deudor]) {
      itemsAgrupadosPorDeudor[deudor] = [];
    }
    itemsAgrupadosPorDeudor[deudor].push({
      id: compras.id,
      codigo: compras.codigo,
      nombre: compras.nombre,
      nombreTienda: compras.nombreTienda,
      nombreProveedor: compras.nombreProveedor,
      cantidad: compras.cantidad,
      cantidadAsignada: compras.cantidadAsignada,
      pedido_compra: compras.pedido_compra,
    });
  });

  const itemsAgrupadosPorDeudorArray = {};
  for (const deudor in itemsAgrupadosPorDeudor) {
    itemsAgrupadosPorDeudorArray[deudor] = Object.values(
      itemsAgrupadosPorDeudor[deudor],
    );
  }

  const actualizarCantidadRecibida = (id, nuevaCantidad) => {
    const updatedItems = comprasState.map((item) =>
      item.id === id ? { ...item, pedido_compra: nuevaCantidad } : item,
    );
    setComprasState(updatedItems);
  };

  const handleEditar = (item) => {
    setSelectedCompra(item);
    onOpen();
  };

  const handleExportarExcel = async () => {
    try {
      const comprasFiltrados = comprasFiltradas.filter((compra) => {
        const cumpleFecha =
          !filtros.fechaOrden || toYMD(compra.fecha) === filtros.fechaOrden;

        const cumplePalabras =
          !filtros.palabrasClave ||
          (compra.nombre || "")
            .toLowerCase()
            .includes(filtros.palabrasClave.toLowerCase());

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

      comprasFiltrados.forEach((item) => {
        worksheet.addRow({
          id: item.id,
          nombreDeu: item.nombreDeu,
          nombreTienda: item.nombreTienda,
          fechaOrden: toDMY(item.fecha),
        });
      });

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

  const handleAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  return (
    <Box p={6} boxShadow="xl" bg={pageBg} rounded="lg">
      <SEO
        title="Control de Calidad"
        description="Inventario y control de calidad."
      />
      <Flex justify="space-between" alignItems="center" mb={4}>
        <Heading mb={4} color={headingColor}>
          Inventario
        </Heading>
        <Button
          colorScheme="green"
          bg="green.500"
          _hover={{ bg: "green.600" }}
          leftIcon={<FaFileExport />}
          onClick={handleExportarExcel}
        >
          Exportar a Excel
        </Button>
      </Flex>

      <FiltrosCompras onAplicarFiltros={handleAplicarFiltros} />

      <ControlCalidadTable
        itemsAgrupadosPorDeudor={itemsAgrupadosPorDeudorArray}
        filtros={filtros}
        onEditar={handleEditar}
      />
      <DetallesModal
        isOpen={isOpen}
        onClose={onClose}
        pedido={selectedCompra}
        actualizarCantidadRecibida={actualizarCantidadRecibida}
      />
    </Box>
  );
};

export default ControlCalidadPage;
