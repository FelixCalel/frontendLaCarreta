import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchMesasAsignadasThunk = createAsyncThunk(
  "asignacionAM/fetchMesasAsignadas",
  async (areaId) => {
    const response = await axios.get(`${BASE_URL}/asignarAM/area/${areaId}`);
    return response.data;
  },
);

export const desasignarMesaThunk = createAsyncThunk(
  "asignacionAM/desasignarMesa",
  async (asignacionId, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/asignarAM/desasignar/${asignacionId.id}`,
        {
          update_by: asignacionId.userId,
        },
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error al desasignar la mesa",
      );
    }
  },
);

export const fetchMesasActivasThunk = createAsyncThunk(
  "asignacionAM/fetchMesasActivas",
  async () => {
    const response = await axios.get(`${BASE_URL}/mesa/getAll`);
    return response.data;
  },
);

export const fetchMesasDisponiblesThunk = createAsyncThunk(
  "asignacionAM/fetchMesasDisponibles",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/mesa/getAllWithoutArea`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available tables:", error);
      return thunkAPI.rejectWithValue("Error al obtener mesas disponibles");
    }
  },
);

export const asignarMesaThunk = createAsyncThunk(
  "asignacionAM/asignarMesa",
  async (data) => {
    const response = await axios.post(`${BASE_URL}/asignarAM/`, data);
    return response.data;
  },
);

export const fetchAsignacionesThunk = createAsyncThunk(
  "asignacionAM/fetchAsignaciones",
  async (areaId) => {
    const res = await axios.get(`${BASE_URL}/asignarArea/${areaId}`);
    return res.data.filter((a) => a.state === true);
  },
);

export const asignarTipoGrupoThunk = createAsyncThunk(
  "asignacionAM/asignar",
  async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}/asignarArea/`, data);
      return res.data;
    } catch (error) {
      console.error("Error al asignar tipo de grupo:", error);
      throw error;
    }
  },
);

export const desasignarTipoGrupoThunk = createAsyncThunk(
  "asignacionAM/desasignar",
  async ({ id, update_by }) => {
    const res = await axios.put(`${BASE_URL}/asignarArea/${id}`, {
      update_by,
      state: false,
    });
    return res.data;
  },
);

export const fetchProductosThunk = createAsyncThunk(
  "asignacionAM/fetchProductos",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/items/todos?pageSize=1000`);
      const data = response.data;
      return data.items ? data.items : Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return thunkAPI.rejectWithValue("Error al obtener productos");
    }
  },
);

export const fetchUsuariosEncargadosThunk = createAsyncThunk(
  "asignacionAM/fetchUsuariosEncargados",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/usuarios/todos`);
      return response.data.usuarios.filter(
        (u) => u.estaActivo && u.roleId === 10,
      );
    } catch (error) {
      console.error("Error fetching encargados:", error);
      return thunkAPI.rejectWithValue("Error al obtener encargados");
    }
  },
);

export const actualizarEncargadoThunk = createAsyncThunk(
  "asignacionAM/actualizarEncargado",
  async ({ id, encargado, update_by }, thunkAPI) => {
    try {
      console.log("ID del encargado a actualizar:", encargado);
      const response = await axios.put(`${BASE_URL}/area/${id}`, {
        encargado: encargado,
        update_by,
        state: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating encargado:", error);
      return thunkAPI.rejectWithValue("Error al actualizar el encargado");
    }
  },
);
