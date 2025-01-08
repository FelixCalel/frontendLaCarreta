import { createSlice } from '@reduxjs/toolkit';
import {
  addNewPedido,
  deletePedido,
  updatePedido,
  togglePedidoStatus,
  tablaPedidos,
  tablaPedidosConDetalles 
} from './thunks';

const pedidoSlice = createSlice({
  name: 'pedidos',
  initialState: {
    data: [], 
    pedidosConDetalles: [], // Añadimos este estado
    status: 'idle',
    error: null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Mantenemos las acciones que actualizan state.data
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
      // Otras acciones que actualizan state.data
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
      })
      // Modificamos `tablaPedidosConDetalles` para actualizar `state.pedidosConDetalles`
      .addCase(tablaPedidosConDetalles.fulfilled, (state, action) => {
        state.pedidosConDetalles = action.payload;
      })
      .addCase(tablaPedidosConDetalles.rejected, (state, action) => {
        console.error('Error al obtener pedidos con detalles:', action.error);
      });
  },
});

export default pedidoSlice.reducer;