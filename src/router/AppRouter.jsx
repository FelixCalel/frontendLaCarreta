import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import CheckingAuth from "../ui/components/CheckingAuth";
import { logout, login, obtenerDatosLogeado } from "../store/auth";
import HomePage from "../pages/auth/HomePage";
import { PaginaPais } from "./PaisRoute";
import { PaginaEmpresa } from "./EmpresaRoute";
import { PaginaCiudad } from "./CiudaRouter";
import { PaginaTienda } from "./TiendaRouter";
import { PaginaRuta } from "./RutaRouter";
import { PaginaPedido } from "./PedidosRouter";
import { PaginaPedidosEntrantes } from "./PedidosEntrantesRouter";
import { validarUsuario } from "../store/RolPermisoUsuario/thunks";

export const AppRouter = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const [accesosPermitidos, setAccesosPermitidos] = useState({});
  const [roleId, setRoleId] = useState(localStorage.getItem("roleId")); // Inicializa roleId directamente desde localStorage
  const usuarioId = localStorage.getItem("usuarioId");

  // Mapeo de rutas con sus respectivos rutaId
  const rutasConRutaId = [
    { path: "/pais/*", rutaId: 1, component: PaginaPais },
    { path: "/ciudad/*", rutaId: 2, component: PaginaCiudad },
    { path: "/ruta/*", rutaId: 3, component: PaginaRuta },
    { path: "/tienda/*", rutaId: 4, component: PaginaTienda },
    { path: "/empresa/*", rutaId: 5, component: PaginaEmpresa },
    { path: "/pedido/*", rutaId: 6, component: PaginaPedido },
    { path: "/pedidos/*", rutaId: 7, component: PaginaPedidosEntrantes }
  ];

  // Cargar roleId cuando el componente se monta o cuando localStorage cambia
useEffect(() => {
    const storedRoleId = localStorage.getItem("roleId");
    setRoleId(storedRoleId); // Esto asegura que el roleId esté disponible antes de verificar rutas
    console.log("Role ID obtenido desde localStorage:", storedRoleId);
}, []);

// Realiza las verificaciones solo cuando el roleId esté disponible
useEffect(() => {
  // Obtén el roleId del estado global (si usas Redux) o el estado del componente
  if (roleId && usuarioId) {
    rutasConRutaId.forEach(({ rutaId, path }) => {
      dispatch(validarUsuario({ usuarioId, rutaId })).then((result) => {
        setAccesosPermitidos((prev) => ({
          ...prev,
          [path]: result.payload,
        }));
      });
    });
  }
}, [dispatch, usuarioId, roleId]);



  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/auth/*" element={<PublicRoute><PortalPagePublic /></PublicRoute>} />
      
      {/* Protege la ruta de home con PrivateRoute */}
      <Route path="/auth/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />

      {/* Protege las rutas de administración (solo accesibles para admin con roleId === 1) */}
      {roleId === "1" ? (
        <Route path="/admin/*" element={<PrivateRoute><PortalRouter /></PrivateRoute>} />
      ) : (
        <Route path="*" element={<Navigate to="/auth/home" />} /> // Redirige a home si no es admin
      )}

      {/* Verificación de permisos para cada ruta */}
      {rutasConRutaId.map(({ path, component: Component }) =>
        accesosPermitidos[path] ? (
          <Route key={path} path={path} element={<PrivateRoute><Component /></PrivateRoute>} />
        ) : (
          console.log(`No puedes acceder a la ruta ${path}`)
        )
      )}

      {/* Ruta predeterminada */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
