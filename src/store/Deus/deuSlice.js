import { createSlice } from '@reduxjs/toolkit';
import { tablaDeudores } from './thunks';
  // Importa el thunk

const deudoresSlice = createSlice({
  name: 'deudores',
  initialState: {
    deudores: [],  // Lista de deudores
    status: 'idle',  // Estado de la solicitud
    error: null,  // Errores en la solicitud
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tablaDeudores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaDeudores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deudores = action.payload;  // Aquí almacenamos los deudores obtenidos
      })
      .addCase(tablaDeudores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default deudoresSlice.reducer;
