// thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDropdownOptions = createAsyncThunk(
  'infoSolicitante/fetchDropdownOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/empresa/');
    return response.data.map(pais => ({ value: pais.id, label: pais.nombre }));
  }
);

export const submitFormData = createAsyncThunk(
  'infoSolicitante/submitFormData',
  async (formData) => {
    const response = await axios.post('/api/submitFormData', formData);
    return response.data;
  }
);
