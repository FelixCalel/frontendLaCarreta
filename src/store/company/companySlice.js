import { createSlice } from '@reduxjs/toolkit';
import { tablaCompany, addNewCompany, deleteCompany, updateCompany, toggleCompanyStatus } from './thunks';

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaCompany.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.sort((a, b) => a.id - b.id); // Asegura el orden al actualizar
      })
      .addCase(tablaCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewCompany.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de agregar
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.data = state.data.filter(company => company.id !== action.payload);
        state.data.sort((a, b) => a.id - b.id); // Ordena después de eliminar
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.data.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar
      })
      .addCase(toggleCompanyStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.data[index].isActive = action.payload.isActive;
        }
        state.data.sort((a, b) => a.id - b.id); // Ordena después de actualizar el estado
      });
  }
});

export default companySlice.reducer;
