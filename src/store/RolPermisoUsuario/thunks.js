import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Thunk para validar si el usuario tiene acceso a un módulo o ruta específica
export const validarUsuario = createAsyncThunk(
  'usuario/validarUsuario',
  async ({ usuarioId, rutaId }) => {
    const response = await axios.get(`${BASE_URL}/api/asignarRMOP/validarUsuario/${usuarioId}/${rutaId}`);
    return response.data.acceso; // Devuelve true o false según el acceso
  }
);

// Asegúrate de que todos los thunks estén exportados
export const fetchModulos = createAsyncThunk(
  'modulos/fetchModulos',
  async (usuarioId) => {
    const response = await axios.get(`${BASE_URL}/api/asignarRMOP/modulosPermisos/${usuarioId}`);
    return response.data; // Devuelve los módulos con las opciones
  }
);
