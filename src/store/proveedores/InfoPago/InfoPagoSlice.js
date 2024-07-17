// store/proveedores/InfoPago/InfoPagoSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchDropdownOptions, fetchBancoOptions, fetchMonedaOptions, fetchTipoCuentaOptions, submitFormData } from './thunks';

const initialState = {
  dropdownOptions: [],
  bancoOptions: [],
  monedaOptions: [],
  tipoCuentaOptions: [],
  formData: {
    tipoPago: '',
    paisBanco: '',
    banco: '',
    moneda: '',
    tipoCuenta: '',
    numeroCuenta: '',
    nombreCheque: ''
  },
  status: 'idle',
  error: null,
};

const infoPagoSlice = createSlice({
  name: 'infoPago',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setTipoPago: (state, action) => {
      state.formData.tipoPago = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDropdownOptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dropdownOptions = action.payload;
      })
      .addCase(fetchDropdownOptions.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchBancoOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBancoOptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bancoOptions = action.payload;
      })
      .addCase(fetchBancoOptions.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchMonedaOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMonedaOptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monedaOptions = action.payload;
      })
      .addCase(fetchMonedaOptions.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchTipoCuentaOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTipoCuentaOptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tipoCuentaOptions = action.payload;
      })
      .addCase(fetchTipoCuentaOptions.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setFormData, setTipoPago } = infoPagoSlice.actions;

export default infoPagoSlice.reducer;
