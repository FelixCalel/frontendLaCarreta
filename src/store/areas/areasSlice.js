import { createSlice } from "@reduxjs/toolkit";
import { fetchAreas, fetchAreaById, fetchOpciones } from "./thunks";

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
      // Fetch Areas
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
      // Fetch Area By ID
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
      // Fetch Opciones
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
      });
  },
});

export const areasReducer = areasSlice.reducer;
