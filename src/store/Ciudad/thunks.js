import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaCiudad = createAsyncThunk(
  'ciudades/fetchCiudades',
  async () => {
    const response = await axios.get(`${BASE_URL}/ciudad/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);

export const addNewCiudad = createAsyncThunk(
  'ciudades/addNewCiudad',
  async (newCiudad) => {
    const response = await axios.post(`${BASE_URL}/ciudad/create`, newCiudad);
    return response.data;
  }
);

export const deleteCiudad = createAsyncThunk(
  'ciudades/deleteCiudad',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/ciudad/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar la ciudad');
    }
  }
);

export const updateCiudad = createAsyncThunk(
  'ciudades/updateCiudad',
  async (ciudad) => {
    const response = await axios.put(`${BASE_URL}/ciudad/actualizar/${ciudad.id}`, ciudad);
    return response.data;
  }
);

export const toggleCiudadStatus = createAsyncThunk(
  'ciudades/toggleCiudadStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`${BASE_URL}/ciudad/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);

export const tablaPais = createAsyncThunk(
  'paises/fetchPaises',
  async () => {
    const response = await axios.get(`${BASE_URL}/pais/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);
