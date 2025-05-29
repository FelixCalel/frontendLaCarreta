import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./thunks";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "checking",
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    errorMessage: null,
    token: null,
    rutas: [],
    user: null,
  },
  reducers: {
    registered: (state, { payload }) => {
      state.status = "registered";
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL;
      state.errorMessage = null;
      state.token = payload.token;
      state.rutas = payload.rutas;
      state.user = payload;
    },
    login: (state, { payload }) => {
      state.status = "authenticated";
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL;
      state.errorMessage = null;
      state.token = payload.token;
      state.rutas = payload.rutas?.length ? payload.rutas : state.rutas;
      state.user = {
        rutas: payload.rutasFull?.length
          ? payload.rutasFull
          : state.user?.rutas || [],
      };
    },
    logout: (state, { payload }) => {
      state.status = "not-authenticated";
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoURL = null;
      state.token = null;
      state.errorMessage = payload?.errorMessage || null;
      state.rutas = [];
      localStorage.removeItem("authSlice");
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
    setRutas: (state, { payload }) => {
      state.rutas = payload.ids;
      state.user = {
        ...(state.user || {}),
        rutas: payload.objetos,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "checking";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.status = "authenticated";
        state.user = payload;
        state.rutas = payload.rutas || [];
        state.uid = payload.id;
        state.email = payload.correo;
        state.displayName = payload.nombre;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.status = "not-authenticated";
        state.errorMessage = payload;
      });
  },
});

export const { login, logout, checkingCredentials, registered, setRutas } =
  authSlice.actions;
