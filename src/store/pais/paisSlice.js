import { createSlice } from '@reduxjs/toolkit';
import { tablaPais } from './thunks'; // Asegúrate de la ruta correcta

const paisSlice = createSlice({
  name: 'paises',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaPais.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaPais.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(tablaPais.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default paisSlice.reducer;
