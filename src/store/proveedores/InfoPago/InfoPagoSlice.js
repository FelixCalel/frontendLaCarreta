import { createSlice } from '@reduxjs/toolkit';
import { fetchDropdownOptions, fetchBancoOptions, fetchMonedaOptions, fetchTipoCuentaOptions, submitFormData } from './thunks';

const initialState = {
  dropdownOptions: [],
  bancoOptions: [],
  monedaOptions: [],
  tipoCuentaOptions: [],
  formData: {}, // Estado inicial vacío para manejar datos dinámicos
  status: 'idle',
  error: null
};

const infoPagoSlice = createSlice({
  name: 'infoPago',
  initialState,
  reducers: {
    setFormData(state, action) {
      state.formData = {
        ...state.formData,
        ...action.payload // Maneja dinámicamente cualquier campo pasado en action.payload
      };
    },
    setTipoPago(state, action) {
      state.formData.tipoPago = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDropdownOptions.fulfilled, (state, action) => {
        state.dropdownOptions = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchDropdownOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBancoOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBancoOptions.fulfilled, (state, action) => {
        state.bancoOptions = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchBancoOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMonedaOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMonedaOptions.fulfilled, (state, action) => {
        state.monedaOptions = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchMonedaOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTipoCuentaOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTipoCuentaOptions.fulfilled, (state, action) => {
        state.tipoCuentaOptions = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTipoCuentaOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(submitFormData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitFormData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setFormData, setTipoPago } = infoPagoSlice.actions;

export default infoPagoSlice.reducer;
