import { createSlice, createSelector } from '@reduxjs/toolkit';
import { tablaTienda, addNewTienda, deleteTienda, updateTienda, toggleTiendaStatus } from './thunks';

const tiendaSlice = createSlice({
  name: 'tiendas',
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
      // Manejo de la tabla de Tiendas
      .addCase(tablaTienda.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaTienda.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.sort((a, b) => a.id - b.id); // Asegura el orden al actualizar
      })
      .addCase(tablaTienda.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewTienda.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de agregar
      })
      .addCase(deleteTienda.fulfilled, (state, action) => {
        state.data = state.data.filter(tienda => tienda.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de eliminar
      })
      .addCase(updateTienda.fulfilled, (state, action) => {
        const index = state.data.findIndex(tienda => tienda.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar
      })
      .addCase(toggleTiendaStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(tienda => tienda.id === action.payload.id);
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id);
      });
  }
});

export const selectOrderedTiendas = createSelector(
  (state) => state.tiendas.data, 
  (data) => data.slice().sort((a, b) => a.id - b.id)  
);

export default tiendaSlice.reducer;
