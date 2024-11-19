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
  // const cancelRef = useRef();

  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = Number(localStorage.getItem("usuarioId"));

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [paisId, setPaisId] = useState(null);
  const [usuarioRutas, setUsuarioRutas] = useState([]);
  const [currentPedido, setCurrentPedido] = useState({
    ciudadId: 0,
    deudorId: 0,
    tiendaId: 0,
    usuarioId: parseInt(usuarioId),
    estadoId: 1,
  });
  const [isPedidoFinalizado, setIsPedidoFinalizado] = useState(false);
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
    }
  }, []);

  // Efecto para cargar rutas de usuario
  useEffect(() => {
    const fetchUsuarioRutas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usuarios/todos`);
        const usuario = response.data.usuarios.find(
          (u) => u.id === parseInt(usuarioId)
        );
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
    fetchUsuarioRutas();
  }, [usuarioId]);

  // Efecto para cargar pedidos
  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  // Validar campos del formulario
  const validateFields = () => {
    const formErrors = {};
    if (!currentPedido.ciudadId && !isPedidoFinalizado)
      formErrors.ciudadId = "La ciudad es obligatoria";
    if (!currentPedido.deudorId && !isPedidoFinalizado)
      formErrors.deudorId = "El deudor es obligatorio";
    if (!currentPedido.tiendaId && !isPedidoFinalizado)
      formErrors.tiendaId = "Debe seleccionar una tienda";
    return formErrors;
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

    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const pedidosHoy = pedidos.filter(
      (pedido) =>
        pedido.usuarioId === parseInt(usuarioId) &&
        pedido.tiendaId === currentPedido.tiendaId &&
        pedido.fecha?.split("T")[0] === today
    );

    if (pedidosHoy.length > 0) {
      toast({
        title: "Pedido duplicado",
        description: "Ya has realizado un pedido en esta tienda hoy.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!isPedidoFinalizado) {
        const newPedido = { ...currentPedido, fecha: new Date().toISOString() };
        const pedidoGuardado = await dispatch(addNewPedido(newPedido)).unwrap();
        setPedidoIdGuardado(pedidoGuardado.id);
        setIsPedidoFinalizado(false);

        dispatch(tablaPedidos());

        toast({
          title: "Pedido creado",
          description: "El pedido ha sido guardado correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Aquí cerramos el modal y reiniciamos el formulario
        onClose();
        resetForm(); // Esta función debe reiniciar `currentPedido` a los valores iniciales
      }
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPedido({
      ciudadId: 0,
      deudorId: 0,
      tiendaId: 0,
      usuarioId: parseInt(usuarioId),
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
        description: "El pedio esta en revisión.",
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
    (pedido) =>
      pedido.usuarioId === parseInt(usuarioId) && pedido.estadoId === 1
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
        handleSubmit={handleSubmit}
        usuarioRutas={usuarioRutas}
        paisId={paisId}
        pedidoIdGuardado={pedidoIdGuardado}
        isTienda1Disabled={isTienda1Disabled}
        isTienda2Disabled={isTienda2Disabled}
        setIsTienda1Disabled={setIsTienda1Disabled}
        setIsTienda2Disabled={setIsTienda2Disabled}
        resetForm={resetForm} // Agregamos el reset aquí
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
