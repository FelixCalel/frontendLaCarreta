import { createSlice } from "@reduxjs/toolkit";
import {
  addNewPedido,
  deletePedido,
  updatePedido,
  togglePedidoStatus,
  tablaPedidos,
  tablaPedidosConDetalles,
  updatePedidoActivacion,
} from "./thunks";

const pedidoSlice = createSlice({
  name: "pedidos",
  initialState: {
    data: [],
    pedidosConDetalles: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaPedidos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(tablaPedidos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        // ↓ de mayor a menor
        state.data.sort((a, b) => b.id - a.id);
      })
      .addCase(tablaPedidos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPedido.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(deletePedido.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (pedido) => pedido.id !== action.payload
        );
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(updatePedido.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (pedido) => pedido.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(togglePedidoStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (pedido) => pedido.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(tablaPedidosConDetalles.fulfilled, (state, action) => {
        state.pedidosConDetalles = action.payload;
      })
      .addCase(tablaPedidosConDetalles.rejected, (state, action) => {
        console.error("Error al obtener pedidos con detalles:", action.error);
      })
      .addCase(updatePedidoActivacion.pending, (state, action) => {
        const { id, isActive } = action.meta.arg;
        state.data = state.data.map((p) =>
          p.id === id ? { ...p, isActive } : p
        );
      })
      .addCase(updatePedidoActivacion.fulfilled, (state, action) => {
        const updated = action.payload;
        state.data = state.data.map((p) =>
          p.id === updated.id ? { ...p, isActive: updated.isActive } : p
        );
      })
      .addCase(updatePedidoActivacion.rejected, (state, action) => {
        //state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default pedidoSlice.reducer;
