import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para buscar deudores por nombre o correlativo
export const tablaDeudores = createAsyncThunk(
  'deudores/tablaDeudores',
  async () => {
    console.log('sjlslsslsl')
    const response = await axios.get('http://localhost:3000/deus/todos');
    const data = response.data;
    console.log('data:',data);
   data.sort((a, b) => a.id - b.id); // Ordena los datos por id
    return data;
  }
);

