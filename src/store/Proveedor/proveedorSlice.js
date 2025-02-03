import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor
} from './proveedor.thunks';

const initialState = {
  data: [],
  loading: false,
  error: null
};

const proveedorSlice = createSlice({
  name: 'proveedores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ========== FETCH PROVEEDORES ==========
      .addCase(fetchProveedores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProveedores.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProveedores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== CREATE PROVEEDOR ==========
      .addCase(createProveedor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProveedor.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createProveedor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== UPDATE PROVEEDOR ==========
      .addCase(updateProveedor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProveedor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateProveedor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== DELETE PROVEEDOR ==========
      .addCase(deleteProveedor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProveedor.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProveedor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default proveedorSlice.reducer;