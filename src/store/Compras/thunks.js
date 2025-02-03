import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchCompras = createAsyncThunk(
  'compras/fetchCompras',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/compras/todas`);
      return response.data; // Array de compras
    } catch (error) {
      console.error('Error al obtener compras:', error);
      return rejectWithValue(error.response?.data || 'Error al obtener compras');
    }
  }
);

export const consolidateCompras = createAsyncThunk(
  'compras/consolidate',
  async ({ estadoId, fecha }, { rejectWithValue }) => {
    try {
      const body = {};
      if (estadoId) body.estadoId = estadoId;
      if (fecha) body.fecha = fecha;

      const response = await axios.post(`${BASE_URL}/compras/consolidar`, body);
      return response.data;
    } catch (error) {
      console.error('Error al consolidar compras:', error);
      return rejectWithValue(error.response?.data || 'Error al consolidar compras');
    }
  }
);


export const updateCompra = createAsyncThunk(
  'compras/updateCompra',
  async ({ id, ...rest }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/compras/update/${id}`, rest);
      return response.data; // Retorna la compra actualizada
    } catch (error) {
      console.error('Error al actualizar compra:', error);
      return rejectWithValue(error.response?.data || 'Error al actualizar compra');
    }
  }
);