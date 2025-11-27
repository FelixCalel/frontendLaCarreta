import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("chakra-ui-color-mode");
  if (savedTheme) {
    return savedTheme;
  }
  return "light"; // Default fallback, though Chakra will handle system preference
};

const initialState = {
  theme: getInitialTheme(),
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Chakra UI handles localStorage automatically with the key 'chakra-ui-color-mode'
      // but we can also sync it here if we want to be explicit or store it elsewhere.
      // For now, we just update the state to reflect the current mode.
    },
  },
});

export const { setTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
