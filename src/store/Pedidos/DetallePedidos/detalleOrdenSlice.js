import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  tablaDetalleOrden,
  addNewDetalleOrden,
  deleteDetalleOrden,
  updateDetalleOrden,
  toggleDetalleOrdenStatus,
} from './thunks';

const detalleOrdenSlice = createSlice({
  name: 'detalleOrden',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaDetalleOrden.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaDetalleOrden.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.sort((a, b) => a.id - b.id); // Ordena al actualizar
      })
      .addCase(tablaDetalleOrden.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewDetalleOrden.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de agregar
      })
      .addCase(deleteDetalleOrden.fulfilled, (state, action) => {
        state.data = state.data.filter((detalleOrden) => detalleOrden.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de eliminar
      })
      .addCase(updateDetalleOrden.fulfilled, (state, action) => {
        const index = state.data.findIndex((detalleOrden) => detalleOrden.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar
      })
      .addCase(toggleDetalleOrdenStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex((detalleOrden) => detalleOrden.id === action.payload.id);
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar el estado
      });
  },
});

// Selector para obtener detalles de orden ordenados por ID
export const selectOrderedDetalleOrden = createSelector(
  (state) => state.detalleOrden.data,
  (data) => data.slice().sort((a, b) => a.id - b.id)
);

export default detalleOrdenSlice.reducer;
