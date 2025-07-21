import { createSlice } from "@reduxjs/toolkit";
import {
  tablaEmpresa,
  addNewEmpresa,
  deleteEmpresa,
  updateEmpresa,
  toggleEmpresaStatus,
  tablaPais,
  importarRecetas,
} from "./thunks";

const empresaSlice = createSlice({
  name: "empresas",
  initialState: {
    data: [],
    status: "idle",
    error: null,
    paises: [],
    paisesStatus: "idle",
    paisesError: null,
    recetas: {
      status: "idle",
      error: null,
      filasWS: 0,
      registrosInsertados: 0,
      errores: [],
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaEmpresa.pending, (state) => {
        state.status = "loading";
      })
      .addCase(tablaEmpresa.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.sort((a, b) => a.id - b.id);
      })
      .addCase(tablaEmpresa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewEmpresa.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(deleteEmpresa.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (empresa) => empresa.id !== action.payload
        );
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(updateEmpresa.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (empresa) => empresa.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(toggleEmpresaStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (empresa) => empresa.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id);
      })
      .addCase(tablaPais.pending, (state) => {
        state.paisesStatus = "loading";
      })
      .addCase(tablaPais.fulfilled, (state, action) => {
        state.paisesStatus = "succeeded";
        state.paises = action.payload;
      })
      .addCase(tablaPais.rejected, (state, action) => {
        state.paisesStatus = "failed";
        state.paisesError = action.error.message;
      })
      .addCase(importarRecetas.pending, (state) => {
        state.recetas.status = "loading";
        state.recetas.error = null;
      })
      .addCase(importarRecetas.fulfilled, (state, action) => {
        state.recetas.status = "succeeded";
        state.recetas.filasWS = action.payload.filasWS;
        state.recetas.registrosInsertados = action.payload.registrosInsertados;
        state.recetas.errores = action.payload.errores;
      })
      .addCase(importarRecetas.rejected, (state, action) => {
        state.recetas.status = "failed";
        state.recetas.error = action.error.message || "Error desconocido";
      });
  },
});

export default empresaSlice.reducer;
