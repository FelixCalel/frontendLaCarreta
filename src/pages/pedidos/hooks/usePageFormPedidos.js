import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {
  addNewPedido,
  tablaPedidos,
  togglePedidoStatus,
} from "../../../store/Pedidos/thunks";
import {
  getDetalleOrdenByPedidoId,
  copiarDetallesUltimoPedido,
} from "../../../store/Pedidos/DetallePedidos/thunks";

const toNumberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toYMD = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
};

export const usePageFormPedidos = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();

  const pedidos = useSelector((state) => state.pedidos.data || []);
  const allTiendas = useSelector((state) => state.tiendas.data || []);
  const authRutas = useSelector((state) => state.auth.rutas || []);
  const authUid = useSelector((state) => state.auth.uid);
  const authRoleId = useSelector((state) => state.auth.roleId);
  const usuarioId =
    toNumberOrZero(authUid) ||
    toNumberOrZero(localStorage.getItem("usuarioId"));
  const roleId =
    toNumberOrZero(authRoleId) ||
    toNumberOrZero(localStorage.getItem("roleId"));

  const [isMobile, setIsMobile] = useState(
    (globalThis.window?.innerWidth ?? 1024) <= 768
  );
  const [paisId, setPaisId] = useState(null);
  const [usuarioRutas, setUsuarioRutas] = useState([]);
  const [currentPedido, setCurrentPedido] = useState({
    ciudadId: 0,
    tiendaId: 0,
    deudorId: null,
    usuarioId,
    estadoId: 1,
  });
  const [dialogState, setDialogState] = useState({
    pedidoIdGuardado: null,
    isDetailsOpen: null,
    selectedPedidoId: null,
    comentarioDialog: "",
    fechaDialog: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTienda1Disabled, setIsTienda1Disabled] = useState(false);
  const [isTienda2Disabled, setIsTienda2Disabled] = useState(false);

  useEffect(() => {
    if (!globalThis.window) return;

    const handleResize = () => setIsMobile(globalThis.window.innerWidth <= 768);
    globalThis.window.addEventListener("resize", handleResize);

    return () => globalThis.window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.openCrearPedido) {
      onOpen();
      globalThis.window?.history.replaceState(
        {},
        globalThis.document?.title ?? ""
      );
    }
  }, [location.state, onOpen]);

  useEffect(() => {
    let resolvedPaisId = 0;
    const pId = localStorage.getItem("paisId");
    if (pId) resolvedPaisId = Number.parseInt(pId, 10);
    else {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData?.paisId !== undefined) {
          resolvedPaisId = Number.parseInt(userData.paisId, 10);
        }
      } catch (error_) {
        console.warn(error_);
      }
    }
    setPaisId(resolvedPaisId);
  }, []);

  useEffect(() => {
    if (Array.isArray(authRutas)) {
      setUsuarioRutas(
        authRutas
          .map((ruta) => (typeof ruta === "object" ? ruta.id : ruta))
          .map((rutaId) => toNumberOrZero(rutaId))
          .filter(Boolean)
      );
    } else setUsuarioRutas([]);
  }, [authRutas]);

  useEffect(() => {
    if (usuarioId && roleId) {
      dispatch(
        tablaPedidos({ userId: usuarioId, roleId, status: 1, limit: 20 })
      );
    }
  }, [dispatch, usuarioId, roleId]);

  useEffect(() => {
    const msg = sessionStorage.getItem("showToastAfterReload");
    if (msg) {
      toast({ title: "Información", description: msg, status: "info" });
      sessionStorage.removeItem("showToastAfterReload");
    }
  }, [toast]);

  const validateFields = () => {
    const errs = {};
    if (!currentPedido.ciudadId) errs.ciudadId = "Requerido";
    if (!currentPedido.deudorId) errs.deudorId = "Requerido";
    if (!currentPedido.tiendaId && !currentPedido.tiendaId2)
      errs.tienda = "Requerido";
    return errs;
  };

  const copiarUltimoPedido = async (tiendaId) => {
    try {
      setIsLoading(true);
      const tiendaIdNumber = toNumberOrZero(tiendaId);
      const tiendaSel = allTiendas.find(
        (tienda) => tienda.id === tiendaIdNumber
      );
      if (!tiendaSel) return;

      const { pedido } = await dispatch(
        copiarDetallesUltimoPedido({
          ciudadId: tiendaSel.ciudadId,
          deudorId: tiendaSel.deudorId,
          tiendaId: tiendaIdNumber,
          usuarioId,
        })
      ).unwrap();

      dispatch(
        tablaPedidos({ userId: usuarioId, roleId, status: 1, limit: 100 })
      );
      setDialogState((prev) => ({
        ...prev,
        pedidoIdGuardado: pedido?.id ?? null,
        isDetailsOpen: pedido?.id ?? null,
      }));
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Error al copiar el último pedido.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const errs = validateFields();
      if (Object.keys(errs).length > 0) {
        toast({
          title: "Datos incompletos",
          description:
            "Debe seleccionar tienda y deudor antes de crear el pedido.",
          status: "warning",
          duration: 2500,
          isClosable: true,
        });
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const tId = toNumberOrZero(
        currentPedido.tiendaId || currentPedido.tiendaId2
      );

      const hasDuplicado = pedidos.some((pedido) => {
        const pedidoFecha = toYMD(pedido?.creadoEl);
        return (
          toNumberOrZero(pedido?.usuarioId) === usuarioId &&
          toNumberOrZero(pedido?.tiendaId) === tId &&
          pedidoFecha === today
        );
      });

      if (hasDuplicado) {
        toast({
          title: "Pedido duplicado",
          description: "Ya existe un pedido de hoy para esa tienda.",
          status: "warning",
          duration: 2800,
          isClosable: true,
        });
        return;
      }

      setIsLoading(true);
      const saved = await dispatch(
        addNewPedido({ ...currentPedido, tiendaId: tId, creadoEl: new Date() })
      ).unwrap();

      setDialogState((prev) => ({
        ...prev,
        pedidoIdGuardado: saved?.id ?? null,
        isDetailsOpen: saved?.id ?? null,
      }));
      dispatch(
        tablaPedidos({ userId: usuarioId, roleId, status: 1, limit: 100 })
      );
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "No se pudo crear el pedido.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPedido({
      deudorId: null,
      ciudadId: null,
      tiendaId: null,
      tiendaId2: null,
      usuarioId,
      estadoId: 1,
    });
    setDialogState((prev) => ({
      ...prev,
      pedidoIdGuardado: null,
      isDetailsOpen: null,
    }));
    setIsTienda1Disabled(false);
    setIsTienda2Disabled(false);
  };

  const handleRealizarPedido = async ({ comentario, fecha }) => {
    try {
      const details = await dispatch(
        getDetalleOrdenByPedidoId(dialogState.selectedPedidoId)
      ).unwrap();
      if (!details?.length) {
        toast({
          title: "Error",
          description: "Agregue productos",
          status: "error",
        });
        return;
      }
      await dispatch(
        togglePedidoStatus({
          id: dialogState.selectedPedidoId,
          estadoId: 2,
          comentarioDisplay: comentario || "",
          fechaOrdenDisplay: fecha,
        })
      ).unwrap();
      dispatch(
        tablaPedidos({ userId: usuarioId, roleId, status: 1, limit: 100 })
      );
      onDialogClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "No se pudo realizar el pedido.",
        status: "error",
      });
    }
  };

  return {
    isMobile,
    paisId,
    usuarioRutas,
    currentPedido,
    setCurrentPedido,
    dialogState,
    setDialogState,
    isLoading,
    isTienda1Disabled,
    setIsTienda1Disabled,
    isTienda2Disabled,
    setIsTienda2Disabled,
    isOpen,
    onOpen,
    onClose,
    isDialogOpen,
    onDialogOpen,
    onDialogClose,
    pedidosUsuario: pedidos.filter(
      (p) => p.usuarioId === usuarioId && p.estadoId === 1
    ),
    usuarioId,
    roleId,
    handleSubmit,
    resetForm,
    copiarUltimoPedido,
    handleRealizarPedido,
  };
};
