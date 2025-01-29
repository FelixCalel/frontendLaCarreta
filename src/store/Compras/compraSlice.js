import { createSlice } from '@reduxjs/toolkit';
import { fetchCompras, consolidateCompras } from './thunks';

const initialState = {
  data: [],      
  loading: false,
  error: null,
};

const comprasSlice = createSlice({
  name: 'compras',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompras.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;  // las compras
      })
      .addCase(fetchCompras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al obtener compras';
      })

      .addCase(consolidateCompras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(consolidateCompras.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(consolidateCompras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al consolidar compras';
      });
  },
});

export default comprasSlice.reducer;
