import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all Pedidos
export const tablaPedidos = createAsyncThunk(
  'pedidos/fetchPedidos',
  async () => {
    const response = await axios.get(`${BASE_URL}/form/pedidos/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordenar los datos
    return data;
  }
);



// Add new Pedido
export const addNewPedido = createAsyncThunk(
  'pedidos/addNewPedido',
  async (newPedido) => {
    const response = await axios.post(`${BASE_URL}/form/pedidos/create`, newPedido);
    return response.data;
  }
);

// Delete Pedido
export const deletePedido = createAsyncThunk(
  'pedidos/deletePedido',
  async (id) => {
    await axios.delete(`${BASE_URL}/form/pedidos/eliminar/${id}`);
    return id;
  }
);

// Update Pedido
export const updatePedido = createAsyncThunk(
  'pedidos/updatePedido',
  async (pedido) => {
    const response = await axios.put(`${BASE_URL}/form/pedido/actualizar/${pedido.id}`, pedido);
    return response.data;
  }
);

// Toggle Pedido Status
export const togglePedidoStatus = createAsyncThunk(
  'pedidos/togglePedidoStatus',
  async ({ id, estadoId }) => {
    const response = await axios.patch(`${BASE_URL}/form/pedidos/actualizar-estado/${id}`, { estadoId });
    return response.data;
  }
);
