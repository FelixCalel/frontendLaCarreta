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
    console.log("Aca se crea un detalle:", newDetalleOrden);
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
export const updateDetalleOrden = createAsyncThunk(
  'detalleOrden/updateDetalleOrden',
  async ({ id, pedidoId, cantidad }) => {
    const response = await axios.put(`${BASE_URL}/detalle/pedido/actualizar/${pedidoId}/${id}`, { cantidad });
    return response.data;
  }
);




// Toggle DetalleOrden Status
export const toggleDetalleOrdenStatus = createAsyncThunk(
  'pedidos/toggleStatus',
  async ({ id, estadoId }) => {
    try {
      console.log('Actualizando estado del pedido:', { id, estadoId });
      const response = await axios.patch(
        `${BASE_URL}/form/pedidos/actualizar-estado/${id}`,
        { estadoId }
      );
      console.log('Respuesta de actualización de estado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      throw error;
    }
  }
);

// Get DetalleOrden by PedidoId
export const getDetalleOrdenByPedidoId = createAsyncThunk(
  'detalleOrden/fetchByPedidoId',
  async (pedidoId) => {
    console.log("Solicitando detalles del pedido con ID:", pedidoId);
    const response = await axios.get(`${BASE_URL}/detalle/pedido/listar/${pedidoId}`);
    const data = response.data;
    console.log("Detalles recibidos del pedido:", data);
    data.sort((a, b) => a.id - b.id); // Ordenar los datos
    return data;
  }
);

// Fetch pedidos comunes por usuarioId
export const getPedidosComunesByUsuarioId = createAsyncThunk(
  'detalleOrden/fetchPedidosComunesByUsuarioId',
  async ({ deudorId, pedidoId, tiendaId }, { rejectWithValue }) => {
    // Log antes de la conversión para verificar los valores iniciales
    console.log("Valores enviados al thunk:", { deudorId, pedidoId, tiendaId });

    // Asegurarnos de que los IDs son números válidos
    deudorId = Number(deudorId);
    pedidoId = Number(pedidoId);
    tiendaId = Number(tiendaId);

    // Log después de la conversión para verificar que los valores son números
    console.log("Parámetros después de la conversión:", { deudorId, pedidoId, tiendaId });

    // Validar si los parámetros son números válidos
    if (isNaN(deudorId) || isNaN(pedidoId) || isNaN(tiendaId)) {
      console.error("Error: Uno de los IDs no es un número válido.");
      return rejectWithValue("Uno de los IDs no es un número válido.");
    }

    // Intentar obtener la respuesta de la API
    try {
      const url = `${BASE_URL}/detalle/pedido/pedidosComunes/${deudorId}/${pedidoId}/${tiendaId}`;
      console.log("URL solicitada:", url);

      const response = await axios.get(url);

      const data = response.data;
      console.log("Datos recibidos del backend:", data);


      // Si los datos son un array, ordenarlos
      if (Array.isArray(data)) {
        data.sort((a, b) => a.id - b.id); // Ordenar los datos por `id`
      }

      console.log("Datos recibidos del backend:", data);
      return data;
    } catch (error) {
      console.error("Error al obtener pedidos comunes:", error);

      // Rechazar el valor con un mensaje de error
      return rejectWithValue(error.response?.data || "Error desconocido en la API");
    }
  }
);

export const actualizarFechaOrden = createAsyncThunk(
  'detalleOrden/actualizarFechaOrden',
  async ({ pedidoId, fechaOrden }) => {
    try {
      console.log("Fecha antes de enviar al backend:", fechaOrden);
      
      const response = await axios.patch(
        `${BASE_URL}/form/pedidos/actualizar-fecha-orden/${pedidoId}`,
        { fechaOrden }
      );
      
      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la fecha de orden:", error);
      throw error;
    }
  }
);