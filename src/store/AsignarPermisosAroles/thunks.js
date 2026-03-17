import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Definimos la URL de la API, asegurándonos de que está correctamente configurada.
const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchPermisosRoles = createAsyncThunk(
  "Permisos/fetchPermisosRoles",
  async (params, thunkAPI) => {
    try {
      const { selectedModulo, selectedOpcion } = params || {};
      const response = await axios.get(`${BASE_URL}/api/asignarRMOP/`);

      const asignaciones = Array.isArray(response.data) ? response.data : [];

      if (selectedModulo && selectedOpcion) {
        return asignaciones.filter(
          (item) =>
            Number(item.modulo_id) === Number(selectedModulo) &&
            Number(item.opcion_id) === Number(selectedOpcion),
        );
      }

      return asignaciones;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchPermisosRolesMetadata = createAsyncThunk(
  "PermisosRoles/fetchPermisosRolesMetadata",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/asignarRMOP/metadata`);
      return response.data; // Asegúrate de que los datos retornados sean correctos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const createasignacionPermisosRoles = createAsyncThunk(
  "permisos/createasignacionPermisosRoles",
  async ({ accessMatrix }, thunkAPI) => {
    try {
      // Asegúrate de que los datos en `createPayload` tengan el tipo de dato correcto
      const createPayload = accessMatrix.map((item) => ({
        role_id: Number(item.role_id),
        modulo_id: Number(item.modulo_id),
        opcion_id: Number(item.opcion_id),
        permiso_id: Number(item.permiso_id),
        created_by: Number(item.created_by),
        updated_by: Number(item.updated_by),
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      console.log(
        "Payload que se enviará al backend:",
        JSON.stringify(createPayload),
      );

      if (createPayload.length > 0) {
        const response = await axios.post(
          `${BASE_URL}/api/asignarRMOP/crear`,
          createPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        return response.data;
      }

      return { message: "Permisos actualizados correctamente." };
    } catch (error) {
      console.error("Error al crear permisos:", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteasignacionPermisosRoles = createAsyncThunk(
  "permisos/deleteasignacionPermisosRoles",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/asignarRMOP/eliminar/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// En tu archivo de thunks
export const fetchAsignacionMO = createAsyncThunk(
  "asignacionMO/fetchAsignacionMO",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/asignacionMO/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);
