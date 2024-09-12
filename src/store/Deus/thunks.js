import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para buscar deudores por nombre o correlativo
export const tablaDeudores = createAsyncThunk(
  'deudores/tablaDeudores',
  async () => {
    const response = await axios.get('http://localhost:3000/deus/todos');
    const data = response.data;
   data.sort((a, b) => a.id - b.id); // Ordena los datos por id
    return data;
  }
);

