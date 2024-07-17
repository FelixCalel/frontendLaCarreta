import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDropdownOptions = createAsyncThunk(
  'infoCredito/fetchDropdownOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/sn_plazo_creditos/listar_plazo_creditos'); 
    return {
      plazos: response.data || []  
    };
  }
);

export const submitFormData = createAsyncThunk(
  'infoCredito/submitFormData',
  async (formData) => {
    const response = await axios.post('http://localhost:3000/api/submitFormData', formData); 
    return response.data;
  }
);
