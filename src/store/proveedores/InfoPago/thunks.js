// store/proveedores/InfoPago/thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDropdownOptions = createAsyncThunk(
  'infoPago/fetchDropdownOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/sys_paises/listar_pais');
    return response.data.map(pais => ({ value: pais.id, label: pais.nombre }));
  }
);

export const fetchBancoOptions = createAsyncThunk(
  'infoPago/fetchBancoOptions',
  async (paisId) => {
    const response = await axios.get(`http://localhost:3000/api/bancos/listar/${paisId}`);
    return response.data.map(banco => ({ value: banco.id, label: banco.nombre }));
  }
);

export const fetchMonedaOptions = createAsyncThunk(
  'infoPago/fetchMonedaOptions',
  async (paisId) => {
    const response = await axios.get(`http://localhost:3000/api/sn_moneda/listar_monedas/${paisId}`);
    return response.data.map(moneda => ({ value: moneda.id, label: moneda.nombre }));
  }
);

export const fetchTipoCuentaOptions = createAsyncThunk(
  'infoPago/fetchTipoCuentaOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/tipo_cuenta/listar_tipo_cuenta');
    return response.data.map(tipoCuenta => ({ value: tipoCuenta.id, label: tipoCuenta.nombre }));
  }
);

export const submitFormData = createAsyncThunk(
  'infoPago/submitFormData',
  async (formData) => {
    const response = await axios.post('/api/submitFormData', formData);
    return response.data;
  }
);
