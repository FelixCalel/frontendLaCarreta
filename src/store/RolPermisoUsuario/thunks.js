import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const assignRoleToUser = createAsyncThunk(
    'usuarios/assignRoleToUser',
    async ({ userId, roleId }) => {
      const response = await axios.post(`${BASE_URL}/api/asignarRMOP/crear`, {
        role_id: roleId,
        user_id: userId,
      });
      return response.data;
    }
  );
  
  export const assignPermisoToRole = createAsyncThunk(
    'roles/assignPermisoToRole',
    async ({ roleId, permisoId }) => {
      const response = await axios.post(`${BASE_URL}/api/asignarRMOP/crear`, {
        role_id: roleId,
        permiso_id: permisoId,
      });
      return response.data;
    }
  );
  