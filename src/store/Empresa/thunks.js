import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const tablaEmpresa = createAsyncThunk(
  'empresas/fetchEmpresas',
  async () => {
    const response = await axios.get(`${BASE_URL}/empresa/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);

export const addNewEmpresa = createAsyncThunk(
  'empresas/addNewEmpresa',
  async (newEmpresa) => {
    const response = await axios.post(`${BASE_URL}/empresa/create`, newEmpresa);
    return response.data;
  }
);

export const deleteEmpresa = createAsyncThunk(
  'empresas/deleteEmpresa',
  async (id) => {
    await axios.delete(`${BASE_URL}/empresa/eliminar/${id}`);
    return id;
  }
);

export const updateEmpresa = createAsyncThunk(
  'empresas/updateEmpresa',
  async (empresa) => {
    const response = await axios.put(`${BASE_URL}/empresa/actualizar/${empresa.id}`, empresa);
    return response.data;
  }
);

export const toggleEmpresaStatus = createAsyncThunk(
  'empresas/toggleEmpresaStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`${BASE_URL}/empresa/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);

export const tablaPais = createAsyncThunk(
  'paises/fetchPaises',
  async () => {
    const response = await axios.get(`${BASE_URL}/pais/todos`);
    const data = response.data;
    data.sort((a, b) => a.id - b.id); 
    return data;
  }
);


export const sincronizarClientes = createAsyncThunk(
  'empresas/sincronizarClientes',
  async ({ dbsap, ipsap, empresaId }) => {
    const response = await axios.post(`${BASE_URL}/sap/deus/sincronizarClientes`, {
      dbsap,
      ipsap,
      empresaId
    });
    return response.data;
  }
);

