import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const tablaPais = createAsyncThunk(
  'paises/fetchPaises',
  async () => {
    const response = await axios.get('http://localhost:3000/pais/todos');
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordena los datos por id
    return data;
  }
);

export const addNewPais = createAsyncThunk(
  'paises/addNewPais',
  async (newPais) => {
    const response = await axios.post('http://localhost:3000/pais/create', newPais);
    return response.data;
  }
);

export const deletePais = createAsyncThunk(
  'paises/deletePais',
  async (id) => {
    await axios.delete(`http://localhost:3000/pais/eliminar/${id}`);
    return id;
  }
);

export const updatePais = createAsyncThunk(
  'paises/updatePais',
  async (pais) => {
    const response = await axios.put(`http://localhost:3000/pais/actualizar/${pais.id}`, pais);
    return response.data;
  }
);

export const togglePaisStatus = createAsyncThunk(
  'paises/togglePaisStatus',
  async ({ id, isActive }) => {
    const response = await axios.patch(`http://localhost:3000/pais/actualizar-estado/${id}`, { isActive });
    return response.data;
  }
);
