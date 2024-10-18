import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Usar la variable de entorno para la URL base
const BASE_URL = import.meta.env.VITE_API_URL;

// Thunk para buscar deudores por nombre o correlativo
export const tablaDeudores = createAsyncThunk(
  'deudores/tablaDeudores',
  async ({ empresaId }) => { // Elimina paisId de aquí
      const deudoresResponse = await axios.get(`${BASE_URL}/deus/todos`, {
          params: { empresaId } // Enviar empresaId como parámetro para filtrar
      });

      // Filtrar deudores directamente por empresaId
      const data = deudoresResponse.data.filter(deudor => {
          return deudor.empresaId === empresaId; // Solo incluir deudores de la empresa seleccionada
      });

      data.sort((a, b) => a.id - b.id); // Ordena los datos por id
      return data;
  }
);
