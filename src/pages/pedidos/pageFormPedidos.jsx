import { useEffect, useState } from "react";
import { useDisclosure, Box, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import HeaderButtons from "./componentes/pageFormPedidos/HeadersButtons";
import PedidosTable from "./componentes/pageFormPedidos/PedidosTable";
import PedidoModal from "./componentes/pageFormPedidos/crearPedidoModal";
import ConfirmDialog from "./componentes/pageFormPedidos/ConfirmarPedidoDialog";
import {
  addNewPedido,
  tablaPedidos,
  deletePedido,
  togglePedidoStatus,
} from "../../store/Pedidos/thunks";
import { getDetalleOrdenByPedidoId } from "../../store/Pedidos/DetallePedidos/thunks";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const PageFormPedidos = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();

  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = Number(localStorage.getItem("usuarioId")) || 0;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [paisId, setPaisId] = useState(null);
  const [usuarioRutas, setUsuarioRutas] = useState([]);
  const [productosCopiados, setProductosCopiados] = useState([]);
  const [currentPedido, setCurrentPedido] = useState({
    ciudadId: 0,
    tiendaId: 0,
    usuarioId: usuarioId,
    estadoId: 1,
  });
  const [isPedidoFinalizado] = useState(false);
  const [pedidoIdGuardado, setPedidoIdGuardado] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(null);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [isTienda1Disabled, setIsTienda1Disabled] = useState(false);
  const [isTienda2Disabled, setIsTienda2Disabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const paisIdFromStorage = localStorage.getItem("paisId");
    if (paisIdFromStorage) {
      setPaisId(parseInt(paisIdFromStorage, 10));
    } else {
      console.error("No se encontró el paisId en el localStorage");
      setPaisId(0);
    }
  }, []);

  useEffect(() => {
    const fetchUsuarioRutas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usuarios/todos`);
        const usuario = response.data.usuarios.find((u) => u.id === usuarioId);
        if (usuario && Array.isArray(usuario.rutas)) {
          const rutasAsignadas = usuario.rutas.map((ruta) => ruta.id);
          setUsuarioRutas(rutasAsignadas);
        } else {
          setUsuarioRutas([]);
        }
      } catch (error) {
        console.error("Error al obtener rutas del usuario:", error);
      }
    };
    if (usuarioId) fetchUsuarioRutas();
  }, [usuarioId]);

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  const validateFields = () => {
    const formErrors = {};
    if (!currentPedido.ciudadId)
      formErrors.ciudadId = "La ciudad es obligatoria";
    if (!currentPedido.deudorId)
      formErrors.deudorId = "El deudor es obligatorio";
    if (!currentPedido.tiendaId && !currentPedido.tiendaId2)
      formErrors.tienda = "Debe seleccionar una tienda";
    return formErrors;
  };

  const copiarUltimoPedido = async (tiendaId) => {
    try {
      const pedidosTiendaYDeudor = pedidos.filter(
        (pedido) => pedido.tiendaId === tiendaId
      );
      if (pedidosTiendaYDeudor.length > 0) {
        const ultimoPedido = pedidosTiendaYDeudor.sort(
          (a, b) => new Date(b.creadoEl) - new Date(a.creadoEl)
        )[0];
        const detalles = await dispatch(
          getDetalleOrdenByPedidoId(ultimoPedido.id)
        ).unwrap();
        setProductosCopiados(detalles);

        const newPedido = {
          ...currentPedido,
          tiendaId: tiendaId,
          creadoEl: new Date(),
          productos: detalles,
        };

        await handleSubmit(newPedido);
        onClose(); 
      } else {
        toast({
          title: "Sin pedidos previos",
          description:
            "No se encontraron pedidos anteriores para esta tienda y deudor.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al copiar productos del último pedido:", error);
      toast({
        title: "Error",
        description: `No se pudieron copiar los productos: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateFields();

    if (Object.keys(formErrors).length > 0) {
      toast({
        title: "Error",
        description: "Faltan campos obligatorios",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0];
    const tiendaSeleccionada =
      currentPedido.tiendaId || currentPedido.tiendaId2;

    const pedidosHoy = pedidos.filter((pedido) => {
      let fechaPedido = pedido.creadoEl;
      if (typeof fechaPedido === "string") {
        fechaPedido = new Date(fechaPedido);
      }
      return (
        pedido.usuarioId === usuarioId &&
        pedido.tiendaId === tiendaSeleccionada &&
        fechaPedido.toISOString().split("T")[0] === todayFormatted
      );
    });

    if (pedidosHoy.length > 0) {
      toast({
        title: "Pedido duplicado",
        description: "Ya has realizado un pedido en esta tienda hoy.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      console.log("Pedido duplicado detectado:", pedidosHoy);
    }

    const newPedido = {
      ...currentPedido,
      tiendaId: tiendaSeleccionada,
      deudorId: currentPedido.deudorId,
      creadoEl: today,
      productos:
        productosCopiados.length > 0
          ? productosCopiados
          : currentPedido.productos,
    };

    try {
      setIsLoading(true);
      const pedidoGuardado = await dispatch(addNewPedido(newPedido)).unwrap();
      setPedidoIdGuardado(pedidoGuardado.id);
      setIsDetailsOpen(pedidoGuardado.id);

      dispatch(tablaPedidos());

      toast({
        title: "Pedido creado",
        description: "El pedido ha sido guardado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear el pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPedido({
      deudorId: null,
      pedidoId: null,
      ciudadId: null,
      tiendaId: null,
      tiendaId2: null,
    });
    setIsTienda1Disabled(false);
    setIsTienda2Disabled(false);
    window.location.reload(true);
  };

  const handleRealizarPedido = async () => {
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(selectedPedidoId)
      ).unwrap();
      if (!detalles || detalles.length === 0) {
        toast({
          title: "Error",
          description: "Debe agregar productos al pedido antes de realizarlo.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await dispatch(
        togglePedidoStatus({ id: selectedPedidoId, estadoId: 2 })
      ).unwrap();
      dispatch(tablaPedidos());
      toast({
        title: "Pedido realizado",
        description: "El pedido está en revisión.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
    } finally {
      onDialogClose();
    }
  };

  const pedidosUsuario = pedidos.filter(
    (pedido) => pedido.usuarioId === usuarioId && pedido.estadoId === 1
  );

  return (
    <Box mt={0} p={2}>
      <HeaderButtons onOpen={onOpen} />

      <PedidosTable
        pedidosUsuario={pedidosUsuario}
        isMobile={isMobile}
        isDetailsOpen={isDetailsOpen} // Estado para controlar los detalles abiertos
        handleToggleDetails={(pedidoId, deudorId, tiendaId) => {
          setIsDetailsOpen(isDetailsOpen === pedidoId ? null : pedidoId);

          if (isDetailsOpen !== pedidoId) {
            dispatch(getDetalleOrdenByPedidoId(pedidoId, deudorId, tiendaId));
          }
        }}
        handleDeletePedido={(pedidoId) => dispatch(deletePedido(pedidoId))}
        showRealizarPedidoConfirmation={(pedidoId) => {
          setSelectedPedidoId(pedidoId);
          onDialogOpen();
        }}
        deudorId={currentPedido.deudorId}
        tiendaId={currentPedido.tiendaId}
        usuarioId={usuarioId}
      />

      <PedidoModal
        isOpen={isOpen}
        onClose={onClose}
        isPedidoFinalizado={isPedidoFinalizado}
        isLoading={isLoading}
        currentPedido={currentPedido}
        setCurrentPedido={setCurrentPedido}
        handleSubmit={handleSubmit}
        usuarioRutas={usuarioRutas}
        paisId={paisId || 0}
        usuarioId={usuarioId || 0}
        pedidoIdGuardado={pedidoIdGuardado}
        isTienda1Disabled={isTienda1Disabled}
        isTienda2Disabled={isTienda2Disabled}
        setIsTienda1Disabled={setIsTienda1Disabled}
        setIsTienda2Disabled={setIsTienda2Disabled}
        resetForm={resetForm}
        copiarUltimoPedido={copiarUltimoPedido}
      />

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={onDialogClose}
        onConfirm={handleRealizarPedido}
      />
    </Box>
  );
};

export default PageFormPedidos;
