import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;


// Función que realiza la petición a la API para obtener los módulos
export const fetchModulos = createAsyncThunk('modulos/fetchModulos',
  async (_, thunkAPI) => {
    try {
      // Accedemos al estado de auth desde thunkAPI
      const state = thunkAPI.getState();
      const auth = state.auth;

      // Verificamos que auth.uid esté disponible
      if (!auth?.uid) {
        throw new Error('El UID de autenticación no está disponible');
      }

      // Hacemos la petición a la API usando el UID
      const response = await axios.get(`${BASE_URL}/api/asignarRMOP/modulosPermisos/${auth.uid}`);
      return response.data;
    } catch (error) {
      // Manejo de errores
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchModulosTabla = createAsyncThunk('modulos/fetchModulosTabla',
  async (_, thunkAPI) => {
    try {
      // Hacemos la petición a la API
      const response = await axios.get(`${BASE_URL}/api/modulos/`);
      return response.data;  // Asegúrate de que los datos retornados sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const fetchMetadataModulos = createAsyncThunk('modulos/fetchMetadataModulos',
  async (_, thunkAPI) => {
    try {
      // Hacemos la petición a la API

      const response = await axios.get(`${BASE_URL}/api/modulos/metadata`);
      return response.data;  // Asegúrate de que los datos retornados sean correctos

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Función que realiza la petición a la API para crear un módulo
export const createModulo = createAsyncThunk('modulos/createModulo',
  async (moduloData, thunkAPI) => {
    try {
      // Agregar los campos faltantes a los datos del módulo
      const state = thunkAPI.getState();
      const auth = state.auth;  // Asegurarse de que auth contiene los datos del usuario actual

      // Formatear los datos de creación
      const modulo = {
        ...moduloData,
        created_by: auth.userId || 1,  // ID del usuario autenticado
        updated_by: auth.userId || 1,  // Asumimos que es el mismo usuario que lo actualiza
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Llamada a la API para crear el módulo
      const response = await axios.post(`${BASE_URL}/api/modulos/crear`, modulo);
      return response.data;
    } catch (error) {
      // Manejo de errores
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const updateModulo = createAsyncThunk(
  'modulos/updateModulo',
  async (moduloData, { rejectWithValue }) => {
      try {
          const response = await axios.put(`${BASE_URL}/api/modulos/update`, moduloData);
          return response.data;
      } catch (error) {
          if (error.response && error.response.data) {
              return rejectWithValue(error.response.data);
          } else {
              return rejectWithValue(error.message);
          }
      }
  }
);

export const deleteModulo = createAsyncThunk(
  'modulos/deleteModulo',
  async (id, { rejectWithValue }) => {
      try {
          const response = await axios.delete(`${BASE_URL}/api/modulos/eliminar/${id}`);
          return response.data;
      } catch (error) {
          if (error.response && error.response.data) {
              return rejectWithValue(error.response.data);
          } else {
              return rejectWithValue(error.message);
          }
      }
  }
);


