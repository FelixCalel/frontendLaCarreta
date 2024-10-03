import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchPermisos = createAsyncThunk(
  'permisos/fetchPermisos',
  async () => {
    const response = await axios.get(`${BASE_URL}/api/permisos`);
    return response.data;
  }
);

export const addNewPermiso = createAsyncThunk(
  'permisos/addNewPermiso',
  async (newPermiso) => {
    const response = await axios.post(`${BASE_URL}/api/permisos/crear`, newPermiso);
    return response.data;
  }
);

export const deletePermiso = createAsyncThunk(
  'permisos/deletePermiso',
  async (id) => {
    await axios.delete(`${BASE_URL}/api/permisos/eliminar/${id}`);
    return id;
  }
);

export const updatePermiso = createAsyncThunk(
  'permisos/updatePermiso',
  async (permiso) => {
    const response = await axios.put(`${BASE_URL}/api/permisos/actualizar/${permiso.id}`, permiso);
    return response.data;
  }
);
