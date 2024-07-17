// src/store/proveedores/InfoProveedor/InfoProveedorSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { fetchDropdownOptions, fetchTipoProveedorOptions, fetchLocalidadProveedorOptions, submitFormData } from './thunks';

const initialState = {
  dropdownOptions: [],
  tipoProveedorOptions: [],
  localidadProveedorOptions: [],
  formData: {
    razonSocial: '',
    paisProveedor: '',
    tipoProveedor: '',
    nombreContacto: '',
    localidadProveedor: '',
    correoContacto: '',
    dpi: '',
    telefonoContacto: '',
    nit: '',
    productosPrincipales: [],
  },
  status: 'idle',
  error: null,
};

const infoProveedorSlice = createSlice({
  name: 'infoProveedor',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDropdownOptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dropdownOptions = action.payload;
      })
      .addCase(fetchDropdownOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTipoProveedorOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTipoProveedorOptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tipoProveedorOptions = action.payload;
      })
      .addCase(fetchTipoProveedorOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchLocalidadProveedorOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLocalidadProveedorOptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.localidadProveedorOptions = action.payload;
      })
      .addCase(fetchLocalidadProveedorOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(submitFormData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitFormData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setFormData } = infoProveedorSlice.actions;

export default infoProveedorSlice.reducer;
