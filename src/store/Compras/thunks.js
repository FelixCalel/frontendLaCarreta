import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchCompras = createAsyncThunk(
  "compras/fetchCompras",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/compras/todas`);
      return response.data; // Array de compras
    } catch (error) {
      console.error("Error al obtener compras:", error);
      return rejectWithValue(
        error.response?.data || "Error al obtener compras"
      );
    }
  }
);

export const consolidateCompras = createAsyncThunk(
  "compras/consolidate",
  async ({ estadoId, fecha }, { rejectWithValue }) => {
    try {
      const body = {};
      if (estadoId) body.estadoId = estadoId;
      if (fecha) body.fecha = fecha;

      const response = await axios.post(`${BASE_URL}/compras/consolidar`, body);
      return response.data;
    } catch (error) {
      console.error("Error al consolidar compras:", error);
      return rejectWithValue(
        error.response?.data || "Error al consolidar compras"
      );
    }
  }
);

export const updateCompra = createAsyncThunk(
  "compras/updateCompra",
  async ({ id, ...rest }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/compras/update/${id}`,
        rest
      );
      return response.data; // Retorna la compra actualizada
    } catch (error) {
      console.error("Error al actualizar compra:", error);
      return rejectWithValue(
        error.response?.data || "Error al actualizar compra"
      );
    }
  }
);

export const asignarProveedor = createAsyncThunk(
  "compras/asignarProveedor",
  async (
    { compraId, proveedorId, cantidad, selectedProveedorName },
    { rejectWithValue }
  ) => {
    try {
      console.log("Enviando a la API:", {
        compraId,
        proveedorId,
        cantidad,
        selectedProveedorName,
      });

      const response = await axios.post(
        `${BASE_URL}/compras/proveedor/asignar`,
        {
          compraId,
          proveedorId,
          cantidad,
          selectedProveedorName,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al asignar proveedor:", error);
      return rejectWithValue(
        error.response?.data || "Error al asignar proveedor"
      );
    }
  }
);

export const desasignarProveedor = createAsyncThunk(
  "compras/desasignarProveedor",
  async ({ compraId, proveedorId }, { rejectWithValue }) => {
    try {
      console.log("Enviando solicitud para desasignar:", {
        compraId,
        proveedorId,
      });

      const response = await axios.post(
        `${BASE_URL}/compras/proveedor/desasignar`,
        {
          compraId,
          proveedorId,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al desasignar proveedor:", error);
      return rejectWithValue(
        error.response?.data || "Error al desasignar proveedor"
      );
    }
  }
);

export const actualizarFechaIngreso = createAsyncThunk(
  "compras/actualizarFechaIngreso",
  async ({ pedidoId, fechaIngreso }) => {
    try {
      console.log("Fecha antes de enviar al backend:", fechaIngreso);

      const response = await axios.patch(
        `${BASE_URL}/compras/actualizar-fecha/${pedidoId}`,
        { fechaIngreso }
      );

      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la fecha de ingreso:", error);
      throw error;
    }
  }
);
