import { createSlice } from "@reduxjs/toolkit";
import {
  tablaItems,
  actualizarStatusProducto,
  actualizarDeudorProducto,
  addDeudoresItem,
  removeDeudoresItem,
} from "./thunks";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload || [];
    },

    patchItem(state, action) {
      const { id, changes } = action.payload || {};
      const idx = state.items.findIndex((it) => it.id === id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...changes };
    },

    upsertMany(state, action) {
      const updates = action.payload || [];
      updates.forEach((u) => {
        const idx = state.items.findIndex((it) => it.id === u.id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...u };
        else state.items.push(u);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tablaItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(tablaItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(tablaItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Error al cargar items";
      })

      .addCase(actualizarStatusProducto.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const idx = state.items.findIndex((it) => it.id === payload.id);
        if (idx !== -1) {
          const existingItem = state.items[idx];
          state.items[idx] = {
            ...existingItem,
            ...payload,
            deudores: (payload.deudores && payload.deudores.length > 0) ? payload.deudores : existingItem.deudores,
          };
        }
      })
      .addCase(actualizarStatusProducto.rejected, (state, action) => {
        state.error = action.error?.message || "Error al actualizar estado";
      })

      .addCase(actualizarDeudorProducto.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const idx = state.items.findIndex((it) => it.id === payload.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...payload };
        }
      })
      .addCase(actualizarDeudorProducto.rejected, (state, action) => {
        state.error = action.error?.message || "Error al actualizar deudor";
      })
      .addCase(addDeudoresItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const idx = state.items.findIndex((it) => it.id === updatedItem.id);
        if (idx !== -1) {
          state.items[idx] = updatedItem;
        }
      })
      .addCase(removeDeudoresItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const idx = state.items.findIndex((it) => it.id === updatedItem.id);
        if (idx !== -1) {
          state.items[idx] = updatedItem;
        }
      });
  },
});

export default itemsSlice.reducer;
export const { setItems, patchItem, upsertMany } = itemsSlice.actions;
