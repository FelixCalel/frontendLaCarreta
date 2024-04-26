

import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth'
import {  usuariosReducer, usuariosSlice  } from './usuarios/usuariosSlice'


export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    usuarios: usuariosReducer,
    
  },
})