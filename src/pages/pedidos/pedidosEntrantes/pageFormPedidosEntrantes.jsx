import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Spinner,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaPedidos,
  togglePedidoStatus,
  updatePedidoActivacion,
} from "../../../store/Pedidos/thunks";
import PedidosTable from "../componentes/EntrantesFormPedidos/PedidosTable";
import DetallesModal from "../componentes/EntrantesFormPedidos/detallesModal";
import {
  getDetalleOrdenByPedidoId,
  actualizarFechaOrden,
} from "../../../store/Pedidos/DetallePedidos/thunks";
import ApproveOrderDialog from "../componentes/EntrantesFormPedidos/ApproveOrderDialog";
import { selectPedidosEntrantesPorRuta } from "./componentes/rutaSelectors";
import { tablaTienda } from "../../../store/Tienda/thunks";
import { useSearch } from "../../../components/component/SearchContext";
import CancelOrderDialog from "./componentes/CancelOrderDialog";

//import { format } from "date-fns";

const EntrantesPage = () => {
  const { query, setSuggestions } = useSearch();
  const [lista, setLista] = useState([]);
  const dispatch = useDispatch();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const pedidos = useSelector((state) => state.pedidos.data);
  const pedidosRuta = useSelector(selectPedidosEntrantesPorRuta());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onClose: onApproveClose,
  } = useDisclosure();
  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();

  useEffect(() => {
    dispatch(tablaTienda());
    dispatch(tablaPedidos());
  }, [dispatch]);

  const todosLosPedidos = useSelector((s) => s.pedidos.data);
  useEffect(() => {
    const candidatos = todosLosPedidos.filter((p) => p.estadoId === 2);
    console.log(
      "Pedidos con estadoId 2:",
      candidatos.map((p) => ({
        id: p.id,
        tiendaId: p.tiendaId,
      }))
    );
  }, [todosLosPedidos]);

  const tiendas = useSelector((s) => s.tiendas.data ?? []);
  useEffect(() => {
    console.log("Tiendas en Redux:", tiendas.slice(0, 5));
  }, [tiendas]);

  useEffect(() => {
    const sug = pedidos
      .flatMap((p) => [
        { id: `d-${p.id}`, label: p.nombreDeu },
        { id: `t-${p.id}`, label: p.nombreTienda },
        { id: `u-${p.id}`, label: `${p.nombreUsuario} ${p.apellidoUsuario}` },
      ])
      .flat();
    setSuggestions(sug);
    return () => setSuggestions([]);
  }, [pedidos, setSuggestions]);

  useEffect(() => {
    const tienda1 = tiendas.find((t) => t.id === 1);
    const tienda12 = tiendas.find((t) => t.id === 12);
    console.log("Tienda 1:", tienda1);
    console.log("Tienda 12:", tienda12);
  }, [tiendas]);

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [selectedPedidos.length, dispatch]);

  useEffect(() => {
    if (pedidos.length) console.log("Ejemplo de pedido:", pedidos[0]);
  }, [pedidos]);

  useEffect(() => {
    if (!pedidosRuta.length) return;

    const q = query.trim().toLowerCase();

    setLista(
      q
        ? pedidosRuta.filter((p) =>
            `${p.nombreDeu} ${p.nombreTienda} ${p.nombreUsuario} ${p.apellidoUsuario}`
              .toLowerCase()
              .includes(q)
          )
        : pedidosRuta
    );
  }, [pedidosRuta, query]);

  const handleConfirmApprove = async ({ fechaOrden, comentario }) => {
    setIsApproving(true);
    try {
      for (const pedidoId of selectedPedidos) {
        await dispatch(
          actualizarFechaOrden({
            pedidoId,
            fechaOrden,
            comentario,
          })
        ).unwrap();
        await dispatch(
          togglePedidoStatus({
            id: pedidoId,
            estadoId: 3,
          })
        ).unwrap();

        const pedido = pedidos.find((p) => p.id === pedidoId);
        if (pedido && !pedido.isActive) {
          await dispatch(
            updatePedidoActivacion({ id: pedidoId, isActive: true })
          ).unwrap();
        }
      }

      await dispatch(tablaPedidos());

      setSelectedPedidos([]);
      toast({
        title: "Pedidos aprobados",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al aprobar pedidos:", error);
      toast({
        title: "Error",
        description: error.message || "Hubo un error al aprobar pedidos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsApproving(false);
      onApproveClose();
    }
  };

  const handleCancelarPedidos = async (comentario) => {
    setIsLoading(true);

    try {
      for (const pedidoId of selectedPedidos) {
        await dispatch(
          togglePedidoStatus({ id: pedidoId, estadoId: 4 })
        ).unwrap();

        await dispatch(
          actualizarFechaOrden({
            pedidoId,
            fechaOrden: null,
            comentario,
          })
        ).unwrap();
      }

      setSelectedPedidos([]);

      toast({
        title: "Pedidos cancelados",
        description:
          "Los pedidos seleccionados han sido cancelados correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al cancelar pedidos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cancelar los pedidos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelDialogConfirm = async (comentario) => {
    setIsCancelling(true);
    await handleCancelarPedidos(comentario);
    setIsCancelling(false);
    onCancelClose();
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

      if (!pedido) {
        console.error(`No se encontró el pedido con ID ${pedidoId}`);
        toast({
          title: "Error",
          description: `No se encontró el pedido con ID ${pedidoId}.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setSelectedPedido(pedido);
      setIsModalOpen(true);
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

  const handleCloseApproveDialog = () => {
    onApproveClose();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  return (
    <Box p={6} boxShadow="xl" bg={bgColor} color={textColor} rounded="lg">
      <Flex justify="space-between" mb={3}>
        <Heading as="h2" size="lg">
          Listado de Pedidos Entrantes
        </Heading>
        <Flex>
          <Button
            colorScheme="green"
            mr={4}
            onClick={onApproveOpen}
            isDisabled={
              selectedPedidos.length === 0 || isLoading || isApproving
            }
          >
            {isApproving ? <Spinner size="sm" /> : "Aprobar Pedidos"}
          </Button>
          <Button
            colorScheme="red"
            onClick={onCancelOpen}
            isDisabled={
              selectedPedidos.length === 0 || isLoading || isCancelling
            }
          >
            {isCancelling ? <Spinner size="sm" /> : "Cancelar Pedidos"}
          </Button>
          <ApproveOrderDialog
            isOpen={isApproveOpen}
            onClose={handleCloseApproveDialog}
            onConfirm={handleConfirmApprove}
            selectedPedidos={selectedPedidos}
          />
          <AlertDialog isOpen={isCancelOpen} onClose={onCancelClose} isCentered>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Cancelar Pedidos
                </AlertDialogHeader>
                <AlertDialogBody>
                  ¿Estás seguro de que deseas cancelar los pedidos
                  seleccionados?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={onCancelClose}>
                    Cerrar
                  </Button>
                  <Button colorScheme="red" onClick={onCancelOpen} ml={3}>
                    Cancelar
                  </Button>
                  <CancelOrderDialog
                    isOpen={isCancelOpen}
                    onClose={onCancelClose}
                    onConfirm={onCancelDialogConfirm}
                    cantidad={selectedPedidos.length}
                  />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Flex>
      </Flex>
      <PedidosTable
        pedidosEntrantes={lista}
        highlight={query}
        // pedidosEntrantes={pedidosFiltrados}
        selectedPedidos={selectedPedidos}
        setSelectedPedidos={setSelectedPedidos}
        handleVerDetalles={handleVerDetalles}
      />
      <DetallesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        detalles={detallesPedido}
        pedido={selectedPedido}
      />
    </Box>
  );
};

export default EntrantesPage;
