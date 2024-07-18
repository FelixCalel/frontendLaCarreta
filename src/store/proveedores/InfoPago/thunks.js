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
  async (sysPaisId) => {
    const response = await axios.get(`http://localhost:3000/api/bancos/listar?sysPaisId=${sysPaisId}`);
    return response.data.map(banco => ({ value: banco.id, label: banco.nombre }));
  }
);

export const fetchMonedaOptions = createAsyncThunk(
  'infoPago/fetchMonedaOptions',
  async (sysPaisId) => {
    const response = await axios.get(`http://localhost:3000/api/tipo_monedas/listar?sysPaisId=${sysPaisId}`);
    return response.data.map(moneda => ({ value: moneda.id, label: moneda.nombre }));
  }
);

export const fetchTipoCuentaOptions = createAsyncThunk(
  'infoPago/fetchTipoCuentaOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/sn_tipo_cuentas/listar');
    return response.data.map(tipoCuenta => ({ value: tipoCuenta.id, label: tipoCuenta.nombre }));
  }
);

export const submitFormData = createAsyncThunk(
  'infoPago/submitFormData',
  async (formData) => {
    const response = await axios.post('http://localhost:3000/api/submitFormData', formData);
    return response.data;
  }
);
