import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all DetalleOrden
export const tablaDetalleOrden = createAsyncThunk(
  'detalleOrden/fetchDetalleOrden',
  async () => {
    const response = await axios.get(`${BASE_URL}/detalleOrden/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);

// Add new DetalleOrden
export const addNewDetalleOrden = createAsyncThunk(
  'detalleOrden/addNewDetalleOrden',
  async (newDetalleOrden) => {
    const response = await axios.post(`${BASE_URL}/detalleOrden/create`, newDetalleOrden);
    console.log("Detalle Orden Creado: ", newDetalleOrden);
    return response.data;
  }
);

// Delete DetalleOrden
export const deleteDetalleOrden = createAsyncThunk(
  'detalleOrden/deleteDetalleOrden',
  async (id) => {
    await axios.delete(`${BASE_URL}/detalleOrden/eliminar/${id}`);
    return id;
  }
);

// Update DetalleOrden
export const updateDetalleOrden = createAsyncThunk(
  'detalleOrden/updateDetalleOrden',
  async (detalleOrden) => {
    const response = await axios.put(`${BASE_URL}/detalleOrden/actualizar/${detalleOrden.id}`, detalleOrden);
    return response.data;
  }
);

// Toggle DetalleOrden Status
export const toggleDetalleOrdenStatus = createAsyncThunk(
  'detalleOrden/toggleDetalleOrdenStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`${BASE_URL}/detalleOrden/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);
