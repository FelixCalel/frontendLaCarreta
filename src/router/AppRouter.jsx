import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
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
import { LoginForm } from "../pages/auth";
import { PaginaPedidosEntrantes } from "./PedidosEntrantesRouter";
import { validarUsuario } from "../store/RolPermisoUsuario/thunks"; // Thunk para validar permisos

export const AppRouter = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const [accesosPermitidos, setAccesosPermitidos] = useState({}); // Guardar los accesos permitidos por ruta
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

  useEffect(() => {
    const datosUsuario = obtenerDatosLogeado();

    if (usuarioId) {
      // Validar el acceso para cada ruta según su rutaId
      rutasConRutaId.forEach(({ rutaId, path }) => {
        dispatch(validarUsuario({ usuarioId, rutaId })).then((result) => {
          setAccesosPermitidos((prev) => ({
            ...prev,
            [path]: result.payload, // Guardamos el acceso permitido para cada ruta
          }));
        });
      });
    }

    if (datosUsuario) {
      dispatch(login(datosUsuario)); // Autenticamos si los datos son válidos
    } else {
      dispatch(logout()); // Si no hay datos o son inválidos, cerramos sesión
    }
  }, [dispatch, usuarioId]);

  if (status === "checking") {
    return <CheckingAuth />;
  }

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <PortalPagePublic />
          </PublicRoute>
        }
      />
      
      {/* Protege la ruta de home con PrivateRoute */}
      <Route
        path="/auth/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      {/* Rutas Privadas Protegidas */}
      {/* Iteramos sobre las rutas y verificamos si tienen acceso */}
      {rutasConRutaId.map(({ path, component: Component }) => (
        accesosPermitidos[path] ? (
          <Route key={path} path={path} element={<PrivateRoute><Component /></PrivateRoute>} />
        ) : (
          console.log(`No puedes acceder a la ruta ${path}`)
        )
      ))}

      {/* Ruta predeterminada */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
