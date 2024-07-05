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
import { ProveedoresPageRouter } from "./ProveedoresPageRouter"; // Asegúrate de que esta ruta sea correcta

import { PageFormSol }  from "../pages/proveedores/PageFormSol";

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

      {/* Rutas Privadas */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <PortalRouter />
          </PrivateRoute>
        }
      />

      {/* Rutas de Proveedores */}
      <Route path="/proveedores/" element={<PageFormSol />} />

      {/* Ruta predeterminada */}
      <Route
        path="*"
        element={
          <Routes>
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        }
      />
    </Routes>
  );
};
