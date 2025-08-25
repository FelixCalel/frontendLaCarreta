import { createSlice } from "@reduxjs/toolkit";
import {
  tablaItems,
  actualizarStatusProducto,
  actualizarDeudorProducto,
} from "./thunks";

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    updateLocalState: (state, action) => {
      const updatedItem = action.payload;
      const index = state.items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        state.items[index] = updatedItem;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tablaItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(tablaItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(tablaItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(actualizarStatusProducto.pending, (state) => {
        state.status = "loading";
      })
      .addCase(actualizarStatusProducto.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(actualizarStatusProducto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(actualizarDeudorProducto.pending, (state) => {
        state.status = "loading";
      })
      .addCase(actualizarDeudorProducto.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          // Actualiza el ítem con el deudor asignado
          state.items[index].deuId = action.payload.deuId;
          state.items[index].deudor = action.payload.deudor; // Asegúrate de que el deudor sea actualizado
        }
      })
      .addCase(actualizarDeudorProducto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default itemsSlice.reducer;
export const { setItems, updateLocalState } = itemsSlice.actions;
