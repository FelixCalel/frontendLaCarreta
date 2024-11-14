import { createSlice } from '@reduxjs/toolkit';
import { tablaRuta, addNewRuta, deleteRuta, updateRuta, toggleRutaStatus } from './thunks';

const rutaSlice = createSlice({
  name: 'rutas',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    ciudades: [],  // Añadimos un array para las ciudades
    rutas: [],     // Añadimos un array para las rutas
    deudores: [],  // Añadimos un array para los deudores
    ciudadesStatus: 'idle',
    rutasStatus: 'idle',
    deudoresStatus: 'idle',
    ciudadesError: null,
    rutasError: null,
    deudoresError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // tablaRuta
      .addCase(tablaRuta.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaRuta.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.sort((a, b) => a.id - b.id);
      })
      .addCase(tablaRuta.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      //AddNewRuta
      .addCase(addNewRuta.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de agregar
      })
      .addCase(deleteRuta.fulfilled, (state, action) => {
        state.data = state.data.filter(ruta => ruta.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de eliminar
      })
      .addCase(updateRuta.fulfilled, (state, action) => {
        const index = state.data.findIndex(ruta => ruta.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar
      })
      .addCase(toggleRutaStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(ruta => ruta.id === action.payload.id);
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar el estado
      })
  }
});

export default rutaSlice.reducer;
