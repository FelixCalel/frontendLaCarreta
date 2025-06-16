import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaDeudores = createAsyncThunk(
  "deudores/tablaDeudores",
  async () => {
    const response = await axios.get(`${BASE_URL}/deus/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);

// Crear un nuevo Deu
export const crearDeudor = createAsyncThunk(
  "deudores/crearDeudor",
  async (deuData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/deus/crear`, deuData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const obtenerDeudorPorId = createAsyncThunk(
  "deudores/obtenerDeudorPorId",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/deus/id/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const eliminarDeudor = createAsyncThunk(
  "deudores/eliminarDeudor",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deus/eliminar/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const actualizarDeudor = createAsyncThunk(
  "deudores/actualizarDeudor",
  async ({ id, deuData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/deus/actualizar/${id}`,
        deuData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const obtenerDeudoresActivos = createAsyncThunk(
  "deudores/obtenerDeudoresActivos",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/deus/activos`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const obtenerDeudoresInactivos = createAsyncThunk(
  "deudores/obtenerDeudoresInactivos",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/deus/inactivos`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const buscarDeudorPorNombreOCorrelativo = createAsyncThunk(
  "deudores/buscarDeudorPorNombreOCorrelativo",
  async ({ correlativo, nombre }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/deus/buscar`, {
        params: { correlativo, nombre },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
