import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const tablaPais = createAsyncThunk(
  'paises/fetchPaises',
  async () => {
    const response = await axios.get('http://localhost:3000/pais/todos');
    return response.data;
  }
);
