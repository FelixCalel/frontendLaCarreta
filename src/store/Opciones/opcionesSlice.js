import { createSlice } from '@reduxjs/toolkit';
import { fetchOpciones } from './thunks';
import { fetchMetadataOpciones } from './thunks';

const opcionesSlice = createSlice({
  name: 'opciones',
  initialState: {
    opciones: [],
    metadata: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpciones.fulfilled, (state, action) => {
        state.opciones = action.payload;
        state.loading = false;
      })
      .addCase(fetchOpciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMetadataOpciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })  
      .addCase(fetchMetadataOpciones.fulfilled, (state, action) => {
        state.metadata = action.payload;
        state.loading = false;
      })
      .addCase(fetchMetadataOpciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});



export default opcionesSlice.reducer;
