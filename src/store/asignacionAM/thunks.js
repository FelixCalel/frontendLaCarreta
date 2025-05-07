import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchMesasAsignadasThunk = createAsyncThunk(
  'asignacionAM/fetchMesasAsignadas',
  async (areaId) => {
    const response = await axios.get(`${BASE_URL}/asignarAM/area/${areaId}`);
    return response.data;
  }
);

export const desasignarMesaThunk = createAsyncThunk(
  'asignacionAM/desasignarMesa',
  async (asignacionId, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/asignarAM/desasignar/${asignacionId.id}`, {
        update_by: asignacionId.userId,
      });
      return response.data;
    }
    catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error al desasignar la mesa');
    }
  }
);

export const fetchMesasActivasThunk = createAsyncThunk(
  'asignacionAM/fetchMesasActivas',
  async () => {
    const response = await axios.get(`${BASE_URL}/mesa/getAll`);
    return response.data;
  }
);

export const fetchMesasDisponiblesThunk = createAsyncThunk(
  "asignacionAM/fetchMesasDisponibles",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/mesa/getAllWithoutArea`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available tables:", error);
      return thunkAPI.rejectWithValue("Error al obtener mesas disponibles");
    }
  }
);

export const asignarMesaThunk = createAsyncThunk(
  'asignacionAM/asignarMesa',
  async (data) => {
    const response = await axios.post(`${BASE_URL}/asignarAM/`, data);
    return response.data;
  }
);
