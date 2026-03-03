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
import moment from "moment";
import { fetchConsolidado } from "../../../store/Pedidos/DetallePedidos/thunks";
import FiltrosPedidos from "./componentes/FiltrosPedidos";
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
    const fechaItem = moment.utc(c.fechaOrden).format("YYYY-MM-DD");
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
        bg={useColorModeValue("white", "gray.800")}
        rounded="xl"
        boxShadow="md"
        p={4}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Flex
          justify="space-between"
          align="center"
          mb={4}
          borderBottomWidth="1px"
          pb={2}
          borderColor={useColorModeValue("gray.100", "gray.700")}
        >
          <Heading
            size="md"
            color={useColorModeValue("green.700", "green.300")}
            fontWeight="bold"
          >
            Consolidado de Pedidos
          </Heading>
        </Flex>

        <Box
          mb={4}
          p={3}
          bg={useColorModeValue("green.50", "gray.700")}
          border="1px solid"
          borderColor={useColorModeValue("green.100", "gray.600")}
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
          isOpen={isOpen}
          onClose={onClose}
          pedido={selectedRegistro}
        />
      </Box>
    </Box>
  );
};

export default PedidosEntrantesPage;
