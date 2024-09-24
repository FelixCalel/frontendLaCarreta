import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all Pedidos
export const tablaPedidos = createAsyncThunk(
  'pedidos/fetchPedidos',
  async () => {
    try {
      // Realizar la petición a la API del backend
      const response = await axios.get(`${BASE_URL}/form/pedidos/todos`);
      
      // Depuración: Verifica la respuesta cruda
      console.log("Datos de respuesta cruda:", response);
      
      // Extraer los datos de la respuesta
      const data = response.data;
      
      // Depuración: Verifica los datos extraídos
      console.log("Datos extraídos de la respuesta:", data);
      
      // Ordenar los datos por 'id' (opcional)
      data.sort((a, b) => a.id - b.id);
      
      // Depuración: Verifica los datos ordenados
      console.log("Datos ordenados:", data);
      
      return data;
    } catch (error) {
      // Registrar el error para entender qué salió mal
      console.error("Error al obtener pedidos:", error.response ? error.response.data : error.message);
      
      // Relanzar el error para que el código que llama (Thunk de Redux) lo maneje
      throw error;
    }
  }
);



// Add new Pedido
export const addNewPedido = createAsyncThunk(
  'pedidos/addNewPedido',
  async (newPedido) => {
    const response = await axios.post(`${BASE_URL}/form/pedidos/create`, newPedido);
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
