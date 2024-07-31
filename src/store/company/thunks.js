import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const tablaCompany = createAsyncThunk(
  'companies/fetchCompanies',
  async () => {
    const response = await axios.get('http://localhost:3000/company/todos');
    const data = response.data;
    data.sort((a, b) => a.id - b.id); // Ordena los datos por id
    return data;
  }
);

export const addNewCompany = createAsyncThunk(
  'companies/addNewCompany',
  async (newCompany) => {
    const response = await axios.post('http://localhost:3000/company/create', newCompany);
    return response.data;
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id) => {
    await axios.delete(`http://localhost:3000/company/eliminar/${id}`);
    return id;
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async (company) => {
    const response = await axios.put(`http://localhost:3000/company/actualizar/${company.id}`, company);
    return response.data;
  }
);

export const toggleCompanyStatus = createAsyncThunk(
  'companies/toggleCompanyStatus',
  async ({ id, isActive }) => {
    const response = await axios.patch(`http://localhost:3000/company/actualizar-estado/${id}`, { isActive });
    return response.data;
  }
);
