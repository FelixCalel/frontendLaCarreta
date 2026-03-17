import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setRutas } from "../auth/authSlice";
import { tablaPedidos } from "../Pedidos/thunks";
import { registerUserChildren } from "../../providers/endpoints";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchRoles = createAsyncThunk(
  "usuarios/fetchRoles",
  async (_, { rejectWithValue, getState }) => {
    const { roles } = getState();
    if (roles.data && roles.data.length > 0) {
      return roles.data;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/roles/listar`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al obtener roles");
    }
  },
);

export const toggleUserStatus = createAsyncThunk(
  "usuarios/toggleUserStatus",
  async ({ usuarioId, estaActivo }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/usuarios/estado/${usuarioId}`,
        {
          estaActivo: !estaActivo,
        },
      );
      return response.data.usuario;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error al actualizar estado",
      );
    }
  },
);

export const assignUserRoutes = createAsyncThunk(
  "usuarios/assignUserRoutes",
  async ({ usuarioId, selectedRoutes }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/usuarios/${usuarioId}/asignar-ruta`,
        { rutaId: selectedRoutes },
      );

      const currentUid = Number(localStorage.getItem("usuarioId") ?? 0);

      if (usuarioId === currentUid) {
        const ids = data.usuario.rutas.map((r) => r.id);
        dispatch(setRutas({ ids, objetos: data.usuario.rutas }));
        dispatch(tablaPedidos());
      }

      return { usuarioId, rutas: data.usuario.rutas };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al asignar rutas");
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "usuarios/updateUserRole",
  async ({ usuarioId, rolId }, { rejectWithValue }) => {
    try {
      await axios.put(`${BASE_URL}/usuarios/actualizar-rol/${usuarioId}`, {
        rolId,
      });
      return { usuarioId, rolId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al actualizar rol");
    }
  },
);
export const createUser = createAsyncThunk(
  "usuarios/createUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await registerUserChildren(formData);
      if (response.ok) {
        return response.usuario;
      } else {
        return rejectWithValue(
          response.errorMessage || "Error al crear usuario",
        );
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error inesperado");
    }
  },
);

export const fetchUsuariosMetadata = createAsyncThunk(
  "usuarios/fetchUsuariosMetadata",
  async (_, { rejectWithValue }) => {
    try {
      return [
        { name: "nombres", label: "Nombres", type: "text", required: true },
        { name: "apellidos", label: "Apellidos", type: "text", required: true },
        {
          name: "correo_electronico",
          label: "Correo Electrónico",
          type: "email",
          required: true,
        },
        {
          name: "password",
          label: "Contraseña",
          type: "password",
          required: true,
        },
        { name: "nit", label: "NIT", type: "text", required: false },
        {
          name: "nombre_empresa",
          label: "Nombre Empresa",
          type: "text",
          required: false,
        },
        { name: "paisId", label: "País", type: "number", required: true },
        { name: "roleId", label: "Rol", type: "number", required: true },
      ];
    } catch (error) {
      return rejectWithValue("Error al obtener metadatos");
    }
  },
);
export const fetchUsuarioById = createAsyncThunk(
  "usuarios/fetchUsuarioById",
  async (usuarioId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/usuarios/${usuarioId}`);
      return response.data.usuario;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error al obtener usuario",
      );
    }
  },
);
