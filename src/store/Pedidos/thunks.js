import { createAsyncThunk } from "@reduxjs/toolkit";
import { tablaEmpresa } from "../Empresa/thunks";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaPedidos = createAsyncThunk(
  "pedidos/fetchPedidos",
  async (arg = null) => {
    let url = `${BASE_URL}/form/pedidos/todos`;

    if (arg && typeof arg === "object") {
      const { userId, roleId, status, page, limit } = arg;
      if (userId) {
        const p = page || 1;
        const l = limit || 10;
        url = `${BASE_URL}/form/pedidos/historial/${userId}?roleId=${roleId}&page=${p}&limit=${l}`;
        if (status) {
          url += `&status=${status}`;
        }
        if (arg.filters) {
          const { tienda, deudor, usuario, fechaInicio, fechaFin, estado } =
            arg.filters;
          if (tienda) url += `&tienda=${encodeURIComponent(tienda)}`;
          if (deudor) url += `&deudor=${encodeURIComponent(deudor)}`;
          if (usuario) url += `&usuario=${encodeURIComponent(usuario)}`;
          if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
          if (fechaFin) url += `&fechaFin=${fechaFin}`;
          if (estado) url += `&status=${estado}`;
        }
      } else if (status) {
        const p = page || 1;
        const l = limit || 10;
        url = `${BASE_URL}/form/pedidos/estado/${status}?page=${p}&limit=${l}`;
      }
    } else if (arg) {
      url = `${BASE_URL}/form/pedidos/estado/${arg}`;
    }

    const response = await axios.get(url);
    const resData = response.data;

    let resultData = [];
    let resultTotal = 0;

    if (resData.data && Array.isArray(resData.data)) {
      resultData = resData.data;
      resultTotal = typeof resData.total === "number" ? resData.total : 0;
    } else if (Array.isArray(resData)) {
      resultData = resData;
      resultTotal = resData.length;
    }

    resultData.sort((a, b) => a.id - b.id);

    return { data: resultData, total: resultTotal };
  },
);

export const fetchIncomingPedidos = createAsyncThunk(
  "pedidos/fetchIncomingPedidos",
  async () => {
    const response = await axios.get(`${BASE_URL}/form/pedidos/estado/2`);
    return response.data;
  },
);

export const fetchFilterOptions = createAsyncThunk(
  "pedidos/fetchFilterOptions",
  async ({ userId, roleId }) => {
    const response = await axios.get(
      `${BASE_URL}/form/pedidos/historial/filtros/${userId}?roleId=${roleId}`,
    );
    return response.data;
  },
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
        newPedido,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error en la creación del pedido",
      );
    }
  },
);

export const deletePedido = createAsyncThunk(
  "pedidos/deletePedido",
  async (id) => {
    await axios.delete(`${BASE_URL}/form/pedidos/eliminar/${id}`);
    return id;
  },
);

export const updatePedido = createAsyncThunk(
  "pedidos/updatePedido",
  async (pedido) => {
    const response = await axios.put(
      `${BASE_URL}/form/pedido/actualizar/${pedido.id}`,
      pedido,
    );
    return response.data;
  },
);

export const togglePedidoStatus = createAsyncThunk(
  "pedidos/togglePedidoStatus",
  async (
    { id, estadoId, comentarioDisplay, fechaOrdenDisplay, comentario },
    { rejectWithValue },
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
        body,
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
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
          const existingPedido = existingPedidos.find(
            (p) => p.id === pedido.id,
          );

          if (
            existingPedido &&
            existingPedido.items &&
            existingPedido.items.length > 0
          ) {
            pedido.items = existingPedido.items;
            return pedido;
          }

          try {
            const detallesResponse = await axios.get(
              `${BASE_URL}/detalle/pedido/listar/${pedido.id}`,
            );
            pedido.items = detallesResponse.data;

            if (!pedido.items || !Array.isArray(pedido.items)) {
              pedido.items = [];
            }
          } catch (error) {
            console.error(
              `Error al obtener detalles del pedido ${pedido.id}:`,
              error,
            );
            pedido.items = [];
          }
          return pedido;
        }),
      );

      pedidosConDetalles.sort((a, b) => a.id - b.id);

      return pedidosConDetalles;
    } catch (error) {
      console.error("Error al obtener pedidos con detalles:", error);
      throw error;
    }
  },
);

export const updatePedidoActivacion = createAsyncThunk(
  "pedidos/updatePedidoActivacion",
  async ({ id, isActive }) => {
    const response = await axios.patch(
      `${BASE_URL}/form/pedidos/actualizar-activacion/${id}`,
      { isActive },
    );
    return response.data;
  },
);

export const exportarPedidoSap = createAsyncThunk(
  "sap/exportarPedidos",
  async (ids, { getState, dispatch, rejectWithValue }) => {
    try {
      await dispatch(tablaEmpresa()).unwrap();
      const empresas = getState().empresas.data;
      let paisId = localStorage.getItem("paisId") || getState().auth.paisId;

      if (!paisId) {
        paisId = getState().auth.user?.paisId;
      }

      if (!paisId) {
        try {
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          paisId = userData.paisId;
        } catch (e) {
          console.error("Error parsing userData from localStorage:", e);
        }
      }

      if (!paisId) {
        console.error(
          "Export Error: paisId missing. Auth State:",
          getState().auth,
        );
        return rejectWithValue(
          "No se pudo obtener el paisId del usuario. Intente cerrar sesión y volver a entrar.",
        );
      }
      console.log({ paisId, empresas });
      const emp = empresas.find((e) => e.paisId == paisId && e.estaActivo);
      if (!emp) {
        return rejectWithValue("No hay configuración SAP para tu país");
      }
      const { data } = await axios.post(
        `${BASE_URL}/sap/deus/exportarPedidos`,
        { dbsap: emp.baseDatos, ipsap: emp.ipBaseDatos, ids },
      );
      return data.enviados || data;
    } catch (err) {
      const msg = err.response?.data || err.message || err;
      return rejectWithValue(msg);
    }
  },
);
