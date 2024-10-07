import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;


export const fetchModulos = createAsyncThunk('modulos/fetchModulos',
  async (_, thunkAPI) => {
    try {
      // Accedemos al estado de auth desde thunkAPI
      const state = thunkAPI.getState();
      const auth = state.auth;
      
      // Verificamos que auth.uid esté disponible
      if (!auth?.uid) {
        throw new Error('El UID de autenticación no está disponible');
      }
 
      // Hacemos la petición a la API usando el UID
const response = await axios.get(`${BASE_URL}/api/asignarRMOP/modulosPermisos/${auth.uid}`);
      console.log(auth.uid);
      return response.data;
    } catch (error) {
      // Manejo de errores
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);