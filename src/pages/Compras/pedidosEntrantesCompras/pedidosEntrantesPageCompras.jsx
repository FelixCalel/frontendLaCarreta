import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Spinner,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConsolidado } from "../../../store/Pedidos/DetallePedidos/thunks";
import FiltrosPedidos from "./componentes/FiltrosPedidos";

const toYMD = (dateString) =>
  dateString ? new Date(dateString).toISOString().split("T")[0] : "";
import ConsolidadoTable from "./componentes/consolidadoTable";
import DetallesModal from "./componentes/DetallesModal";
import { selectConsolidadoEstado } from "../../../store/Pedidos/DetallePedidos/detalleOrdenSlice";

const PedidosEntrantesPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [filtros, setFiltros] = useState({ fechaOrden: "", palabrasClave: [] });
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");

  const contBg = useColorModeValue("white", "gray.800");
  const boxBorder = useColorModeValue("gray.200", "gray.700");
  const headBorder = useColorModeValue("gray.100", "gray.700");
  const titleColor = useColorModeValue("green.700", "green.300");
  const filterBg = useColorModeValue("green.50", "gray.700");
  const filterBorder = useColorModeValue("green.100", "gray.600");

  const {
    data: consolidado = [],
    status,
    error,
  } = useSelector(selectConsolidadoEstado);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const roleId = Number(localStorage.getItem("roleId") || 0);
        if (!roleId) {
          setLoading(false);
          return;
        }
        await dispatch(fetchConsolidado(roleId)).unwrap();
      } catch {
        toast({
          title: "Error al cargar el consolidado",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch, toast]);

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  const consolidadosFiltrados = consolidado.filter((c) => {
    const fechaItem = toYMD(c.fechaOrden);
    const okFecha = !filtros.fechaOrden || fechaItem === filtros.fechaOrden;
    const okPal =
      filtros.palabrasClave.length === 0 ||
      filtros.palabrasClave.some((w) =>
        (c.nombreProducto || "").toLowerCase().includes(w),
      );
    return okFecha && okPal;
  });

  const handleVerDetalle = (registro) => {
    setSelectedRegistro(registro);
    onOpen();
  };

  return (
    <Box p={4} bg={bg} minH="calc(100vh - 100px)">
      <Box
        w="100%"
        bg={contBg}
        rounded="xl"
        boxShadow="md"
        p={4}
        borderWidth="1px"
        borderColor={boxBorder}
      >
        <Flex
          justify="space-between"
          align="center"
          mb={4}
          borderBottomWidth="1px"
          pb={2}
          borderColor={headBorder}
        >
          <Heading size="md" color={titleColor} fontWeight="bold">
            Consolidado de Pedidos
          </Heading>
        </Flex>

        <Box
          mb={4}
          p={3}
          bg={filterBg}
          border="1px solid"
          borderColor={filterBorder}
          rounded="md"
        >
          <FiltrosPedidos onAplicarFiltros={setFiltros} />
        </Box>
        <ConsolidadoTable
          data={consolidadosFiltrados}
          status={status}
          error={error}
          onVerDetalle={handleVerDetalle}
        />
        <DetallesModal
          key={selectedRegistro?.id || "detalles-modal"}
          isOpen={isOpen}
          onClose={onClose}
          pedido={selectedRegistro}
        />
      </Box>
    </Box>
  );
};

export default PedidosEntrantesPage;
