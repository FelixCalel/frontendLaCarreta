import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchRoles = createAsyncThunk(
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

const createRol = createAsyncThunk(
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

      const response = await axios.post(`${BASE_URL}/Rol/crear`, Rol);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);
