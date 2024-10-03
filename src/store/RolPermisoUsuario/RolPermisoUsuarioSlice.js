import { createSlice } from '@reduxjs/toolkit';
import { assignRoleToUser } from './thunks';

const assignSlice = createSlice({
  name: 'assignments',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignRoleToUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(assignRoleToUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(assignRoleToUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default assignSlice.reducer;
