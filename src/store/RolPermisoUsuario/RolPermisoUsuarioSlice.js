import { createSlice } from '@reduxjs/toolkit';
import { fetchModulos } from './thunks';
 
const modulosSlice = createSlice({
  name: 'modulos',
  initialState: {
    modulos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModulos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModulos.fulfilled, (state, action) => {
        state.modulos = action.payload;
        state.loading = false;
      })
      .addCase(fetchModulos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
 
export default modulosSlice.reducer;