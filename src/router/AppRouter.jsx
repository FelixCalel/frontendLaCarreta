import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import CheckingAuth from "../ui/components/CheckingAuth";
import HomePage from "../pages/auth/HomePage";
import { routeComponentMap } from "./routeComponentMap";

export const AppRouter = () => {
  const {
    permissions,
    roleId: roleIdNum,
    status,
  } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const roleId = String(roleIdNum);

  useEffect(() => {
    if (status !== "checking") {
      setLoading(false);
    }
  }, [status]);

  const rolesPermitidosAdmin = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];

  if (loading || status === "checking") {
    return <CheckingAuth />;
  }

  const allowedRoutes = permissions?.routes || [];
  const isAuthenticated = status === "authenticated";

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
        path="/auth/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      {rolesPermitidosAdmin.includes(roleId) ? (
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <PortalRouter />
            </PrivateRoute>
          }
        />
      ) : (
        <Route path="/admin/*" element={<Navigate to="/auth/home" />} />
      )}
      {allowedRoutes.map((route) => {
        const Component = routeComponentMap[route];
        if (!Component) return null;

        return (
          <Route
            key={route}
            path={`${route}/*`}
            element={
              <PrivateRoute>
                <Component />
              </PrivateRoute>
            }
          />
        );
      })}
      {isAuthenticated &&
        Object.keys(routeComponentMap).map((route) => {
          if (allowedRoutes.includes(route)) return null;

          return (
            <Route
              key={`blocked-${route}`}
              path={`${route}/*`}
              element={<Navigate to="/auth/home" replace />}
            />
          );
        })}

      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
