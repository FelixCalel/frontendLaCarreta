import { createSlice } from '@reduxjs/toolkit';
import { fetchPermisos, addNewPermiso, deletePermiso, updatePermiso } from './thunks';

const permisoSlice = createSlice({
  name: 'permisos',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermisos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPermisos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPermisos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPermiso.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(deletePermiso.fulfilled, (state, action) => {
        state.data = state.data.filter(permiso => permiso.id !== action.payload);
      })
      .addCase(updatePermiso.fulfilled, (state, action) => {
        const index = state.data.findIndex(permiso => permiso.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  }
});

export default permisoSlice.reducer;
