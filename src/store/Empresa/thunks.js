import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const tablaEmpresa = createAsyncThunk(
  'empresas/fetchEmpresas',
  async () => {
    const response = await axios.get('http://localhost:3000/empresa/todos');
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordena los datos por id
    return data;
  }
);

export const addNewEmpresa = createAsyncThunk(
  'empresas/addNewEmpresa',
  async (newEmpresa) => {
    const response = await axios.post('http://localhost:3000/empresa/create', newEmpresa);
    return response.data;
  }
);

export const deleteEmpresa = createAsyncThunk(
  'empresas/deleteEmpresa',
  async (id) => {
    await axios.delete(`http://localhost:3000/empresa/eliminar/${id}`);
    return id;
  }
);

export const updateEmpresa = createAsyncThunk(
  'empresas/updateEmpresa',
  async (empresa) => {
    const response = await axios.put(`http://localhost:3000/empresa/actualizar/${empresa.id}`, empresa);
    return response.data;
  }
);

export const toggleEmpresaStatus = createAsyncThunk(
  'empresas/toggleEmpresaStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`http://localhost:3000/empresa/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);
