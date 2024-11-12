import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth'
import { usuariosReducer  } from './usuarios/usuariosSlice'
import paisesReducer from './pais/paisSlice';
import empresaReducer from './Empresa/empresaSlice'
import ciudadReducer from './Ciudad/ciudadSlice'
import tiendaReducer from './Tienda/tiendaSlice'
import rutaReducer from './Ruta/rutaSlice'
import deusReducer from './Deus/deuSlice'
import modulosSlice from './Modulos/modulosSlice'
import roleReducer from './Roles/roleSlice'
import PermisosSlice from './Permisos/permisoSlice'
import opcionesSlice from './Opciones/opcionesSlice'
import PermisosRolesSlice from './AsignarPermisosAroles/asignarPermisosSlice'
import asignacionMOSlice from './asignacionMO/asignacionMOSlice.js'

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
    modulos: modulosSlice,
    opciones: opcionesSlice,
    roles: roleReducer,
    Permisos: PermisosSlice,
    PermisosRoles: PermisosRolesSlice,
    asignacionMO: asignacionMOSlice,
  },
})