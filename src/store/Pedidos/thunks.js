import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all Pedidos
export const tablaPedidos = createAsyncThunk(
  'pedidos/fetchPedidos',
  async () => {
    const response = await axios.get(`${BASE_URL}/form/pedido/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);

// Add new Pedido
export const addNewPedido = createAsyncThunk(
  'pedidos/addNewPedido',
  async (newPedido) => {
    const response = await axios.post(`${BASE_URL}/form/pedido/create`, newPedido);
    console.log("Pedido Creado: ", newPedido);
    return response.data;
  }
);

// Delete Pedido
export const deletePedido = createAsyncThunk(
  'pedidos/deletePedido',
  async (id) => {
    await axios.delete(`${BASE_URL}/form/pedido/eliminar/${id}`);
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
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`${BASE_URL}/form/pedido/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);
