import { useEffect, useState, Suspense } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import CheckingAuth from "../ui/components/CheckingAuth";
import HomePage from "../pages/auth/HomePage";
import { routeComponentMap } from "./routeComponentMap";
import { Box, Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
    <Spinner size="xl" color="teal.500" thickness="4px" />
  </Box>
);

export const AppRouter = () => {
  const { permissions, status } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "checking") {
      setLoading(false);
    }
  }, [status]);

  if (loading || status === "checking") {
    return <CheckingAuth />;
  }

  const allowedRoutes = permissions?.routes || [];
  const hasAdminAccess = permissions?.hasAdminAccess || false;
  const isAuthenticated = status === "authenticated";

  return (
    <Suspense fallback={<LoadingSpinner />}>
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
        {hasAdminAccess ? (
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
    </Suspense>
  );
};
