import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchasignacionMO = createAsyncThunk(
  "asignacionMO/fetchasignacionMO",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/asignacionMO/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);
export const fetchasignacionMOMetadata = createAsyncThunk(
  "asignacionMO/fetchasignacionMOMetadata",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/opciones/metadata`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

const createasignacionMO = createAsyncThunk(
  "asignacionMO/createasignacionMO",
  async (asignacionMOData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const auth = state.auth;

      const asignacionMO = {
        ...asignacionMOData,
        created_by: auth.userId || 1,
        updated_by: auth.userId || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await axios.post(
        `${BASE_URL}/asignacionMO/crear`,
        asignacionMO,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);
