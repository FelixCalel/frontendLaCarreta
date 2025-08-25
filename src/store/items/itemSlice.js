import { createSlice } from "@reduxjs/toolkit";
import {
  tablaItems,
  actualizarStatusProducto,
  actualizarDeudorProducto,
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
          state.items[idx] = { ...state.items[idx], ...payload };
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
      });
  },
});

export default itemsSlice.reducer;
export const { setItems, patchItem, upsertMany } = itemsSlice.actions;
