import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetAuth: () => initialState,
  },
});

export const { setEmail, setPassword, setLoading, setError, resetAuth } =
  authSlice.actions;
export default authSlice.reducer;
