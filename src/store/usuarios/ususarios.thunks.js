import { listUsuarios } from "../../providers/endpoints"
import { createAsyncThunk } from '@reduxjs/toolkit';




// export const fetchUsuarios = createAsyncThunk(
//   'usuarios/fetchUsuarios',
//   async ({ id }, { rejectWithValue }) => {
//     try {
//       const resultado = await listUsuarios({ id });
//       console.log(resultado);
//       if (!resultado.ok) {
//         throw new Error('Error al obtener los usuarios -->');
//       }
//       const usuarios = await resultado;
//       return usuarios;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );