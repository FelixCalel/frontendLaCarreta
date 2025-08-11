import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "checking",
  uid: null,
  email: null,
  displayName: null,
  token: localStorage.getItem("token") || null,
  roleId: localStorage.getItem("roleId") || null,
  paisId: localStorage.getItem("paisId") || null,
  rutas: [],
  rutasFull: [],
  id: localStorage.getItem("usuarioId") || null,

  allowedRoutes: JSON.parse(localStorage.getItem("allowedRoutes") || "[]"),
};

const persistAllowed = (routes) => {
  if (routes) localStorage.setItem("allowedRoutes", JSON.stringify(routes));
  else localStorage.removeItem("allowedRoutes");
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.status = "authenticated";
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.token = payload.token;
      state.roleId = payload.roleId;
      state.paisId = payload.paisId;
      state.rutas = payload.rutas || [];
      state.rutasFull = payload.rutasFull || [];
      state.id = payload.id;
    },
    logout: (state) => {
      state.status = "not-authenticated";
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.token = null;
      state.roleId = null;
      state.paisId = null;
      state.rutas = [];
      state.rutasFull = [];
      state.id = null;
      state.allowedRoutes = null;
      localStorage.removeItem("allowedRoutes");
    },

    // NUEVO
    setAllowedRoutes: (state, { payload }) => {
      state.allowedRoutes = payload || [];
      persistAllowed(state.allowedRoutes);
    },
  },
});

export const { login, logout, setAllowedRoutes } = authSlice.actions;
export default authSlice.reducer;
