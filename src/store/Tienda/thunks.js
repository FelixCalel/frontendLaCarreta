import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaTienda = createAsyncThunk(
  "tiendas/fetchTiendas",
  async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tienda/todos`);
      const data = response.data;

      data.sort((a, b) => a.id - b.id);

      return data;
    } catch (error) {
      console.error("Error al obtener tiendas:", error);
      throw error;
    }
  }
);

export const fetchTiendasByPais = createAsyncThunk(
  "tiendas/fetchTiendasByPais",
  async (paisId, { rejectWithValue, getState }) => {
    const { tiendas } = getState();
    if (tiendas.data && tiendas.data.length > 0) {
       const cachedTiendas = tiendas.data.filter(t => t.paisId === paisId && t.estaActivo);
       if (cachedTiendas.length > 0) {
           return cachedTiendas;
       }
    }

    try {
      const response = await axios.get(`${BASE_URL}/tienda/by-pais/${paisId}`);
      if (response && response.data) {
        return response.data.filter((tienda) => tienda.estaActivo);
      }
      return [];
    } catch (error) {
      console.error("Error al cargar tiendas por país:", error);
      return rejectWithValue(error.response?.data || "Error al cargar tiendas");
    }
  }
);

export const addNewTienda = createAsyncThunk(
  "tiendas/addNewTienda",
  async (newTienda) => {
    newTienda.ciudadId = parseInt(newTienda.ciudadId);
    newTienda.deudorId = parseInt(newTienda.deudorId);
    newTienda.rutaId = parseInt(newTienda.rutaId);

    console.log("Hola", newTienda);
    try {
      const response = await axios.post(`${BASE_URL}/tienda/create`, newTienda);
      console.log("Hola 2", newTienda);
      return response.data;
    } catch (error) {
      return error.response.data || "Error al crear la tienda";
    }
  }
);

export const deleteTienda = createAsyncThunk(
  "tiendas/deleteTienda",
  async (id) => {
    await axios.delete(`${BASE_URL}/tienda/eliminar/${id}`);
    return id;
  }
);

export const updateTienda = createAsyncThunk(
  "tiendas/updateTienda",
  async (tienda) => {
    const response = await axios.put(
      `${BASE_URL}/tienda/actualizar/${tienda.id}`,
      tienda
    );
    return response.data;
  }
);

export const toggleTiendaStatus = createAsyncThunk(
  "tiendas/toggleTiendaStatus",
  async ({ id, estaActivo }) => {
    const response = await axios.patch(
      `${BASE_URL}/tienda/actualizar-estado/${id}`,
      { estaActivo }
    );
    return response.data;
  }
);
