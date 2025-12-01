import axios from "axios";
import {
  setNotificaciones,
  markRead,
  markAllRead,
  startLoadingNotificaciones,
  setError,
} from "./notificacionesSlice";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getNotificaciones = (usuarioId) => {
  return async (dispatch, getState) => {
    if (!usuarioId) return;
    
    dispatch(startLoadingNotificaciones());
    const { token } = getState().auth;

    try {
      const response = await axios.get(`${BASE_URL}/notificaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        const uniqueNotifications = [];
        const seenPedidoIds = new Set();

        response.data.forEach((notif) => {
          if (notif.pedidoId) {
            if (!seenPedidoIds.has(notif.pedidoId)) {
              seenPedidoIds.add(notif.pedidoId);
              uniqueNotifications.push(notif);
            }
          } else {
            uniqueNotifications.push(notif);
          }
        });

        dispatch(setNotificaciones(uniqueNotifications));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      dispatch(setError(error.message));
    }
  };
};

export const markAsRead = (id) => {
  return async (dispatch, getState) => {
    if (!id) return;
    const { token } = getState().auth;

    try {
      await axios.patch(
        `${BASE_URL}/notificaciones/${id}/leido`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(markRead(id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
};

export const markAllAsRead = () => {
  return async (dispatch, getState) => {
    const { token } = getState().auth;

    try {
      await axios.patch(
        `${BASE_URL}/notificaciones/marcar-todas/leidas`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(markAllRead());
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };
};
