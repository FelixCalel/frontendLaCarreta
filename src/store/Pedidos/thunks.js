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
  async (newPedido, { rejectWithValue }) => {
    // Validación básica de los campos
    if (!newPedido.deudorId || !newPedido.tiendaId || !newPedido.ciudadId) {
      return rejectWithValue("Faltan datos necesarios para crear el pedido");
    }

    try {
      const response = await axios.post(`${BASE_URL}/form/pedidos/create`, newPedido);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error en la creación del pedido");
    }
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


export const tablaPedidosConDetalles = createAsyncThunk(
  'pedidos/fetchPedidosConDetalles',
  async () => {
    try {
      // Obtener todos los pedidos
      const responsePedidos = await axios.get(`${BASE_URL}/form/pedidos/todos`);
      let pedidos = responsePedidos.data;

      // Filtrar solo los pedidos con estadoId === 3 (aprobados)
      pedidos = pedidos.filter(pedido => pedido.estadoId === 3);

      // Para cada pedido aprobado, obtener sus detalles
      const pedidosConDetalles = await Promise.all(
        pedidos.map(async (pedido) => {
          try {
            const detallesResponse = await axios.get(`${BASE_URL}/detalle/pedido/listar/${pedido.id}`);
            pedido.items = detallesResponse.data; // Asignamos los detalles al pedido

            // Si no hay items, asignar un arreglo vacío
            if (!pedido.items || !Array.isArray(pedido.items)) {
              pedido.items = [];
            }

          } catch (error) {
            console.error(`Error al obtener detalles del pedido ${pedido.id}:`, error);
            pedido.items = []; // Asignar un arreglo vacío si hay error
          }
          return pedido;
        })
      );

      pedidosConDetalles.sort((a, b) => a.id - b.id); // Ordenar los pedidos

      return pedidosConDetalles;
    } catch (error) {
      console.error("Error al obtener pedidos con detalles:", error);
      throw error;
    }
  }
);