import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAreas,
  fetchAreaById,
  fetchOpciones,
  eliminarAreaThunk,
} from "./thunks";

const areasSlice = createSlice({
  name: "areas",
  initialState: {
    areas: [],
    currentArea: null,
    opciones: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAreaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAreaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArea = action.payload;
      })
      .addCase(fetchAreaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOpciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpciones.fulfilled, (state, action) => {
        state.loading = false;
        state.opciones = action.payload;
      })
      .addCase(fetchOpciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(eliminarAreaThunk.fulfilled, (state, action) => {
        state.areas = state.areas.filter(
          (area) => area.id !== action.payload.id,
        );
        if (state.currentArea?.id === action.payload.id) {
          state.currentArea = null;
        }
      });
  },
});

export const areasReducer = areasSlice.reducer;
