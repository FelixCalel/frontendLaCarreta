import { createSlice } from '@reduxjs/toolkit';
import { fetchPermisosRoles } from './thunks';
import { fetchPermisosRolesMetadata } from './thunks';

const PermisosRolesSlice = createSlice({
  name: 'PermisosRoles',
  initialState: {
    PermisosRoles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});



export default PermisosRolesSlice.reducer;
