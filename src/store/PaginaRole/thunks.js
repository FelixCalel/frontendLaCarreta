import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;


export const fetchrole = createAsyncThunk('role/fetchrole', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/roles/listar`);  // Check this endpoint.
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
});

export const fetchRolesMetadata = createAsyncThunk('Roles/fetchRolesMetadata',
    async (_, thunkAPI) => {
      try {
        // Hacemos la petición a la API
        const response = await axios.get(`${BASE_URL}/api/roles/metadata`);
        return response.data;  // Asegúrate de que los datos retornados sean correctos
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );

  export const createRol = createAsyncThunk('Rol/createRol',
    async (RolData, thunkAPI) => {
      try {
        // Agregar los campos faltantes a los datos del rol
        const state = thunkAPI.getState();
        const auth = state.auth;  // Asegúrate de que auth contiene los datos del usuario actual
  
        // Formatear los datos de creación
        const Rol = {
          ...RolData,
          created_by: auth.userId || 1,  // ID del usuario autenticado
          updated_by: auth.userId || 1,  // Asumimos que es el mismo usuario que lo actualiza
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
  
        // Log para ver los datos que se están enviando
        console.log("Datos enviados al servidor para crear el rol:", Rol);
  
        // Llamada a la API para crear el rol
        const response = await axios.post(`${BASE_URL}/api/roles/crear`, Rol);
        return response.data;
      } catch (error) {
        // Manejo de errores
        console.error("Error al crear el rol:", error);
        return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );
  
  export const deleteRol = createAsyncThunk(
    'Rol/deleteRol',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/roles/eliminar/${id}`);
            return response.data;  // Asegúrate de que se retorna la respuesta correcta
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
  );

  export const updateRol= createAsyncThunk(
    'Roles/updateRol',
    async (RolData, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/roles/update`, RolData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
  );