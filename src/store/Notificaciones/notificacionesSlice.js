import { createSlice } from "@reduxjs/toolkit";

export const notificacionesSlice = createSlice({
  name: "notificaciones",
  initialState: {
    notificaciones: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    startLoadingNotificaciones: (state) => {
      state.isLoading = true;
    },
    setNotificaciones: (state, action) => {
      state.isLoading = false;
      state.notificaciones = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.leido).length;
    },
    addNotificacion: (state, action) => {
      const newNotification = action.payload;
      const existingIndex = state.notificaciones.findIndex(
        (n) => n.id === newNotification.id
      );

      if (existingIndex !== -1) {
        // Update existing
        state.notificaciones.splice(existingIndex, 1);
        state.notificaciones.unshift({
          ...newNotification,
          leido: false,
          creadoEl: newNotification.creadoEl || new Date().toISOString(),
        });
      } else {
        // Add new
        state.notificaciones.unshift({
          ...newNotification,
          leido: false,
          creadoEl: newNotification.creadoEl || new Date().toISOString(),
        });
      }
      state.unreadCount = state.notificaciones.filter((n) => !n.leido).length;
    },
    markRead: (state, action) => {
      const id = action.payload;
      state.notificaciones = state.notificaciones.map((n) =>
        n.id === id ? { ...n, leido: true } : n
      );
      state.unreadCount = state.notificaciones.filter((n) => !n.leido).length;
    },
    markAllRead: (state) => {
      state.notificaciones = state.notificaciones.map((n) => ({
        ...n,
        leido: true,
      }));
      state.unreadCount = 0;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startLoadingNotificaciones,
  setNotificaciones,
  addNotificacion,
  markRead,
  markAllRead,
  setError,
} = notificacionesSlice.actions;

export default notificacionesSlice.reducer;
