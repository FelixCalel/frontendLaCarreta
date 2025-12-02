import { createAsyncThunk } from "@reduxjs/toolkit";
import { tablaEmpresa } from "../Empresa/thunks";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaPedidos = createAsyncThunk(
  "pedidos/fetchPedidos",
  async () => {
    const response = await axios.get(`${BASE_URL}/form/pedidos/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
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
  async (
    { id, estadoId, comentarioDisplay, fechaOrdenDisplay, comentario },
    { rejectWithValue }
  ) => {
    try {
      const toYMD = (v) => {
        if (!v) return undefined;
        if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
        const d = new Date(v);
        if (isNaN(d.getTime())) return undefined;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      };

      const body = {
        estadoId,
        comentarioDisplay: comentarioDisplay ?? "",
        comentario: comentario ?? "",
        fechaOrdenDisplay: toYMD(fechaOrdenDisplay),
      };

      Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);

      const { data } = await axios.patch(
        `${BASE_URL}/form/pedidos/actualizar-estado/${id}`,
        body
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const tablaPedidosConDetalles = createAsyncThunk(
  "pedidos/fetchPedidosConDetalles",
  async (_, { getState }) => {
    try {
      const state = getState();
      const existingPedidos = state.pedidos.pedidosConDetalles || [];

      const responsePedidos = await axios.get(`${BASE_URL}/form/pedidos/todos`);
      let pedidos = responsePedidos.data;

      pedidos = pedidos.filter((pedido) => pedido.estadoId === 3);

      const pedidosConDetalles = await Promise.all(
        pedidos.map(async (pedido) => {
          // Check if we already have details for this pedido in the state
          const existingPedido = existingPedidos.find(p => p.id === pedido.id);
          
          if (existingPedido && existingPedido.items && existingPedido.items.length > 0) {
             // Use existing items if available
             pedido.items = existingPedido.items;
             return pedido;
          }

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

export const exportarPedidoSap = createAsyncThunk(
  "sap/exportarPedidos",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      await dispatch(tablaEmpresa()).unwrap();
      const empresas = getState().empresas.data;
      const paisId = localStorage.getItem("paisId") || getState().auth.paisId;
      if (!paisId) {
        return rejectWithValue("No se pudo obtener el paisId del usuario");
      }
      console.log({ paisId, empresas });
      const emp = empresas.find((e) => e.paisId == paisId && e.estaActivo);
      if (!emp) {
        return rejectWithValue("No hay configuración SAP para tu país");
      }
      const { data } = await axios.post(
        `${BASE_URL}/sap/deus/exportarPedidos`,
        { dbsap: emp.baseDatos, ipsap: emp.ipBaseDatos }
      );
      return data.enviados || data;
    } catch (err) {
      const msg = err.response?.data || err.message || err;
      return rejectWithValue(msg);
    }
  }
);
