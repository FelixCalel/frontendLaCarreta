import { createSlice } from '@reduxjs/toolkit';
import { fetchPermisos } from './thunks';
import { fetchPermisosMetadata } from './thunks';

const PermisosSlice = createSlice({
  name: 'Permisos',
  initialState: {
    Permisos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermisos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermisos.fulfilled, (state, action) => {
        state.Permisos = action.payload;
        state.loading = false;
      })
      .addCase(fetchPermisos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPermisosMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })  
      .addCase(fetchPermisosMetadata.fulfilled, (state, action) => {
        state.metadata = action.payload;
        state.loading = false;
      })
      .addCase(fetchPermisosMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});



export default PermisosSlice.reducer;
