import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all DetalleOrden
export const tablaDetalleOrden = createAsyncThunk(
  'detalleOrden/fetchDetalleOrden',
  async () => {
    try {
      // Hacer la petición a la API
      const response = await axios.get(`${BASE_URL}/detalle/pedido/todos`);
      const data = response.data;
      
      // Verificar la estructura de los datos antes de ordenar
      console.log("Datos sin ordenar:", data);

      // Ordenar los datos
      data.sort((a, b) => a.id - b.id);
      return data;
    } catch (error) {
      // Capturar y mostrar cualquier error que ocurra en la petición
      console.error("Error al obtener el detalle de la orden:", error);
      
      // Si quieres un mensaje más detallado, podrías hacer esto:
      if (error.response) {
        console.error("Error en la respuesta de la API:", error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta de la API:", error.request);
      } else {
        console.error("Error al configurar la petición:", error.message);
      }

      throw error; // Propagar el error para que pueda ser manejado en el estado de Redux
    }
  }
);


// Add new DetalleOrden
export const addNewDetalleOrden = createAsyncThunk(
  'detalleOrden/addNewDetalleOrden',
  async (newDetalleOrden) => {
    const response = await axios.post(`${BASE_URL}/detalle/pedido/create`, newDetalleOrden);
    console.log("Detalle Orden Creado: ", newDetalleOrden);
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

export const getDetalleOrdenByPedidoId = createAsyncThunk(
  'detalleOrden/fetchByPedidoId',
  async (pedidoId) => {
    try {
      // Hacer la petición a la API con el pedidoId
      const response = await axios.get(`${BASE_URL}/detalle/pedido/listar/${pedidoId}`);

      // Verificar si la respuesta es exitos
      const data = response.data;

      // Ordenar los datos si es necesario
      data.sort((a, b) => a.id - b.id);

      return data;  // Retornar los datos obtenidos para ser usados en el estado de Redux
    } catch (error) {
      console.error("Error al obtener el detalle de la orden por pedidoId:", error);
      // Manejo de error específico
      if (error.response) {
        console.error("Error en la respuesta de la API:", error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta de la API:", error.request);
      } else {
        console.error("Error al configurar la petición:", error.message);
      }

      throw error; // Propagar el error para que pueda ser manejado en el estado de Redux
    }
  }
);

// Fetch pedidos comunes por usuarioId
export const getPedidosComunesByUsuarioId = createAsyncThunk(
  'detalleOrden/fetchPedidosComunesByUsuarioId',
  async (usuarioId) => {
    try {
      // Realizar la petición a la API con el usuarioId
      const response = await axios.get(`${BASE_URL}/detalle/pedido/pedidosComunes/${usuarioId}`);
      
      // Verificar y ordenar los datos si es necesario
      const data = response.data;
      data.sort((a, b) => a.id - b.id);

      return data; // Retornar los datos obtenidos para ser usados en el estado de Redux
    } catch (error) {
      console.error("Error al obtener los pedidos comunes por usuarioId:", error);

      // Manejo de error específico
      if (error.response) {
        console.error("Error en la respuesta de la API:", error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta de la API:", error.request);
      } else {
        console.error("Error al configurar la petición:", error.message);
      }

      throw error; // Propagar el error para que pueda ser manejado en el estado de Redux
    }
  }
);

