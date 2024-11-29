import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  addNewPedido,
  tablaPedidos,
} from "../../store/Pedidos/thunks";

const BASE_URL = import.meta.env.VITE_API_URL;

const usePedidosLogic = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = Number(localStorage.getItem("usuarioId"));

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
  const [isTienda1Disabled, setIsTienda1Disabled] = useState(false);
  const [isTienda2Disabled, setIsTienda2Disabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const paisIdFromStorage = localStorage.getItem("paisId");
    if (paisIdFromStorage) {
      setPaisId(parseInt(paisIdFromStorage, 10));
    } else {
      console.error("No se encontró el paisId en el localStorage");
    }
  }, []);

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

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
        setUsuarioRutas([]);
      }
    };
    fetchUsuarioRutas();
  }, [usuarioId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetForm = () => {
    setCurrentPedido({
      ciudadId: 0,
      deudorId: 0,
      tiendaId: 0,
      usuarioId: parseInt(usuarioId),
      estadoId: 1,
    });
    setIsPedidoFinalizado(false);
    setPedidoIdGuardado(null);
    setIsTienda1Disabled(false);
    setIsTienda2Disabled(false);
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
      let fechaPedido = new Date(pedido.fechaOrden);
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
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    const newPedido = {
      ...currentPedido,
      tiendaId: tiendaSeleccionada,
      fechaOrden: today,
      productos: currentPedido.productos, // Aquí usa el estado correcto
    };
  
    try {
      setIsLoading(true); // Activa el indicador de carga
      const pedidoGuardado = await dispatch(addNewPedido(newPedido)).unwrap();
  
      setPedidoIdGuardado(pedidoGuardado.id);
  
      // Actualiza la tabla de pedidos
      dispatch(tablaPedidos());
  
      toast({
        title: "Pedido creado",
        description: "El pedido ha sido guardado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Asegúrate de que la página se recargue después de que la promesa termine
      window.location.reload(); 
  
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
      setIsLoading(false); // Desactiva el indicador de carga
    }
  };
 

  const validateFields = () => {
    let formErrors = {};
    if (!currentPedido.ciudadId && !isPedidoFinalizado)
      formErrors.ciudadId = "La ciudad es obligatoria";
    if (!currentPedido.deudorId && !isPedidoFinalizado)
      formErrors.deudorId = "El deudor es obligatorio";
    if (!currentPedido.tiendaId && !isPedidoFinalizado)
      formErrors.tiendaId = "Debe seleccionar una tienda";
    return formErrors;
  };

  const pedidosUsuario = pedidos
    .filter((pedido) => pedido.usuarioId === parseInt(usuarioId))
    .filter((pedido) => pedido.estadoId === 1);

  return {
    pedidosUsuario,
    isMobile,
    currentPedido,
    setCurrentPedido,
    usuarioRutas,
    paisId,
    isPedidoFinalizado,
    setIsPedidoFinalizado,
    pedidoIdGuardado,
    isDetailsOpen,
    setIsDetailsOpen,
    handleSubmit,
    resetForm,
    isLoading,
    isTienda1Disabled,
    isTienda2Disabled,
    setIsTienda1Disabled,
    setIsTienda2Disabled,
  };
};

usePedidosLogic.propTypes = {
  pedidosUsuario: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      usuarioId: PropTypes.number,
      estadoId: PropTypes.number,
      fecha: PropTypes.string,
    })
  ),
  currentPedido: PropTypes.object,
  isMobile: PropTypes.bool,
};

export default usePedidosLogic;
