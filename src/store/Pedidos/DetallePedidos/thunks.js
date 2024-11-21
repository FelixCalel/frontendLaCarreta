import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all DetalleOrden
export const tablaDetalleOrden = createAsyncThunk(
  'detalleOrden/fetchDetalleOrden',
  async () => {
    try {
      console.log("Iniciando solicitud para obtener los detalles de orden...");
      const response = await axios.get(`${BASE_URL}/detalle/pedido/todos`);
      
      console.log("Respuesta completa del servidor:", response);
      
      const data = response.data;
      console.log("Datos recibidos del backend (sin procesar):", data);
      
      // Verifica si los datos son un array antes de intentar ordenarlos
      if (Array.isArray(data)) {
        data.sort((a, b) => a.id - b.id); // Ordenar los datos por 'id'
        console.log("Datos ordenados por 'id':", data);
      } else {
        console.error("Error: Los datos recibidos no son un array:", data);
      }
      
      return data;
    } catch (error) {
      console.error("Error al realizar la solicitud a la API:", error);
      throw error;
    }
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
    console.log(`Eliminando detalle con ID: ${id}`); // Agrega un log aquí
    await axios.delete(`${BASE_URL}/detalle/pedido/eliminar/${id}`);
    return id;
  }
);



// Update DetalleOrden
// Update DetalleOrden
export const updateDetalleOrden = createAsyncThunk(
  'detalleOrden/updateDetalleOrden',
  async ({ id, pedidoId, cantidad }) => {
    const response = await axios.put(`${BASE_URL}/detalle/pedido/actualizar/${pedidoId}/${id}`, { cantidad });
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
    console.log("Solicitando detalles del pedido con ID:", pedidoId);
    const response = await axios.get(`${BASE_URL}/detalle/pedido/listar/${pedidoId}`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordenar los datos
    return data;
  }
);

// Fetch pedidos comunes por usuarioId
export const getPedidosComunesByUsuarioId = createAsyncThunk(
  'detalleOrden/fetchPedidosComunesByUsuarioId',
  async ({ usuarioId, pedidoId }, { rejectWithValue }) => {
    try {
      usuarioId = Number(usuarioId);
      pedidoId = Number(pedidoId);

      console.log("Parámetros enviados al backend:", { usuarioId, pedidoId });

      const response = await axios.get(
        `${BASE_URL}/detalle/pedido/pedidosComunes/${usuarioId}/${pedidoId}`
      );

      const data = response.data;

      // Si los datos son un array, ordenarlos
      if (Array.isArray(data)) {
        data.sort((a, b) => a.id - b.id); // Ordenar los datos por `id`
      }

      console.log("Datos recibidos del backend:", data);
      return data;
    } catch (error) {
      console.error("Error al obtener pedidos comunes:", error);

      // Rechazar el valor con un mensaje personalizado
      return rejectWithValue(error.response?.data || "Error desconocido en la API");
    }
  }
);



