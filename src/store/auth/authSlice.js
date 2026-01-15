import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./thunks";

const LOCAL_KEY = "authSlice";

const loadState = () => {
  try {
    const s = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    const hasToken = s.token && s.uid;

    return {
      status: hasToken ? s.status ?? "authenticated" : "not-authenticated",
      uid: s.uid ?? null,
      correo: s.correo ?? null,
      displayName: s.displayName ?? null,
      photoURL: s.photoURL ?? null,
      errorMessage: null,
      paisId: s.paisId ?? null,
      roleId: s.roleId ?? null,
      token: s.token ?? null,
      rutas: s.rutas ?? [],
      user: s.user ?? null,
      permissions: s.permissions ?? null,
    };
  } catch (_err) {
    return {
      status: "not-authenticated",
      uid: null,
      correo: null,
      displayName: null,
      photoURL: null,
      errorMessage: null,
      paisId: null,
      roleId: null,
      token: null,
      rutas: [],
      user: null,
      permissions: null,
    };
  }
};

const saveState = (state) => {
  try {
    //console.log("Guardando estado en localStorage:", state);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState: loadState(),

  reducers: {
    registered: (state, { payload }) => {
      state.status = "registered";
      state.uid = payload.uid;
      state.correo = payload.correo;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL ?? null;
      state.user = payload;
      state.paisId = payload.paisId;
      state.roleId = payload.roleId;
      state.token = payload.token ?? null;
      saveState(state);
      state.rutas = payload.rutas ?? [];
    },

    login: (state, { payload }) => {
      state.status = "authenticated";
      state.uid = payload.uid;
      state.correo = payload.correo;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL ?? null;
      state.paisId = payload.paisId ?? null;
      state.roleId = payload.roleId ?? null;
      state.token = payload.token ?? null;
      state.rutas =
        payload.rutas && payload.rutas.length ? payload.rutas : state.rutas;
      state.user = {
        ...(state.user || {}),
        ...(payload.user || {}),
        rutas:
          payload.rutasFull && payload.rutasFull.length
            ? payload.rutasFull
            : state.user?.rutas || [],
      };
      state.permissions = payload.permissions ?? state.permissions;
      saveState(state);
    },

    logout: (state, { payload }) => {
      state.status = "not-authenticated";
      state.uid = null;
      state.correo = null;
      state.displayName = null;
      state.photoURL = null;
      state.token = null;
      state.paisId = null;
      state.roleId = null;
      state.errorMessage = payload?.errorMessage || null;
      state.rutas = [];
      state.user = null;
      state.permissions = null;
      state.permissions = null;
      localStorage.removeItem(LOCAL_KEY);
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioId");
      localStorage.removeItem("nombreUsuario");
      localStorage.removeItem("correoUsuario");
      localStorage.removeItem("avatar");
      localStorage.removeItem("roleId");
      localStorage.removeItem("paisId");
      localStorage.removeItem("userData");
      localStorage.removeItem("isAuthenticated");
    },

    checkingCredentials: (state) => {
      state.status = "checking";
    },

    setRutas: (state, { payload }) => {
      state.rutas = payload.ids;
      state.user = { ...(state.user || {}), rutas: payload.objetos };
      saveState(state);
    },

    updateUser: (state, { payload }) => {
      state.displayName = payload.nombre
        ? `${payload.nombre} ${payload.apellido || ""}`.trim()
        : state.displayName;
      state.photoURL = payload.avatar || state.photoURL;
      if (state.user) {
        state.user = {
          ...state.user,
          nombre: payload.nombre || state.user.nombre,
          apellido: payload.apellido || state.user.apellido,
          telefono: payload.telefono || state.user.telefono,
          avatar: payload.avatar || state.user.avatar,
        };
      }
      saveState(state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        if (state.status !== "authenticated" && state.status !== "checking") {
          state.status = "checking";
        }
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.status = "authenticated";
        state.user = payload.user || payload; // Handle wrapped or unwrapped user
        state.rutas = payload.rutas || payload.user?.rutas || [];
        state.uid = payload.id || payload.user?.id;
        state.correo = payload.correo || payload.user?.correo;
        state.paisId = payload.paisId || payload.user?.paisId;
        state.roleId = payload.roleId || payload.user?.roleId;
        state.displayName = payload.nombre || payload.user?.nombre;
        state.photoURL = payload.avatar || payload.user?.avatar;
        state.permissions = payload.permissions ?? state.permissions;
        if (payload.token) {
          state.token = payload.token;
        }
        saveState(state);
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        const isNetworkError =
          payload === "Network Error" ||
          payload === "ERR_NETWORK" ||
          payload?.message === "Network Error" ||
          payload?.code === "ERR_NETWORK" ||
          (typeof payload === "string" && payload.includes("Network"));

        if (!isNetworkError) {
          state.status = "not-authenticated";
          state.errorMessage = payload;
          saveState(state);
        }
      });
  },
});

export const {
  login,
  logout,
  checkingCredentials,
  registered,
  setRutas,
  updateUser,
} = authSlice.actions;
