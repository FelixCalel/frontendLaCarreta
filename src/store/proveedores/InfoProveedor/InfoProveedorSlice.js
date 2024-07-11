// InfoProveedorSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchDropdownOptions, submitFormData } from './thunks';

const initialState = {
  dropdownOptions: [],
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
    productosPrincipales: '',
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
