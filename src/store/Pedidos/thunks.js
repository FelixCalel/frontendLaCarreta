import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaPedidos = createAsyncThunk(
  "pedidos/fetchPedidos",
  async () => {
    const response = await axios.get(`${BASE_URL}/form/pedidos/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordenar los datos
    return data;
  }
);

export const addNewPedido = createAsyncThunk(
  "pedidos/addNewPedido",
  async (newPedido, { rejectWithValue }) => {
    if (!newPedido.deudorId || !newPedido.tiendaId || !newPedido.ciudadId) {
      return rejectWithValue("Faltan datos necesarios para crear el pedido");
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/form/pedidos/create`,
        newPedido
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error en la creación del pedido"
      );
    }
  }
);

export const deletePedido = createAsyncThunk(
  "pedidos/deletePedido",
  async (id) => {
    await axios.delete(`${BASE_URL}/form/pedidos/eliminar/${id}`);
    return id;
  }
);

export const updatePedido = createAsyncThunk(
  "pedidos/updatePedido",
  async (pedido) => {
    const response = await axios.put(
      `${BASE_URL}/form/pedido/actualizar/${pedido.id}`,
      pedido
    );
    return response.data;
  }
);

export const togglePedidoStatus = createAsyncThunk(
  "pedidos/togglePedidoStatus",
  async ({ id, estadoId }) => {
    const response = await axios.patch(
      `${BASE_URL}/form/pedidos/actualizar-estado/${id}`,
      { estadoId }
    );
    return response.data;
  }
);

export const tablaPedidosConDetalles = createAsyncThunk(
  "pedidos/fetchPedidosConDetalles",
  async () => {
    try {
      const responsePedidos = await axios.get(`${BASE_URL}/form/pedidos/todos`);
      let pedidos = responsePedidos.data;

      pedidos = pedidos.filter((pedido) => pedido.estadoId === 3);

      const pedidosConDetalles = await Promise.all(
        pedidos.map(async (pedido) => {
          try {
            const detallesResponse = await axios.get(
              `${BASE_URL}/detalle/pedido/listar/${pedido.id}`
            );
            pedido.items = detallesResponse.data;

            if (!pedido.items || !Array.isArray(pedido.items)) {
              pedido.items = [];
            }
          } catch (error) {
            console.error(
              `Error al obtener detalles del pedido ${pedido.id}:`,
              error
            );
            pedido.items = [];
          }
          return pedido;
        })
      );

      pedidosConDetalles.sort((a, b) => a.id - b.id);

      return pedidosConDetalles;
    } catch (error) {
      console.error("Error al obtener pedidos con detalles:", error);
      throw error;
    }
  }
);

export const updatePedidoActivacion = createAsyncThunk(
  "pedidos/updatePedidoActivacion",
  async ({ id, isActive }) => {
    const response = await axios.patch(
      `${BASE_URL}/form/pedidos/actualizar-activacion/${id}`,
      { isActive }
    );
    return response.data;
  }
);

const DBSAP = import.meta.env.VITE_DBSAP;
const IPSAP = import.meta.env.VITE_IPSAP;

export const exportarPedidoSap = createAsyncThunk(
  "sap/exportarPedidos",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/sap/deus/exportarPedidos`,
        { dbsap: DBSAP, ipsap: IPSAP }
      );
      return data.enviados || data;
    } catch (err) {
      return rejectWithValue(
        (err.response && err.response.data) || "Error al exportar pedidos a SAP"
      );
    }
  }
);
