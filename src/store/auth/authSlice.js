import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./thunks";

const LOCAL_KEY = "authSlice";

const loadState = () => {
  try {
    const s = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    //console.log(s);
    return {
      status: s.status ?? "not-authenticated",
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
    };
  }
};

const saveState = (state) => {
  //console.log("Guardando estado en localStorage:", state);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
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
      state.correo = null;
      state.displayName = null;
      state.photoURL = null;
      state.token = null;
      state.paisId = null;
      state.roleId = null;
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
        state.correo = payload.correo;
        state.paisId = payload.paisId;
        state.roleId = payload.roleId;
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
