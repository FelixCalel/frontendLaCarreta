import { createSlice } from '@reduxjs/toolkit';
import { fetchTiposDocumento } from './thunks';

const initialState = {
  documentos: [],
  tiposDocumento: [],
  selectedTipoDocumento: '',
  status: 'idle',
  error: null,
};

const documentacionSlice = createSlice({
  name: 'documentacion',
  initialState,
  reducers: {
    setSelectedTipoDocumento: (state, action) => {
      state.selectedTipoDocumento = action.payload;
    },
    addDocumento: (state, action) => {
      state.documentos.push(action.payload);
    },
    removeDocumento: (state, action) => {
      state.documentos = state.documentos.filter(doc => doc.numero !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTiposDocumento.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTiposDocumento.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tiposDocumento = action.payload;
      })
      .addCase(fetchTiposDocumento.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSelectedTipoDocumento, addDocumento, removeDocumento } = documentacionSlice.actions;

export default documentacionSlice.reducer;
