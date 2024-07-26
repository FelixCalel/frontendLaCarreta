import { createSlice } from '@reduxjs/toolkit';
import { tablaPais, addNewPais, deletePais, updatePais, togglePaisStatus } from './thunks';

const paisSlice = createSlice({
  name: 'paises',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaPais.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaPais.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.sort((a, b) => a.id - b.id); // Asegura el orden al actualizar
      })
      .addCase(tablaPais.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPais.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de agregar
      })
      .addCase(deletePais.fulfilled, (state, action) => {
        state.data = state.data.filter(pais => pais.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de eliminar
      })
      .addCase(updatePais.fulfilled, (state, action) => {
        const index = state.data.findIndex(pais => pais.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar
      })
      .addCase(togglePaisStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(pais => pais.id === action.payload.id);
        if (index !== -1) {
          state.data[index].isActive = action.payload.isActive;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar el estado
      });
  }
});

export default paisSlice.reducer;
