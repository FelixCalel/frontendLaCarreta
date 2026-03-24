import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchrole = createAsyncThunk(
  "role/fetchrole",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/roles/listar`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchRolesMetadata = createAsyncThunk(
  "Roles/fetchRolesMetadata",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/roles/metadata`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const createRol = createAsyncThunk(
  "Rol/createRol",
  async (RolData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const auth = state.auth;

      const Rol = {
        ...RolData,
        created_by: auth.userId || 1,
        updated_by: auth.userId || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Datos enviados al servidor para crear el rol:", Rol);

      const response = await axios.post(`${BASE_URL}/roles/crear`, Rol);
      return response.data;
    } catch (error) {
      console.error("Error al crear el rol:", error);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const deleteRol = createAsyncThunk(
  "Rol/deleteRol",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/roles/eliminar/${id}`,
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const updateRol = createAsyncThunk(
  "Roles/updateRol",
  async (RolData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/roles/update`, RolData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
