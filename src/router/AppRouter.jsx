// src/router/AppRouter.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import CheckingAuth from "../ui/components/CheckingAuth";
import { isAuthenticated } from "../providers/endpoints";
import { logout, login, obtenerDatosLogeado } from "../store/auth";
import { LoginForm } from "../pages/auth";
import HomePage from "../pages/auth/HomePage";
import { AdminRoute } from "./AdminRoute";

export const AppRouter = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.auth);
  const logged = isAuthenticated();

  useEffect(() => {
    if (!logged) dispatch(logout());
    else dispatch(login(obtenerDatosLogeado()));
  }, [dispatch, logged]);

  if (status === "checking") return <CheckingAuth />;

  return (
    <Routes>
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <PortalPagePublic />
          </PublicRoute>
        }
      />
      <Route
        path="/home/*"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <PortalRouter />
          </AdminRoute>
        }
      />
      <Route path="*" element={<LoginForm />} />
    </Routes>
  );
};
