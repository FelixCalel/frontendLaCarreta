import { createSlice } from '@reduxjs/toolkit';
import { fetchRoles, addNewRole, deleteRole, updateRole } from './thunks';

const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewRole.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.data = state.data.filter(role => role.id !== action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.data.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  }
});

export default roleSlice.reducer;
