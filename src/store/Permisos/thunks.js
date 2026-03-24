import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchPermisos = createAsyncThunk(
  "Permisos/fetchPermisos",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/permisos/`);
      return response.data;
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
      const response = await axios.get(`${BASE_URL}/permisos/metadata`);
      return response.data;
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
      const state = thunkAPI.getState();
      const auth = state.auth;

      const permisos = {
        ...permisosData,
        created_by: auth.userId || 1,
        updated_by: auth.userId || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await axios.post(
        `${BASE_URL}/permisos/crear`,
        permisos,
      );
      return response.data;
    } catch (error) {
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
        `${BASE_URL}/permisos/eliminar/${id}`,
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

export const updatePermiso = createAsyncThunk(
  "permiso/updatePermiso",
  async (permisosData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/permisos/update`,
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
