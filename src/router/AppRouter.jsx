import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import CheckingAuth from "../ui/components/CheckingAuth";
import { logout, login, obtenerDatosLogeado } from "../store/auth";  // Aquí importamos obtenerDatosLogeado
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
  const status = useSelector((state) => state.auth.status); // Obtenemos el estado de autenticación

  useEffect(() => {
    const datosUsuario = obtenerDatosLogeado(); // Llamamos a la función para obtener los datos del usuario
    if (datosUsuario) {
      dispatch(login(datosUsuario)); // Si hay datos de usuario, autenticamos
    } else {
      dispatch(logout()); // Si no hay, cerramos sesión
    }
  }, [dispatch]);

  // Mostramos una pantalla de carga si estamos en el estado "checking"
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

      {/* Nueva ruta para el HomePage */}
      <Route path="/auth/home" element={<HomePage />} />

      {/* Rutas Privadas */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <PortalRouter />
          </PrivateRoute>
        }
      />

      {/* Rutas de Pais */}
      <Route path="/pais/*" element={<PaginaPais />} />
      <Route path="/pedido/*" element={<PaginaPedido />} />
      <Route path="/empresa/*" element={<PaginaEmpresa />} />
      <Route path="/ciudad/*" element={<PaginaCiudad />} />
      <Route path="/tienda/*" element={<PaginaTienda />} />
      <Route path="/ruta/*" element={<PaginaRuta />} />
      <Route path="/pedidos/*" element={<PaginaPedidosEntrantes />} />

      {/* Ruta predeterminada */}
      <Route path="*" element={<LoginForm />} />
    </Routes>
  );
};
