// InfoCreditoSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchDropdownOptions, submitFormData } from './thunks';

const initialState = {
  dropdownOptions: {
    plazos: []
  },
  formData: {
    plazo: '',
    monto: ''
  },
  status: 'idle',
  error: null,
};

const infoCreditoSlice = createSlice({
  name: 'infoCredito',
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

export const { setFormData } = infoCreditoSlice.actions;

export default infoCreditoSlice.reducer;
