import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Ajusta la URL base de tu API
const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchModulos = createAsyncThunk(
  'modulos/fetchModulos',
  async (UsuarioId, thunkAPI) => {
    try {
      // Verificamos que UsuarioId esté disponible
      if (!UsuarioId) {
        throw new Error('El UsuarioId de autenticación no está disponible');
      }

      // Hacemos la petición a la API usando el UsuarioId
      const response = await axios.get(`${BASE_URL}/api/asignarRMOP/modulosPermisos/${UsuarioId}`);
      console.log(UsuarioId); // Verifica que UsuarioId esté pasando correctamente
      return response.data;
    } catch (error) {
      // Manejo de errores
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
