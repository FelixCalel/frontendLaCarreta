import { createSlice } from '@reduxjs/toolkit';
import { fetchModulos } from './thunks'; // Importa el thunk fetchModulos

const modulosSlice = createSlice({
  name: 'modulos',
  initialState: {
    modulos: [], // Donde se almacenarán los módulos obtenidos de la API
    loading: false, // Estado de carga
    error: null, // Manejo de errores
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cuando se está solicitando los módulos (pending)
      .addCase(fetchModulos.pending, (state) => {
        state.loading = true;  // Activar el estado de carga
        state.error = null;    // Limpiar errores previos
      })
      // Cuando se obtienen los módulos correctamente (fulfilled)
      .addCase(fetchModulos.fulfilled, (state, action) => {
        state.modulos = action.payload; // Guardar los módulos obtenidos
        state.loading = false;          // Desactivar el estado de carga
      })
      // Si ocurre un error al obtener los módulos (rejected)
      .addCase(fetchModulos.rejected, (state, action) => {
        state.loading = false;           // Desactivar el estado de carga
        state.error = action.error.message; // Guardar el mensaje de error
      });
  },
});

export default modulosSlice.reducer;
