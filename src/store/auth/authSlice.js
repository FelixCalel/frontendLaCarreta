import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "checking", // 'checking', 'authenticated', 'not-authenticated'
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    errorMessage: null,
    token: null, // Nuevo campo para el token
  },
  reducers: {
    registered: (state, { payload }) => {
      state.status = "registered"; // 'checking', 'not-authenticated', 'authenticated'
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL;
      state.errorMessage = null;
      state.token = payload.token; // Guardar el token
    },
    login: (state, { payload }) => {
      state.status = "authenticated"; // 'checking', 'not-authenticated', 'authenticated'
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL;
      state.errorMessage = null;
      state.token = payload.token; // Guardar el token
    },
    logout: (state, { payload }) => {
      state.status = "not-authenticated"; // 'checking', 'not-authenticated', 'authenticated'
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoURL = null;
      state.token = null; // Limpiar el token
      state.errorMessage = payload?.errorMessage || null;
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
  },
});

// Exportar las acciones
export const { login, logout, checkingCredentials, registered } = authSlice.actions;
