import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaItems = createAsyncThunk(
  'items/fetchItems',
  async () => {
    const response = await axios.get(`${BASE_URL}/items/todos`); 
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);
