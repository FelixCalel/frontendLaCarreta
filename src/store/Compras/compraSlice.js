import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCompras,
  consolidateCompras,
  updateCompra,
  asignarProveedor,
  desasignarProveedor,
  actualizarFechaIngreso,
} from "./thunks";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const comprasSlice = createSlice({
  name: "compras",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload || "Error al obtener compras";
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
        state.error = action.payload || "Error al consolidar compras";
      })

      .addCase(updateCompra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompra.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.data.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.data[index] = updated;
        }
      })
      .addCase(updateCompra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al actualizar compra";
      })
      .addCase(asignarProveedor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asignarProveedor.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.data.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updated };
        }
      })
      .addCase(asignarProveedor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al asignar proveedor";
      })

      .addCase(desasignarProveedor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(desasignarProveedor.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.data.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            proveedoresAsignados: updated.proveedoresAsignados,
          };
        }
      })
      .addCase(desasignarProveedor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al desasignar proveedor";
      })
      .addCase(actualizarFechaIngreso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(actualizarFechaIngreso.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const updatedCompra = action.payload;
      //   const index = state.data.findIndex((c) => c.id === updatedCompra.id);
      //   if (index !== -1) {
      //     state.data[index] = { ...state.data[index], ...updatedCompra };
      //   }
      // })
      .addCase(actualizarFechaIngreso.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || "Error al actualizar fecha de ingreso";
      });
  },
});

export default comprasSlice.reducer;
