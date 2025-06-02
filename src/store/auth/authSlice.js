import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./thunks";

const LOCAL_KEY = "authSlice";

/* ----------  helpers ---------- */
const loadState = () => {
  try {
    const s = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    return {
      status: s.status ?? "not-authenticated",
      uid: s.uid ?? null,
      email: s.email ?? null,
      displayName: s.displayName ?? null,
      photoURL: s.photoURL ?? null,
      errorMessage: null,
      token: s.token ?? null,
      rutas: s.rutas ?? [],
      user: s.user ?? null,
    };
  } catch (_err) {
    return {
      status: "not-authenticated",
      uid: null,
      email: null,
      displayName: null,
      photoURL: null,
      errorMessage: null,
      token: null,
      rutas: [],
      user: null,
    };
  }
};

const saveState = (state) =>
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));

/* ----------  slice ---------- */
export const authSlice = createSlice({
  name: "auth",
  initialState: loadState(),

  reducers: {
    registered: (state, { payload }) => {
      state.status = "registered";
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL ?? null;
      state.token = payload.token ?? null;
      state.rutas = payload.rutas ?? [];
      state.user = payload;
      saveState(state);
    },

    login: (state, { payload }) => {
      state.status = "authenticated";
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL ?? null;
      state.token = payload.token ?? null;
      state.rutas =
        payload.rutas && payload.rutas.length ? payload.rutas : state.rutas;
      state.user = {
        rutas:
          payload.rutasFull && payload.rutasFull.length
            ? payload.rutasFull
            : state.user?.rutas || [],
      };
      saveState(state);
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
      state.user = null;
      localStorage.removeItem(LOCAL_KEY);
    },

    checkingCredentials: (state) => {
      state.status = "checking";
    },

    setRutas: (state, { payload }) => {
      state.rutas = payload.ids;
      state.user = { ...(state.user || {}), rutas: payload.objetos };
      saveState(state);
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
        saveState(state);
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.status = "not-authenticated";
        state.errorMessage = payload;
        saveState(state);
      });
  },
});

export const { login, logout, checkingCredentials, registered, setRutas } =
  authSlice.actions;
