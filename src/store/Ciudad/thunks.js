import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const tablaCiudad = createAsyncThunk(
  'ciudades/fetchCiudades',
  async () => {
    const response = await axios.get('http://localhost:3000/ciudad/todos');
    const data = response.data;
   // console.log(data);
    data.sort((a, b) => a.id - b.id); // Ordena los datos por id
    return data;
  }
);

export const addNewCiudad = createAsyncThunk(
  'ciudades/addNewCiudad',
  async (newCiudad) => {
    const response = await axios.post('http://localhost:3000/ciudad/create', newCiudad);
    return response.data;
  }
);

export const deleteCiudad = createAsyncThunk(
  'ciudades/deleteCiudad',
  async (id) => {
    await axios.delete(`http://localhost:3000/ciudad/eliminar/${id}`);
    return id;
  }
);

export const updateCiudad = createAsyncThunk(
  'ciudades/updateCiudad',
  async (ciudad) => {
    const response = await axios.put(`http://localhost:3000/ciudad/actualizar/${ciudad.id}`, ciudad);
    return response.data;
  }
);

export const toggleCiudadStatus = createAsyncThunk(
  'ciudades/toggleCiudadStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`http://localhost:3000/ciudad/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);

export const tablaPais = createAsyncThunk(
  'paises/fetchPaises',
  async () => {
    const response = await axios.get('http://localhost:3000/pais/todos');
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);
