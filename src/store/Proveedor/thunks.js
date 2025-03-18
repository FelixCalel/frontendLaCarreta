import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchProveedores = createAsyncThunk(
  'proveedores/fetchProveedores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/proveedor/listar`);
      return response.data.data; // Array de proveedores
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener proveedores');
    }
  }
);

export const createProveedor = createAsyncThunk(
  'proveedores/createProveedor',
  async (proveedorData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/proveedor/crear`, proveedorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al crear proveedor');
    }
  }
);

export const updateProveedor = createAsyncThunk(
  'proveedores/updateProveedor',
  async (proveedorData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/proveedor/update`, proveedorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar proveedor');
    }
  }
);

export const deleteProveedor = createAsyncThunk(
  'proveedores/deleteProveedor',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/proveedor/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al eliminar proveedor');
    }
  }
);