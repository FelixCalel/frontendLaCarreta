import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { listUsuarios } from '../../providers/endpoints';

// Define tu thunk asíncrono utilizando createAsyncThunk
export const fetchUsuarios = createAsyncThunk(
  'usuarios/fetchUsuarios',
  async ({ id }, thunkAPI) => {
    try {
        console.log("ingresa en fetchUsuairios",{id});
      // Realiza tu lógica asincrónica aquí, como hacer una solicitud HTTP
      const response = await listUsuarios({ id });
      console.log(response);

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios -->');
      }
      // Parsea la respuesta a formato JSON
      // const usuarios = await response.json();
      
     
      // Devuelve los usuarios obtenidos
      return response;
    } catch (error) {
      // Si ocurre un error, lo lanzamos para que sea manejado por Redux Toolkit
      throw error;
    }
  }
);

// Define tu slice de Redux
export const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    // Puedes definir otras acciones sincrónicas aquí si es necesario
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.status = 'loading'; // Actualiza el estado a 'loading' mientras se realiza la solicitud
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        console.log(action,"<---");
        state.status = 'succeeded';
        state.items = action.payload.usuarios; // Actualiza los items con los usuarios obtenidos
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; // Captura el mensaje de error
      });
  }
});

// Exporta el reducer generado automáticamente por createSlice
export const usuariosReducer = usuariosSlice.reducer;

// Exporta las acciones generadas automáticamente por createSlice
export const {  } = usuariosSlice.actions;
