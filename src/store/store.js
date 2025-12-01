import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import { usuariosReducer } from "./usuarios/usuariosSlice";
import paisesReducer from "./pais/paisSlice";
import empresaReducer from "./Empresa/empresaSlice";
import ciudadReducer from "./Ciudad/ciudadSlice";
import tiendaReducer from "./Tienda/tiendaSlice";
import rutaReducer from "./Ruta/rutaSlice";
import deusReducer from "./Deus/deuSlice";
import pedidosReducer from "./Pedidos/pedidoSlice.js";
import modulosSlice from "./Modulos/modulosSlice";
import roleReducer from "./Roles/roleSlice";
import PermisosSlice from "./Permisos/permisosSlice.js";
import opcionesSlice from "./Opciones/opcionesSlice";
import PermisosRolesSlice from "./AsignarPermisosAroles/asignarPermisosSlice";
import asignacionMOSlice from "./asignacionMO/asignacionMOSlice.js";
import detalleOrdenReducer from "./Pedidos/DetallePedidos/detalleOrdenSlice";
import itemReducer from "./items/itemSlice";
import comprasSlice from "./Compras/compraSlice.js";
import proveedorReducer from "./Proveedor/proveedorSlice.js";
import asignacionAMSlice from "./asignacionAM/asignacionAMSlice.js";
import { pedidoProduccionApi } from "../services/pedidoProductionApi.ts";
import { qaApi } from "../services/controlCalidadAPI.ts";
import settingsReducer from "./settings/settingsSlice";
import notificacionesReducer from "./Notificaciones/notificacionesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    settings: settingsReducer,
    usuarios: usuariosReducer,
    paises: paisesReducer,
    empresas: empresaReducer,
    ciudades: ciudadReducer,
    tiendas: tiendaReducer,
    rutas: rutaReducer,
    deudores: deusReducer,
    pedidos: pedidosReducer,
    detalleOrden: detalleOrdenReducer,
    items: itemReducer,
    modulos: modulosSlice,
    opciones: opcionesSlice,
    roles: roleReducer,
    Permisos: PermisosSlice,
    PermisosRoles: PermisosRolesSlice,
    asignacionMO: asignacionMOSlice,
    compras: comprasSlice,
    proveedores: proveedorReducer,
    AsignacionAreaMesa: asignacionAMSlice,
    notificaciones: notificacionesReducer,
    [pedidoProduccionApi.reducerPath]: pedidoProduccionApi.reducer,
    [qaApi.reducerPath]: qaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      pedidoProduccionApi.middleware,
      qaApi.middleware
    ),
});
