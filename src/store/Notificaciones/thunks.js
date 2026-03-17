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
    const fallbackToken =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    const authToken = token || fallbackToken;

    try {
      const response = await axios.get(`${BASE_URL}/notificaciones`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (Array.isArray(response.data)) {
        dispatch(setNotificaciones(response.data));
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
    const fallbackToken =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    const authToken = token || fallbackToken;

    try {
      await axios.patch(
        `${BASE_URL}/notificaciones/${id}/leido`,
        {},
        {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        },
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
    const fallbackToken =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    const authToken = token || fallbackToken;

    try {
      await axios.patch(
        `${BASE_URL}/notificaciones/marcar-todas/leidas`,
        {},
        {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        },
      );
      dispatch(markAllRead());
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };
};
