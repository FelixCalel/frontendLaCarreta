import { Route, Routes } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import { useDispatch, useSelector } from "react-redux";
import CheckingAuth from "../ui/components/CheckingAuth";
import { useEffect } from "react";
import { logout, login, obtenerDatosLogeado } from "../store/auth";
import { isAuthenticated } from "../providers/endpoints";
import { Dashboard } from "../pages";
// import { ProveedoresPageRouter } from "./ProveedoresPageRouter";
import { PaginaPais } from "./PaisRoute";
import { PaginaEmpresa } from "./EmpresaRoute";
import { PaginaCiudad } from "./CiudaRouter";
import { PaginaTienda } from "./TiendaRouter";
import  { PaginaRuta } from "./RutaRouter";
import HomePage from "../pages/auth/HomePage"; 

export const AppRouter = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth);
  const isAuthenticating = isAuthenticated();

  useEffect(() => {
    if (!isAuthenticating) {
      dispatch(logout());
    } else {
      dispatch(login(obtenerDatosLogeado()));
    }
  }, [dispatch, isAuthenticating]);

  if (status.status === "checking") {
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

      {/* Rutas de Proveedores
      <Route path="/proveedores/*" element={<ProveedoresPageRouter />} /> */}


      {/* Rutas de Pais */}
      <Route path="/pais/*" element={<PaginaPais />} />
      <Route path="/empresa/*" element={<PaginaEmpresa />} />
      <Route path="/ciudad/*" element={<PaginaCiudad />} />
      <Route path="/tienda/*" element={<PaginaTienda />} />
      <Route path="/ruta/*" element={<PaginaRuta />} />

      {/* <Route path="/login/*" element={<PaginaPais />} /> */}

      {/* Ruta predeterminada */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};
