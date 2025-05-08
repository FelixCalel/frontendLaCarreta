import { createSlice } from '@reduxjs/toolkit';
import { fetchMesasActivasThunk, fetchMesasAsignadasThunk, fetchMesasDisponiblesThunk, fetchAsignacionesThunk ,
  fetchCategoriasThunk, fetchGruposThunk, asignarTipoGrupoThunk, desasignarTipoGrupoThunk, fetchUsuariosEncargadosThunk,
  actualizarEncargadoThunk } from './thunks';

const asignacionAMSlice = createSlice({
  name: 'asignacionAM',
  initialState: {
    mesasAsignadas: [],
    asignaciones: [],
    categorias: [],
    grupos: [],
    usuariosEncargados: [],
    encargadoActual: null,
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMesasAsignadasThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMesasAsignadasThunk.fulfilled, (state, action) => {
        state.mesasAsignadas = action.payload;
        state.loading = false;
      })
      .addCase(fetchMesasAsignadasThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMesasActivasThunk.fulfilled, (state, action) => {
        state.mesasActivas = action.payload;
      })
      .addCase(fetchMesasDisponiblesThunk.fulfilled, (state, action) => {
        state.mesasDisponibles = action.payload;
      })


      .addCase(fetchAsignacionesThunk.fulfilled, (state, action) => {
        state.asignaciones = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCategoriasThunk.fulfilled, (state, action) => {
        state.categorias = action.payload;
      })
      .addCase(fetchGruposThunk.fulfilled, (state, action) => {
        state.grupos = action.payload;
      })
      .addCase(asignarTipoGrupoThunk.fulfilled, (state, action) => {
        state.asignaciones.push(action.payload);
      })
      .addCase(desasignarTipoGrupoThunk.fulfilled, (state, action) => {
        state.asignaciones = state.asignaciones.map(a =>
          a.id === action.payload.id ? { ...a, state: false } : a
        );
      })
      .addCase(fetchUsuariosEncargadosThunk.fulfilled, (state, action) => {
        state.usuariosEncargados = action.payload;
      })
      .addCase(actualizarEncargadoThunk.fulfilled, (state, action) => {
        state.encargadoActual = action.payload;
        state.status = 'encargado_actualizado';
      });

  },
});

export default asignacionAMSlice.reducer;
