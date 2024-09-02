import { createSlice } from '@reduxjs/toolkit';
import { tablaEmpresa, addNewEmpresa, deleteEmpresa, updateEmpresa, toggleEmpresaStatus, tablaPais } from './thunks';

const empresaSlice = createSlice({
  name: 'empresas',
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

export default empresaSlice.reducer;
