import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all Tiendas
export const tablaTienda = createAsyncThunk(
  'tiendas/fetchTiendas',
  async () => {
    const response = await axios.get('http://localhost:3000/tienda/todos');
    const data = response.data;
    data.sort((a, b) => a.id - b.id);
    return data;
  }
);

// Add new Tienda
export const addNewTienda = createAsyncThunk(
  'tiendas/addNewTienda',
  async (newTienda) => {
    newTienda.ciudadId = parseInt(newTienda.ciudadId);
    newTienda.deudorId = parseInt(newTienda.deudorId);
    newTienda.rutaId = parseInt(newTienda.rutaId);

    console.log('Hola', newTienda);
    try {
      const response = await axios.post('http://localhost:3000/tienda/create', newTienda);
      console.log('Hola 2',newTienda);
      return response.data;
    } catch (error) {
      return (error.response.data || 'Error al crear la tienda');
    }
  }
);


// Delete Tienda
export const deleteTienda = createAsyncThunk(
  'tiendas/deleteTienda',
  async (id) => {
    await axios.delete(`http://localhost:3000/tienda/eliminar/${id}`);
    return id;
  }
);

// Update Tienda
export const updateTienda = createAsyncThunk(
  'tiendas/updateTienda',
  async (tienda) => {
    const response = await axios.put(`http://localhost:3000/tienda/actualizar/${tienda.id}`, tienda);
    return response.data;
  }
);

// Toggle Tienda Status
export const toggleTiendaStatus = createAsyncThunk(
  'tiendas/toggleTiendaStatus',
  async ({ id, estaActivo }) => {
    const response = await axios.patch(`http://localhost:3000/tienda/actualizar-estado/${id}`, { estaActivo });
    return response.data;
  }
);

// Fetch all Ciudades
// export const tablaCiudad = createAsyncThunk(
//   'ciudades/fetchCiudades',
//   async () => {
//     const response = await axios.get('http://localhost:3000/ciudad/todos');
//     const data = response.data;
//     data.sort((a, b) => a.id - b.id); // Ordena los datos por id
//     return data;
//   }
// );


