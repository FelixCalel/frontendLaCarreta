import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all DetalleOrden
export const tablaDetalleOrden = createAsyncThunk(
  'detalleOrden/fetchDetalleOrden',
  async () => {
    const response = await axios.get(`${BASE_URL}/detalle/pedido/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordenar los datos
    return data;
  }
);

// Add new DetalleOrden
export const addNewDetalleOrden = createAsyncThunk(
  'detalleOrden/addNewDetalleOrden',
  async (newDetalleOrden) => {
    const response = await axios.post(`${BASE_URL}/detalle/pedido/create`, newDetalleOrden);
    return response.data;
  }
);

// Delete DetalleOrden
export const deleteDetalleOrden = createAsyncThunk(
  'detalleOrden/deleteDetalleOrden',
  async (id) => {
    await axios.delete(`${BASE_URL}/detalle/pedido/eliminar/${id}`);
    return id;
  }
);

// Update DetalleOrden
export const updateDetalleOrden = createAsyncThunk(
  'detalleOrden/updateDetalleOrden',
  async (detalleOrden) => {
    const response = await axios.put(`${BASE_URL}/detalle/pedido/actualizar/${detalleOrden.id}`, detalleOrden);
    return response.data;
  }
);

// Toggle DetalleOrden Status
export const toggleDetalleOrdenStatus = createAsyncThunk(
  'detalleOrden/toggleDetalleOrdenStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`${BASE_URL}/pedido/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);

// Get DetalleOrden by PedidoId
export const getDetalleOrdenByPedidoId = createAsyncThunk(
  'detalleOrden/fetchByPedidoId',
  async (pedidoId) => {
    const response = await axios.get(`${BASE_URL}/detalle/pedido/listar/${pedidoId}`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordenar los datos
    return data;
  }
);

// Fetch pedidos comunes por usuarioId
export const getPedidosComunesByUsuarioId = createAsyncThunk(
  'detalleOrden/fetchPedidosComunesByUsuarioId',
  async ({ usuarioId, pedidoId }) => {
    usuarioId = Number(usuarioId);
    pedidoId = Number(pedidoId);
    const response = await axios.get(`${BASE_URL}/detalle/pedido/pedidosComunes/${usuarioId}/${pedidoId}`);
    const data = response.data;
    if (Array.isArray(data)) {
      data.sort((a, b) => a.id - b.id); // Ordenar los datos si es un array
    }
    console.log("Datos recibidos del backend:", data);
    return data;
  }
);



