import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchModulos = createAsyncThunk(
  "modulos/fetchModulos",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const auth = state.auth;

      if (!auth?.uid) {
        throw new Error("El UID de autenticación no está disponible");
      }

      const response = await axios.get(
        `${BASE_URL}/asignarRMOP/modulosPermisos/${auth.uid}`,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchModulosTabla = createAsyncThunk(
  "modulos/fetchModulosTabla",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/modulos/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchMetadataModulos = createAsyncThunk(
  "modulos/fetchMetadataModulos",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/modulos/metadata`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const createModulo = createAsyncThunk(
  "modulos/createModulo",
  async (moduloData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const auth = state.auth;
      const { id, ...moduloDataSinId } = moduloData || {};

      const modulo = {
        ...moduloDataSinId,
        created_by: auth.userId || 1,
        updated_by: auth.userId || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await axios.post(
        `${BASE_URL}/modulos/crear`,
        modulo,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const updateModulo = createAsyncThunk(
  "modulos/updateModulo",
  async (moduloData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/modulos/update`,
        moduloData,
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

export const deleteModulo = createAsyncThunk(
  "modulos/deleteModulo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/modulos/eliminar/${id}`,
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
