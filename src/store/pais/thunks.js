import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaPais = createAsyncThunk(
  'paises/fetchPaises',
  async () => {
    const response = await axios.get(`${BASE_URL}/pais/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id); 
    return data;
  }
);

export const addNewPais = createAsyncThunk(
  'paises/addNewPais',
  async (newPais) => {
    const response = await axios.post(`${BASE_URL}/pais/create`, newPais);
    return response.data;
  }
);

export const deletePais = createAsyncThunk(
  'paises/deletePais',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/pais/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar el país');
    }
  }
);

export const updatePais = createAsyncThunk(
  'paises/updatePais',
  async (pais) => {
    const response = await axios.put(`${BASE_URL}/pais/actualizar/${pais.id}`, pais);
    return response.data;
  }
);

export const togglePaisStatus = createAsyncThunk(
  'paises/togglePaisStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`${BASE_URL}/pais/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);
