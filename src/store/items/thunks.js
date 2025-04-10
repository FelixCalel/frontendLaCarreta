import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaItems = createAsyncThunk(
  "items/fetchItems",
  async ({ page = 1, pageSize = 10, nombre = "", codigo = "" } = {}) => {
    const response = await axios.get(`${BASE_URL}/items/todos`, {
      params: { page, pageSize, nombre, codigo },
    });
    return response.data;
  }
);
