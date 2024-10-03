import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute"; // Asegúrate de importar el PrivateRoute
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

export const AppRouter = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    const datosUsuario = obtenerDatosLogeado();
    if (datosUsuario) {
      dispatch(login(datosUsuario)); // Autenticamos si los datos son válidos
    } else {
      dispatch(logout()); // Si no hay datos o son inválidos, cerramos sesión
    }
  }, [dispatch]);

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

      {/* Rutas Privadas */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <PortalRouter />
          </PrivateRoute>
        }
      />

      {/* Otras rutas protegidas */}
      <Route path="/pais/*" element={<PrivateRoute><PaginaPais /></PrivateRoute>} />
      <Route path="/pedido/*" element={<PrivateRoute><PaginaPedido /></PrivateRoute>} />
      <Route path="/empresa/*" element={<PrivateRoute><PaginaEmpresa /></PrivateRoute>} />
      <Route path="/ciudad/*" element={<PrivateRoute><PaginaCiudad /></PrivateRoute>} />
      <Route path="/tienda/*" element={<PrivateRoute><PaginaTienda /></PrivateRoute>} />
      <Route path="/ruta/*" element={<PrivateRoute><PaginaRuta /></PrivateRoute>} />
      <Route path="/pedidos/*" element={<PrivateRoute><PaginaPedidosEntrantes /></PrivateRoute>} />

      {/* Ruta predeterminada */}
      <Route path="*" element={<LoginForm />} />
    </Routes>
  );
};
