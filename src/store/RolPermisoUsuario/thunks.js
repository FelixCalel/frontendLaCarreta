import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const validarUsuario = createAsyncThunk(
  "usuario/validarUsuario",
  async ({ usuarioId, rutaId }) => {
    const response = await axios.get(
      `${BASE_URL}/api/asignarRMOP/validarUsuario/${usuarioId}/${rutaId}`
    );
    return response.data.acceso;
  }
);

export const fetchModulos = createAsyncThunk(
  "modulos/fetchModulos",
  async (usuarioId) => {
    const response = await axios.get(
      `${BASE_URL}/api/asignarRMOP/modulosPermisos/${usuarioId}`
    );
    return response.data;
  }
);
