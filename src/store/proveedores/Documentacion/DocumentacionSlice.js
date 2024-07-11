// DocumentacionSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { uploadDocumento, deleteDocumento } from './thunks';

const initialState = {
  documentos: [],
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocumento.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadDocumento.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documentos.push(action.payload);
      })
      .addCase(uploadDocumento.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteDocumento.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDocumento.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documentos = state.documentos.filter(doc => doc.numero !== action.payload);
      })
      .addCase(deleteDocumento.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSelectedTipoDocumento, addDocumento } = documentacionSlice.actions;

export default documentacionSlice.reducer;
