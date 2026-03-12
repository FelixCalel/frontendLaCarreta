import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotificaciones,
  markAsRead,
  markAllAsRead,
} from "../../../store/Notificaciones/thunks";
import { fetchCurrentUser } from "../../../store/auth/thunks";
import {
  addNotificacion,
  removeNotificacion,
} from "../../../store/Notificaciones/notificacionesSlice";

export const useNotificationSystem = () => {
  const dispatch = useDispatch();

  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);
  const roleId = localStorage.getItem("roleId");

  const { notificaciones = [], unreadCount } = useSelector(
    (state) => state.notificaciones || {},
  );
  const {
    user,
    rutas: userRutasIds,
  } = useSelector((state) => state.auth || {});
  const rolNombre = user?.role?.nombre || localStorage.getItem("rolNombre");

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchCurrentUser());
      dispatch(getNotificaciones(usuarioId));
    }
  }, [dispatch, usuarioId]);

  useEffect(() => {
    const handleNotification = (event) => {
      const newNotification = event.detail;

      const notifUserId = newNotification.usuarioId
        ? parseInt(newNotification.usuarioId, 10)
        : null;
      if (!notifUserId || notifUserId !== usuarioId) {
        const rutaId =
          newNotification.rutaId ||
          (newNotification.data && newNotification.data.rutaId);

        if (rolNombre === "Ventas" || rolNombre === "Display") {
          if (rutaId && userRutasIds && userRutasIds.length > 0) {
            if (!userRutasIds.includes(parseInt(rutaId, 10))) {
              return;
            }
          } else if (!notifUserId) {
            return;
          }
        } else if (!notifUserId) {
          return;
        }
      }

      if (rolNombre === "Ventas") {
        const estadoId =
          newNotification.estadoId ||
          (newNotification.data && newNotification.data.estadoId);
        if (estadoId && parseInt(estadoId) !== 2) {
          return;
        }
      }

      if (rolNombre === "Display") {
        const estadoId =
          newNotification.estadoId ||
          (newNotification.data && newNotification.data.estadoId);
        if (estadoId && ![3, 4, 5].includes(parseInt(estadoId))) {
          return;
        }
      }

      if (!newNotification.id) {
        console.warn("Received notification without ID:", newNotification);
        return;
      }

      dispatch(addNotificacion(newNotification));
    };

    const handleNotificationDeleted = (event) => {
      const { id, pedidoId, usuarioId: targetUserId } = event.detail;

      const parsedTargetId = targetUserId ? parseInt(targetUserId, 10) : null;

      if (parsedTargetId && parsedTargetId !== usuarioId) {
        return;
      }

      dispatch(removeNotificacion({ id, pedidoId }));
    };

    window.addEventListener("notification-received", handleNotification);
    window.addEventListener("notification-deleted", handleNotificationDeleted);

    return () => {
      window.removeEventListener("notification-received", handleNotification);
      window.removeEventListener(
        "notification-deleted",
        handleNotificationDeleted,
      );
    };
  }, [dispatch, usuarioId, roleId, rolNombre, userRutasIds]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const rawRutas = user?.rutas || userRutasIds || [];

  const rutasSet = new Set(
    Array.isArray(rawRutas)
      ? rawRutas.map((r) => (typeof r === "object" ? +r.id : +r))
      : [],
  );

  const filteredNotificaciones = notificaciones.filter((n) => {
    const userRoleId = parseInt(roleId, 10);
    const isVentasOrDisplay = userRoleId === 3 || userRoleId === 2;
    const hasPedidoId = n.pedidoId || (n.data && n.data.pedidoId);

    if (isVentasOrDisplay && hasPedidoId) {
      if (rutasSet.size === 0) return false;

      const nRutaId = n.rutaId || (n.data && n.data.rutaId);
      if (nRutaId) {
        return rutasSet.has(parseInt(nRutaId, 10));
      }
      return false;
    }

    const nUsuarioId = n.usuarioId || (n.data && n.data.usuarioId);
    if (nUsuarioId && parseInt(nUsuarioId) === usuarioId) {
      return true;
    }

    if (rutasSet.size === 0) return false;

    const nRutaId = n.rutaId || (n.data && n.data.rutaId);
    if (nRutaId) {
      return rutasSet.has(parseInt(nRutaId, 10));
    }

    return false;
  });

  const displayUnreadCount = filteredNotificaciones.filter(
    (n) => !n.leido,
  ).length;

  return {
    filteredNotificaciones,
    displayUnreadCount,
    unreadCount,
    rolNombre,
    handleMarkAllAsRead,
    handleMarkAsRead,
    roleId,
  };
};

