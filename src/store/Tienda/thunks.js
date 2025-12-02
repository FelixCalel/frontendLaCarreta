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
    // Simple caching: if we have data and it matches the country (assuming data is replaced or we filter)
    // Since the store might contain all shops or shops from another country, we need to be careful.
    // If tiendas.data is populated, we can check if it contains shops for this country.
    // However, the previous logic replaced the data. Let's check if we already have shops for this country in the current state.
    
    // A better approach for this specific thunk which seems to filter by country:
    if (tiendas.data && tiendas.data.length > 0) {
       const cachedTiendas = tiendas.data.filter(t => t.paisId === paisId && t.estaActivo);
       if (cachedTiendas.length > 0) {
           // If we have some shops for this country, we might assume it's loaded. 
           // But to be safe and "fresh", maybe we only skip if we recently fetched?
           // For now, let's assume if we have data, we use it.
           // But wait, the original logic fetches from API. If we return local data, we avoid the call.
           // The issue is if the user switches countries, we need to fetch the new country's shops.
           // If the state only holds the *current* country's shops, then we can just check if data is there.
           // But if state holds *all* shops, we filter.
           
           // Let's assume we want to avoid re-fetching if we just did it.
           // Without a "lastFetched" timestamp or "currentPaisId" in state, it's hard to be 100% sure.
           // But let's try to return cached data if available.
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

// Delete Tienda
export const deleteTienda = createAsyncThunk(
  "tiendas/deleteTienda",
  async (id) => {
    await axios.delete(`${BASE_URL}/tienda/eliminar/${id}`);
    return id;
  }
);

// Update Tienda
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

// Toggle Tienda Status
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
