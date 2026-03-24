import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchOpciones = createAsyncThunk(
  "opciones/fetchOpciones",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/opciones/`);
      return response.data;
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
      const response = await axios.get(`${BASE_URL}/opciones/metadata`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const createOpciones = createAsyncThunk(
  "opciones/createOpciones",
  async (OpcionesData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const auth = state.auth;
      const { id, ...opcionesDataSinId } = OpcionesData || {};

      const Opciones = {
        ...opcionesDataSinId,
        created_by: auth.userId || 1,
        updated_by: auth.userId || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await axios.post(
        `${BASE_URL}/opciones/crear`,
        Opciones,
      );
      return response.data;
    } catch (error) {
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
        `${BASE_URL}/opciones/update`,
        opcionData,
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

export const deleteOpciones = createAsyncThunk(
  "opciones/deleteOpciones",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/opciones/eliminar/${id}`,
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
