import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaDetalleOrden = createAsyncThunk(
  "detalleOrden/fetchDetalleOrden",
  async () => {
    try {
      console.log("Iniciando solicitud para obtener los detalles de orden...");
      const response = await axios.get(`${BASE_URL}/detalle/pedido/todos`);

      console.log("Respuesta completa del servidor:", response);

      const data = response.data;
      console.log("Datos recibidos del backend (sin procesar):", data);

      if (Array.isArray(data)) {
        data.sort((a, b) => a.id - b.id);
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

export const addNewDetalleOrden = createAsyncThunk(
  "detalleOrden/addNewDetalleOrden",
  async (newDetalleOrden) => {
    console.log("Aca se crea un detalle:", newDetalleOrden);
    const response = await axios.post(
      `${BASE_URL}/detalle/pedido/create`,
      newDetalleOrden
    );
    return response.data;
  }
);

export const deleteDetalleOrden = createAsyncThunk(
  "detalleOrden/deleteDetalleOrden",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`Eliminando detalle con ID: ${id}`);
      const response = await axios.delete(
        `${BASE_URL}/detalle/pedido/eliminar/${id}`
      );
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const updateDetalleOrden = createAsyncThunk(
  "detalleOrden/updateDetalleOrden",
  async ({ id, pedidoId, cantidad }) => {
    const response = await axios.put(
      `${BASE_URL}/detalle/pedido/actualizar/${pedidoId}/${id}`,
      { cantidad }
    );
    return response.data;
  }
);

export const toggleDetalleOrdenStatus = createAsyncThunk(
  "pedidos/toggleStatus",
  async ({ id, estadoId }) => {
    try {
      console.log("Actualizando estado del pedido:", { id, estadoId });
      const response = await axios.patch(
        `${BASE_URL}/form/pedidos/actualizar-estado/${id}`,
        { estadoId }
      );
      console.log("Respuesta de actualización de estado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      throw error;
    }
  }
);

export const getDetalleOrdenByPedidoId = createAsyncThunk(
  "detalleOrden/fetchByPedidoId",
  async (pedidoId) => {
    console.log("Solicitando detalles del pedido con ID:", pedidoId);
    const response = await axios.get(
      `${BASE_URL}/detalle/pedido/listar/${pedidoId}`
    );
    const data = response.data;
    console.log("Detalles recibidos del pedido:", data);
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);

export const getPedidosComunesByUsuarioId = createAsyncThunk(
  "detalleOrden/fetchPedidosComunesByUsuarioId",
  async ({ deudorId, pedidoId, tiendaId }, { rejectWithValue }) => {
    console.log("Valores enviados al thunk:", { deudorId, pedidoId, tiendaId });

    deudorId = Number(deudorId);
    pedidoId = Number(pedidoId);
    tiendaId = Number(tiendaId);

    console.log("Parámetros después de la conversión:", {
      deudorId,
      pedidoId,
      tiendaId,
    });

    if (isNaN(deudorId) || isNaN(pedidoId) || isNaN(tiendaId)) {
      console.error("Error: Uno de los IDs no es un número válido.");
      return rejectWithValue("Uno de los IDs no es un número válido.");
    }

    try {
      const url = `${BASE_URL}/detalle/pedido/pedidosComunes/${deudorId}/${pedidoId}/${tiendaId}`;
      console.log("URL solicitada:", url);

      const response = await axios.get(url);

      const data = response.data;
      console.log("Datos recibidos del backend:", data);

      if (Array.isArray(data)) {
        data.sort((a, b) => a.id - b.id);
      }

      console.log("Datos recibidos del backend:", data);
      return data;
    } catch (error) {
      console.error("Error al obtener pedidos comunes:", error);

      return rejectWithValue(
        error.response?.data || "Error desconocido en la API"
      );
    }
  }
);

export const actualizarFechaOrden = createAsyncThunk(
  "detalleOrden/actualizarFechaOrden",
  async ({ pedidoId, fechaOrden }) => {
    try {
      console.log("Fecha antes de enviar al backend:", fechaOrden);

      const response = await axios.patch(
        `${BASE_URL}/form/pedidos/actualizar-fecha/${pedidoId}`,
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

export const copiarDetallesUltimoPedido = createAsyncThunk(
  "detalleOrden/copiarUltimo",
  async ({ ciudadId, deudorId, tiendaId, usuarioId }, { rejectWithValue }) => {
    try {
      const body = { ciudadId, deudorId, tiendaId, usuarioId };

      const { data } = await axios.post(
        `${BASE_URL}/detalle/pedido/copiar-ultimo`,
        body
      );

      return data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err.message || "Error desconocido");
    }
  }
);

export const fetchConsolidado = createAsyncThunk(
  "detalleOrden/fetchConsolidado",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/detalle/pedido/todos/${roleId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener los detalles consolidado:", error);
      return rejectWithValue(
        error.response?.data || "Error al obtener el consolidado"
      );
    }
  }
);
