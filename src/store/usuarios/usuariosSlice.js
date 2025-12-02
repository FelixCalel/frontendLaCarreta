import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listUsuarios } from "../../providers/endpoints";
import { fetchUsuariosMetadata, toggleUserStatus, assignUserRoutes } from "./thunks";

export const fetchUsuarios = createAsyncThunk(
  "usuarios/fetchUsuarios",
  async (arg = {}) => {
    const { id } = arg;
    console.log("ingresa en fetchUsuairios", { id });
    const response = await listUsuarios({ id });
    console.log("fetchUsuarios response:", response);

    if (!response || !response.ok) {
      console.error("Error fetching usuarios:", response?.error || "Unknown error");
      throw new Error(response?.error || "Error al obtener los usuarios -->");
    }
    return response;
  }
);



const saveState = (state) => {
  console.log("Guardando estado en localStorage:", state);
  localStorage.setItem("authSlice", JSON.stringify(state));
};

export const usuariosSlice = createSlice({
  name: "usuarios",
  initialState: {
    data: [],
    items: [],
    status: "idle",
    error: null,
    paisId: null,
    metadata: [],
  },
  reducers: {
    // Puedes definir otras acciones sincrónicas aquí si es necesario
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        console.log(action, "<---");
        state.status = "succeeded";
        state.items = action.payload.usuarios;
        state.data = action.payload;

        if (action.payload.paisId) {
          state.paisId = action.payload.paisId;
          saveState(state);
        }
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUsuariosMetadata.fulfilled, (state, action) => {
        state.metadata = action.payload;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        if (state.items) {
          const index = state.items.findIndex((u) => u.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(assignUserRoutes.fulfilled, (state, action) => {
        if (state.items) {
          const index = state.items.findIndex((u) => u.id === action.payload.usuarioId);
          if (index !== -1) {
            state.items[index].rutas = action.payload.rutas;
          }
        }
      });
  },
});

export const usuariosReducer = usuariosSlice.reducer;

export const { setUsuarios } = usuariosSlice.actions;
