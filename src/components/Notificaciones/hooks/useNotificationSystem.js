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
  const { user, rutas: userRutasIds } = useSelector(
    (state) => state.auth || {},
  );
  const rolNombre = user?.role?.nombre || localStorage.getItem("rolNombre");

  const isVentasNotification = (notification) => {
    const notificationKind =
      notification?.notificationKind ||
      (notification?.data && notification.data.notificationKind);

    if (notificationKind === "NEW_ORDER") {
      return true;
    }

    const estadoId =
      notification?.estadoId ||
      (notification?.data && notification.data.estadoId);

    return parseInt(estadoId, 10) === 2;
  };

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchCurrentUser());
      dispatch(getNotificaciones(usuarioId));

      const intervalId = setInterval(() => {
        dispatch(getNotificaciones(usuarioId));
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [dispatch, usuarioId]);

  useEffect(() => {
    const handleNotification = (event) => {
      const newNotification = event.detail;
      const nUsuarioId =
        newNotification?.usuarioId ||
        (newNotification?.data && newNotification.data.usuarioId);

      if (!nUsuarioId || parseInt(nUsuarioId, 10) !== usuarioId) {
        return;
      }

      if (rolNombre === "Ventas") {
        if (!isVentasNotification(newNotification)) {
          return;
        }
      }

      if (rolNombre === "Display") {
        const estadoId =
          newNotification.estadoId ||
          (newNotification.data && newNotification.data.estadoId);
        if (estadoId && ![2, 3, 4, 5, 6].includes(parseInt(estadoId))) {
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
    if (n.leido) return false;

    const nUsuarioId = n.usuarioId || (n.data && n.data.usuarioId);
    if (nUsuarioId && parseInt(nUsuarioId) === usuarioId) {
      if (rolNombre === "Ventas") {
        return isVentasNotification(n);
      }
      if (rolNombre === "Display") {
        const estadoId = n.estadoId || (n.data && n.data.estadoId);
        return !estadoId || [2, 3, 4, 5, 6].includes(parseInt(estadoId, 10));
      }
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
