import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Usar la variable de entorno para la URL base
const BASE_URL = import.meta.env.VITE_API_URL;

// Thunk para buscar deudores por nombre o correlativo
export const tablaDeudores = createAsyncThunk(
  'deudores/tablaDeudores',
  async () => {
    const response = await axios.get(`${BASE_URL}/deus/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordena los datos por id
    return data;
  }
);
