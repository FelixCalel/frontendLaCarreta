import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all DetalleOrden
export const tablaDetalleOrden = createAsyncThunk(
  'detalleOrden/fetchDetalleOrden',
  async () => {
    try {
      // Hacer la petición a la API
      console.log("Iniciando la petición a la API...");
      const response = await axios.get(`${BASE_URL}/detalle/pedido/todos`);

      // Verificar si la respuesta es exitosa
      if (response.status === 200) {
        console.log("Respuesta recibida:", response);
      } else {
        console.warn("Respuesta no fue exitosa. Código de estado:", response.status);
      }

      const data = response.data;
      
      // Verificar la estructura de los datos antes de ordenar
      console.log("Datos sin ordenar:", data);

      // Ordenar los datos
      data.sort((a, b) => a.id - b.id);
      console.log("Datos ordenados:", data);

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
