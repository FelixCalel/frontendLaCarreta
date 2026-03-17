import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchOpciones = createAsyncThunk(
  "opciones/fetchOpciones",
  async (_, thunkAPI) => {
    try {
      // Hacemos la petición a la API
      const response = await axios.get(`${BASE_URL}/api/opciones/`);
      return response.data; // Asegúrate de que los datos retornados sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchMetadataOpciones = createAsyncThunk(
  "opciones/fetchOpcionesMetadata",
  async (_, thunkAPI) => {
    try {
      // Hacemos la petición a la API
      const response = await axios.get(`${BASE_URL}/api/opciones/metadata`);
      return response.data; // Asegúrate de que los datos retornados sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

// Función que realiza la petición a la API para crear un módulo
export const createOpciones = createAsyncThunk(
  "opciones/createOpciones",
  async (OpcionesData, thunkAPI) => {
    try {
      // Agregar los campos faltantes a los datos del módulo
      const state = thunkAPI.getState();
      const auth = state.auth; // Asegurarse de que auth contiene los datos del usuario actual
      const { id, ...opcionesDataSinId } = OpcionesData || {};

      // Formatear los datos de creación
      const Opciones = {
        ...opcionesDataSinId,
        created_by: auth.userId || 1, // ID del usuario autenticado
        updated_by: auth.userId || 1, // Asumimos que es el mismo usuario que lo actualiza
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Llamada a la API para crear el módulo
      const response = await axios.post(
        `${BASE_URL}/api/opciones/crear`,
        Opciones,
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

export const updateOpciones = createAsyncThunk(
  "opciones/updateOpciones",
  async (opcionData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/opciones/update`,
        opcionData,
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

export const deleteOpciones = createAsyncThunk(
  "opciones/deleteOpciones",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/opciones/eliminar/${id}`,
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
