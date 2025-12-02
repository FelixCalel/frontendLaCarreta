import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaDeudores = createAsyncThunk(
  "deudores/tablaDeudores",
  async (_, { getState }) => {
    const { deudores } = getState();
    if (deudores.deudores && deudores.deudores.length > 0) {
      return deudores.deudores;
    }
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
    const { deudores } = thunkAPI.getState();
    // If we have deudores and they seem to be active (we can't easily check "all active" without iterating, 
    // but if we have a list, maybe we filter?)
    // If the state has "deudores", we don't know if they are ALL deudores or just active ones.
    // But if we have data, we can try to filter locally.
    if (deudores.deudores && deudores.deudores.length > 0) {
        const activos = deudores.deudores.filter(d => d.estaActivo); // Assuming 'estaActivo' property exists
        if (activos.length > 0) return activos;
    }

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
    const { deudores } = thunkAPI.getState();
    if (deudores.deudores && deudores.deudores.length > 0) {
        const inactivos = deudores.deudores.filter(d => !d.estaActivo);
        if (inactivos.length > 0) return inactivos;
    }
    
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
