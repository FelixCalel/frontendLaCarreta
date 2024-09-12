import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all Tiendas
export const tablaRuta = createAsyncThunk(
  'rutas/fetchRutas',
  async () => {
    const response = await axios.get('http://localhost:3000/ruta/todos');
    const data = response.data;
    data.sort((a, b) => a.id - b.id); 
    return data;
  }
);

// Add new Tienda
export const addNewRuta = createAsyncThunk(
  'rutas/addNewRutas',
  async (newRuta) => {
    const response = await axios.post('http://localhost:3000/ruta/create', newRuta);
    return response.data;
  }
);

// Delete Tienda
export const deleteRuta = createAsyncThunk(
  'rutas/deleteRutas',
  async (id) => {
    await axios.delete(`http://localhost:3000/ruta/eliminar/${id}`);
    return id;
  }
);

// Update Tienda
export const updateRuta = createAsyncThunk(
  'rutas/updateRuta',
  async (ruta) => {
    const response = await axios.put(`http://localhost:3000/ruta/actualizar/${ruta.id}`, ruta);
    return response.data;
  }
);

// Toggle Tienda Status
export const toggleRutaStatus = createAsyncThunk(
  'rutas/toggleRutaStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`http://localhost:3000/ruta/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);


