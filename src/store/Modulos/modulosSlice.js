import { createSlice } from '@reduxjs/toolkit';
import { fetchModulos } from './thunks';
import { fetchModulosTabla } from './thunks';
import { fetchMetadataModulos } from './thunks';

const modulosSlice = createSlice({
  name: 'modulos',
  initialState: {
    modulos: [],
    modulosTabla: [],
    metadata: [],
    loading: false,
    error: null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchModulos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModulos.fulfilled, (state, action) => {
        state.modulos = action.payload;
        state.loading = false;
      })
      .addCase(fetchModulos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchModulosTabla.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModulosTabla.fulfilled, (state, action) => {
        state.modulosTabla = action.payload;  // Asegúrate de almacenar los datos correctamente
        state.loading = false;
      })
      .addCase(fetchModulosTabla.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;  // Captura el error correctamente
      })
      .addCase(fetchMetadataModulos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetadataModulos.fulfilled, (state, action) => {
        state.metadata = action.payload;  // Asegúrate de almacenar los datos correctamente
        state.loading = false;
      })
      .addCase(fetchMetadataModulos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;  // Captura el error correctamente
      });
    
  },
});
 


export default modulosSlice.reducer;
