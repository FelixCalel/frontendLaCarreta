import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Definimos la URL de la API, asegurándonos de que está correctamente configurada.
const BASE_URL = import.meta.env.VITE_API_URL;


export const fetchPermisosRoles = createAsyncThunk( 
  'Permisos/fetchPermisosRoles',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/asignarRMOP/`);
      return response.data; // Asegúrate de que los datos sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchPermisosRolesMetadata = createAsyncThunk(
  'PermisosRoles/fetchPermisosRolesMetadata',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/asignarRMOP/metadata`);
      return response.data;  // Asegúrate de que los datos retornados sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const createasignacionPermisosRoles = createAsyncThunk(
  'permisos/createasignacionPermisosRoles',
  async ({ accessMatrix }, thunkAPI) => {
    try {
      const createPayload = accessMatrix;

      if (createPayload.length > 0) {
        const response = await axios.post(`${BASE_URL}/api/asignarRMOP/crear`, createPayload);
        return response.data;
      }

      return { message: "Permisos actualizados correctamente." };
    } catch (error) {
      console.error("Error al crear asignación de permisos:", error);
      console.error("Detalles del error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const deleteasignacionPermisosRoles = createAsyncThunk(
  'Permisos/deleteasignacionPermisosRoles',
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/asignarRMOP/eliminar/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

