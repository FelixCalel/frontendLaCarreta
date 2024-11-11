import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import CheckingAuth from "../ui/components/CheckingAuth";
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
  const [loading, setLoading] = useState(true); // Bandera de carga
  const [roleId, setRoleId] = useState(localStorage.getItem("roleId"));
  const usuarioId = localStorage.getItem("usuarioId");

  const rutasConRutaId = [
    { path: "/pais/*", rutaId: 1, component: PaginaPais },
    { path: "/ciudad/*", rutaId: 2, component: PaginaCiudad },
    { path: "/ruta/*", rutaId: 3, component: PaginaRuta },
    { path: "/tienda/*", rutaId: 4, component: PaginaTienda },
    { path: "/empresa/*", rutaId: 5, component: PaginaEmpresa },
    { path: "/pedido/*", rutaId: 6, component: PaginaPedido },
    { path: "/pedidos/*", rutaId: 7, component: PaginaPedidosEntrantes },
  ];

  useEffect(() => {
    const storedRoleId = localStorage.getItem("roleId");
    setRoleId(storedRoleId);
  }, []);

  useEffect(() => {
    const verificarAccesos = async () => {
      if (roleId && usuarioId) {
        const nuevosAccesosPermitidos = {};
  
        await Promise.all(
          rutasConRutaId.map(async ({ rutaId, path }) => {
            const result = await dispatch(validarUsuario({ usuarioId, rutaId }));
            nuevosAccesosPermitidos[path] = result.payload;
          })
        );
  
        setAccesosPermitidos(nuevosAccesosPermitidos);
      }
      setLoading(false); // Marcar como cargado al terminar de verificar
    };

    verificarAccesos();
  }, [dispatch, usuarioId, roleId]);

  const rolesPermitidosAdmin = ["1"];

  if (loading) {
    // Mostrar componente de carga hasta que se obtengan los permisos
    return <CheckingAuth />;
  }

  return (
    <Routes>
      <Route path="/auth/*" element={<PublicRoute><PortalPagePublic /></PublicRoute>} />
      <Route path="/auth/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      {rolesPermitidosAdmin.includes(roleId) ? (
        <Route path="/admin/*" element={<PrivateRoute><PortalRouter /></PrivateRoute>} />
      ) : (
        <Route path="/admin/*" element={<Navigate to="/auth/home" />} />
      )}
      {rutasConRutaId.map(({ path, component: Component }) =>
        accesosPermitidos[path] ? (
          <Route key={path} path={path} element={<PrivateRoute><Component /></PrivateRoute>} />
        ) : (
          <Route key={path} path={path} element={<Navigate to="/auth/home" />} />
        )
      )}

      <Route path="*" element={<Navigate to = "/auth/login" />} />
    </Routes>
  );
};
