import { createSlice } from '@reduxjs/toolkit';
import { fetchasignacionMO } from './thunks';
import { fetchasignacionMOMetadata } from './thunks';

const asignacionMOSlice = createSlice({
  name: 'asignacionMO',
  initialState: {
    asignacionMO: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchasignacionMO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchasignacionMO.fulfilled, (state, action) => {
        state.asignacionMO = action.payload;
        state.loading = false;
      })
      .addCase(fetchasignacionMO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchasignacionMOMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })  
      .addCase(fetchasignacionMOMetadata.fulfilled, (state, action) => {
        state.metadata = action.payload;
        state.loading = false;
      })
      .addCase(fetchasignacionMOMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});



export default asignacionMOSlice.reducer;
