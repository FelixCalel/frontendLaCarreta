import { createSlice } from '@reduxjs/toolkit';
import { fetchDropdownOptions } from './thunks';

const infoPagoSlice = createSlice({
  name: 'infoPago',
  initialState: {
    dropdownOptions: [],
    formData: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setTipoPago: (state, action) => {
      state.formData.tipoPago = action.payload;
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
      });
  },
});

export const { setFormData, setTipoPago } = infoPagoSlice.actions;

export default infoPagoSlice.reducer;
