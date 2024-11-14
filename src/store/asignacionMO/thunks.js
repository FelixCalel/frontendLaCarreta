import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Definimos la URL de la API, asegurándonos de que está correctamente configurada.
const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchasignacionMO = createAsyncThunk(
  'asignacionMO/fetchasignacionMO',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/asignacionMO/`);
      return response.data; // Asegúrate de que los datos sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const fetchasignacionMOMetadata = createAsyncThunk('asignacionMO/fetchasignacionMOMetadata',
  async (_, thunkAPI) => {
    try {
      // Hacemos la petición a la API
      const response = await axios.get(`${BASE_URL}/api/opciones/metadata`);
      return response.data;  // Asegúrate de que los datos retornados sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const createasignacionMO = createAsyncThunk('asignacionMO/createasignacionMO',
  async (asignacionMOData, thunkAPI) => {
    try {
      // Agregar los campos faltantes a los datos del módulo
      const state = thunkAPI.getState();
      const auth = state.auth;  // Asegurarse de que auth contiene los datos del usuario actual

      // Formatear los datos de creación
      const asignacionMO = {
        ...asignacionMOData,
        created_by: auth.userId || 1,  // ID del usuario autenticado
        updated_by: auth.userId || 1,  // Asumimos que es el mismo usuario que lo actualiza
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Llamada a la API para crear el módulo
      const response = await axios.post(`${BASE_URL}/api/asignacionMO/crear`, asignacionMO);
      return response.data;
    } catch (error) {
      // Manejo de errores
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);