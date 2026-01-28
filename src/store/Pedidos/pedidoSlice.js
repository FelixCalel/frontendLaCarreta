import { createSlice } from "@reduxjs/toolkit";
import {
  addNewPedido,
  deletePedido,
  updatePedido,
  togglePedidoStatus,
  tablaPedidos,
  tablaPedidosConDetalles,
  updatePedidoActivacion,
  exportarPedidoSap,
  fetchIncomingPedidos,
  fetchFilterOptions,
} from "./thunks";

const pedidoSlice = createSlice({
  name: "pedidos",
  initialState: {
    data: [],
    total: 0,
    filterOptions: { tiendas: [], deudores: [], usuarios: [] },
    incomingData: [],
    pedidosConDetalles: [],
    status: "idle",
    error: null,
    exportStatus: "idle",
    exportResultado: null,
    exportError: null,
  },
  reducers: {
    clearPedidos: (state) => {
      state.data = [];
      state.total = 0;
      state.pedidosConDetalles = [];
      state.status = "idle";
      state.error = null;
    },
    removePedidos: (state, action) => {
      const idsToRemove = action.payload || [];
      state.data = state.data.filter(
        (pedido) => !idsToRemove.includes(pedido.id),
      );
      state.total = state.data.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tablaPedidos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(tablaPedidos.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (
          action.payload &&
          typeof action.payload === "object" &&
          !Array.isArray(action.payload) &&
          "data" in action.payload
        ) {
          state.data = action.payload.data;
          state.total =
            typeof action.payload.total === "number" ? action.payload.total : 0;
        } else {
          state.data = Array.isArray(action.payload) ? action.payload : [];
          state.total = state.data.length;
        }
        state.data.sort((a, b) => b.id - a.id);
      })
      .addCase(tablaPedidos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchIncomingPedidos.fulfilled, (state, action) => {
        state.incomingData = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      .addCase(addNewPedido.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(deletePedido.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (pedido) => pedido.id !== action.payload,
        );
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(updatePedido.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (pedido) => pedido.id === action.payload.id,
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(togglePedidoStatus.fulfilled, (state, action) => {
        const { id, estadoId, comentarioDisplay, fechaOrdenDisplay } =
          action.meta.arg;
        const idx = state.data.findIndex((p) => p.id === id);
        if (idx !== -1) {
          state.data[idx] = {
            ...state.data[idx],
            estadoId,
            comentarioDisplay:
              comentarioDisplay ?? state.data[idx].comentarioDisplay,
            fechaOrdenDisplay:
              fechaOrdenDisplay ?? state.data[idx].fechaOrdenDisplay,
          };
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
          p.id === id ? { ...p, isActive } : p,
        );
      })
      .addCase(updatePedidoActivacion.fulfilled, (state, action) => {
        const updated = action.payload;
        state.data = state.data.map((p) =>
          p.id === updated.id ? { ...p, isActive: updated.isActive } : p,
        );
      })
      .addCase(updatePedidoActivacion.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(exportarPedidoSap.pending, (state) => {
        state.exportStatus = "loading";
        state.exportError = null;
      })
      .addCase(exportarPedidoSap.fulfilled, (state, action) => {
        state.exportStatus = "succeeded";
        state.exportResultado = action.payload;
      })
      .addCase(exportarPedidoSap.rejected, (state, action) => {
        state.exportStatus = "failed";
        state.exportError = action.payload || action.error.message;
      });
  },
});

export const { clearPedidos, removePedidos } = pedidoSlice.actions;
export default pedidoSlice.reducer;
