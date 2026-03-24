import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchAreas = createAsyncThunk(
  "areas/fetchAreas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/area/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al obtener áreas");
    }
  },
);

export const fetchAreaById = createAsyncThunk(
  "areas/fetchAreaById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/area/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al obtener área");
    }
  },
);

export const crearAreaThunk = createAsyncThunk(
  "areas/crearArea",
  async (areaData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/area/`, areaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al crear área");
    }
  },
);

export const fetchOpciones = createAsyncThunk(
  "areas/fetchOpciones",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/opciones/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error al obtener opciones",
      );
    }
  },
);
export const eliminarAreaThunk = createAsyncThunk(
  "areas/eliminarArea",
  async ({ id, update_by }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/area/${id}`, {
        state: false,
        update_by,
      });
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al eliminar área");
    }
  },
);
