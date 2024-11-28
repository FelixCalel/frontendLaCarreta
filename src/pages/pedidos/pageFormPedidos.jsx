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
  // Estados y hooks principales
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();

  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = Number(localStorage.getItem("usuarioId")) || 0; // Valor predeterminado
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [paisId, setPaisId] = useState(null);
  const [usuarioRutas, setUsuarioRutas] = useState([]);
  const [productosCopiados, setProductosCopiados] = useState([]);
  const [currentPedido, setCurrentPedido] = useState({
    ciudadId: 0,
    deudorId: 0,
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

  // Efecto para manejar el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Efecto para cargar el ID del país
  useEffect(() => {
    const paisIdFromStorage = localStorage.getItem("paisId");
    if (paisIdFromStorage) {
      setPaisId(parseInt(paisIdFromStorage, 10));
    } else {
      console.error("No se encontró el paisId en el localStorage");
      setPaisId(0); // Valor predeterminado
    }
  }, []);

  // Efecto para cargar rutas de usuario
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

  // Efecto para cargar pedidos
  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  // Validar campos del formulario
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
    console.log("ID de tienda seleccionada:", tiendaId);
  
    try {
      const pedidosTienda = pedidos.filter((pedido) => pedido.tiendaId === tiendaId);
      console.log("Pedidos encontrados para esta tienda:", pedidosTienda);
  
      if (pedidosTienda.length === 0) {
        toast({
          title: "Sin pedidos previos",
          description: "No se encontraron pedidos anteriores para esta tienda.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      // Obtener el último pedido (ordenado por fecha)
      const ultimoPedido = pedidosTienda.sort((a, b) => new Date(b.fechaOrden) - new Date(a.fechaOrden))[0];
      console.log("Último pedido encontrado:", ultimoPedido);
  
      // Verificar si el pedido tiene productos
      if (!ultimoPedido || !ultimoPedido.id) {
        toast({
          title: "Error",
          description: "No se encontró un ID válido para el pedido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      // Obtener los detalles del pedido desde el backend
      const detalles = await dispatch(getDetalleOrdenByPedidoId(ultimoPedido.id)).unwrap();
      console.log("Detalles del último pedido:", detalles);
  
      if (!detalles || detalles.length === 0) {
        // Si no hay productos en el pedido, informar al usuario
        toast({
          title: "Pedido vacío",
          description: "El último pedido de esta tienda no tiene productos para copiar.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      // Actualizar el estado con los productos copiados
      setProductosCopiados(detalles);
  
      toast({
        title: "Productos copiados",
        description: "Se han copiado los productos del último pedido.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
  
  

  // Manejar envío del formulario
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

    console.log("Datos para validación:", {
      usuarioId,
      tiendaSeleccionada,
      todayFormatted,
    });

    const pedidoData = {
      ...currentPedido,
      deudorId: currentPedido.deudorId, // Aquí pasas el deudorId
      // Otros datos del pedido como tiendaId, ciudadId, etc.
    };
  
    // Proceder con la creación o actualización del pedido
    dispatch(addNewPedido(pedidoData)).then(() => {
      onClose();
      dispatch(tablaPedidos());
    });

    // Validar si ya existe un pedido para la misma tienda en el mismo día
    const pedidosHoy = pedidos.filter((pedido) => {
      let fechaPedido = pedido.fechaOrden;

      // Convertir fechaOrden a Date si es necesario
      if (typeof fechaPedido === "string") {
        fechaPedido = new Date(fechaPedido);
      }

      // Validar formato de fecha
      return (
        pedido.usuarioId === usuarioId &&
        pedido.tiendaId === tiendaSeleccionada &&
        fechaPedido.toISOString().split("T")[0] === todayFormatted
      );
    });

    console.log("Pedidos encontrados hoy:", pedidosHoy);

    if (pedidosHoy.length > 0) {
      toast({
        title: "Pedido duplicado",
        description: "Ya has realizado un pedido en esta tienda hoy.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return; // Bloquear la creación del pedido
    }

    setIsLoading(true);

    try {
      const newPedido = {
        ...currentPedido,
        tiendaId: tiendaSeleccionada,
        fechaOrden: today,
        productos: productosCopiados,
      };

      const pedidoGuardado = await dispatch(addNewPedido(newPedido)).unwrap();
      setPedidoIdGuardado(pedidoGuardado.id);
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
      ciudadId: 0,
      deudorId: 0,
      tiendaId: null,
      tiendaId2: null,
      usuarioId: usuarioId,
      estadoId: 1,
    });
    setIsTienda1Disabled(false);
    setIsTienda2Disabled(false);
  };

  // Manejar confirmación para realizar pedido
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
    <Box mt={-8} p={-4}>
      <HeaderButtons onOpen={onOpen} />

      <PedidosTable
        pedidosUsuario={pedidosUsuario}
        isMobile={isMobile}
        isDetailsOpen={isDetailsOpen}
        handleToggleDetails={(pedidoId) =>
          setIsDetailsOpen(isDetailsOpen === pedidoId ? null : pedidoId)
        }
        handleDeletePedido={(pedidoId) => dispatch(deletePedido(pedidoId))}
        showRealizarPedidoConfirmation={(pedidoId) => {
          setSelectedPedidoId(pedidoId);
          onDialogOpen();
        }}
        usuarioId={usuarioId}
      />

      <PedidoModal
        isOpen={isOpen}
        onClose={onClose}
        isPedidoFinalizado={isPedidoFinalizado}
        isLoading={isLoading}
        currentPedido={currentPedido}
        setCurrentPedido={setCurrentPedido}
        handleSubmit={handleSubmit} // Aquí
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
