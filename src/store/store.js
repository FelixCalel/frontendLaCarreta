

import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth'
import { usuariosReducer  } from './usuarios/usuariosSlice'
import paisesReducer from './pais/paisSlice';
import empresaReducer from './Empresa/empresaSlice'
import ciudadReducer from './Ciudad/ciudadSlice'
import tiendaReducer from './Tienda/tiendaSlice'
import rutaReducer from './Ruta/rutaSlice'
import deusReducer from './Deus/deuSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    usuarios: usuariosReducer,
    paises: paisesReducer,
    empresas: empresaReducer,
    ciudades: ciudadReducer,
    tiendas: tiendaReducer,  
    rutas: rutaReducer,
    deudores: deusReducer,
  },
})