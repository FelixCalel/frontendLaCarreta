import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaItems = createAsyncThunk(
  "items/fetchItems",
  async ({ page = 1, pageSize = 10, nombre = "", codigo = "" } = {}) => {
    const response = await axios.get(`${BASE_URL}/items/todos`, {
      params: { page, pageSize, nombre, codigo },
    });
    return response.data;
  },
);

export const actualizarStatusProducto = createAsyncThunk(
  "items/updateStatusProducto",
  async ({ id, estaActivo }) => {
    const response = await axios.put(`${BASE_URL}/items/status/${id}`, {
      estaActivo,
    });
    return response.data;
  },
);

export const actualizarDeudorProducto = createAsyncThunk(
  "items/updateDeudorProducto",
  async ({ id, deuId }) => {
    const response = await axios.put(`${BASE_URL}/items/deudores/${id}`, {
      deudorIds: deuId ? [deuId] : [],
    });
    return response.data;
  },
);

export const addDeudoresItem = createAsyncThunk(
  "items/addDeudoresItem",
  async ({ itemId, deudorIds }) => {
    const response = await axios.post(`${BASE_URL}/items/deudores/${itemId}`, {
      deudorIds,
    });
    return response.data;
  },
);

export const removeDeudoresItem = createAsyncThunk(
  "items/removeDeudoresItem",
  async ({ itemId, deudorIds }) => {
    const response = await axios.delete(
      `${BASE_URL}/items/deudores/${itemId}`,
      {
        data: { deudorIds },
      },
    );
    return response.data;
  },
);
