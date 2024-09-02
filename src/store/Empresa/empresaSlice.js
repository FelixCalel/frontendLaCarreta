import { createSlice } from '@reduxjs/toolkit';
import { tablaEmpresa, addNewEmpresa, deleteEmpresa, updateEmpresa, toggleEmpresaStatus } from './thunks';

const empresaSlice = createSlice({
  name: 'empresas',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaEmpresa.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaEmpresa.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.sort((a, b) => a.id - b.id); // Asegura el orden al actualizar
      })
      .addCase(tablaEmpresa.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewEmpresa.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de agregar
      })
      .addCase(deleteEmpresa.fulfilled, (state, action) => {
        state.data = state.data.filter(empresa => empresa.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de eliminar
      })
      .addCase(updateEmpresa.fulfilled, (state, action) => {
        const index = state.data.findIndex(empresa => empresa.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar
      })
      .addCase(toggleEmpresaStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(empresa => empresa.id === action.payload.id);
        if (index !== -1) {
          state.data[index].estaActivo = action.payload.estaActivo;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar el estado
      });
  }
});

export default empresaSlice.reducer;
