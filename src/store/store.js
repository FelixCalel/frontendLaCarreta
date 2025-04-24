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

const persistedAuth = JSON.parse(localStorage.getItem("authSlice") || "null");

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
  },
  preloadedState: persistedAuth ? { auth: persistedAuth } : {},
});

store.subscribe(() => {
  const { auth } = store.getState();

  // elige SOLO los campos que quieres persistir
  const {
    status,
    uid,
    email,
    displayName,
    token,
    rutas,
    user, // trae las rutas completas si las tienes
  } = auth;

  localStorage.setItem(
    "authSlice",
    JSON.stringify({
      status,
      uid,
      email,
      displayName,
      token,
      rutas,
      user,
    })
  );
});
