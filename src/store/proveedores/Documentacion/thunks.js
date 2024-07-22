import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTiposDocumento = createAsyncThunk(
  'documentacion/fetchTiposDocumento',
  async ({ tipoProveedorId, localidadId }) => {
    const response = await axios.get(`http://localhost:3000/api/tipo_documentos/listar2/${tipoProveedorId}/${localidadId}`);
    return response.data.map(documento => ({ value: documento.id, label: documento.nombre }));
  }
);
 