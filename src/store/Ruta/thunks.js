import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all Tiendas
export const tablaRuta = createAsyncThunk(
  'rutas/fetchRutas',
  async () => {
    const response = await axios.get(`${BASE_URL}/ruta/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);

// Add new Tienda
export const addNewRuta = createAsyncThunk(
  'rutas/addNewRutas',
  async (newRuta) => {
    newRuta.paisId = parseInt(newRuta.paisId);
    console.log("Data", newRuta);
    const response = await axios.post(`${BASE_URL}/ruta/create`, newRuta);
    console.log("Registro: ", newRuta);
    return response.data;
  }
);

// Delete Tienda
export const deleteRuta = createAsyncThunk(
  'rutas/deleteRutas',
  async (id) => {
    await axios.delete(`${BASE_URL}/ruta/eliminar/${id}`);
    return id;
  }
);

// Update Tienda
export const updateRuta = createAsyncThunk(
  'rutas/updateRuta',
  async (ruta) => {
    const response = await axios.put(`${BASE_URL}/ruta/actualizar/${ruta.id}`, ruta);
    return response.data;
  }
);

// Toggle Tienda Status
export const toggleRutaStatus = createAsyncThunk(
  'rutas/toggleRutaStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`${BASE_URL}/ruta/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);
