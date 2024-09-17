import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  addNewPedido,
  deletePedido,
  updatePedido,
  togglePedidoStatus,
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
      .addCase(addNewPedido.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de agregar
      })
      .addCase(deletePedido.fulfilled, (state, action) => {
        state.data = state.data.filter((pedido) => pedido.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de eliminar
      })
      .addCase(updatePedido.fulfilled, (state, action) => {
        const index = state.data.findIndex((pedido) => pedido.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar
      })
      .addCase(togglePedidoStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex((pedido) => pedido.id === action.payload.id);
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar el estado
      });
  },
});

// Selector para obtener pedidos ordenados por ID
export const selectOrderedPedidos = createSelector(
  (state) => state.pedidos.data,
  (data) => data.slice().sort((a, b) => a.id - b.id)
);

export default pedidoSlice.reducer;
