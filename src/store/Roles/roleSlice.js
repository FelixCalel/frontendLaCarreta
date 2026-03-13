import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles } from "./thunks";
import { fetchRolesMetadata } from "./thunks";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    data: [],
    roles: [],
    metadata: [],
    status: "idle",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        const roles = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.roles)
            ? action.payload.roles
            : Array.isArray(action.payload?.data)
              ? action.payload.data
              : [];

        state.roles = roles;
        state.data = roles;
        state.status = "succeeded";
        state.loading = false;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      .addCase(fetchRolesMetadata.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesMetadata.fulfilled, (state, action) => {
        state.metadata = action.payload;
        state.status = "succeeded";
        state.loading = false;
      })
      .addCase(fetchRolesMetadata.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default roleSlice.reducer;
