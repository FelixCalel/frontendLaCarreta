import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  tablaDetalleOrden,
  addNewDetalleOrden,
  deleteDetalleOrden,
  updateDetalleOrden,
  toggleDetalleOrdenStatus,
  fetchConsolidado,
} from "./thunks";

const detalleOrdenSlice = createSlice({
  name: "detalleOrden",
  initialState: {
    data: [],
    consolidado: [],
    status: "idle",
    statusConsolidado: "idle",
    error: null,
    consolidadoErro: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaDetalleOrden.pending, (state) => {
        state.status = "loading";
      })
      .addCase(tablaDetalleOrden.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.sort((a, b) => a.id - b.id);
      })
      .addCase(tablaDetalleOrden.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewDetalleOrden.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(deleteDetalleOrden.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (detalleOrden) => detalleOrden.id !== action.payload
        );
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(updateDetalleOrden.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (detalleOrden) => detalleOrden.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(toggleDetalleOrdenStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (detalleOrden) => detalleOrden.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id);
      });
    builder
      .addCase(fetchConsolidado.pending, (state) => {
        state.statusConsolidado = "loading";
      })
      .addCase(fetchConsolidado.fulfilled, (state, action) => {
        state.statusConsolidado = "succeeded";
        state.consolidado = action.payload;
      })
      .addCase(fetchConsolidado.rejected, (state, action) => {
        state.statusConsolidado = "failed";
        state.consolidadoError = action.payload || action.error.message;
      });
  },
});

export const selectOrderedDetalleOrden = createSelector(
  (state) => state.detalleOrden.data,
  (data) => data.slice().sort((a, b) => a.id - b.id)
);

export default detalleOrdenSlice.reducer;
