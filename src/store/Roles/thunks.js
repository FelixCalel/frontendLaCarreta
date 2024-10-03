import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async () => {
    const response = await axios.get(`${BASE_URL}/api/roles`);
    return response.data;
  }
);

export const addNewRole = createAsyncThunk(
  'roles/addNewRole',
  async (newRole) => {
    const response = await axios.post(`${BASE_URL}/api/roles/crear`, newRole);
    return response.data;
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id) => {
    await axios.delete(`${BASE_URL}/api/roles/eliminar/${id}`);
    return id;
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async (role) => {
    const response = await axios.put(`${BASE_URL}/api/roles/actualizar/${role.id}`, role);
    return response.data;
  }
);
