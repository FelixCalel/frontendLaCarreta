import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all Tiendas
export const tablaTienda = createAsyncThunk(
  'tiendas/fetchTiendas',
  async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tienda/todos`);
      const data = response.data;
      
      data.sort((a, b) => a.id - b.id);

      // Log para ver los datos después de ordenar
      console.log('Datos después de ordenar:', data);

      return data;
    } catch (error) {
      console.error('Error al obtener tiendas:', error);
      throw error; // Propaga el error para que sea capturado en la acción
    }
  }
);


// Add new Tienda
export const addNewTienda = createAsyncThunk(
  'tiendas/addNewTienda',
  async (newTienda) => {
    newTienda.ciudadId = parseInt(newTienda.ciudadId);
    newTienda.deudorId = parseInt(newTienda.deudorId);
    newTienda.rutaId = parseInt(newTienda.rutaId);

    console.log('Hola', newTienda);
    try {
      const response = await axios.post(`${BASE_URL}/tienda/create`, newTienda);
      console.log('Hola 2', newTienda);
      return response.data;
    } catch (error) {
      return (error.response.data || 'Error al crear la tienda');
    }
  }
);

// Delete Tienda
export const deleteTienda = createAsyncThunk(
  'tiendas/deleteTienda',
  async (id) => {
    await axios.delete(`${BASE_URL}/tienda/eliminar/${id}`);
    return id;
  }
);

// Update Tienda
export const updateTienda = createAsyncThunk(
  'tiendas/updateTienda',
  async (tienda) => {
    const response = await axios.put(`${BASE_URL}/tienda/actualizar/${tienda.id}`, tienda);
    return response.data;
  }
);

// Toggle Tienda Status
export const toggleTiendaStatus = createAsyncThunk(
  'tiendas/toggleTiendaStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`${BASE_URL}/tienda/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);
