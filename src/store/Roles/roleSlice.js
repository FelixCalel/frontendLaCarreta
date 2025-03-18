import { createSlice } from '@reduxjs/toolkit';
import { fetchRoles } from './thunks';
import { fetchRolesMetadata } from './thunks';

const roleSlice = createSlice({
    name: 'role',
    initialState: {
        roles: [],
        metadata: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.roles = action.payload;
                state.loading = false;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(fetchRolesMetadata.pending, (state) => {
                state.loading = true;
                state.error = null;
              })  
              .addCase(fetchRolesMetadata.fulfilled, (state, action) => {
                state.metadata = action.payload;
                state.loading = false;
              })
              .addCase(fetchRolesMetadata.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
              });
    }
});

export default roleSlice.reducer;
