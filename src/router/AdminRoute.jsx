// src/router/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export const AdminRoute = ({ children }) => {
  const { status, roleId } = useSelector((s) => s.auth);

  if (status !== "authenticated") return <Navigate to="/auth/login" replace />;

  if (roleId !== 1)
    // ← solo el rol 1 entra
    return <Navigate to="/home" replace />;

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
