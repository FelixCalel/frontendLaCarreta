import { createSlice } from '@reduxjs/toolkit';
import { fetchMesasActivasThunk, fetchMesasAsignadasThunk, fetchMesasDisponiblesThunk, asignarMesaThunk } from './thunks';

const asignacionAMSlice = createSlice({
  name: 'asignacionAM',
  initialState: {
    mesasAsignadas: [],
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
      .addCase(asignarMesaThunk.fulfilled, (state, action) => {
        state.mesasAsignadas.push(action.payload); // O recarga desde fetch
      });
  },
});

export default asignacionAMSlice.reducer;
