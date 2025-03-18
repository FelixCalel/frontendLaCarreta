// PermisosRolesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchPermisosRoles, fetchPermisosRolesMetadata, fetchAsignacionMO } from './thunks';

const PermisosRolesSlice = createSlice({
  name: 'PermisosRoles',
  initialState: {
    PermisosRoles: [],
    asignacionMO: [], // Nuevo estado para las relaciones módulo-opción
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducers existentes para fetchPermisosRoles y fetchPermisosRolesMetadata
      .addCase(fetchPermisosRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermisosRoles.fulfilled, (state, action) => {
        state.PermisosRoles = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchPermisosRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPermisosRolesMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermisosRolesMetadata.fulfilled, (state, action) => {
        state.metadata = action.payload;
        state.loading = false;
      })
      .addCase(fetchPermisosRolesMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Nuevos reducers para fetchAsignacionMO
      .addCase(fetchAsignacionMO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAsignacionMO.fulfilled, (state, action) => {
        state.asignacionMO = action.payload || []; // Almacena los datos de la API
        state.loading = false;
      })
      .addCase(fetchAsignacionMO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al cargar asignacionMO';
      });
  },
});

export default PermisosRolesSlice.reducer;