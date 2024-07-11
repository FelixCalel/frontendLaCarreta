// thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDropdownOptions = createAsyncThunk(
  'infoCredito/fetchDropdownOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/plazos'); // Ajusta esta URL a tu endpoint real
    return {
      plazos: response.data.plazos || []
    };
  }
);

export const submitFormData = createAsyncThunk(
  'infoCredito/submitFormData',
  async (formData) => {
    const response = await axios.post('/api/submitFormData', formData); // Ajusta esta URL a tu endpoint real
    return response.data;
  }
);
