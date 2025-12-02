import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listUsuarios } from "../../providers/endpoints";
import { fetchUsuariosMetadata, toggleUserStatus, assignUserRoutes } from "./thunks";

// ... (existing code)





// Define tu thunk asíncrono utilizando createAsyncThunk
export const fetchUsuarios = createAsyncThunk(
  "usuarios/fetchUsuarios",
  async (arg = {}) => {
    const { id } = arg;
    console.log("ingresa en fetchUsuairios", { id });
    // Realiza tu lógica asincrónica aquí, como hacer una solicitud HTTP
    const response = await listUsuarios({ id });
    console.log("fetchUsuarios response:", response);

    // Verifica si la respuesta es exitosa
    if (!response || !response.ok) {
      console.error("Error fetching usuarios:", response?.error || "Unknown error");
      throw new Error(response?.error || "Error al obtener los usuarios -->");
    }
    // Parsea la respuesta a formato JSON
    // const usuarios = await response.json();

    // Devuelve los usuarios obtenidos
    return response;
  }
);



const saveState = (state) => {
  console.log("Guardando estado en localStorage:", state);
  localStorage.setItem("authSlice", JSON.stringify(state)); // Usa el mismo LOCAL_KEY que has utilizado antes
};

// Define tu slice de Redux
export const usuariosSlice = createSlice({
  name: "usuarios",
  initialState: {
    data: [],
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    paisId: null, // Asegúrate de tener `paisId` en el estado inicial
    metadata: [],
  },
  reducers: {
    // Puedes definir otras acciones sincrónicas aquí si es necesario
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.status = "loading"; // Actualiza el estado a 'loading' mientras se realiza la solicitud
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        console.log(action, "<---");
        state.status = "succeeded";
        state.items = action.payload.usuarios; // Asegúrate de que action.payload tenga `usuarios` y `paisId`
        state.data = action.payload;

        // Si necesitas también asegurarte de que el paisId se guarde en el estado global
        if (action.payload.paisId) {
          state.paisId = action.payload.paisId;
          saveState(state); // Guarda nuevamente el estado con paisId
        }
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Captura el mensaje de error
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

// Exporta el reducer generado automáticamente por createSlice
export const usuariosReducer = usuariosSlice.reducer;

// Exporta las acciones generadas automáticamente por createSlice
export const { setUsuarios } = usuariosSlice.actions;
