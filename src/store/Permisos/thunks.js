import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Definimos la URL de la API, asegurándonos de que está correctamente configurada.
const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchPermisos = createAsyncThunk(
  "Permisos/fetchPermisos",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/permisos/`);
      return response.data; // Asegúrate de que los datos sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchPermisosMetadata = createAsyncThunk(
  "Permisos/fetchPermisosMetadata",
  async (_, thunkAPI) => {
    try {
      // Hacemos la petición a la API
      const response = await axios.get(`${BASE_URL}/api/permisos/metadata`);
      return response.data; // Asegúrate de que los datos retornados sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const createpermisos = createAsyncThunk(
  "permisos/createpermisos",
  async (permisosData, thunkAPI) => {
    try {
      // Agregar los campos faltantes a los datos del módulo
      const state = thunkAPI.getState();
      const auth = state.auth; // Asegurarse de que auth contiene los datos del usuario actual

      // Formatear los datos de creación
      const permisos = {
        ...permisosData,
        created_by: auth.userId || 1, // ID del usuario autenticado
        updated_by: auth.userId || 1, // Asumimos que es el mismo usuario que lo actualiza
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Llamada a la API para crear el módulo
      const response = await axios.post(
        `${BASE_URL}/api/permisos/crear`,
        permisos,
      );
      return response.data;
    } catch (error) {
      // Manejo de errores
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const deletepermisos = createAsyncThunk(
  "Permisos/deletePermisos",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/permisos/eliminar/${id}`,
      );
      return response.data; // Asegúrate de que se retorna la respuesta correcta
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const updatePermiso = createAsyncThunk(
  "permiso/updatePermiso",
  async (permisosData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/permisos/update`,
        permisosData,
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
