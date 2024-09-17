import { createSlice } from '@reduxjs/toolkit';
import { tablaItems } from './thunks';  

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    status: 'idle', 
    error: null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;  // Aquí almacenamos los items obtenidos
      })
      .addCase(tablaItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default itemsSlice.reducer;
