import { createSlice } from "@reduxjs/toolkit";
import {
  tablaDetalleOrden,
  addNewDetalleOrden,
  deleteDetalleOrden,
  updateDetalleOrden,
  toggleDetalleOrdenStatus,
  fetchConsolidado,
} from "./thunks";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  consolidado: [],
  statusConsolidado: "idle",
  consolidadoError: null,
};

const detalleOrdenSlice = createSlice({
  name: "detalleOrden",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaDetalleOrden.pending, (s) => {
        s.status = "loading";
      })
      .addCase(tablaDetalleOrden.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.data = a.payload.sort((x, y) => x.id - y.id);
      })
      .addCase(tablaDetalleOrden.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      })

      .addCase(addNewDetalleOrden.fulfilled, (s, a) => {
        s.data.push(a.payload);
        s.data.sort((x, y) => x.id - y.id);
      })
      .addCase(deleteDetalleOrden.fulfilled, (s, a) => {
        s.data = s.data.filter((d) => d.id !== a.payload);
      })
      .addCase(updateDetalleOrden.fulfilled, (s, a) => {
        const i = s.data.findIndex((d) => d.id === a.payload.id);
        if (i !== -1) s.data[i] = a.payload;
      })
      .addCase(toggleDetalleOrdenStatus.fulfilled, (s, a) => {
        const i = s.data.findIndex((d) => d.id === a.payload.id);
        if (i !== -1) s.data[i].estaActivo = a.payload.estaActivo;
      })
      .addCase(fetchConsolidado.pending, (s) => {
        s.statusConsolidado = "loading";
        s.consolidadoError = null;
      })
      .addCase(fetchConsolidado.fulfilled, (s, a) => {
        s.statusConsolidado = "succeeded";
        s.consolidado = a.payload;
      })
      .addCase(fetchConsolidado.rejected, (s, a) => {
        s.statusConsolidado = "failed";
        s.consolidadoError = a.payload ?? a.error.message;
      });
  },
});


export const selectConsolidadoEstado = (state) => ({
  data: state.detalleOrden.consolidado,
  status: state.detalleOrden.statusConsolidado,
  error: state.detalleOrden.consolidadoError,
});

export default detalleOrdenSlice.reducer;
