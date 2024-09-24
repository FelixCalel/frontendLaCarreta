import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  addNewPedido,
  deletePedido,
  updatePedido,
  togglePedidoStatus,
  tablaPedidos // Asegúrate de importar el thunk para cargar pedidos
} from './thunks';

const pedidoSlice = createSlice({
  name: 'pedidos',
  initialState: {
    data: [], 
    status: 'idle',
    error: null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(tablaPedidos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaPedidos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; 
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(tablaPedidos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; 
      })
      .addCase(addNewPedido.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); 
      })
      .addCase(deletePedido.fulfilled, (state, action) => {
        state.data = state.data.filter((pedido) => pedido.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); 
      })
      .addCase(updatePedido.fulfilled, (state, action) => {
        const index = state.data.findIndex((pedido) => pedido.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(togglePedidoStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex((pedido) => pedido.id === action.payload.id);
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id); 
      });
  },
});

export const selectOrderedPedidos = createSelector(
  (state) => state.pedidos.data,
  (data) => data.slice().sort((a, b) => a.id - b.id)
);

export default pedidoSlice.reducer;
