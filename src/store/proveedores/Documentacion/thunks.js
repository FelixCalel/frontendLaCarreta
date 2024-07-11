// thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadDocumento = createAsyncThunk(
  'documentacion/uploadDocumento',
  async ({ tipoDocumento, file }) => {
    const formData = new FormData();
    formData.append('tipoDocumento', tipoDocumento);
    formData.append('file', file);

    const response = await axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
);

export const deleteDocumento = createAsyncThunk(
  'documentacion/deleteDocumento',
  async (numero) => {
    await axios.delete(`http://localhost:3000/api/documentos/${numero}`);
    return numero;
  }
);
