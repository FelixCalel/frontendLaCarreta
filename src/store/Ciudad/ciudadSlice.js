import { createSlice } from '@reduxjs/toolkit';
import { tablaCiudad, addNewCiudad, deleteCiudad, updateCiudad, toggleCiudadStatus, tablaPais } from './thunks';

const ciudadSlice = createSlice({
  name: 'ciudades',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    paises: [],  // Añadimos un array para los países
    paisesStatus: 'idle',
    paisesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaCiudad.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaCiudad.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.sort((a, b) => a.id - b.id); // Asegura el orden al actualizar
      })
      .addCase(tablaCiudad.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewCiudad.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de agregar
      })
      .addCase(deleteCiudad.fulfilled, (state, action) => {
        state.data = state.data.filter(ciudad => ciudad.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de eliminar
      })
      .addCase(updateCiudad.fulfilled, (state, action) => {
        const index = state.data.findIndex(ciudad => ciudad.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar
      })
      .addCase(toggleCiudadStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(ciudad => ciudad.id === action.payload.id);
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar el estado
      })
      // Manejo del estado para los países
      .addCase(tablaPais.pending, (state) => {
        state.paisesStatus = 'loading';
      })
      .addCase(tablaPais.fulfilled, (state, action) => {
        state.paisesStatus = 'succeeded';
        state.paises = action.payload;
      })
      .addCase(tablaPais.rejected, (state, action) => {
        state.paisesStatus = 'failed';
        state.paisesError = action.error.message;
      });
  }
});

export default ciudadSlice.reducer;
