import { createSlice } from '@reduxjs/toolkit';
import { fetchCompras, consolidateCompras, updateCompra } from './thunks';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const comprasSlice = createSlice({
  name: 'compras',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ========== fetchCompras ==========
      .addCase(fetchCompras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompras.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al obtener compras';
      })

      // ========== consolidateCompras ==========
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
      })

      // ========== updateCompra ==========
      .addCase(updateCompra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompra.fulfilled, (state, action) => {
        // action.payload debería ser la compra actualizada
        const updated = action.payload;
        const index = state.data.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          // Reemplazamos el objeto viejo con el nuevo
          state.data[index] = updated;
        }
      })
      .addCase(updateCompra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al actualizar compra';
      });
  },
});

export default comprasSlice.reducer;
