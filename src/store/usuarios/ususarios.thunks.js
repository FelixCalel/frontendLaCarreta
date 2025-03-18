import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_URL;

// // Thunk para obtener los datos del usuario logueado
// export const obtenerUsuarioActual = createAsyncThunk(
//   'usuarios/obtenerUsuarioActual',
//   async (usuarioId) => {
//     const response = await axios.get(`${BASE_URL}/usuarios/todos`);
//     const data = response.data.usuarios;

//     // Filtrar solo el usuario con el id del logueado
//     const usuarioActual = data.find((usuario) => usuario.id === parseInt(usuarioId));
    
//     if (!usuarioActual) {
//       throw new Error("Usuario no encontrado");
//     }

//     return usuarioActual;
//   }
// );
