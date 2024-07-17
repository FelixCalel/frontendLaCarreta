// store/proveedores/InfoProveedor/thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDropdownOptions = createAsyncThunk(
  'infoProveedor/fetchDropdownOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/sys_paises/listar_pais');
    return response.data.map(pais => ({ value: pais.id, label: pais.nombre }));
  }
);

export const fetchTipoProveedorOptions = createAsyncThunk(
  'infoProveedor/fetchTipoProveedorOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/sn_tipos/listar_tipo'); 
    return response.data.map(tipo => ({ value: tipo.id, label: tipo.nombre }));
  }
);

export const fetchLocalidadProveedorOptions = createAsyncThunk(
  'infoProveedor/fetchLocalidadProveedorOptions',
  async () => {
    const response = await axios.get('http://localhost:3000/api/localidades/'); 
    return response.data.map(localidad => ({ value: localidad.id, label: localidad.nombre }));
  }
);

export const submitFormData = createAsyncThunk(
  'infoProveedor/submitFormData',
  async (formData) => {
    const response = await axios.post('/api/submitFormData', formData);
    return response.data;
  }
);
