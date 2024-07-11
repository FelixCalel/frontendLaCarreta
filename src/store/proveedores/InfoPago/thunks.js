// thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDropdownOptions = createAsyncThunk(
  'infoPago/fetchDropdownOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/sys_paises/listar_pais');
    return {
      bancosPorPais: response.data.bancosPorPais || {},
      monedasPorPais: response.data.monedasPorPais || {}
    };
  }
);

export const submitFormData = createAsyncThunk(
  'infoPago/submitFormData',
  async (formData) => {
    const response = await axios.post('/api/submitFormData', formData);
    return response.data;
  }
);
