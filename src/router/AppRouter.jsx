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
import { validarUsuario } from "../store/RolPermisoUsuario/thunks";

export const AppRouter = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const [accesoPermitido, setAccesoPermitido] = useState(false); 

  useEffect(() => {
    const datosUsuario = obtenerDatosLogeado();
    const usuarioId = localStorage.getItem("usuarioId");
    if (usuarioId) {
      dispatch(validarUsuario({ usuarioId, rutaId: 1 })).then((result) => {
        setAccesoPermitido(result.payload); 
      });
    }

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
      {accesoPermitido ? (
        <Route path="/pais/*" element={<PrivateRoute><PaginaPais /></PrivateRoute>} />
      ) : (
        console.log("No puedes acceder a esta ruta")
      )}

      <Route path="/pedido/*" element={<PrivateRoute><PaginaPedido /></PrivateRoute>} />
      <Route path="/empresa/*" element={<PrivateRoute><PaginaEmpresa /></PrivateRoute>} />
      <Route path="/ciudad/*" element={<PrivateRoute><PaginaCiudad /></PrivateRoute>} />
      <Route path="/tienda/*" element={<PrivateRoute><PaginaTienda /></PrivateRoute>} />
      <Route path="/ruta/*" element={<PrivateRoute><PaginaRuta /></PrivateRoute>} />
      <Route path="/pedidos/*" element={<PrivateRoute><PaginaPedidosEntrantes /></PrivateRoute>} />

      {/* Ruta predeterminada */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
