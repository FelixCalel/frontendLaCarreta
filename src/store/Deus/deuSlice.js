import { createSlice } from '@reduxjs/toolkit';
import {
  tablaDeudores,
  crearDeudor,
  obtenerDeudorPorId,
  eliminarDeudor,
  actualizarDeudor,
  obtenerDeudoresActivos,
  obtenerDeudoresInactivos,
  buscarDeudorPorNombreOCorrelativo,
} from './thunks';

const initialState = {
  deudores: [],
  deudor: null,
  status: 'idle',
  error: null,
};

const deudoresSlice = createSlice({
  name: 'deudores',
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.error = null;
    },
    limpiarDeudor: (state) => {
      state.deudor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener todos los deudores
      .addCase(tablaDeudores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(tablaDeudores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deudores = action.payload;
      })
      .addCase(tablaDeudores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Crear un deudor
      .addCase(crearDeudor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(crearDeudor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deudores.push(action.payload);
      })
      .addCase(crearDeudor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Obtener deudor por ID
      .addCase(obtenerDeudorPorId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(obtenerDeudorPorId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deudor = action.payload;
      })
      .addCase(obtenerDeudorPorId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Eliminar un deudor
      .addCase(eliminarDeudor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(eliminarDeudor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deudores = state.deudores.filter((deudor) => deudor.id !== action.payload.id);
      })
      .addCase(eliminarDeudor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Actualizar un deudor
      .addCase(actualizarDeudor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(actualizarDeudor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.deudores.findIndex((deudor) => deudor.id === action.payload.id);
        if (index !== -1) {
          state.deudores[index] = action.payload;
        }
      })
      .addCase(actualizarDeudor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Obtener deudores activos
      .addCase(obtenerDeudoresActivos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(obtenerDeudoresActivos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deudores = action.payload;
      })
      .addCase(obtenerDeudoresActivos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Obtener deudores inactivos
      .addCase(obtenerDeudoresInactivos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(obtenerDeudoresInactivos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deudores = action.payload;
      })
      .addCase(obtenerDeudoresInactivos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Buscar deudor por nombre o correlativo
      .addCase(buscarDeudorPorNombreOCorrelativo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(buscarDeudorPorNombreOCorrelativo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deudores = action.payload;
      })
      .addCase(buscarDeudorPorNombreOCorrelativo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { limpiarError, limpiarDeudor } = deudoresSlice.actions;

export default deudoresSlice.reducer;
