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
import {
  getDetalleOrdenByPedidoId,
  copiarDetallesUltimoPedido,
} from "../../store/Pedidos/DetallePedidos/thunks";
// import axios from "axios";
//import ProductosTable from "./componentes/detallesPedidosTable";
import { useLocation } from "react-router-dom";



const PageFormPedidos = () => {
  const location = useLocation();
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
  const [productosCopiados] = useState([]);
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
  const [comentarioDialog, setComentarioDialog] = useState("");
  const [fechaDialog, setFechaDialog] = useState("");
  const [isTienda1Disabled, setIsTienda1Disabled] = useState(false);
  const [isTienda2Disabled, setIsTienda2Disabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const allTiendas = useSelector((state) => state.tiendas.data || []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.openCrearPedido) {
      onOpen();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, onOpen]);

  useEffect(() => {
    const paisIdFromStorage = localStorage.getItem("paisId");
    if (paisIdFromStorage) {
      setPaisId(parseInt(paisIdFromStorage, 10));
    } else {
      console.error("No se encontró el paisId en el localStorage");
      setPaisId(0);
    }
  }, []);

  const allUsuarios = useSelector((state) => state.usuarios.data.usuarios || []);

  useEffect(() => {
    if (usuarioId && allUsuarios.length > 0) {
      const usuario = allUsuarios.find((u) => u.id === usuarioId);
      if (usuario && Array.isArray(usuario.rutas)) {
        const rutasAsignadas = usuario.rutas.map((ruta) => ruta.id);
        setUsuarioRutas(rutasAsignadas);
      } else {
        setUsuarioRutas([]);
      }
    }
  }, [usuarioId, allUsuarios]);

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  useEffect(() => {
    const message = sessionStorage.getItem("showToastAfterReload");
    if (message) {
      toast({
        title: "Información",
        description: message,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      sessionStorage.removeItem("showToastAfterReload");
    }
  }, [toast]);

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
      setIsLoading(true);
      const tiendaSel = allTiendas.find((t) => t.id === tiendaId);
      if (!tiendaSel) {
        toast({
          title: "Error",
          description: "Tienda no encontrada.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const payload = {
        ciudadId: tiendaSel.ciudadId,
        deudorId: tiendaSel.deudorId,
        tiendaId: tiendaId,
        usuarioId: usuarioId,
      };

      const { pedido, detalles } = await dispatch(
        copiarDetallesUltimoPedido(payload)
      ).unwrap();

      await dispatch(tablaPedidos());
      setPedidoIdGuardado(pedido.id);
      setIsDetailsOpen(pedido.id);

      toast({
        title: "Pedido copiado",
        description: `Se creó el pedido #${pedido.id} con ${detalles.length} productos.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Error desconocido";
      console.error("Error al copiar pedido:", errorMessage);

      if (errorMessage.includes("No existe un pedido aprobado anterior")) {
        sessionStorage.setItem(
          "showToastAfterReload",
          "No se encontró un pedido anterior para esta tienda."
        );
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: errorMessage || "No se pudo copiar el último pedido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
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
      estadoId: currentPedido.estadoId ?? 1,
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
      //resetForm();
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
    //window.location.reload(true);
  };

  const toYMD = (v) => {
    if (!v) return undefined;
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const d = new Date(v);
    if (isNaN(d.getTime())) return undefined;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleRealizarPedido = async ({ comentario, fecha }) => {
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
        togglePedidoStatus({
          id: selectedPedidoId,
          estadoId: 2,
          comentarioDisplay: comentario || "",
          fechaOrdenDisplay: toYMD(fecha),
        })
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
        isDetailsOpen={isDetailsOpen}
        handleToggleDetails={(pedidoId, deudorId, tiendaId) => {
          setIsDetailsOpen(isDetailsOpen === pedidoId ? null : pedidoId);

          if (isDetailsOpen !== pedidoId) {
            dispatch(getDetalleOrdenByPedidoId(pedidoId, deudorId, tiendaId));
          }
        }}
        handleDeletePedido={(pedidoId) => dispatch(deletePedido(pedidoId))}
        showRealizarPedidoConfirmation={(pedidoId) => {
          setSelectedPedidoId(pedidoId);
          setComentarioDialog("");
          setFechaDialog("");
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
        fecha={fechaDialog}
        setFecha={setFechaDialog}
        comentario={comentarioDialog}
        setComentario={setComentarioDialog}
      />
    </Box>
  );
};

export default PageFormPedidos;
